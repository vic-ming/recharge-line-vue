<template>
  <MainLayout :header="currentStep === 0 ? '註冊會員' : '驗證手機'" :deleteIcon="true" :backIcon="currentStep == 1" :backfunction="prevStep">
    <!-- Progress Stepper -->
    <div class="stepper-container">
      <div 
        v-for="(step, index) in steps" 
        :key="index"
        class="step-item"
        :class="{ active: currentStep === index, completed: currentStep > index }"
      >
        <div class="step-label">{{ step }}</div>
        <div class="step-line" v-if="index < steps.length - 1"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="register-container">
      <!-- Step 1: 註冊資訊 -->
      <div v-if="currentStep === 0" class="form-step">
        <div class="form-group">
          <label for="name">姓名 <span class="required">*</span></label>
          <input 
            id="name" 
            v-model="formData.name" 
            type="text" 
            placeholder="請輸入你的真實姓名"
            @blur="validateField('name')"
            :class="{ 'error': errors.name }"
          />
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>

        <div class="form-group">
          <label for="phone">手機 <span class="required">*</span></label>
          <input 
            id="phone" 
            v-model="formData.phone" 
            type="tel" 
            placeholder="請輸入你的手機號碼"
            @blur="validateField('phone')"
            :class="{ 'error': errors.phone }"
          />
          <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
        </div>

        <div class="form-group">
          <label for="email">Email <span class="required">*</span></label>
          <input 
            id="email" 
            v-model="formData.email" 
            type="email" 
            placeholder="請輸入你的常用Email"
            @blur="validateField('email')"
            :class="{ 'error': errors.email }"
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="verificationCode">用戶驗證碼 <span class="required">*</span></label>
          <input 
            id="verificationCode" 
            v-model="formData.verificationCode" 
            type="text" 
            placeholder="請輸入你的用戶驗證碼"
            @blur="validateField('verificationCode')"
            :class="{ 'error': errors.verificationCode }"
            maxlength="5"
          />
          <span v-if="errors.verificationCode" class="error-message">{{ errors.verificationCode }}</span>
        </div>
      </div>

      <!-- Step 2: 驗證手機 -->
      <div v-if="currentStep === 1" class="form-step">
        <p class="step-description">已發送手機驗證碼至 {{ formData.phone }}</p>
        <div class="form-group">
          <label for="phoneVerificationCode">手機驗證碼 <span class="required">*</span></label>
          <input 
            id="phoneVerificationCode" 
            v-model="formData.phoneVerificationCode" 
            type="text" 
            placeholder="請輸入你的手機驗證碼"
            @blur="validateField('phoneVerificationCode')"
            :class="{ 'error': errors.phoneVerificationCode }"
          />
          <span v-if="errors.phoneVerificationCode" class="error-message">{{ errors.phoneVerificationCode }}</span>
        </div>
        <button
          @click="handleResend" 
          class="nav-btn next-btn mt-[49px]"
          :disabled="countDown > 0 || loading"
        >
          <template v-if="loading">
            發送中...
          </template>
          <template v-else-if="countDown > 0">
            重新發送 <span>({{ countDown }})</span>
          </template>
          <template v-else>
            重新發送
          </template>
        </button>
      </div>

      <!-- Step 3: 完成 -->
      <div v-if="currentStep === 2" class="form-step">
        <img class="w-[120px] h-[120px] mx-auto mt-[33px]" src="/icons/finish.svg" alt="register">
        <p class="step-description text-center text-[16px] mt-[4px]">開始使用服務</p>
        <button
          @click="router.push('/balance')" 
          class="nav-btn next-btn mt-[33px]"
        >
          確認
        </button>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="button-container">
      <button v-if="currentStep === 0"
        @click="handleNextStep" 
        class="nav-btn next-btn"
        :disabled="!isStep1Valid"
      >
        {{ loading ? '註冊中...' : '下一步' }}
      </button>
      <button v-if="currentStep === 1"
        @click="handleSubmit" 
        class="nav-btn next-btn"
        :disabled="!isStep2Valid"
      >
        {{ loading ? '驗證中...' : '送出' }}
      </button>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import MainLayout from '@/components/MainLayout.vue'
import { useRouter } from 'vue-router'
import { register, resendPhoneCode, verifyPhoneCode } from '@/services/api.service'

const router = useRouter()

const steps = ['註冊資訊', '驗證手機']
const currentStep = ref(0)
const loading = ref(false)

const formData = reactive({
  name: '',
  phone: '',
  email: '',
  verificationCode: '',
  phoneVerificationCode: ''
})

const errors = reactive({
  name: '',
  phone: '',
  email: '',
  verificationCode: '',
  phoneVerificationCode: ''
})

// 倒數計時相關
const countDown = ref(30)
let countDownTimer: number | null = null

// 開始倒數計時
const startCountDown = () => {
  countDown.value = 30
  if (countDownTimer) {
    clearInterval(countDownTimer)
  }
  countDownTimer = setInterval(() => {
    if (countDown.value > 0) {
      countDown.value--
    } else {
      if (countDownTimer) {
        clearInterval(countDownTimer)
        countDownTimer = null
      }
    }
  }, 1000)
}

