<template>
  <MainLayout header="" :deleteIcon="true" :backIcon="false">
    <Loading v-if="loading" />
    <div v-else class="charging-container">
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
        >
          <img v-if="isCharging" src="/icons/bolt.svg" alt="充電中">
          <span>{{ statusText }}</span>
        </button>
        <button 
          class="status-btn peak"
        >
          <img v-if="isPeak" src="/icons/bolt.svg" alt="尖峰">
          <span>{{ touText }}</span>
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
import { ref, onMounted, watch } from 'vue'
import MainLayout from '@/components/MainLayout.vue'
import CustomSelect from '@/components/CustomSelect.vue'
import Loading from '@/components/Loading.vue'
import { getMemberProfile, getChargingStatus } from '@/services/api.service'

const selectedParking = ref('')
// 資料狀態
const isCharging = ref(false)
const isPeak = ref(false)
const statusText = ref('待機中')
const touText = ref('離峰')
const power = ref(0)
const cost = ref(0)
const parkingOptions = ref<{ value: string, label: string }[]>([])
const statusMap = ref<Record<string, any>>({})
const loading = ref(false)

// 載入資料
const loadData = async () => {
  loading.value = true
  try {
    // 1. 先取得車位列表
    const profileRes = await getMemberProfile()
    if (profileRes && profileRes.user_profile) {
      const spaces = profileRes.user_profile.parking_spaces
      if (Array.isArray(spaces) && spaces.length > 0) {
        parkingOptions.value = spaces.map((space: string) => ({
          value: space,
          label: space
        }))
        // 預設選取第一個
        if (!selectedParking.value) {
          selectedParking.value = spaces[0]
        }
      }
    }

    // 2. 取得充電狀態
    const statusRes = await getChargingStatus()
    
    // statusRes 是一個陣列
    if (Array.isArray(statusRes.chargers)) {
      statusMap.value = statusRes.chargers.reduce((acc: any, item: any) => {
        acc[item.parking_space] = item
        return acc
      }, {})
      
      // 如果已經有選中的車位，立即更新資訊
      if (selectedParking.value) {
        updateDisplayInfo(selectedParking.value)
      }
    }

  } catch (error) {
    console.error('Failed to load charging status:', error)
  } finally {
    loading.value = false
  }
}

// 更新顯示資訊
const updateDisplayInfo = (parkingSpace: string) => {
  console.log('Updating display info for parking space:', parkingSpace)
  console.log('Display info for parking space:', statusMap.value)
  if (!parkingSpace || !statusMap.value[parkingSpace]) {
    // 無資料時的預設值
    isCharging.value = false
    isPeak.value = false
    statusText.value = '待機中'
    touText.value = '離峰'
    power.value = 0
    cost.value = 0
    return
  }
  
  const data = statusMap.value[parkingSpace]
  
  // 1. 設定充電狀態 (charging, idle, finished)
  // 如果是 charging 則左邊亮起
  isCharging.value = data.charging_status === 'charging'
  
  // 設定狀態文字
  const statusLabels: Record<string, string> = {
    'charging': '充電中',
    'idle': '待機中',
    'finished': '已完成'
  }
  statusText.value = statusLabels[data.charging_status] || '待機中'

  // 2. 設定尖離峰狀態 (peak, off-peak)
  // 如果是 peak 則右邊亮起
  isPeak.value = data.tou_period === 'peak'
  
  // 設定時段文字
  const touLabels: Record<string, string> = {
    'peak': '尖峰',
    'off-peak': '離峰'
  }
  touText.value = touLabels[data.tou_period] || '離峰'

  // 3. 設定數值
  power.value = data.power_kw || 0
  cost.value = data.cost_per_kwh || 0
}

// 監聽車位變更
watch(selectedParking, (newVal) => {
  updateDisplayInfo(newVal)
})

onMounted(() => {
  loadData()
})
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
