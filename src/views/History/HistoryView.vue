<template>
  <MainLayout header="充電紀錄" :deleteIcon="true" :backIcon="false">
    <Loading v-if="loading" />
    <div v-else class="history-container">
      <!-- 車位選擇器 -->
      <div class="parking-selector">
        <img src="/icons/car.svg" alt="車位" class="car-icon">
        <CustomSelect
          v-model="selectedParking"
          :options="parkingOptions"
          placeholder="選擇車位"
        />
      </div>

      <!-- 查詢區間 -->
      <div class="date-filter">
        <div class="filter-header">
          <span class="filter-title">查詢區間</span>
          <span class="filter-subtitle">最多半年</span>
        </div>
        
        <div class="filter-buttons">
          <button 
            v-for="option in dateOptions" 
            :key="option.value"
            class="filter-btn"
            :class="{ active: selectedDateRange === option.value }"
            @click="selectedDateRange = option.value"
          >
            {{ option.label }}
          </button>
        </div>

        <div class="date-inputs">
          <div class="date-input-wrapper">
            <input 
              type="date" 
              v-model="startDate" 
              class="date-input"
              :min="minDate"
              :max="maxDate"
            >
            <img src="/icons/calendar.svg" alt="calendar" class="calendar-icon">
          </div>
          <span class="date-separator">-</span>
          <div class="date-input-wrapper">
            <input 
              type="date" 
              v-model="endDate" 
              class="date-input"
              :min="minDate"
              :max="maxDate"
            >
            <img src="/icons/calendar.svg" alt="calendar" class="calendar-icon">
          </div>
        </div>
      </div>

      <!-- 總計區塊 -->
      <div class="total-card">
        <div class="total-label">區間總花費</div>
        <div class="flex items-center gap-[10px]">
          <div class="total-amount">${{ totalCost.toLocaleString() }}</div>
          <div class="total-unit">/ {{ totalRecords }} 筆</div>
        </div>
        <div class="total-icon">
          <img src="/images/bolt-green.png" alt="充電">
        </div>
      </div>

      <!-- 充電紀錄列表 -->
      <div class="records-section">
        <h3 class="section-title">充電紀錄</h3>
        <div class="records-list">
          <div 
            v-for="record in chargingRecords" 
            :key="record.id"
            class="record-card"
            @click="goToDetail(record.id)"
          >
            <div class="record-icon">
              <img src="/icons/charge.svg" alt="充電站">
            </div>
            <div class="record-info">
              <div class="record-id">{{ record.stationId }}</div>
              <div class="record-time">
                <div>S: {{ record.startTime }}</div>
                <div>E: {{ record.endTime }}</div>
              </div>
            </div>
            <div class="record-details">
              <div class="record-cost" :class="record.type">
                {{ record.type === 'charge' ? '費用' : record.type === 'add' ? '加值' : '費用' }} {{ record.cost >= 0 ? '+' : '' }}{{ record.cost }}
              </div>
              <div class="record-energy">充電 {{ record.energy }}kWh</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/components/MainLayout.vue'
import CustomSelect from '@/components/CustomSelect.vue'
import Loading from '@/components/Loading.vue'
import { getMemberProfile, getChargingRecords } from '@/services/api.service'

const router = useRouter()

