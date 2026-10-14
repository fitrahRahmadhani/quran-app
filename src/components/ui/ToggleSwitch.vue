<script setup>
const model = defineModel({ type: Boolean })
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="model"
    @click="model = !model"
    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
    :class="model ? 'bg-primary' : 'bg-gray-300'"
  >
    <span
      class="inline-block h-5 w-5 rounded-full bg-white shadow transition-transform"
      :class="model ? 'translate-x-5.5' : 'translate-x-0.5'"
    ></span>
  </button>
</template>
