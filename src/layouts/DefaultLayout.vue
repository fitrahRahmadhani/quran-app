<script setup>
import TheFooter from '@/components/ui/TheFooter.vue'
import TheHeader from '@/components/ui/TheHeader.vue'
</script>

<template>
  <div class="flex flex-col w-full min-h-screen bg-linear-to-br from-[#F6F3EA] to-[#F1E8D8]">
    <TheHeader />
    <main class="max-w-360 w-full flex-1 mx-auto border border-red-500 p-4 sm:p-6 lg:p-8">
      <slot></slot>
    </main>
    <TheFooter />
  </div>
</template>
