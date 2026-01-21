<template>
  <MainLayout header="會員中心" :deleteIcon="false" :backIcon="false">
    <div class="member-container">
      
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '@/components/MainLayout.vue'
</script>

<style lang="scss" scoped>
@import '@/assets/styles/common.scss';
.member-container {
  padding: 0 22px;
}
</style>
