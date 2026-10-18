import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMinimize = defineStore('minimize', () => {
  const isFocusMode = ref(false)

  function toggleFocusMode() {
    isFocusMode.value = !isFocusMode.value
  }

  function disableFocusMode() {
    isFocusMode.value = false
  }

  return {
    isFocusMode,
    toggleFocusMode,
    disableFocusMode,
  }
})
