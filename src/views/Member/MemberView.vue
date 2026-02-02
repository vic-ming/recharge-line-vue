<template>
  <MainLayout header="會員中心" :deleteIcon="true" :backIcon="false">
    <Loading v-if="loading" />
    <div v-else class="member-container">
      <div class="member-card">
        <img class="card-bg" src="/images/card-bg.png" alt="" />
        <img class="edit-icon" src="/icons/edit.svg" alt="" @click="edit" />

        <div class="member-info">
          <div class="info-name">{{ info.name }}</div> 
          <div class="info-item">
            <img src="/icons/phone.svg" alt="" />
            <p>{{ info.phone }}</p>
          </div>
          <div class="info-item">
            <img src="/icons/mail.svg" alt="" />
            <p>{{ info.mail }}</p>
          </div>
          <div class="info-item">
            <img src="/icons/home.svg" alt="" />
            <p>{{ info.home }}</p>
          </div>
          <div class="info-item">
            <img src="/icons/car.svg" alt="" />
            <p class="font-[700]">{{ info.car.join(' | ') }}</p>
          </div>
        </div>
      </div>

      
    </div>
    <div v-if="!loading" class="contact-info">
        <div class="contact-title">客服聯絡資訊</div>
        <div class="contact-item">
          <img src="/icons/phone-gray.svg" alt="" />
          <p>0922-000-000</p>
        </div>
      </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/components/MainLayout.vue'
import Loading from '@/components/Loading.vue'
import { getMemberProfile } from '@/services/api.service'

const router = useRouter() // router instance

const edit = () => {
  router.push('/member/setting')
}

interface MemberInfo {
  name: string
  phone: string
  mail: string
  home: string
  car: string[]
}

const info = ref<MemberInfo>({
  name: '--',
  phone: '--',
  mail: '--',
  home: '--',
  car: []
})

const loading = ref(false)

const fetchMemberProfile = async () => {
  loading.value = true
  try {
    const res = await getMemberProfile()
    // 檢查 API 回傳結構
    if (res && res.user_profile) {
        const userProfile = res.user_profile
        // API 目前沒有回傳 name 欄位，先使用預設值或從其他地方獲取（如果有的話）
        // 暫時顯示 phone 作為名稱，或待 API 補充
        info.value = {
            name: '--', 
            phone: userProfile.phone || '--',
            mail: userProfile.email || '--',
            home: userProfile.household_number || '--',
            car: userProfile.parking_spaces || []
        }
    }
  } catch (error) {
    console.error('Failed to fetch member profile:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMemberProfile()
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/common.scss';
.member-container {
  margin-top: 18px;
  padding: 0 22px;
  .member-card {
    height: 229px;
    background: linear-gradient(180deg, #2D333F 69.95%, rgba(45, 51, 63, 0) 94.82%);
    border-radius: 20px;
    padding: 24px;
    overflow: hidden;
    position: relative;
    .card-bg {
      width: 142px;
      position: absolute;
      top: 0;
      right: 0;
    }
    .edit-icon {
      width: 24px;
      position: absolute;
      top: 24px;
      right: 24px;
    }
    .member-info {
      display: flex;
      flex-direction: column;
      gap: 12px;
      .info-name {
        font-size: 24px;
        font-weight: 500;
        margin-bottom: 8px;
      }
      .info-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 400;
        color: #fff;
        img{
          width: 24px;
        }
      }
    }
  }
}
.contact-info {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 24px 16px;
  border-top: 1px solid #90A1B933;
  margin-bottom: 34px;
  .contact-title {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  .contact-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 400;
    color: #fff;
    img{
      width: 24px;
    }
  }
} 
</style>
