<script setup>
import { Check, ChevronDown } from '@lucide/vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  options: { type: Array, required: true },
  placeholder: { type: String, default: 'Pilih salah satu' },
  disabled: { type: Boolean, default: false },
})

const model = defineModel()

const root = ref(null)
const isOpen = ref(false)
const activeIndex = ref(-1)

const selected = computed(() => props.options.find((o) => o.value === model.value))

function open() {
  if (props.disabled) return
  isOpen.value = true
  const current = props.options.findIndex((o) => o.value === model.value)
  activeIndex.value = current >= 0 ? current : 0
}

function close() {
  isOpen.value = false
  activeIndex.value = -1
}

function toggle() {
  isOpen.value ? close() : open()
}

function select(option) {
  model.value = option.value
  close()
}

function move(step) {
  if (!isOpen.value) return open()
  const last = props.options.length - 1
  activeIndex.value = Math.min(last, Math.max(0, activeIndex.value + step))
}

function onKeydown(e) {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      move(1)
      break
    case 'ArrowUp':
      e.preventDefault()
      move(-1)
      break
    case 'Enter':
    case ' ':
      e.preventDefault()
      if (!isOpen.value) open()
      else if (activeIndex.value >= 0) select(props.options[activeIndex.value])
      break
    case 'Escape':
      close()
      break
    case 'Tab':
      close()
      break
  }
}

function onClickOutside(e) {
  if (root.value && !root.value.contains(e.target)) close()
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>

<template>
  <div ref="root" class="relative w-full">
    <button
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      :disabled="disabled"
      class="flex w-full items-center justify-between gap-2 rounded-lg bg-primary/10 p-2 text-left text-sm font-semibold text-primary transition-colors hover:bg-primary/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
      @click="toggle"
      @keydown="onKeydown"
    >
      <span class="truncate" :class="{ 'font-normal opacity-60': !selected }">
        {{ selected ? selected.label : placeholder }}
      </span>
      <ChevronDown
        :size="16"
        class="shrink-0 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition duration-75 ease-in"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <ul
        v-if="isOpen"
        role="listbox"
        class="absolute bottom-0 z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
      >
        <li
          v-for="(option, i) in options"
          :key="option.value"
          role="option"
          :aria-selected="option.value === model"
          class="flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-sm text-primary"
          :class="{
            'bg-primary/10': i === activeIndex,
            'font-semibold': option.value === model,
          }"
          @click="select(option)"
          @mouseenter="activeIndex = i"
        >
          <span class="truncate">{{ option.label }}</span>
          <Check v-if="option.value === model" :size="14" :stroke-width="3" class="shrink-0" />
        </li>
      </ul>
    </Transition>
  </div>
</template>