const formatDate = (date: Date): string => {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const selectedParking = ref('')
const selectedDateRange = ref('month1')
const startDate = ref('')
const endDate = ref('')
const totalCost = ref(0)
const totalRecords = ref(0)
const maxDate = ref('')
const minDate = ref('')
const parkingOptions = ref<{ value: string, label: string }[]>([])
const loading = ref(false)

// 介面定義
interface ChargingRecord {
  id: number
  stationId: string
  startTime: string
  endTime: string
  cost: number
  energy: number
  type: string
}

const chargingRecords = ref<ChargingRecord[]>([])

let isInternalChange = false

// 初始化日期
const today = new Date()
maxDate.value = formatDate(today)
const sixMonthsAgo = new Date()
sixMonthsAgo.setMonth(today.getMonth() - 6)
minDate.value = formatDate(sixMonthsAgo)

// 預設今天為結束日期
endDate.value = formatDate(today)

// 預設一個月前為開始日期
const oneMonthAgo = new Date()
oneMonthAgo.setMonth(today.getMonth() - 1)
startDate.value = formatDate(oneMonthAgo)

const dateOptions = [
  { value: 'month1', label: '近一個月' },
  { value: 'month3', label: '近三個月' },
  { value: 'halfYear', label: '近半年' },
]

// 載入資料
const loadData = async () => {
  loading.value = true
  try {
    // 1. 如果還沒載入車位，先載入
    if (parkingOptions.value.length === 0) {
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
    }

    // 2. 根據目前條件搜尋紀錄
    if (selectedParking.value && startDate.value && endDate.value) {
      // API 需要 YYYY/MM/DD 格式
      const apiStartDate = startDate.value.replace(/-/g, '/')
      const apiEndDate = endDate.value.replace(/-/g, '/')
      const recordsRes = await getChargingRecords(apiStartDate, apiEndDate)
      
      if (recordsRes && recordsRes.data && Array.isArray(recordsRes.data)) {
        // 找到目前選定車位的資料
        const parkingData = recordsRes.data.find((item: any) => item.parking_space === selectedParking.value)
        
        if (parkingData) {
          totalCost.value = parkingData.total_cost || 0
          totalRecords.value = parkingData.record_count || 0
          
          if (Array.isArray(parkingData.records)) {
            chargingRecords.value = parkingData.records.map((record: any) => {
              // 時間格式處理，只取時間前面的部分顯示或保留完整
              // 範例資料: "2025/11/30 12:30:00"
              return {
                id: record.record_id,
                stationId: parkingData.parking_space,
                startTime: record.start_time,
                endTime: record.end_time,
                cost: record.price,
                energy: record.charging_kwh,
                type: 'charge' // 目前 API 回傳似乎只有充電紀錄
              }
            })
          } else {
            chargingRecords.value = []
          }
        } else {
          // 該車位無資料
          totalCost.value = 0
          totalRecords.value = 0
          chargingRecords.value = []
        }
      }
    }

  } catch (error) {
    console.error('Failed to load history:', error)
  } finally {
    loading.value = false
  }
}

// 監聽預設區間變化
watch(selectedDateRange, (newRange) => {
  if (newRange === 'custom') return
  
  isInternalChange = true
  const current = new Date()
  endDate.value = formatDate(current)
  
  const start = new Date()
  switch (newRange) {
    case 'month1':
      start.setMonth(current.getMonth() - 1)
      break
    case 'month3':
      start.setMonth(current.getMonth() - 3)
      break
    case 'halfYear':
      start.setMonth(current.getMonth() - 6)
      break
  }
  startDate.value = formatDate(start)
  
  nextTick(() => {
    isInternalChange = false
  })
})

// 監聽日期手動變化
watch([startDate, endDate], ([newStart, newEnd], [oldStart, oldEnd]) => {
  if (isInternalChange) {
    loadData()
    return
  }

  selectedDateRange.value = 'custom'
  
  // 限制日期範圍在半年內
  if (newStart < minDate.value) {
    startDate.value = minDate.value
    return
  }
  if (newEnd > maxDate.value) {
    endDate.value = maxDate.value
    return
  }

  // 智能連動邏輯
  // 需確保 oldStart, oldEnd 存在 (第一次執行時可能為 undefined，但非 immediate watch 通常沒問題)
  const prevStart = oldStart || ''
  const prevEnd = oldEnd || ''

  if (newStart !== prevStart) {
    // 開始日期變動：如果開始時間晚於結束時間，自動推延結束時間
    if (newStart > newEnd) {
      endDate.value = newStart
      return
    }
  } else if (newEnd !== prevEnd) {
    // 結束日期變動：如果結束時間早於開始時間，自動提早開始時間
    if (newEnd < newStart) {
      startDate.value = newEnd
      return
    }
  }

  // 當日期改變時重新載入資料
  loadData()
})

// 監聽車位改變
watch(selectedParking, () => {
  loadData()
})

onMounted(() => {
  loadData()
})

const goToDetail = (id: number) => {
  router.push(`/charging-history/${id}`)
}
</script>

<style lang="scss" scoped>
.history-container {
  padding: 24px 0;
  min-height: calc(100vh - 100px);
}

.parking-selector {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 24px;
  padding: 0 16px;

  .car-icon {
    width: 24px;
    height: 24px;
    position: relative;
    top: 11px;
  }
}

.date-filter {
  margin-bottom: 24px;
  padding: 0 16px;

  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .filter-title {
      font-size: 16px;
      font-weight: 500;
      color: #fff;
    }

    .filter-subtitle {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.5);
    }
  }

  .filter-buttons {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    
    &::-webkit-scrollbar {
      display: none;
    }
    
    scrollbar-width: none;
  }

  .filter-btn {
    padding: 8px 16px;
    background: #90A1B91A;
    border: 1px solid #90A1B933;
    border-radius: 20px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
    flex-shrink: 0;

    &.active {
      background: linear-gradient(90deg, rgba(85, 251, 171, 0.1) 0%, rgba(103, 244, 232, 0.1) 100%);
      border-color: #60F7D1;
      color: #fff;
    }
  }

  .date-inputs {
    display: flex;
    align-items: center;
    gap: 12px;

    .date-input-wrapper {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;

      .date-input {
        width: 100%;
        padding: 9px 40px 9px 16px;
        border-radius: 15px;
        background: #90A1B91A;
        color: #fff;
        font-size: 14px;
        border: 1px solid #90A1B91A;
        appearance: none;
        
        &::-webkit-calendar-picker-indicator {
          position: absolute;
          right: 0;
          top: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        &:focus {
          outline: none;
          border-color: #60F7D1;
        }
      }

      .calendar-icon {
        position: absolute;
        right: 16px;
        width: 20px;
        height: 20px;
        pointer-events: none;
      }
    }

    .date-separator {
      color: rgba(255, 255, 255, 0.5);
    }
  }
}

