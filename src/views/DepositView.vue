<template>
  <MainLayout header="儲值" :deleteIcon="false" :backIcon="true">
    <div class="deposit-container">
      <!-- 儲值金額 -->
      <section class="selection-section">
        <h3 class="section-title">儲值金額</h3>
        <div class="amount-grid">
          <button 
            v-for="amount in amountPresets" 
            :key="amount"
            class="amount-btn"
            :class="{ active: selectedAmount === amount }"
            @click="selectedAmount = amount"
          >
            +${{ amount.toLocaleString() }}
          </button>
        </div>
      </section>

      <!-- 付款方式 -->
      <section class="selection-section">
        <h3 class="section-title">付款方式</h3>
        <div class="payment-methods">
          <div 
            class="payment-card"
            :class="{ active: selectedPayment === 'card' }"
            @click="selectedPayment = 'card'"
          >
            <div class="payment-icon">
              <img src="/icons/credit-card.svg" alt="信用卡">
            </div>
            <span class="payment-label">信用卡/簽帳金融卡</span>
          </div>

          <div 
            class="payment-card"
            :class="{ active: selectedPayment === 'apple' }"
            @click="selectedPayment = 'apple'"
          >
            <div class="payment-icon">
              <img src="/icons/apple-pay.svg" alt="Apple Pay">
            </div>
            <span class="payment-label">Apple Pay</span>
          </div>
        </div>
      </section>

      <!-- 確定按鈕 -->
      <div class="button-footer">
        <button 
          class="confirm-btn" 
          :disabled="!isValid"
          @click="handleDeposit"
        >
          確定儲值
        </button>
      </div>

      <!-- 成功提示 -->
      <BottomAlert 
        v-model="showAlert"
        icon="/icons/success.svg"
        title="儲值成功！"
        button-text="確定"
        @button-click="handleAlertConfirm"
      />
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/components/MainLayout.vue'
import BottomAlert from '@/components/BottomAlert.vue'

const router = useRouter()

const amountPresets = [1000, 2000, 3000, 5000, 7000, 10000]
const selectedAmount = ref<number | null>(null)
const selectedPayment = ref<string | null>('card')
const showAlert = ref(false)

const isValid = computed(() => selectedAmount.value !== null && selectedPayment.value !== null)

const handleDeposit = () => {
  if (isValid.value) {
    showAlert.value = true
  }
}

const handleAlertConfirm = () => {
  router.push('/balance')
}
</script>

<style lang="scss" scoped>
.deposit-container {
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 20px;
}

.amount-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.amount-btn {
  height: 52px;
  background: #90A1B91A;
  border-radius: 15px;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #90A1B91A;

  &.active {
    background: rgba(96, 247, 209, 0.1);
    border-color: #60F7D1;
    color: #fff;
  }
}

.payment-methods {
  display: flex;
  gap: 16px;
}

.payment-card {
  flex: 1;
  height: 120px;
  background: #90A1B91A;
  border: 1px solid #90A1B91A;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  .payment-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .payment-label {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    text-align: center;
  }

  &.active {
    background: rgba(96, 247, 209, 0.1);
    border-color: #60F7D1;

    .payment-label {
      color: #fff;
    }
  }
}

.button-footer {
  position: fixed;
  bottom: 0px;
  left: 0;
  right: 0;
  padding: 20px 19px 40px;
  background: #1A202C;
}

.confirm-btn {
  width: 100%;
  height: 52px;
  background: #60F7D1;
  color: #1A202C;
  border: none;
  border-radius: 26px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
}
</style>
