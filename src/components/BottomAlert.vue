<template>
  <Transition name="slide-up">
    <div v-if="isVisible" class="bottom-alert-overlay" @click="close">
      <div class="bottom-alert" @click.stop>
        <div class="alert-content">
          <img v-if="icon" :src="icon" :alt="title" class="alert-icon">
          <h3 v-if="title" class="alert-title">{{ title }}</h3>
          <button 
            v-if="buttonText" 
            @click="handleButtonClick" 
            class="alert-button"
          >
            {{ buttonText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
  icon?: string
  title?: string
  message?: string
  buttonText?: string
}>()

const emit = defineEmits(['update:modelValue', 'buttonClick'])

const isVisible = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  isVisible.value = newVal
})

const close = () => {
  isVisible.value = false
  emit('update:modelValue', false)
}

const handleButtonClick = () => {
  emit('buttonClick')
  close()
}
</script>

<style lang="scss" scoped>
.bottom-alert-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

.bottom-alert {
  width: 100%;
  background: #23252D;
  border-radius: 16px 16px 0 0;
  padding: 30px 20px 10px;
}

.alert-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;
  justify-content: center;

  .alert-icon {
    width: 48px;
    height: 48px;
    margin-bottom: 16px;
  }

  .alert-title {
    color: #FFFFFFCC;
    font-size: 16px;
    font-weight: 700;
    line-height: 23px;
    margin: 0 0 30px 0;
  }

  .alert-message {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    margin: 0 0 20px 0;
  }

  .alert-button {
    width: 100%;
    max-width: 335px;
    padding: 14px 24px;
    border-radius: 24px;
    border: none;
    font-size: 16px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.3s ease;
    background: linear-gradient(90deg, #55FBAB 0%, #67F4E8 100%);
    color: #1D2B27;
    margin-top: auto;

    &:hover {
      opacity: 0.9;
    }

    &:active {
      transform: scale(0.98);
    }
  }
}

// 滑入動畫
.slide-up-enter-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  .bottom-alert {
    transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
}

.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.6, 1);
  
  .bottom-alert {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.6, 1);
  }
}

.slide-up-enter-from {
  background: rgba(0, 0, 0, 0);
  
  .bottom-alert {
    transform: translateY(100%);
  }
}

.slide-up-enter-to {
  background: rgba(0, 0, 0, 0.5);
  
  .bottom-alert {
    transform: translateY(0);
  }
}

.slide-up-leave-from {
  background: rgba(0, 0, 0, 0.5);
  
  .bottom-alert {
    transform: translateY(0);
  }
}

.slide-up-leave-to {
  background: rgba(0, 0, 0, 0);
  
  .bottom-alert {
    transform: translateY(100%);
  }
}
</style>
