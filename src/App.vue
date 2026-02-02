<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getMemberProfile } from '@/services/api.service'

const router = useRouter()
const route = useRoute()

onMounted(async () => {
  try {
    const res = await getMemberProfile()
    if (res && res.success === false && res.message === '查無此會員資料') {
       console.log('User not found, redirecting to register')
       if (route.name !== 'register') {
         router.push({ name: 'register' })
       }
    }
  } catch (error) {
    console.error('Failed to get member profile on app launch:', error)
    if (router.currentRoute.value.name !== 'register') {
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
