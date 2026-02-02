<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getMemberProfile } from '@/services/api.service'
import { initializeLiff, liff } from '@/utils/liff'

const router = useRouter()
const route = useRoute()

onMounted(async () => {
  try {
    // 0. 檢查是否有 liff.state 需要導向
    const params = new URLSearchParams(window.location.search)
    const liffState = params.get('liff.state')
    if (liffState) {
       const targetPath = decodeURIComponent(liffState)
       if (targetPath && targetPath.startsWith('/')) {
         console.log('Redirecting to target path from liff.state:', targetPath)
         router.replace(targetPath)
         // 如果有 state，通常表示是剛登入回來，讓其繼續執行後續初始化，或者視情況 return
       }
    }
    alert('初始化開始')

    // 1. 初始化 LIFF
    await initializeLiff()

    alert('初始化成功')

    // 2. 檢查是否登入
    if (!liff.isLoggedIn()) {
       // 未登入，執行登入並中止流程 (login 會導向 LINE 登入頁面)
       liff.login()
       return 
    }
    alert('登入成功')
    
    // 3. 確保取得到 UID
    const profile = await liff.getProfile().catch(() => null)
    if (!profile?.userId) {
       console.error('無法取得 LINE Profile')
       // 視情況決定是否重試登入或顯示錯誤
       return
    }

    alert('取得 profile 成功')
    // 4. 已登入且有 UID，再檢查會員資料
    const res = await getMemberProfile()
    console.log('App Launch - Member Profile Response:', JSON.stringify(res)) 
    alert('取得會員資料成功')
    alert(JSON.stringify(res))
    // 判斷是否查無會員
    // 優先檢查 success: false + message
    const isSuccessFalse = res?.success === false;
    // 檢查 Code 是否不為成功代碼 (假設 1 是成功 (Code 1), 0 是失敗? 或 undefined) 
    // 根據 api.service.ts，若非 0 或 1 會 log error。
    // 但此處 response 是直接 json。
    
    // 關鍵字檢查
    const msg = res?.message || res?.Message || '';
    const isNotFoundMsg = msg.includes('查無') || msg.includes('不存在');

    
    
    if (isSuccessFalse && isNotFoundMsg) {
       console.log('User not found (success:false + msg), redirecting to register')
       if (route.name !== 'register') {
         router.replace({ name: 'register' }) // Use replace to avoid back navigation loop
       }
       return;
    }
    
    if (res?.Code !== 1 && res?.Code !== undefined && isNotFoundMsg) {
       console.log('User not found (Code!=1 + msg), redirecting to register')
       if (route.name !== 'register') {
         router.replace({ name: 'register' })
       }
       return;
    }

    // 如果是成功的 (Code 1 或 success true)
    if (res?.Code === 1 || res?.success === true) {
        console.log('User found, staying on current page')
    } else {
        // 其他未知狀態，暫時 log warning
        console.warn('Unexpected member profile response, but not clearly "Not Found":', res)
        // 為了保險，如果真的判定失敗但沒中上面的條件，也可以視情況導向
    }
  } catch (error) {
    console.error('Failed to get member profile on app launch (Exception):', error)
    // 確保只在非註冊頁且 LIFF 正常時導向
    if (liff.isLoggedIn() && route.name !== 'register') {
      console.log('Exception handled, redirecting to register')
      router.replace({ name: 'register' })
    }
  }
})
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style lang="scss">

html, body, #app{
  background-color: #1D293D;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
#app{
  background-image: url("/images/bg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
