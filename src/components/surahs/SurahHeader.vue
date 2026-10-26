<script setup>
import { Pause, Play } from '@lucide/vue'

const props = defineProps({
  namaLatin: String,
  arti: String,
  tempatTurun: String,
  jumlahAyat: String,
  nama: String,
  isPlaying: Boolean,
})

const emits = defineEmits(['play'])
</script>

<template>
  <div
    class="w-full h-fit relative flex flex-col bg-primary rounded-3xl overflow-hidden p-5 sm:p-8 gap-6 sm:gap-8"
  >
    <div class="flex justify-between items-center gap-4">
      <div class="min-w-0">
        <p class="text-secondary text-2xl sm:text-3xl font-semibold">{{ props.namaLatin }}</p>
        <p class="text-accent/50 text-sm sm:text-base">
          {{ props.arti }} • {{ props.tempatTurun }} • {{ props.jumlahAyat }} Ayat
        </p>
      </div>
      <p
        dir="rtl"
        lang="ar"
        class="text-secondary text-4xl sm:text-5xl lg:text-6xl font-quran self-start shrink-0"
      >
        {{ props.nama }}
      </p>
    </div>
    <div class="flex items-center">
      <button
        type="button"
        class="bg-secondary shrink-0 py-2 px-4 font-semibold rounded-full text-primary text-sm sm:text-base cursor-pointer"
        @click="$emit('play')"
      >
        <div v-if="!props.isPlaying" class="flex gap-2 items-center">
          <Play :size="18" :stroke-width="2.5" />
          Putar Surah
        </div>
        <div v-else class="flex gap-2 items-center">
          <Pause :size="18" :stroke-width="2.5" />
          Jeda
        </div>
      </button>
    </div>
    <div class="w-40 h-40 rounded-full absolute -top-10 -right-10 bg-white/10"></div>
  </div>
</template>
