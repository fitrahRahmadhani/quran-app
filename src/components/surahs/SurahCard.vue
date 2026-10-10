<script setup>
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
      <div class="py-2 px-3 rounded-lg bg-primary/10 text-primary">
        <p class="font-medium text-sm">{{ number }}</p>
      </div>
      <div class="text-primary">
        <p class="font-medium">{{ title }}</p>
        <p class="text-xs font-light">{{ meaning }} • {{ numberOfVerses }} ayat</p>
      </div>
    </div>
    <p dir="rtl" lang="ar" class="font-quran text-3xl text-primary self-baseline">
      {{ arabicTitle }}
    </p>
  </RouterLink>
</template>
