<template>
  <MainLayout header="充電金餘額" :deleteIcon="false" :backIcon="true">
    <div class="balance-container">
      <div class="balance-card">
        <h2 class="balance-label">當前餘額</h2>
        <div class="balance-amount">
          <span class="currency">NT$</span>
          <span class="amount">1,234</span>
        </div>
        <p class="balance-note">充電金可用於充電服務付款</p>
      </div>

      <div class="action-buttons">
        <button class="action-btn primary" @click="goToRecharge">
          <span>儲值</span>
        </button>
        <button class="action-btn secondary" @click="goToHistory">
          <span>交易紀錄</span>
        </button>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import MainLayout from '@/components/MainLayout.vue'

const router = useRouter()

const goToRecharge = () => {
  router.push('/pay-way')
}

const goToHistory = () => {
  // TODO: 導向交易紀錄頁面
  console.log('Go to transaction history')
}
</script>

<style lang="scss" scoped>
.balance-container {
  padding: 40px 20px;
}

.balance-card {
  background: linear-gradient(135deg, rgba(99, 246, 217, 0.15) 0%, rgba(85, 251, 171, 0.1) 100%);
  border: 1px solid rgba(99, 246, 217, 0.3);
  border-radius: 24px;
  padding: 40px 24px;
  text-align: center;
  margin-bottom: 32px;

  .balance-label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    font-weight: 400;
    margin: 0 0 16px 0;
  }

  .balance-amount {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 8px;
    margin-bottom: 16px;

    .currency {
      color: #60F7D1;
      font-size: 24px;
      font-weight: 600;
    }

    .amount {
      color: #fff;
      font-size: 48px;
      font-weight: 700;
      line-height: 1;
    }
  }

  .balance-note {
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
    margin: 0;
  }
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.action-btn {
  padding: 14px 24px;
  border-radius: 24px;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &.primary {
    background: linear-gradient(90deg, #55FBAB 0%, #67F4E8 100%);
    color: #1D2B27;

    &:hover {
      opacity: 0.9;
      transform: translateY(-2px);
    }
  }

  &.secondary {
    background: rgba(99, 246, 217, 0.1);
    border: 1px solid #60F7D1;
    color: #60F7D1;

    &:hover {
      background: rgba(99, 246, 217, 0.2);
      transform: translateY(-2px);
    }
  }

  &:active {
    transform: translateY(0);
  }
}
</style>
