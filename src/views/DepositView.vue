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

      <!-- 發票開立方式 -->
      <section class="selection-section">
          <div class="form-group">
            <h3 class="section-title">發票開立方式 <span class="required">*</span></h3>
            <CustomSelect
              v-model="selectedInvoiceType"
              :options="invoiceOptions"
              placeholder="請選擇"
            />
          </div>

          <div class="form-group" v-if="selectedInvoiceType === 2">
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

          <div v-if="selectedInvoiceType === 3">
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
      <div class="button-footer" :class="{ 'z-50': isECPayReady }">
        <button 
          v-if="!isECPayReady"
          class="confirm-btn" 
          :disabled="!isValid || isLoading"
          @click="handleDeposit"
        >
          確定儲值
        </button>
        <button 
          v-else
          class="confirm-btn" 
          :disabled="isLoading"
          @click="handleApprovePayment"
        >
          確認付款
        </button>
      </div>
    </div>
    <div id="ECPayPayment" class="ecpay-payment"></div>


    <BottomAlert 
      v-model="showSuccessAlert"
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
import CustomSelect from '@/components/CustomSelect.vue'
import BottomAlert from '@/components/BottomAlert.vue'
import { createPaymentToken, getMemberProfile, executePayment } from '@/services/api.service'
import { loadECPaySDK } from '@/utils/ecpay'
import { getLineUserId } from '@/utils/liff'

const router = useRouter()
const isECPayReady = ref(false)
const showSuccessAlert = ref(false)

const amountPresets = [1000, 2000, 3000, 5000, 7000, 10000]
const selectedAmount = ref<number | null>(null)
const selectedPayment = ref<string | null>(null)
const isLoading = ref(false)

