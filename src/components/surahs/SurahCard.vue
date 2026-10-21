<script setup>
import { toArabicNumber } from '@/utils/formatText'

const props = defineProps({
  id: Number,
  number: Number,
  title: String,
  arabicTitle: String,
  numberOfVerses: Number,
  meaning: String,
})
</script>

<template>
  <RouterLink
    :to="{ name: 'surah-read', params: { id: props.id } }"
    class="flex p-4 bg-white rounded-2xl border border-gray-200 justify-between items-center"
  >
    <div class="flex items-center gap-4">
      <div class="rounded-lg w-12 h-12 flex items-center justify-center bg-primary/10 text-primary">
        <p dir="rtl" lang="ar" class="font-quran text-gray-800 text-3xl">
          <span class="text-primary"> &#x06DD;{{ toArabicNumber(number) }}</span>
        </p>
      </div>
      <div class="text-primary">
        <p class="font-medium">{{ title }}</p>
        <p class="text-xs font-light">{{ meaning }} • {{ numberOfVerses }} ayat</p>
      </div>
    </div>
    <p dir="rtl" lang="ar" class="font-quran text-2xl text-primary">
      {{ arabicTitle }}
    </p>
  </RouterLink>
</template>
