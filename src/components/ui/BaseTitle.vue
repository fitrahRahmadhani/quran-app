<script setup>
const props = defineProps({
  title: String,
})
</script>

<template>
  <h2 class="text-4xl font-bold text-primary">{{ props.title }}</h2>
  <p class="text-primary mt-2">
    Temukan surah yang ingin kamu baca, atau jelajahi sesuai urutan mushaf.
  </p>
</template>