// Invoice Logic
const selectedInvoiceType = ref<number | null>(null)
const invoiceOptions = [
  { value: 1, label: '會員載具' },
  { value: 2, label: '手機條碼載具' },
  { value: 3, label: '三聯式統一發票' }
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

// 檢查發票是否有效
const isInvoiceValid = computed(() => {
  if (!selectedInvoiceType.value) return false
  
  if (selectedInvoiceType.value === 1) {
    return true
  }
  
  if (selectedInvoiceType.value === 2) {
    return formData.mobileCarrier.trim() !== '' && !errors.mobileCarrier
  }
  
  if (selectedInvoiceType.value === 3) {
    return formData.companyName.trim() !== '' && 
           formData.taxId.trim() !== '' && 
           !errors.companyName && 
           !errors.taxId
  }
  
  return false
})

const isValid = computed(() => selectedAmount.value !== null && selectedPayment.value !== null && isInvoiceValid.value)

const handleDeposit = async () => {
  if (!isValid.value || isLoading.value) return

  isLoading.value = true
  try {
    const lineUid = await getLineUserId()
    if (!lineUid) {
      alert('無法取得 LINE UID')
      return
    }

    // 1. 取得會員資料 (為了拿手機號碼)
    let memberProfile: any
    try {
      memberProfile = await getMemberProfile() as any
    } catch (e) {
        alert('取得會員資料失敗: ' + (e instanceof Error ? e.message : e))
        throw e
    }
    
    const phone = memberProfile?.user_profile?.phone
    const email = memberProfile?.user_profile?.email
    
    if (!phone) {
      alert('無法取得會員電話號碼')
      return
    }

    // 2. 建立支付 Token
    let tokenRes
    try {
      tokenRes = await createPaymentToken({
          total_amount: selectedAmount.value!,
          member_id: lineUid,
          phone: phone,
          email: email,
          invoice_carrier_type: selectedInvoiceType.value!, 
          invoice_carrier_num: selectedInvoiceType.value === 2 ? formData.mobileCarrier : '',
          invoice_buyer_name: selectedInvoiceType.value === 3 ? formData.companyName : '',
          invoice_tax_id: selectedInvoiceType.value === 3 ? formData.taxId : '',
          choose_payment_list: selectedPayment.value === 'card' ? null : 7,
      })
    } catch (e) {
      alert('建立支付 Token 失敗: ' + (e instanceof Error ? e.message : e))
      throw e
    }

    if (!tokenRes?.data?.token) {
      alert('建立支付訂單失敗')
      return
    }

    // 3. 載入並呼叫 SDK
    await loadECPaySDK('stage') // 預設使用 stage，實際專案可依環境變數調整
    
    
    if (window.ECPay) {
      // 1. 初始化 ECPay SDK
      // 第一個參數: 'STAGE' | 'PROD' (ServerType)
      // 第二個參數: 1 (isLoading, 1=顯示預設 loading, 0=不顯示)
      // 第三個參數: callback (錯誤處理)
      window.ECPay.initialize('STAGE', 1, (errMsg) => {
        if (errMsg) {
          alert('ECPay 初始化失敗: ' + errMsg)
          return
        }
        
        // 2. 建立支付
        // 第一個參數: token
        // 第二個參數: 語言 'zh-TW' | 'en-US'
        // 第三個參數: callback (錯誤處理)
        try {
          window.ECPay!.createPayment(tokenRes.data.token, 'zh-TW', (errMsg) => {
            if (errMsg) {
              console.error('ECPay CreatePayment Error:', errMsg)
              alert('建立支付畫面失敗: ' + errMsg)
            } else {
              if (selectedPayment.value === 'card') {
                isECPayReady.value = true
              }
            }
          })
        } catch (e) {
            console.error('ECPay CreatePayment Exception:', e)
        }
      })
    } else {
      alert('支付 SDK 載入失敗')
    }
  } catch (error) {
    console.error('Deposit failed:', error)
    alert(`儲值發生錯誤: ${error instanceof Error ? error.message : error}`)
  } finally {
    isLoading.value = false
  }
}

const handleApprovePayment = async () => {
    isLoading.value = true
    try {
        if (!window.ECPay) {
            alert('ECPay SDK 未載入')
            return
        }

        window.ECPay.getPayToken(async (paymentInfo, errMsg) => {
            if (errMsg) {
                console.error('getPayToken Error:', errMsg)
                alert('取得支付 Token 失敗: ' + errMsg)
                isLoading.value = false
                return
            }
            
            console.log('Payment Info:', paymentInfo)
            
            try {
                // 取得會員電話 (這裡需要確保有 phone，可以從前面的邏輯暫存或者重新取得)
                // 為了簡化，這裡假設 tokenRes 流程已經確保了 phone 存在，
                // 但為了安全，最好在此處再次確認或從狀態管理中取得
                 const memberProfile = await getMemberProfile() as any
                 const phone = memberProfile?.user_profile?.phone || ''

                const res = await executePayment({
                    pay_token: paymentInfo.PayToken,
                    merchant_trade_no: paymentInfo.MerchantTradeNo,
                    phone: phone
                })

                if (res.success) { // 假設 Code 1 為成功
                   // check 3D verification
                   if (res.data?.ThreeDInfo?.ThreeDURL) {
                      window.location.href = res.data.ThreeDInfo.ThreeDURL
                      return
                   }

                   // 付款成功，顯示彈窗
                  //  showSuccessAlert.value = true
                } else {
                   console.error('Execute Payment API Error:', res)
                   alert('付款失敗: ' + (res.data?.RtnMsg || res.Message || '未知錯誤'))
                }
            } catch (apiError) {
                console.error('Execute Payment API Error:', apiError)
                alert('付款 API 呼叫失敗')
            } finally {
                isLoading.value = false
            }
        })
    } catch (e) {
        console.error('handleApprovePayment Exception:', e)
        alert('付款流程發生例外錯誤')
        isLoading.value = false
    }
}

const handleAlertConfirm = () => {
  showSuccessAlert.value = false
  router.push('/balance')
}
</script>

<style lang="scss" scoped>
.deposit-container {
  padding: 24px 20px 120px 20px;
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
}

.confirm-btn {
  width: 100%;
  height: 52px;
  background: linear-gradient(90deg, #55FBAB 0%, #67F4E8 100%);
  color: #1D2B27;
  border: none;
  border-radius: 26px;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s ease;

  &:disabled {
    background: linear-gradient(270deg, rgba(160, 160, 160, 0.8) 0%, rgba(130, 130, 130, 0.8) 100%);
    color: #BCBCBC;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
}

// Invoice Styles
.form-group {
    margin-bottom: 20px;

    label {
      display: block;
      color: #fff;
      font-size: 14px;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .required {
      color: #FF6B6B;
      margin-left: 4px;
    }

    input[type="text"] {
      width: 100%;
      height: 48px;
      background: rgba(144, 161, 185, 0.1);
      border: 1px solid rgba(144, 161, 185, 0.1);
      border-radius: 12px;
      padding: 0 16px;
      color: #fff;
      font-size: 16px;
      transition: all 0.3s ease;

      &::placeholder {
        color: rgba(255, 255, 255, 0.3);
      }

      &:focus {
        outline: none;
        border-color: #55FBAB;
        background: rgba(85, 251, 171, 0.05);
      }

      &.error {
        border-color: #FF6B6B;
        background: rgba(255, 107, 107, 0.05);
      }

      &.valid {
        border-color: #55FBAB;
      }
    }

    .error-message {
      display: block;
      color: #FF6B6B;
      font-size: 12px;
      margin-top: 6px;
    }
}

.notice-section {
  margin-top: 30px;
  
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

.ecpay-payment {
  position: fixed;
  right: 0;
  bottom: 0;
  opacity: 1;
  width: 100%;
  z-index: 10;
}

// ECPay SDK UI 樣式覆寫
:deep(.ecpay-pay-list-wrap .ecpay-pay-list) {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  max-height: 90vh;
  overflow-y: auto;
  padding-bottom: env(safe-area-inset-bottom);
  background: #0f172a; /* 改為深色背景 */
  border-radius: 24px 24px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1); /* 微弱邊框 */
}

:deep(.ecpay-pay-list-wrap .ecpay-pay-list > li.ecpay-pl-act) {
  background: transparent !important; /* 透明背景，透出上面的深色 */
  width: 100%;
  border: none;
  margin-top: 0 !important;
}

:deep(.ecpay-pl-type) {
 color: #121212 !important;
}
:deep(.ecpay-card-info-tab .ecpay-cit-ic) {
  display: none !important;
}
:deep(.ecpay-card-info-tab .ecpay-cit-ic2.ecpay-eci-member) {
  display: none !important;
}
:deep(.ecpay-select-input.ecpay-cit-item dt) {
  color: #fff !important;
}
:deep(.ecpay-card-detail) {
  color: #fff !important;
}
/* 標題與文字顏色 */
:deep(.ecpay-tit), :deep(label), :deep(.control-label), :deep(h1), :deep(h2), :deep(h3), :deep(div) {
  color: #fff !important;
  font-family: inherit !important;
}

/* 輸入框樣式 */
:deep(input[type="text"]), 
:deep(input[type="tel"]), 
:deep(input[type="number"]),
:deep(input[type="password"]),
:deep(select) {
  width: 100% !important;
  height: 48px !important;
  background: rgba(144, 161, 185, 0.1) !important;
  border: 1px solid rgba(144, 161, 185, 0.1) !important;
  border-radius: 12px !important;
  padding: 0 16px !important;
  color: #fff !important;
  font-size: 16px !important;
  margin-bottom: 12px !important;
  box-shadow: none !important;
  transition: all 0.3s ease !important;
}

:deep(input:focus), :deep(select:focus) {
  border-color: #55FBAB !important;
  background: rgba(85, 251, 171, 0.05) !important;
  outline: none !important;
}

/* 錯誤提示文字 */
:deep(.error-text), :deep(.invalid-feedback) {
  color: #FF6B6B !important;
  font-size: 12px !important;
  margin-top: 4px !important;
}
:deep(#ECPayPayment .ecpay-pay-check .ecpay-checkbox.eck-2), :deep(#ECPayPayment .ecpay-pay-check .epc-txt) {
  display: none !important; 
}
/* 按鈕樣式 (已設定，微調 margin) */
/* 按鈕樣式 (已設定，微調 margin) */
:deep(#ECPayPayment .btn-block), 
:deep(#ECPayPayment button),
:deep(#ECPayPayment .ecpay-btn),
:deep(#ECPayPayment input[type="button"]),
:deep(#ECPayPayment input[type="submit"]),
:deep(#ECPayPayment .ecpay-button) { /* 增加更多可能的 class */
  background: linear-gradient(90deg, #55FBAB 0%, #67F4E8 100%) !important;
  color: #1D2B27 !important;
  border: none !important;
  border-radius: 26px !important;
  height: 52px !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  width: 100% !important;
  margin-top: 24px !important;
  margin-bottom: 24px !important; /* 增加底部間距 */
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  cursor: pointer !important;
  position: relative !important; /* 避免被 absolute 元素覆蓋 */
  z-index: 10000 !important;
}

/* 確保容器有足夠空間顯示按鈕 */
:deep(.ecpay-pay-list-wrap .ecpay-pay-list) {
  /* ...其他樣式不變 */
  padding-bottom: calc(80px + env(safe-area-inset-bottom)) !important; /* 增加底部內距給按鈕 */
}

/* 隱藏不需要的元素 (例如綠界的 header 或 footer 裝飾，視情況而定) */
:deep(.ecpay-logo) {
  filter: brightness(0) invert(1) !important; /* Logo 轉白 */
  opacity: 0.8 !important;
}

</style>
