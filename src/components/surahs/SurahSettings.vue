<script setup>
import { Minus, Plus, Settings2 } from '@lucide/vue'
import { ref } from 'vue'
import ToggleSwitch from '../ui/ToggleSwitch.vue'
import SelectDropdown from '../ui/SelectDropdown.vue'

const props = defineProps({
  isFocusMode: Boolean,
  arabicTextSize: Number,
  arabicTextSizeList: Array,
  translateTextSize: Number,
  translateTextSizeList: Array,
  indonesianTranslate: Boolean,
  transliteration: Boolean,
  qari: String,
  qariOptions: Array,
})

function changeArabicTextSize(step) {
  const next = props.arabicTextSize + step
  if (next < 0 || next >= props.arabicTextSizeList.length) return
  emit('update:arabicTextSize', next)
}

function changeTranslateTextSize(step) {
  const next = props.translateTextSize + step
  if (next < 0 || next >= props.translateTextSizeList.length) return
  emit('update:translateTextSize', next)
}

const emit = defineEmits([
  'update:arabicTextSize',
  'update:translateTextSize',
  'update:indonesianTranslate',
  'update:transliteration',
  'update:qari',
])

const showSettings = ref(false)
</script>

<template>
  <div class="lg:w-full" :class="props.isFocusMode ? 'lg:hidden' : ''">
    <div
      v-if="showSettings"
      class="fixed inset-0 bg-black/20 lg:hidden"
      @click="showSettings = false"
    ></div>

    <button
      type="button"
      aria-label="Pengaturan baca"
      class="relative size-12 flex items-center justify-center rounded-full bg-primary/80 text-white shadow-lg cursor-pointer lg:hidden"
      @click="showSettings = !showSettings"
    >
      <Settings2 :size="22" />
    </button>

    <div
      :class="showSettings ? 'flex' : 'hidden lg:flex'"
      class="absolute bottom-14 right-0 w-72 max-w-[calc(100vw-2rem)] flex-col gap-4 rounded-2xl bg-white p-4 shadow-xl lg:static lg:w-full lg:max-w-none lg:shadow-none"
    >
      <div class="pb-4 border-b border-gray-200">
        <p class="font-semibold text-primary">Pengaturan Baca</p>
        <p class="text-xs text-gray-500">Sesuaikan kenyamananmu</p>
      </div>

      <div class="space-y-2">
        <p class="text-sm font-semibold text-primary">Ukuran teks arab</p>
        <div class="flex items-center justify-between p-2 bg-primary/10 rounded-lg text-primary">
          <button
            @click="changeArabicTextSize(-1)"
            :disabled="props.arabicTextSize === 0"
            class="flex items-center text-sm cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            A<Minus :size="14" />
          </button>
          <p class="text-sm font-semibold">{{ props.arabicTextSizeList[arabicTextSize].name }}</p>
          <button
            @click="changeArabicTextSize(1)"
            :disabled="props.arabicTextSize === props.arabicTextSizeList.length - 1"
            class="flex items-center font-semibold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            A<Plus :size="14" :stroke-width="3" />
          </button>
        </div>
      </div>

      <div class="space-y-2">
        <p class="text-sm font-semibold text-primary">Ukuran terjemahan</p>
        <div class="flex items-center justify-between p-2 bg-primary/10 rounded-lg text-primary">
          <button
            @click="changeTranslateTextSize(-1)"
            :disabled="props.translateTextSize === 0"
            class="flex items-center text-sm cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            A<Minus :size="14" />
          </button>
          <p class="text-sm font-semibold">
            {{ props.translateTextSizeList[translateTextSize].name }}
          </p>
          <button
            @click="changeTranslateTextSize(1)"
            :disabled="props.translateTextSize === props.translateTextSizeList.length - 1"
            class="flex items-center font-semibold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            A<Plus :size="14" :stroke-width="3" />
          </button>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-semibold text-primary">Terjemahan</p>
          <p class="text-xs text-gray-500">Bahasa Indonesia</p>
        </div>
        <ToggleSwitch
          :model-value="props.indonesianTranslate"
          @update:model-value="emit('update:indonesianTranslate', $event)"
        />
      </div>

      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-semibold text-primary">Transliterasi</p>
          <p class="text-xs text-gray-500">Tampilkan teks Latin</p>
        </div>
        <ToggleSwitch
          :model-value="props.transliteration"
          @update:model-value="emit('update:transliteration', $event)"
        />
      </div>

      <div class="space-y-2">
        <p class="text-sm font-semibold text-primary">Qori</p>
        <SelectDropdown
          :model-value="qari"
          :options="qariOptions"
          @update:model-value="emit('update:qari', $event)"
        />
      </div>
    </div>
  </div>
</template>
