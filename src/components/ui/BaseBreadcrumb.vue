<script setup>
const props = defineProps({
  items: Array,
})
</script>

<template>
  <div class="hidden flex-wrap gap-x-2 gap-y-1 mb-6 md:flex">
    <template v-for="(item, index) in items" :key="index">
      <RouterLink v-if="item.to" :to="item.to">
        <p class="text-sm text-gray-500">{{ index > 0 ? '/ ' : '' }}{{ item.label }}</p>
      </RouterLink>
      <p v-else class="text-sm font-semibold text-primary">
        {{ index > 0 ? '/ ' : '' }}{{ item.label }}
      </p>
    </template>
  </div>
</template>