// 重新發送驗證碼
const handleResend = async () => {
  if (countDown.value > 0) return
  
  loading.value = true
  try {
    const response = await resendPhoneCode()
    
    if (response && response.success) {
      // alert('驗證碼已重新發送')
      startCountDown()
    } else {
      // alert(response?.Message || '發送失敗，請稍後再試')
    }
  } catch (error) {
    console.error('重新發送驗證碼失敗:', error)
    // alert('發送失敗，請稍後再試')
  } finally {
    loading.value = false
  }
}

// 組件掛載時開始倒數
onMounted(() => {
  if (currentStep.value === 1) {
    startCountDown()
  }
})

// 組件卸載時清除計時器
onUnmounted(() => {
  if (countDownTimer) {
    clearInterval(countDownTimer)
  }
})

// 驗證規則
const validators = {
  name: (value: string) => {
    if (!value.trim()) return '請輸入姓名'
    if (value.trim().length < 2) return '姓名至少需要2個字元'
    return ''
  },
  phone: (value: string) => {
    if (!value.trim()) return '請輸入手機號碼'
    const phoneRegex = /^09\d{8}$/
    if (!phoneRegex.test(value)) return '請輸入有效的手機號碼（格式：09xxxxxxxx）'
    return ''
  },
  email: (value: string) => {
    if (!value.trim()) return '請輸入Email'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return '請輸入有效的Email格式'
    return ''
  },
  verificationCode: (value: string) => {
    if (!value.trim()) return '請輸入用戶驗證碼'
    if (value.length !== 5) return '驗證碼必須為5碼'
    return ''
  },
  phoneVerificationCode: (value: string) => {
    if (!value.trim()) return '請輸入手機驗證碼'
    if (!/^\d+$/.test(value)) return '驗證碼只能包含數字'
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
const validateAllFields = (fields: Array<keyof typeof formData>) => {
  let isValid = true
  fields.forEach(field => {
    validateField(field)
    if (errors[field]) isValid = false
  })
  return isValid
}

// 計算步驟1是否有效
const isStep1Valid = computed(() => {
  return formData.name.trim() !== '' &&
         formData.phone.trim() !== '' &&
         formData.email.trim() !== '' &&
         formData.verificationCode.trim() !== '' &&
         !errors.name &&
         !errors.phone &&
         !errors.email &&
         !errors.verificationCode &&
         !loading.value
})

// 計算步驟2是否有效
const isStep2Valid = computed(() => {
  return formData.phoneVerificationCode.trim() !== '' &&
         !errors.phoneVerificationCode &&
         !loading.value
})

// 處理下一步（註冊）
const handleNextStep = async () => {
  if (!validateAllFields(['name', 'phone', 'email', 'verificationCode'])) {
    return
  }

  loading.value = true
  try {

    const response = await register({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      valicode: formData.verificationCode
    })


    if (response && response.success) {
      // 註冊成功，進入驗證手機步驟
      currentStep.value++
      // 進入驗證手機步驟時開始倒數
      if (currentStep.value === 1) {
        startCountDown()
      }
    } else {
      // 顯示錯誤訊息
      alert(response?.Message || '註冊失敗，請稍後再試')
    }
  } catch (error) {
    console.error('註冊失敗:', error)
    alert('註冊失敗，請檢查網路連線或稍後再試')
  } finally {
    loading.value = false
  }
}

// 處理提交（驗證手機）
const handleSubmit = async () => {
  if (!validateAllFields(['phoneVerificationCode'])) {
    return
  }

  loading.value = true
  try {
    const response = await verifyPhoneCode(formData.phoneVerificationCode)

    if (response && response.success) {
      // 驗證成功，進入完成步驟
      currentStep.value++
    } else {
      // 顯示錯誤訊息
      alert(response?.Message || '驗證失敗，請檢查驗證碼是否正確')
    }
  } catch (error) {
    console.error('驗證失敗:', error)
    alert('驗證失敗，請稍後再試')
  } finally {
    loading.value = false
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    // 離開驗證手機步驟時清除計時器
    if (countDownTimer) {
      clearInterval(countDownTimer)
      countDownTimer = null
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/common.scss';

.stepper-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 18.5px;
  margin-top: 40px;
  margin-bottom: 30px;
  position: relative;
  .step-item {

    display: flex;
    align-items: center;
    position: relative;
    &:last-child {
      flex: initial; 
    }

    .step-label {
      font-size: 12px;
      font-weight: 400;
      color: #A7B5C9;
      white-space: nowrap;
      transition: all 0.3s ease;
    }

    .step-line {
      width: 40px;
      height: 1px;
      background: #828385;
      margin: 0 5px;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 0;
        background: #63F6D9;
        transition: width 0.3s ease;
      }
    }

    &.active {
      .step-label {
        color: #63F6D9;
        font-weight: 400;
      }
    }

    &.completed {
      .step-label {
        color: #63F6D9;
      }
      
      .step-line::after {
        width: 100%;
      }
    }
  }
}

.register-container {
  padding: 0 18.5px;
  min-height: 400px;
}
</style>
