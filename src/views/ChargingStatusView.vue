<template>
  <MainLayout header="充電狀態" :deleteIcon="false" :backIcon="true">
    <div class="charging-container">
      <div class="status-card">
        <div class="status-icon">
        </div>
        <h2 class="status-title">充電中</h2>
        <p class="status-description">正在為您的車輛充電</p>
      </div>

      <div class="charging-info">
        <div class="info-row">
          <span class="info-label">充電進度</span>
          <span class="info-value">75%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 75%"></div>
        </div>

        <div class="info-row">
          <span class="info-label">已充電時間</span>
          <span class="info-value">45 分鐘</span>
        </div>

        <div class="info-row">
          <span class="info-label">預計剩餘時間</span>
          <span class="info-value">15 分鐘</span>
        </div>

        <div class="info-row">
          <span class="info-label">充電功率</span>
          <span class="info-value">7.2 kW</span>
        </div>
      </div>

      <button class="stop-btn" @click="handleStop">
        停止充電
      </button>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import MainLayout from '@/components/MainLayout.vue'

const router = useRouter()

const handleStop = () => {
  // TODO: 停止充電邏輯
  console.log('Stop charging')
  alert('充電已停止')
}
</script>

<style lang="scss" scoped>
.charging-container {
  padding: 40px 20px;
}

.status-card {
  text-align: center;
  margin-bottom: 32px;

  .status-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
    background: linear-gradient(135deg, #55FBAB 0%, #67F4E8 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: pulse 2s ease-in-out infinite;

    img {
      width: 40px;
      height: 40px;
      filter: brightness(0) invert(1);
    }
  }

  .status-title {
    color: #60F7D1;
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 8px 0;
  }

  .status-description {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    margin: 0;
  }
}

.charging-info {
  background: rgba(99, 246, 217, 0.05);
  border: 1px solid rgba(99, 246, 217, 0.2);
  border-radius: 20px;
  padding: 24px 20px;
  margin-bottom: 24px;

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }

    .info-label {
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
    }

    .info-value {
      color: #fff;
      font-size: 16px;
      font-weight: 600;
    }
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 16px;

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #55FBAB 0%, #67F4E8 100%);
      border-radius: 4px;
      transition: width 0.3s ease;
    }
  }
}

.stop-btn {
  width: 100%;
  padding: 14px 24px;
  border-radius: 24px;
  border: 1px solid #FF6C6C;
  background: rgba(255, 108, 108, 0.1);
  color: #FF6C6C;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 108, 108, 0.2);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
}
</style>
