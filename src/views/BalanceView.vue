<template>
  <MainLayout header="充電金餘額" :deleteIcon="false" :backIcon="true">
    <div class="balance-container">
      <!-- 圓形餘額顯示 -->
      <div class="balance-wheel">
        <div class="balance-label">目前餘額</div>
        <div class="balance-amount">${{ balance.toLocaleString() }}</div>
        <div v-if="balance === 0" class="balance-note">可用電度約 450 kWh</div>
      </div>

      <!-- 立即儲值按鈕 -->
      <button class="deposit-btn" @click="goToDeposit">
        立即儲值
      </button>

      <!-- 交易紀錄 -->
      <div class="records-section">
        <h3 class="section-title">{{ hasRecords ? '儲值紀錄' : '使用紀錄' }}</h3>
        
        <div v-if="hasRecords" class="records-list">
          <div v-for="record in records" :key="record.id" class="record-item">
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/components/MainLayout.vue'

const router = useRouter()

const balance = ref(5000)
const records = ref([
  {
    id: 1,
    type: 'deposit',
    typeText: '儲值',
    date: '2025/12/01',
    detail: '信用卡',
    amount: 1000
  },
  {
    id: 2,
    type: 'charge',
    typeText: '充電',
    date: '2025/12/01',
    detail: '450kWh',
    amount: 1000
  },
  {
    id: 3,
    type: 'charge',
    typeText: '充電',
    date: '2025/12/01',
    detail: '450kWh',
    amount: 1000
  }
])

const hasRecords = computed(() => records.value.length > 0)

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
