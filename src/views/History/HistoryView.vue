<template>
  <MainLayout header="充電紀錄" :deleteIcon="false" :backIcon="true">
    <div class="history-container">
      <!-- 歷史記錄列表 -->
      <div class="history-list">
        <div 
          v-for="record in chargingRecords" 
          :key="record.id"
          class="history-card"
          @click="viewDetail(record.id)"
        >
          <div class="card-header">
            <div class="station-info">
              <h3 class="station-name">{{ record.stationName }}</h3>
              <p class="station-address">{{ record.address }}</p>
            </div>
            <div class="status-badge" :class="record.status">
              {{ getStatusText(record.status) }}
            </div>
          </div>

          <div class="card-body">
            <div class="info-row">
              <span class="label">充電時間</span>
              <span class="value">{{ record.date }}</span>
            </div>
            <div class="info-row">
              <span class="label">充電時長</span>
              <span class="value">{{ record.duration }}</span>
            </div>
            <div class="info-row">
              <span class="label">充電量</span>
              <span class="value">{{ record.energy }} kWh</span>
            </div>
            <div class="info-row">
              <span class="label">費用</span>
              <span class="value highlight">NT$ {{ record.cost }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 空狀態 -->
      <div v-if="chargingRecords.length === 0" class="empty-state">
        <p>尚無充電紀錄</p>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MainLayout from '@/components/MainLayout.vue'

interface ChargingRecord {
  id: number
  stationName: string
  address: string
  date: string
  duration: string
  energy: number
  cost: number
  status: 'completed' | 'failed'
}

// 模擬數據
const chargingRecords = ref<ChargingRecord[]>([
  {
    id: 1,
    stationName: '台北市政府充電站',
    address: '台北市信義區市府路1號',
    date: '2024-01-20 14:30',
    duration: '1小時15分',
    energy: 25.5,
    cost: 180,
    status: 'completed'
  },
  {
    id: 2,
    stationName: '大安森林公園充電站',
    address: '台北市大安區新生南路二段1號',
    date: '2024-01-18 09:15',
    duration: '45分鐘',
    energy: 18.2,
    cost: 130,
    status: 'completed'
  },
  {
    id: 3,
    stationName: '信義商圈充電站',
    address: '台北市信義區松高路12號',
    date: '2024-01-15 16:45',
    duration: '30分鐘',
    energy: 12.8,
    cost: 95,
    status: 'failed'
  }
])

const getStatusText = (status: string) => {
  return status === 'completed' ? '已完成' : '失敗'
}

const viewDetail = (id: number) => {
  console.log('View detail:', id)
  // TODO: 導向詳細頁面
}
</script>

<style lang="scss" scoped>
.history-container {
  padding: 20px;
  min-height: calc(100vh - 100px);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.history-card {
  background: rgba(99, 246, 217, 0.05);
  border: 1px solid rgba(99, 246, 217, 0.2);
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #60F7D1;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 246, 217, 0.15);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .station-info {
      flex: 1;

      .station-name {
        color: #fff;
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 4px 0;
      }

      .station-address {
        color: rgba(255, 255, 255, 0.6);
        font-size: 12px;
        margin: 0;
      }
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;

      &.completed {
        background: rgba(85, 251, 171, 0.2);
        color: #55FBAB;
      }

      &.failed {
        background: rgba(255, 108, 108, 0.2);
        color: #FF6C6C;
      }
    }
  }

  .card-body {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .label {
        color: rgba(255, 255, 255, 0.6);
        font-size: 14px;
      }

      .value {
        color: #fff;
        font-size: 14px;
        font-weight: 500;

        &.highlight {
          color: #60F7D1;
          font-weight: 600;
        }
      }
    }
  }
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 16px;
}
</style>
