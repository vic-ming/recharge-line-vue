<template>
  <MainLayout header="選擇開立發票方式" :deleteIcon="false" :backIcon="true">
    <!-- Main Content -->
    <div class="inovice-container">
      <div class="form-step">
        <div class="form-group">
          <label for="cardNumber">卡號 <span class="required">*</span></label>
          <input 
            id="cardNumber" 
            v-model="formData.cardNumber" 
            type="text" 
            placeholder="xxxx-xxxx-xxxx-xxxx"
            @input="formatCardNumber"
            @blur="validateField('cardNumber')"
            :class="{ 'error': errors.cardNumber }"
            maxlength="19"
          />
          <span v-if="errors.cardNumber" class="error-message">{{ errors.cardNumber }}</span>
        </div>

        <div class="form-group">
          <label for="expiryDate">有效期限 <span class="required">*</span></label>
          <input 
            id="expiryDate" 
            v-model="formData.expiryDate" 
            type="text" 
            placeholder="MM/YY"
            @input="formatExpiryDate"
            @blur="validateField('expiryDate')"
            :class="{ 'error': errors.expiryDate }"
            maxlength="5"
          />
          <span v-if="errors.expiryDate" class="error-message">{{ errors.expiryDate }}</span>
        </div>

        <div class="form-group">
          <label for="cvc">信用卡驗證碼 (CVC) <span class="required">*</span></label>
          <input 
            id="cvc" 
            v-model="formData.cvc" 
            type="text" 
            placeholder="請輸入卡片背面的3位數字"
            @blur="validateField('cvc')"
            :class="{ 'error': errors.cvc }"
            maxlength="3"
          />
          <span v-if="errors.cvc" class="error-message">{{ errors.cvc }}</span>
        </div>
        
        <p class="step-description mt-[54px]">為確保卡片能正常使用，系統會試刷新台幣 1 元， 驗證過後會立即刷退。</p>

        <button
          @click="handleSubmit" 
          class="nav-btn next-btn mt-[6px]"
          :disabled="!isFormValid"
        >
          確認
        </button>
      </div>
    </div>

    <!-- Bottom Alert -->
    <BottomAlert 
      v-model="showAlert"
      icon="/icons/success.svg"
      title="儲值成功！"
      button-text="確定"
      @button-click="handleAlertConfirm"
    />
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/components/MainLayout.vue'
import BottomAlert from '@/components/BottomAlert.vue'

const router = useRouter()
const showAlert = ref(true)

const formData = reactive({
  cardNumber: '',
  expiryDate: '',
  cvc: ''
})

const errors = reactive({
  cardNumber: '',
  expiryDate: '',
  cvc: ''
})

// 格式化卡號（每4位加空格）
const formatCardNumber = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\s/g, '').replace(/\D/g, '')
  
  // 每4位數字加一個空格
  const formatted = value.match(/.{1,4}/g)?.join(' ') || value
  formData.cardNumber = formatted
}

// 格式化有效期限（MM/YY）
const formatExpiryDate = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  
  if (value.length >= 2) {
    value = value.slice(0, 2) + '/' + value.slice(2, 4)
  }
  
  formData.expiryDate = value
}

// Luhn 演算法驗證卡號
const luhnCheck = (cardNumber: string): boolean => {
  const digits = cardNumber.replace(/\s/g, '').split('').map(Number)
  let sum = 0
  let isEven = false
  
  for (let i = digits.length - 1; i >= 0; i--) {
    const currentDigit = digits[i]
    if (currentDigit === undefined) continue
    
    let digit = currentDigit
    
    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    
    sum += digit
    isEven = !isEven
  }
  
  return sum % 10 === 0
}

// 驗證有效期限
const validateExpiry = (expiry: string): boolean => {
  const [month, year] = expiry.split('/').map(Number)
  
  if (!month || !year) return false
  if (month < 1 || month > 12) return false
  
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear() % 100 // 取後兩位
  const currentMonth = currentDate.getMonth() + 1
  
  if (year < currentYear) return false
  if (year === currentYear && month < currentMonth) return false
  
  return true
}

// 驗證規則
const validators = {
  cardNumber: (value: string) => {
    const cleanValue = value.replace(/\s/g, '')
    if (!cleanValue) return '請輸入卡號'
    if (!/^\d+$/.test(cleanValue)) return '卡號只能包含數字'
    if (cleanValue.length !== 16) return '卡號必須為16位數字'
    if (!luhnCheck(value)) return '卡號格式不正確'
    return ''
  },
  expiryDate: (value: string) => {
    if (!value) return '請輸入有效期限'
    if (!/^\d{2}\/\d{2}$/.test(value)) return '格式必須為 MM/YY'
    if (!validateExpiry(value)) return '有效期限無效或已過期'
    return ''
  },
  cvc: (value: string) => {
    if (!value) return '請輸入CVC'
    if (!/^\d{3}$/.test(value)) return 'CVC必須為3位數字'
    return ''
  }
}

// 驗證單個欄位
const validateField = (field: keyof typeof formData) => {
  if (validators[field]) {
    errors[field] = validators[field](formData[field])
  }
}

// 驗證所有欄位
const validateAllFields = () => {
  let isValid = true
  Object.keys(formData).forEach(field => {
    validateField(field as keyof typeof formData)
    if (errors[field as keyof typeof errors]) isValid = false
  })
  return isValid
}

// 計算表單是否有效
const isFormValid = computed(() => {
  return formData.cardNumber.trim() !== '' &&
         formData.expiryDate.trim() !== '' &&
         formData.cvc.trim() !== '' &&
         !errors.cardNumber &&
         !errors.expiryDate &&
         !errors.cvc
})

// 處理提交
const handleSubmit = () => {
  if (validateAllFields()) {
    console.log('Credit card info:', {
      cardNumber: formData.cardNumber.replace(/\s/g, ''),
      expiryDate: formData.expiryDate,
      cvc: formData.cvc
    })
    // 顯示成功提示
    showAlert.value = true
  }
}

// 處理 Alert 確認按鈕
const handleAlertConfirm = () => {
  router.push('/member')
}
</script>

<style lang="scss" scoped>  
@import '@/assets/styles/common.scss';

.inovice-container {
  padding: 0 19px;
  margin-top: 40px;
  min-height: 400px;
}
</style>
