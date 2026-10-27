<script setup>
import { toArabicNumber } from '@/utils/formatText'
import { Bookmark, Pause, Play } from '@lucide/vue'

const props = defineProps({
  isActive: Boolean,
  isFocusMode: Boolean,
  ayat: Object,
  arabicClass: String,
  translateClass: String,
  transliteration: Boolean,
  indonesianTranslate: Boolean,
  bookmarked: Boolean,
  isPlaying: Boolean,
})
const emit = defineEmits(['bookmark', 'play'])
</script>

<template>
  <div
    class="py-6 sm:py-8 px-3 sm:px-4 transition-colors"
    :class="[
      props.isActive ? 'bg-primary/10' : '',
      props.isFocusMode ? 'scroll-mt-6' : 'scroll-mt-28',
    ]"
  >
    <p dir="rtl" lang="ar" class="leading-quran font-quran text-gray-800" :class="arabicClass">
      {{ props.ayat.teksArab }}
      <span class="text-primary"> &#x06DD;{{ toArabicNumber(props.ayat.nomorAyat) }}</span>
    </p>
    <p v-if="transliteration" class="mt-6 sm:mt-8 text-primary text-sm sm:text-base">
      {{ props.ayat.teksLatin }}
    </p>
    <p v-if="indonesianTranslate" class="mt-2" :class="translateClass">
      {{ props.ayat.teksIndonesia }}
    </p>
    <div class="mt-2 flex items-center">
      <button
        type="button"
        :aria-label="bookmarked ? 'Hapus bookmark' : 'Tambah bookmark'"
        :aria-pressed="bookmarked"
        class="flex items-center gap-1 shrink-0 font-semibold cursor-pointer"
        :class="
          bookmarked ? 'text-white bg-primary rounded-xl px-2 py-2' : 'text-primary/50 pr-1 py-1'
        "
        @click="$emit('bookmark')"
      >
        <Bookmark :size="18" :stroke-width="2.5" :fill="bookmarked ? 'currentColor' : 'none'" />
        <span class="text-xs" v-if="bookmarked">Hapus Bookmark</span>
      </button>
      <button
        type="button"
        class="shrink-0 p-1 font-semibold text-primary/50 cursor-pointer"
        @click="$emit('play')"
      >
        <div v-if="!props.isPlaying" class="flex gap-2 items-center">
          <Play :size="18" :stroke-width="2.5" />
        </div>
        <div v-else class="flex gap-2 items-center">
          <Pause :size="18" fill="currentColor'" />
        </div>
      </button>
    </div>
  </div>
</template>
