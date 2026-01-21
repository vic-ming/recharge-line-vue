<template>
  <MainLayout header="編輯會員資料" :deleteIcon="false" :backIcon="true">
    <div class="setting-container">
      <div class="form-step">
        <!-- 真實姓名 -->
        <div class="form-group">
          <label for="name">真實姓名 <span class="required">*</span></label>
          <input 
            id="name" 
            v-model="formData.name" 
            type="text" 
            placeholder="請輸入真實姓名"
            @blur="validateField('name')"
            :class="{ 'error': errors.name }"
          />
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>

        <!-- 連絡電話 -->
        <div class="form-group">
          <label for="phone">連絡電話 <span class="required">*</span></label>
          <div class="phone-input-wrapper">
            <input 
              id="phone" 
              v-model="formData.phone" 
              type="tel" 
              placeholder="請輸入連絡電話"
              @blur="validateField('phone')"
              :class="{ 'error': errors.phone }"
              class="w-full"
              disabled
            />
            <span class="verified-badge">已驗證</span>
          </div>
          <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
        </div>

        <!-- E-mail -->
        <div class="form-group">
          <label for="email">E-mail <span class="required">*</span></label>
          <input 
            id="email" 
            v-model="formData.email" 
            type="email" 
            placeholder="請輸入E-mail"
            @blur="validateField('email')"
            :class="{ 'error': errors.email }"
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <!-- 戶號 -->
        <div class="form-group">
          <label for="homeNumber">戶號 <span class="required">*</span></label>
          <input 
            id="homeNumber" 
            v-model="formData.homeNumber" 
            type="text" 
            placeholder="請輸入戶號"
            @blur="validateField('homeNumber')"
            :class="{ 'error': errors.homeNumber }"
          />
          <span v-if="errors.homeNumber" class="error-message">{{ errors.homeNumber }}</span>
        </div>

        <!-- 車位號 -->
        <div class="form-group">
          <label>車位號 <span class="required">*</span></label>
          <div class="parking-list">
            <div 
              v-for="(_, index) in formData.parkingSpots" 
              :key="index"
              class="parking-item"
            >
              <input 
                v-model="formData.parkingSpots[index]" 
                type="text" 
                placeholder="請輸入車位號"
              />
              <button 
                class="delete-btn" 
                @click="removeParking(index)"
                type="button"
              >
                <img src="/icons/trash.svg" alt="刪除">
              </button>
            </div>
          </div>
          <button 
            class="add-parking-btn" 
            @click="addParking"
            type="button"
          >
            <span>+</span>
          </button>
        </div>

        
      </div>
    </div>
    <!-- Navigation Buttons -->
    <div class="button-container">
      <!-- 儲存變更按鈕 -->
      <button
        @click="handleSubmit" 
        class="nav-btn next-btn"
        :disabled="!isFormValid"
      >
        儲存變更
      </button>
    </div>

    <!-- Bottom Alert -->
    <BottomAlert 
      v-model="showAlert"
      icon="/icons/success.svg"
      title="儲存成功！"
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
const showAlert = ref(false)

const formData = reactive({
  name: '王大明',
  phone: '0800000123',
  email: 'abc123@gmail.com',
  homeNumber: 'WS-01-12',
  parkingSpots: ['B2-56', 'B2-57']
})

const errors = reactive({
  name: '',
  phone: '',
  email: '',
  homeNumber: ''
})

// 驗證規則
const validators = {
  name: (value: string) => {
    if (!value.trim()) return '請輸入真實姓名'
    if (value.trim().length < 2) return '姓名至少需要2個字元'
    return ''
  },
  phone: (value: string) => {
    if (!value.trim()) return '請輸入連絡電話'
    const phoneRegex = /^0\d{9,10}$/
    if (!phoneRegex.test(value)) return '請輸入有效的電話號碼'
    return ''
  },
  email: (value: string) => {
    if (!value.trim()) return '請輸入E-mail'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return '請輸入有效的E-mail格式'
    return ''
  },
  homeNumber: (value: string) => {
    if (!value.trim()) return '請輸入戶號'
    return ''
  }
}

// 驗證單個欄位
const validateField = (field: keyof typeof errors) => {
  if (validators[field]) {
    errors[field] = validators[field](formData[field])
  }
}

// 新增車位
const addParking = () => {
  formData.parkingSpots.push('')
}

// 刪除車位
const removeParking = (index: number) => {
  if (formData.parkingSpots.length > 1) {
    formData.parkingSpots.splice(index, 1)
  }
}

// 計算表單是否有效
const isFormValid = computed(() => {
  return formData.name.trim() !== '' &&
         formData.phone.trim() !== '' &&
         formData.email.trim() !== '' &&
         formData.homeNumber.trim() !== '' &&
         formData.parkingSpots.length > 0 &&
         formData.parkingSpots.every(spot => spot.trim() !== '') &&
         !errors.name &&
         !errors.phone &&
         !errors.email &&
         !errors.homeNumber
})

// 處理提交
const handleSubmit = () => {
  // 驗證所有欄位
  validateField('name')
  validateField('phone')
  validateField('email')
  validateField('homeNumber')
  
  if (isFormValid.value) {
    console.log('Updated member data:', formData)
    // 顯示成功提示
    showAlert.value = true
  }
}

// 處理 Alert 確認按鈕
// @ts-ignore - Used in template @button-click event
const handleAlertConfirm = () => {
  router.push('/member')
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/common.scss';

.setting-container {
  padding: 24px 20px;
  min-height: calc(100vh - 100px);
}

.phone-input-wrapper {
  position: relative;

  input {
    padding-right: 80px;
  }

  .verified-badge {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #A7B5C9;
    font-size: 14px;
    font-weight: 400;
  }
}

.parking-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.parking-item {
  display: flex;
  gap: 12px;
  align-items: center;
  position: relative;

  input {
    flex: 1;
    width: 100%;
  }

  .delete-btn {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    position: absolute;
    right: 13px;
    top: 9px;

    img {
      width: 24px;
      height: 24px;
    }

    &:hover {
      background: rgba(255, 108, 108, 0.2);
      border-color: #FF6C6C;
    }
  }
}

.add-parking-btn {
  width: 100%;
  height: 44px;
  background: transparent;
  border: 1px solid #68717E;
  border-radius: 15px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 24px;

}

.nav-btn {
  margin-top: 16px;
}
</style>
