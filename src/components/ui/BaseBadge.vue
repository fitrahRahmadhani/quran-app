<script setup>
const props = defineProps({
  id: String,
  title: String,
})
</script>

<template>
  <button
    id="{{ id }}"
    class="text-sm border border-primary/20 font-medium py-2 px-4 text-primary bg-primary/10 rounded-full cursor-pointer"
  >
    {{ title }}
  </button>
</template>
