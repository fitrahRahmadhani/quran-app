<script setup>
import { formatTime } from '@/utils/formatText'
import { Pause, Play } from '@lucide/vue'

const props = defineProps({
  isPlaying: Boolean,
  isFocusMode: Boolean,
  surahName: String,
  nowPlayingLabel: String,
  speed: Number,
  currentTime: Number,
  progress: Number,
  duration: Number,
})

const emits = defineEmits(['skip', 'toggle', 'cycleSpeed', 'seek'])
</script>

<template>
  <div
    class="sticky z-30 mt-8 mr-16 lg:mr-0 flex flex-col gap-3 bg-white p-4 rounded-2xl shadow-xl"
    :class="isFocusMode ? 'bottom-6 ' : 'bottom-24 md:bottom-6 lg:bottom-6'"
  >
    <div class="flex items-center gap-4">
      <div class="flex-1 min-w-0 flex flex-col">
        <p class="font-semibold text-primary truncate">{{ surahName }}</p>
        <p class="text-sm text-gray-500 truncate">{{ nowPlayingLabel }}</p>
      </div>

      <div class="shrink-0 flex items-center gap-2">
        <button
          type="button"
          aria-label="Mundur 5 detik"
          class="p-1 rounded-full text-primary hover:bg-primary/10 cursor-pointer"
          @click="$emit('skip', -5)"
        >
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <g
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M4.91 7.8C3.8 9.28 3.11 11.11 3.11 13.11 3.11 18.02 7.09 22 12 22s8.89-3.98 8.89-8.89S16.91 4.22 12 4.22c-.68 0-1.34.09-1.98.24"
              ></path>
              <path d="M10.02 4.47 12 2M10.02 4.47l2.43 1.78"></path>
            </g>
            <text
              x="12"
              y="16.2"
              text-anchor="middle"
              font-size="7.5"
              font-weight="700"
              fill="currentColor"
            >
              5
            </text>
          </svg>
        </button>

        <button
          type="button"
          :aria-label="isPlaying ? 'Jeda' : 'Putar'"
          class="p-2 bg-primary text-white rounded-full cursor-pointer"
          @click="$emit('toggle')"
        >
          <Pause v-if="isPlaying" />
          <Play v-else />
        </button>

        <button
          type="button"
          aria-label="Maju 5 detik"
          class="p-1 rounded-full text-primary hover:bg-primary/10 cursor-pointer"
          @click="$emit('skip', 5)"
        >
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <g
              transform="matrix(-1 0 0 1 24 0)"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M4.91 7.8C3.8 9.28 3.11 11.11 3.11 13.11 3.11 18.02 7.09 22 12 22s8.89-3.98 8.89-8.89S16.91 4.22 12 4.22c-.68 0-1.34.09-1.98.24"
              ></path>
              <path d="M10.02 4.47 12 2M10.02 4.47l2.43 1.78"></path>
            </g>
            <text
              x="12"
              y="16.2"
              text-anchor="middle"
              font-size="7.5"
              font-weight="700"
              fill="currentColor"
            >
              5
            </text>
          </svg>
        </button>

        <button
          type="button"
          aria-label="Ubah kecepatan"
          class="w-12 py-1 text-sm font-semibold rounded-full bg-primary/10 text-primary cursor-pointer"
          @click="$emit('cycleSpeed')"
        >
          {{ speed }}x
        </button>
      </div>
    </div>

    <div class="flex items-center gap-3 text-xs text-gray-500">
      <span class="w-9 text-right tabular-nums">{{ formatTime(currentTime) }}</span>
      <div class="flex-1 py-2 cursor-pointer" @click="emits('seek', $event)">
        <div class="h-1.5 rounded-full bg-primary/20 overflow-hidden">
          <div class="h-full bg-primary" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
      <span class="w-9 tabular-nums">{{ formatTime(duration) }}</span>
    </div>
  </div>
</template>
