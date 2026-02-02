<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getMemberProfile } from '@/services/api.service'
import { initializeLiff, liff } from '@/utils/liff'

const router = useRouter()
const route = useRoute()

onMounted(async () => {
  try {
    // 1. 初始化 LIFF
    await initializeLiff()

    // 2. 檢查是否登入
    if (!liff.isLoggedIn()) {
       // 未登入，執行登入並中止流程 (login 會導向 LINE 登入頁面)
       liff.login()
       return 
    }
    
    // 3. 確保取得到 UID
    const profile = await liff.getProfile().catch(() => null)
    if (!profile?.userId) {
       console.error('無法取得 LINE Profile')
       // 視情況決定是否重試登入或顯示錯誤
       return
    }

    // 4. 已登入且有 UID，再檢查會員資料
    const res = await getMemberProfile()
    if (res && res.success === false && res.message === '查無此會員資料') {
       console.log('User not found, redirecting to register')
       if (route.name !== 'register') {
         router.push({ name: 'register' })
       }
    }
  } catch (error) {
    console.error('Failed to get member profile on app launch:', error)
    // 只有在確認是 API 錯誤且非登入相關問題才導向註冊
    // 若是 LIFF 錯誤則不應導向註冊，以免陷入迴圈
    // 這裡簡單判斷：若已登入但 API 失敗，可能需要註冊
    if (liff.isLoggedIn() && router.currentRoute.value.name !== 'register') {
      router.push({ name: 'register' })
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
