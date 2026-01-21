<template>
  <MainLayout header="" :deleteIcon="false" :backIcon="true" :questionIcon="true">
    <div class="charging-container">
      <!-- 車位選擇器 -->
      <div class="parking-selector">
        <img src="/icons/car.svg" alt="車位" class="car-icon">
        <CustomSelect
          v-model="selectedParking"
          :options="parkingOptions"
          placeholder="選擇車位"
        />
      </div>

      <!-- 狀態按鈕 -->
      <div class="status-buttons">
        <button 
          class="status-btn charging"
          :class="{ active: chargingStatus === 'charging' }"
        >
          <img src="/icons/bolt.svg" alt="充電中">
          <span>充電中</span>
        </button>
        <button 
          class="status-btn peak"
          :class="{ active: chargingStatus === 'peak' }"
        >
          <img src="/icons/bolt.svg" alt="尖峰">
          <span>尖峰</span>
        </button>
      </div>

      <!-- 充電資訊 -->
      <div class="charging-info">
        <div class="info-item">
          <div class="flex items-end gap-2">
            <div class="info-value">{{ power }}</div>
            <div class="info-unit">kw</div>
          </div>
          <div class="info-label">設備功率</div>
        </div>
        <div class="divider"></div>
        <div class="info-item">
          <div class="flex items-end gap-2">  
            <div class="info-value highlight">{{ cost }}</div>
            <div class="info-unit highlight">元</div>
          </div>
          <div class="info-label">費用/度</div>
        </div>
      </div>

      <!-- 底部提示 -->
      <div class="bottom-note">
        資料回傳可能有延遲
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MainLayout from '@/components/MainLayout.vue'
import CustomSelect from '@/components/CustomSelect.vue'

const selectedParking = ref('B2-56')
const chargingStatus = ref('charging') // 'charging' or 'peak'
const power = ref(7)
const cost = ref(12)

const parkingOptions = [
  { value: 'B2-56', label: 'B2-56' },
  { value: 'B2-57', label: 'B2-57' },
  { value: 'B2-58', label: 'B2-58' }
]
</script>

<style lang="scss" scoped>
.charging-container {
  padding: 24px 21px;
  min-height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
}

.parking-selector {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 48px;

  .car-icon {
    width: 24px;
    height: 24px;
    position: relative;
    top: 11px;
  }
}

.status-buttons {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 39px;
  justify-content: center;
  align-items: center;
}

.status-btn {
  padding: 8px 10px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  gap: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  background: #3F4150;
  border-color: #60F7D1;
  color: #fff;
  width: 123px;

  img {
    width: 22px;
    height: 22px;
  }
 
}

.charging-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: auto;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  .info-value {
    font-size: 64px;
    font-weight: 500;
    line-height: 1;
    color: #fff;

    &.highlight {
      color: #60F7D1;
    }
  }

  .info-unit {
    font-size: 30px;
    font-weight: 500;
    color: rgba(255, 255, 255);
    margin-top: -8px;

    &.highlight {
      color: #60F7D1;
    }
  }

  .info-label {
    font-size: 24px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.6);
    margin-top: 4px;
  }
}

.divider {
  width: 1px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
}

.bottom-note {
  position: absolute;
  bottom: 82px;
  left: 0;
  width: 100%;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 400;
  padding: 20px 0;
}
</style>
