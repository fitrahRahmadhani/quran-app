<script setup>
import TheFooter from '@/components/ui/TheFooter.vue'
import TheHeader from '@/components/ui/TheHeader.vue'
import { useMinimize } from '@/stores/minimize'

const minimizeStore = useMinimize()
</script>

<template>
  <div class="flex flex-col w-full min-h-screen bg-linear-to-br from-[#F6F3EA] to-[#F1E8D8]">
    <TheHeader v-if="!minimizeStore.isFocusMode" />
    <main class="max-w-360 w-full flex-1 mx-auto p-4 sm:p-6 lg:p-8">
      <slot></slot>
    </main>
    <TheFooter v-if="!minimizeStore.isFocusMode" />
  </div>
</template>