.total-card {
  background: linear-gradient(90deg, rgba(85, 251, 171, 0.2) 0%, rgba(103, 244, 232, 0) 100%);
  margin: 0 16px 24px 16px;
  border-radius: 20px;
  padding: 16px 18px;
  position: relative;
  overflow: hidden;
  .total-label {
    font-size: 14px;
    color: #60F7D1;
    margin-bottom: 8px;
  }

  .total-amount {
    font-size: 24px;
    font-weight: 500;
    color: #fff;
  }

  .total-unit {
    font-size: 14px;
    color: #A7B5C9;
  }

  .total-icon {
    position: absolute;
    right: 37px;
    bottom: 0;
    width: 50px;
    img {
      width: 100%;
    }
  }
}

.records-section {
  border-top: 1px solid #90A1B933;
  padding: 24px 12px 0;
  .section-title {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 24px;
  }
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.record-card {
  background: #90A1B91A;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 10px;

  .record-icon {
    width: 40px;
    height: 40px;
    background: #393F47;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    img {
      width: 24px;
      height: 24px;
    }
  }

  .record-info {
    flex: 1;

    .record-id {
      font-size: 16px;
      font-weight: 500;
      color: #60F7D1;
      margin-bottom: 8px;
    }

    .record-time {
      font-size: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }

  .record-details {
    text-align: right;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .record-cost {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 33px;
      color: #60F7D1;
    
    }

    .record-energy {
      font-size: 16px;
      font-weight: 500;
      color: #fff;
    }
  }
}
</style>
