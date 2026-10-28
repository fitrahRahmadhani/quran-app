<script setup>
import { TriangleAlert } from '@lucide/vue'
</script>

<template>
  <div
    class="flex flex-col items-center text-center gap-4 mt-12 p-6 sm:p-8 bg-white border border-red-100 rounded-3xl"
  >
    <div class="p-4 rounded-full bg-red-50 text-red-500">
      <TriangleAlert :size="40" />
    </div>

    <div>
      <h3 class="text-xl font-bold text-primary">Gagal Memuat Data</h3>
      <p class="mt-1 text-gray-500 max-w-md">
        Terjadi kesalahan saat memuat data. Silakan coba lagi
      </p>
    </div>
  </div>
</template>
