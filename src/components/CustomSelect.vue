<template>
  <div class="custom-select" v-click-outside="closeDropdown">
    <div 
      class="select-trigger" 
      @click="toggleDropdown"
      :class="{ 'active': isOpen, 'valid': modelValue !== '', 'error': hasError }"
    >
      <div class="px-[16px] py-[10px]">
        <span class="select-value" :class="{ '!text-[#68717E]': isOpen }">{{ displayText }}</span>
        <img 
            src="/icons/arrow-down.svg" 
            alt="dropdown" 
            class="select-arrow"
            :class="{ 'rotate': isOpen }"
        >
      </div>
      
      <Transition name="slide-down">
        <div v-if="isOpen" class="select-dropdown">
          <div 
            v-for="option in options" 
            :key="option.value"
            class="select-option"
            :class="{ 'selected': option.value === modelValue, 'highlighted': option.value === modelValue }"
            @click="selectOption(option)"
          >
            {{ option.label }}
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Option {
  value: string | number
  label: string
}

const props = defineProps<{
  modelValue: string
  options: Option[]
  placeholder?: string
  hasError?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)

const displayText = computed(() => {
  const selected = props.options.find(opt => opt.value === props.modelValue)
  return selected ? selected.label : (props.placeholder || '請選擇')
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const selectOption = (option: Option) => {
  emit('update:modelValue', option.value)
  closeDropdown()
}

// Click outside directive
interface ClickOutsideElement extends HTMLElement {
  clickOutsideEvent?: (event: Event) => void
}

const vClickOutside = {
  mounted(el: ClickOutsideElement, binding: any) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: ClickOutsideElement) {
    if (el.clickOutsideEvent) {
      document.removeEventListener('click', el.clickOutsideEvent)
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-select {
  position: relative;
  width: 100%;
}

.select-trigger {
  width: 100%;
  
  border-radius: 15px;
  border: 1px solid #90A1B91A;
  background: #90A1B91A;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    border-color: #60F7D1;
  }

  &.active {
    border-color: #60F7D1;
  }

  &.valid {
    border-color: #60F7D1;
  }

  &.error {
    border-color: #FF6C6C;
  }

  .select-value {
    flex: 1;
    color: #fff;
  }

  .select-arrow {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
    position: absolute;
    right: 16px;
    top: 10px;

    &.rotate {
      transform: rotate(180deg);
    }
  }
}

.select-option {
  padding: 9px 16px;
  color: #68717E;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;


  &:hover {
    background: #63F6D966;
  }

  &.selected {
    background: #63F6D966;
    border-top: 1px solid #6EFFE2;
    border-bottom: 1px solid #6EFFE2;
    color: #fff;
  }

  &.highlighted {
    background: rgba(99, 246, 217, 0.15);
  }

  &:last-child {
    border-bottom: none;
  }
}

.select-dropdown {
  overflow: hidden;
}

// Slide down animation
.slide-down-enter-active {
  transition: all 0.5s ease-out;
}

.slide-down-leave-active {
  transition: all 0.2s ease-in;
}

.slide-down-enter-from {
  opacity: 0;
  max-height: 0;
}

.slide-down-enter-to {
  opacity: 1;
  max-height: 500px;
}

.slide-down-leave-from {
  opacity: 1;
  max-height: 500px;
}

.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
