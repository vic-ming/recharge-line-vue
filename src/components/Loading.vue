<template>
  <div class="loading-container">
    <div class="spinner"></div>
    <div v-if="text" class="loading-text">{{ text }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    default: '載入中...'
  }
})
</script>

<style lang="scss" scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(96, 247, 209, 0.3);
  border-radius: 50%;
  border-top-color: #60F7D1;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 12px;
}

.loading-text {
  color: #60F7D1;
  font-size: 14px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
