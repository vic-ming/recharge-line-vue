<template>
  <div class="main-layout">
    <!-- Header Slot -->
    <header class="layout-header">
      <img v-if="backIcon" class="back-icon" src="/icons/back.svg" @click="backFunction" alt="back" />
      <h1>{{ header }}</h1>
      <img v-if="deleteIcon" class="delete-icon" src="/icons/delete.svg" alt="delete" @click="deleteFunction" />
    </header>

    <!-- Main Content -->
    <main class="layout-content">
      <slot>
        <!-- Default main content -->
      </slot>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  defineProps<{
    header: string,
    backIcon?: boolean,
    deleteIcon?: boolean,
    questionIcon?: boolean,
    backFunction?: () => void
  }>()

  const emit = defineEmits(['back'])

  const router = useRouter()

  const backFunction = () => {
    emit('back')
    router.back()
  }

  import { isInLineApp, closeLiff } from '@/utils/liff'

  const deleteFunction = () => {
    if (isInLineApp()) {
      closeLiff()
    } else {
      router.back()
    }
  }
</script>

<style lang="scss" scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.layout-header {
  padding-top: 52px;
  z-index: 100;
  text-align: center;
  font-weight: 700;
  font-size: 18px;
  line-height: 28px;
  position: relative;
  h1{
    display: inline-block;
  }

  .back-icon {
    position: absolute;
    left: 16px;
    top: 56px;
    cursor: pointer;
  }
  .delete-icon {
    position: absolute;
    right: 16px;
    top: 56px;
    cursor: pointer;
  }
}

.layout-content {
  flex: 1;
  width: 100%;
}
</style>
