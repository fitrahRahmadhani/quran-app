<script setup>
const props = defineProps({
  id: String,
  title: String,
})
</script>

<template>
  <RouterLink
    :to="{ name: 'surah-read', params: { id: props.id } }"
    class="text-sm border border-primary/20 font-medium py-2 px-4 text-primary bg-primary/10 rounded-full"
  >
    {{ title }}
  </RouterLink>
</template>
