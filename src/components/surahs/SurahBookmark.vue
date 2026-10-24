<script setup>
import { Bookmark } from '@lucide/vue'

const props = defineProps({
  bookmark: Object,
})
</script>

<template>
  <RouterLink
    class="flex p-4 bg-primary rounded-2xl justify-between items-center mt-4"
    v-if="bookmark"
    :to="{
      name: 'surah-read',
      params: { id: bookmark.surah },
      hash: `#ayat-${bookmark.ayat}`,
    }"
  >
    <div class="flex items-center gap-4">
      <div class="py-2 px-2 rounded-lg bg-secondary shadow-xl shadow-secondary/20 text-primary">
        <Bookmark :size="18" />
      </div>
      <div class="text-accent">
        <p class="font-medium">{{ bookmark.namaLatin }}</p>
        <p class="text-xs font-light">{{ bookmark.arti }} • ayat ke {{ bookmark.ayat }}</p>
      </div>
    </div>
    <p class="text-accent">Lanjut membaca →</p>
  </RouterLink>
</template>
