<template>
  <MainLayout header="選擇開立發票方式" :deleteIcon="false" :backIcon="true">
    <!-- Main Content -->
    <div class="invoice-container">
      <div class="form-step">
        <!-- 發票開立方式 -->
        <div class="form-group">
          <label for="invoiceType">發票開立方式 <span class="required">*</span></label>
          <CustomSelect
            v-model="selectedInvoiceType"
            :options="invoiceOptions"
            placeholder="請選擇"
          />
        </div>

        <div class="form-group" v-if="selectedInvoiceType === 'mobile'">
          <label for="mobileCarrier">手機條碼載具 <span class="required">*</span></label>
          <input 
            id="mobileCarrier" 
            v-model="formData.mobileCarrier" 
            type="text" 
            placeholder="請輸入你的手機條碼載具"
            @blur="validateField('mobileCarrier')"
            :class="{ 'error': errors.mobileCarrier, 'valid': formData.mobileCarrier && !errors.mobileCarrier }"
            maxlength="8"
          />
          <span v-if="errors.mobileCarrier" class="error-message">{{ errors.mobileCarrier }}</span>
        </div>

        <div v-if="selectedInvoiceType === 'unified'">
          <div class="form-group">
            <label for="companyName">買受人抬頭 <span class="required">*</span></label>
            <input 
              id="companyName" 
              v-model="formData.companyName" 
              type="text" 
              placeholder="請輸入買受人抬頭"
              @blur="validateField('companyName')"
              :class="{ 'error': errors.companyName, 'valid': formData.companyName && !errors.companyName }"
            />
            <span v-if="errors.companyName" class="error-message">{{ errors.companyName }}</span>
          </div>
          
          <div class="form-group mt-[7px]">
            <input 
              id="taxId" 
              v-model="formData.taxId" 
              type="text" 
              placeholder="請輸入統一編號"
              @blur="validateField('taxId')"
              :class="{ 'error': errors.taxId, 'valid': formData.taxId && !errors.taxId }"
              maxlength="8"
            />
            <span v-if="errors.taxId" class="error-message">{{ errors.taxId }}</span>
          </div>
        </div>

        <!-- 注意事項 -->
        <div class="notice-section">
          <h3 class="notice-title">注意事項</h3>
          <p class="notice-text">配合國稅局宣導政策，發票開立方式以電子發票為主。</p>
        </div>

        <!-- 送出按鈕 -->
        <button
          @click="handleSubmit" 
          class="nav-btn next-btn"
          :disabled="!canSubmit"
        >
          送出
        </button>
      </div>
    </div>

    <!-- Bottom Alert -->
    <BottomAlert 
      v-model="showAlert"
      icon="/icons/success.svg"
      title="開立發票成功！"
      button-text="確定"
      @button-click="router.push('/balance')"
    />
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/components/MainLayout.vue'
import CustomSelect from '@/components/CustomSelect.vue'
import BottomAlert from '@/components/BottomAlert.vue'

const router = useRouter()
const selectedInvoiceType = ref('')
const showAlert = ref(false)

const invoiceOptions = [
  { value: 'member', label: '會員載具' },
  { value: 'mobile', label: '手機條碼載具' },
  { value: 'unified', label: '三聯式統一發票' }
]

const formData = reactive({
  mobileCarrier: '',
  companyName: '',
  taxId: ''
})

const errors = reactive({
  mobileCarrier: '',
  companyName: '',
  taxId: ''
})

// 驗證規則
const validators = {
  mobileCarrier: (value: string) => {
    if (!value.trim()) return '請輸入手機條碼載具'
    if (value.length !== 8) return '手機條碼載具必須為8碼'
    if (!/^\/[A-Z0-9.+-]{7}$/.test(value)) return '手機條碼格式不正確（格式：/XXXXXXX）'
    return ''
  },
  companyName: (value: string) => {
    if (!value.trim()) return '請輸入買受人抬頭'
    if (value.trim().length < 2) return '買受人抬頭至少需要2個字元'
    return ''
  },
  taxId: (value: string) => {
    if (!value.trim()) return '請輸入統一編號'
    if (!/^\d{8}$/.test(value)) return '統一編號必須為8位數字'
    return ''
  }
}

// 驗證單個欄位
const validateField = (field: keyof typeof formData) => {
  if (validators[field]) {
    errors[field] = validators[field](formData[field])
  }
}

// 檢查是否可以提交
const canSubmit = computed(() => {
  if (!selectedInvoiceType.value) return false
  
  if (selectedInvoiceType.value === 'member') {
    return true
  }
  
  if (selectedInvoiceType.value === 'mobile') {
    return formData.mobileCarrier.trim() !== '' && !errors.mobileCarrier
  }
  
  if (selectedInvoiceType.value === 'unified') {
    return formData.companyName.trim() !== '' && 
           formData.taxId.trim() !== '' && 
           !errors.companyName && 
           !errors.taxId
  }
  
  return false
})

const handleSubmit = () => {
  if (!canSubmit.value) return
  
  // 根據選擇的類型驗證對應欄位
  if (selectedInvoiceType.value === 'mobile') {
    validateField('mobileCarrier')
    if (errors.mobileCarrier) return
  }
  
  if (selectedInvoiceType.value === 'unified') {
    validateField('companyName')
    validateField('taxId')
    if (errors.companyName || errors.taxId) return
  }
  
  console.log('Invoice data:', {
    type: selectedInvoiceType.value,
    ...formData
  })
  
  // 顯示成功提示
  showAlert.value = true
}

// 處理 Alert 確認按鈕
// @ts-ignore - Used in template @button-click event
const handleAlertConfirm = () => {
  router.push('/member')
}
</script>

<style lang="scss" scoped>  
@import '@/assets/styles/common.scss';

.invoice-container {
  padding: 0 19px;
  margin-top: 40px;
  min-height: 400px;
}

.notice-section {
  margin-top: 14px;
  
  .notice-title {
    color: #fff;
    font-size: 18px;
    font-weight: 500;
    line-height: 24px;
    margin: 0 0 12px 0;
  }

  .notice-text {
    color: #fff;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    margin: 0;
  }
}

.nav-btn {
  margin-top: 14px;
}
</style>
