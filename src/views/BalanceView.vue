<template>
  <MainLayout header="充電金餘額" :deleteIcon="true" :backIcon="false">
    <Loading v-if="loading" />
    <div v-else class="balance-container">
      <!-- 圓形餘額顯示 -->
      <div class="balance-wheel">
        <div class="balance-label">目前餘額</div>
        <div v-if="loading" class="balance-amount">$ 0</div>
        <div v-else-if="error" class="balance-amount error">--</div>
        <div v-else class="balance-amount">${{ balance.toLocaleString() }}</div>
      </div>

      <!-- 立即儲值按鈕 -->
      <button class="deposit-btn" @click="goToDeposit">
        立即儲值
      </button>

      <!-- 交易紀錄 -->
      <div class="records-section">
        <h3 class="section-title">{{ hasRecords ? '儲值紀錄' : '使用紀錄' }}</h3>
        
        <div v-if="hasRecords" class="records-list">
          <div v-for="record in recentRecords" :key="record.id" class="record-item">
            <div class="record-icon">
              <img :src="record.type === 'deposit' ? '/icons/recharge.svg' : '/icons/recharge-white.svg'" :alt="record.type">
            </div>
            <div class="record-info">
              <div class="record-type">{{ record.typeText }}</div>
              <div class="record-meta">{{ record.date }} {{ record.detail }}</div>
            </div>
            <div class="record-amount" :class="record.type">
              {{ record.type === 'deposit' ? '+' : '-' }}{{ record.amount }}
            </div>
          </div>
        </div>

        <!-- 空狀態 -->
        <div v-else class="empty-state">
          <div class="empty-icon">
            <img src="/images/piggy-bank.png" alt="目前沒有紀錄">
          </div>
          <p class="empty-text">目前沒有交易紀錄喔！</p>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/components/MainLayout.vue'
import Loading from '@/components/Loading.vue'
import { getBalance } from '@/services/api.service'

const router = useRouter()

const balance = ref(0)
const loading = ref(true)
const error = ref('')

// 交易紀錄介面
interface Record {
  id: number
  type: 'deposit' | 'charge'
  typeText: string
  date: string
  detail: string
  amount: number
}

const records = ref<Record[]>([])

const recentRecords = computed(() => records.value.slice(0, 3))

const hasRecords = computed(() => records.value.length > 0)

// 載入餘額資料
const loadBalance = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await getBalance()
    
    console.log('Balance API Response:', response)
    
    // 檢查回應格式
    let data: any
    
    // 情況1: 後端直接回傳 { success, balance, records }
    if (response.success !== undefined) {
      data = response
    }
    // 情況2: 標準格式 { Code, Data: { success, balance, records } }
    else if (response.Code === 0 || response.Code === 1) {
      data = response.Data
    }
    // 情況3: 錯誤
    else {
      error.value = response.Message || '載入失敗'
      console.error('載入餘額失敗:', response.Message)
      return
    }
    
    // 檢查 success 標記
    if (data.success) {
      // 設定餘額
      balance.value = data.balance || 0
      
      // 轉換交易紀錄格式
      if (data.records && Array.isArray(data.records)) {
        records.value = data.records.map((record: any, index: number) => {
          // 判斷類型（儲值或充電）
          const isDeposit = record.category === '儲值' || record.amount.startsWith('+')
          
          return {
            id: index + 1,
            type: isDeposit ? 'deposit' : 'charge',
            typeText: record.category,
            date: record.time,
            detail: record.type,
            amount: Math.abs(parseFloat(record.amount.replace(/[+-]/g, '')))
          }
        })
      }
    } else {
      error.value = '載入失敗'
    }
  } catch (err) {
    error.value = '網路錯誤，請稍後再試'
    console.error('載入餘額失敗:', err)
  } finally {
    loading.value = false
  }
}

// 組件掛載時載入資料
onMounted(() => {
  loadBalance()
})

const goToDeposit = () => {
  router.push('/deposit')
}
</script>

<style lang="scss" scoped>
.balance-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.balance-wheel {
  position: relative;
  width: 270px;
  height: 270px;
  margin-top: 38px;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url('/images/circle.png');
  background-size: cover;
  background-position: center;
  .balance-label {
    font-size: 16px;
    color: #60F7D1;
    margin-bottom: 16px;
    text-align: center;
  }

  .balance-amount {
    font-size: 60px;
    line-height: 48px;

    &.loading {
      font-size: 24px;
      color: #A7B5C9;
      animation: pulse 1.5s ease-in-out infinite;
    }

    &.error {
      color: #FF6B6B;
      opacity: 0.5;
    }
  }

  .balance-note {
    font-size: 12px;
    color: #90A1B9;
    background: #90A1B90D;
    padding: 4px 12px;
    border-radius: 12px;
    border: 1px solid #FFFFFF1A;
    margin-top: 16px;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.error-message {
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 20px;
  color: #FF6B6B;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  .retry-btn {
    background: rgba(255, 255, 255, 0.1);
    color: #60F7D1;
    border: 1px solid #60F7D1;
    border-radius: 8px;
    padding: 6px 16px;
    font-size: 14px;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(96, 247, 209, 0.1);
    }
  }
}

.deposit-btn {
  width: 147px;
  height: 51px;
  background: linear-gradient(90deg, #55FBAB 0%, #67F4E8 100%);
  color: #1D2B27;
  border: none;
  border-radius: 100px;
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 40px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.records-section {
  width: 100%;
  padding: 24px 16px;
  border-top: 1px solid #90A1B933;

  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 24px;
    padding-left: 4px;
  }
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.record-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;

  .record-icon {
    width: 40px;
    height: 40px;
    background: #393F47;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 24px;
      height: 24px;
    }
  }

  .record-info {
    flex: 1;

    .record-type {
      font-size: 16px;
      color: #fff;
      margin-bottom: 8px;
    }

    .record-meta {
      font-size: 14px;
      color: #A7B5C9;
    }
  }

  .record-amount {
    font-size: 16px;
    font-weight: 500;

    &.deposit {
      color: #60F7D1;
    }

    &.charge {
      color: #fff;
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;

  .empty-icon {
    width: 150px;
    height: 150px;
    margin-bottom: 20px;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .empty-text {
    font-size: 16px;
    color: #fff;
  }
}
</style>
