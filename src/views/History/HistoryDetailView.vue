<template>
  <MainLayout header="充電紀錄明細" :deleteIcon="false" :backIcon="true">
    <Loading v-if="loading" />
    <div v-else class="detail-container">
      <!-- 車輛圖片 -->
      <div class="car-image">
        <img src="/images/detail-banner.png" alt="充電車輛">
      </div>
      <div class="detail-date">{{ chargingDate }}</div>

      <!-- 充電資訊卡片 -->
      <div class="detail-info">
        <div class="info-card">
          <div class="info-item">
            <div class="flex items-end gap-[10px]">
              <div class="info-value">{{ energy }}</div>
              <div class="info-unit">kWh</div>
            </div>
            <div class="info-label">充電量</div>
          </div>
          <div class="divider"></div>
          <div class="info-item">
            <div class="info-value !font-[400]">${{ totalCost }}</div>
            <div class="info-label">費用</div>
          </div>
        </div>
      </div>

      <!-- 費用計算 -->
      <div class="cost-section">
        <h3 class="section-title">費用計算</h3>
        <div class="cost-list">
          <div class="cost-item">
            <span class="cost-label">尖峰費率（{{ peakRate }} 元 / 度）</span>
            <span class="cost-value">{{ peakAmount }}</span>
          </div>
          <div class="cost-item">
            <span class="cost-label">離峰費率（{{ offPeakRate }} 元 / 度）</span>
            <span class="cost-value">{{ offPeakAmount }}</span>
          </div>
          <div class="cost-item total">
            <span class="cost-label">訂單金額</span>
            <span class="cost-value">${{ totalCost }}</span>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from '@/components/MainLayout.vue'
import Loading from '@/components/Loading.vue'
import { getChargingRecordDetail } from '@/services/api.service'

const route = useRoute()
const loading = ref(false)

const chargingDate = ref('--')
const energy = ref(0)
const totalCost = ref(0)
const peakRate = ref(0)
const peakAmount = ref(0)
const offPeakRate = ref(0)
const offPeakAmount = ref(0)

const loadDetail = async () => {
  const id = Number(route.params.id)
  if (!id) return

  loading.value = true
  try {
    const res = await getChargingRecordDetail(id)
    console.log('Record Detail:', res)

    if (res && res.success) {
      chargingDate.value = res.date || '--'
      energy.value = res.charging_kwh || 0
      totalCost.value = res.total_cost || 0
      
      // 處理尖離峰費率詳情
      if (res.tou_period_detail) {
        // 尖峰
        if (res.tou_period_detail.peak) {
          peakRate.value = res.tou_period_detail.peak.unit_price || 0
          peakAmount.value = res.tou_period_detail.peak.price || 0
        }
        
        // 離峰
        if (res.tou_period_detail.off_peak) {
          offPeakRate.value = res.tou_period_detail.off_peak.unit_price || 0
          offPeakAmount.value = res.tou_period_detail.off_peak.price || 0
        }
      }
    }
  } catch (error) {
    console.error('Failed to load record detail:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDetail()
})
</script>

<style lang="scss" scoped>
.detail-container {
  min-height: calc(100vh - 100px);
}

.car-image {
  width: 100%;
  position: relative;
  overflow: hidden;
  margin: 11px 0;
  img {
    width: 100%;
    object-fit: cover;
  }
}
.detail-date {
  color: #fff;
  font-size: 14px;
  font-weight: 400;
  text-align: center;
}
.detail-info {
  border-top: 1px solid #90A1B933;
  border-bottom: 1px solid #90A1B933;
  margin-top: 20px; 
  margin-bottom: 24px;
}
.info-card {
  background: linear-gradient(90deg, rgba(85, 251, 171, 0.1) 0%, rgba(103, 244, 232, 0.1) 100%);
  border-radius: 20px;
  padding: 23px 0;
  margin: 24px 21px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 19px;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;

  .info-value {
    font-size: 34px;
    font-weight: 700;
    color: #fff;
  }

  .info-unit {
    font-size: 34px;
    font-weight: 700;
  }

  .info-label {
    font-size: 14px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.6);
  }
}

.divider {
  width: 1px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
}

.cost-section {
  padding: 0 16px;

  .section-title {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 24px;
  }
}
.cost-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.cost-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .cost-label {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
  }

  .cost-value {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
  }

  &.total {
    padding-top: 8px;
    border-top: 1px solid rgba(255, 255, 255, 0.5);

    .cost-label {
      font-size: 14px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.8);
    }

    .cost-value {
      font-size: 14px;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.8);
    }
  }
}
</style>
