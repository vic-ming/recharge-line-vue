<template>
  <MainLayout header="主頁面" :deleteIcon="false" :backIcon="false">
    <div class="home-container">
      <!-- 功能按鈕區 -->
      <div class="menu-grid">

        <!-- 註冊 -->
        <div class="menu-card" @click="goToRegister">
          <h3 class="menu-title">註冊</h3>
          <p class="menu-description">註冊成為會員</p>
        </div>

        <!-- 充電金餘額 -->
        <div class="menu-card" @click="goToBalance">
          <h3 class="menu-title">充電金餘額</h3>
          <p class="menu-description">查看您的充電金額度</p>
        </div>

        <!-- 會員中心 -->
        <div class="menu-card" @click="goToMember">
          <h3 class="menu-title">會員中心</h3>
          <p class="menu-description">管理個人資料與設定</p>
        </div>

        <!-- 充電狀態 -->
        <div class="menu-card" @click="goToChargingStatus">
          <h3 class="menu-title">充電狀態</h3>
          <p class="menu-description">查看當前充電進度</p>
        </div>

        <!-- 充電紀錄 -->
        <div class="menu-card" @click="goToChargingHistory">
          <h3 class="menu-title">充電紀錄</h3>
          <p class="menu-description">查看歷史充電記錄</p>
        </div>

       
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import MainLayout from '@/components/MainLayout.vue'

const router = useRouter()

const goToBalance = () => {
  router.push('/balance')
}

const goToMember = () => {
  router.push('/member')
}

const goToChargingStatus = () => {
  router.push('/charging-status')
}

const goToChargingHistory = () => {
  router.push('/charging-history')
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style lang="scss" scoped>
.home-container {
  padding: 40px 20px;
  min-height: calc(100vh - 100px);
}

.menu-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.menu-card {
  background: linear-gradient(135deg, rgba(99, 246, 217, 0.1) 0%, rgba(85, 251, 171, 0.05) 100%);
  border: 1px solid rgba(99, 246, 217, 0.3);
  border-radius: 20px;
  padding: 24px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(99, 246, 217, 0.15) 0%, rgba(85, 251, 171, 0.1) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    border-color: #60F7D1;
    box-shadow: 0 8px 24px rgba(99, 246, 217, 0.2);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-2px);
  }

  .menu-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #55FBAB 0%, #67F4E8 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    position: relative;
    z-index: 1;

    img {
      width: 32px;
      height: 32px;
      filter: brightness(0) invert(1);
    }
  }

  .menu-title {
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    line-height: 28px;
    margin: 0 0 8px 0;
    position: relative;
    z-index: 1;
  }

  .menu-description {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    margin: 0;
    position: relative;
    z-index: 1;
  }
}
</style>
