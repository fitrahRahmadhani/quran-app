<script setup>
import { toArabicNumber } from '@/utils/formatText'
const props = defineProps({
  prevSurah: Object,
  nextSurah: Object,
})
</script>

<template>
  <div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mt-8">
    <RouterLink
      v-if="props.prevSurah"
      :to="{ name: 'surah-read', params: { id: props.prevSurah.nomor } }"
      class="sm:col-start-1 flex items-center justify-between gap-4 p-4 bg-white rounded-2xl"
    >
      <div class="flex items-center gap-3 sm:gap-4 min-w-0">
        <div class="shrink-0 rounded-lg bg-primary/10 text-primary p-2">
          <p dir="rtl" lang="ar" class="font-quran text-2xl sm:text-3xl leading-none">
            &#x06DD;{{ toArabicNumber(props.prevSurah.nomor) }}
          </p>
        </div>
        <div class="text-primary min-w-0">
          <p class="font-medium truncate">{{ props.prevSurah.namaLatin }}</p>
          <p class="text-xs font-light">{{ props.prevSurah.jumlahAyat }} ayat</p>
        </div>
      </div>
      <p
        dir="rtl"
        lang="ar"
        class="font-quran text-2xl sm:text-3xl text-primary self-baseline shrink-0"
      >
        {{ props.prevSurah.nama }}
      </p>
    </RouterLink>

    <RouterLink
      v-if="props.nextSurah"
      :to="{ name: 'surah-read', params: { id: props.nextSurah.nomor } }"
      class="sm:col-start-2 flex items-center justify-between gap-4 p-4 bg-primary rounded-2xl"
    >
      <div class="flex items-center gap-3 sm:gap-4 min-w-0">
        <div class="shrink-0 rounded-lg bg-white/10 text-accent p-2">
          <p dir="rtl" lang="ar" class="font-quran text-2xl sm:text-3xl leading-none">
            &#x06DD;{{ toArabicNumber(props.nextSurah.nomor) }}
          </p>
        </div>
        <div class="text-white min-w-0">
          <p class="font-medium truncate">{{ props.nextSurah.namaLatin }}</p>
          <p class="text-xs font-light">{{ props.nextSurah.jumlahAyat }} ayat</p>
        </div>
      </div>
      <p
        dir="rtl"
        lang="ar"
        class="font-quran text-2xl sm:text-3xl text-accent self-baseline shrink-0"
      >
        {{ props.nextSurah.nama }}
      </p>
    </RouterLink>
  </div>
</template>
