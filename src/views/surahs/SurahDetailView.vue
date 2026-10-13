<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { Pause, Play } from '@lucide/vue'
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'

const surah = ref('')
const isLoading = ref(true)
const errorMessage = ref('')
const audio = new Audio()
const activeAudio = ref(null)
const isPlaying = ref(false)
const qari = ref('01')
const currentTime = ref(0)
const duration = ref(0)
const progress = computed(() => {
  if (!duration.value) return 0
  return (currentTime.value / duration.value) * 100
})

function togglePlayer(key, url) {
  const equal = activeAudio.value === key

  if (equal && isPlaying.value) {
    audio.pause()
    isPlaying.value = false
    return
  }

  if (!equal) {
    audio.src = url
    activeAudio.value = key
  }

  audio.play()
  isPlaying.value = true
}

audio.ontimeupdate = () => {
  currentTime.value = audio.currentTime
}

audio.onloadedmetadata = () => {
  duration.value = audio.duration
}

audio.onended = () => {
  isPlaying.value = false
}

onMounted(async () => {
  try {
    const res = await axios.get('https://equran.id/api/v2/surat/1')
    surah.value = res.data.data
  } catch (e) {
    errorMessage.value = e.message
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <DefaultLayout>
    <div class="flex gap-2 mb-6">
      <RouterLink :to="{ name: 'beranda' }"
        ><p class="text-sm text-gray-500">Beranda</p>
      </RouterLink>
      <RouterLink :to="{ name: 'beranda' }"
        ><p class="text-sm text-gray-500">/ Daftar Surah</p>
      </RouterLink>
      <p class="text-sm font-semibold text-primary">/ Surah</p>
    </div>

    <div
      class="w-full h-fit relative flex flex-col bg-primary rounded-3xl overflow-hidden p-8 gap-8"
    >
      <div class="flex justify-between items-center">
        <div>
          <p class="text-accent text-3xl font-semibold">{{ surah.namaLatin }}</p>
          <p class="text-accent/50">
            {{ surah.arti }} • {{ surah.tempatTurun }} • {{ surah.jumlahAyat }} Ayat
          </p>
        </div>
        <p dir="rtl" lang="ar" class="text-accent text-6xl font-quran self-start">
          {{ surah.nama }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="bg-accent shrink-0 py-2 px-4 font-semibold rounded-full text-primary"
          @click="togglePlayer('full', surah.audioFull[qari])"
        >
          <div v-if="!isPlaying" class="flex gap-2 items-center">
            <Play :size="18" :stroke-width="2.5" />
            Putar Surah
          </div>
          <div v-else class="flex gap-2 items-center">
            <Pause :size="18" :stroke-width="2.5" />
            Jeda
          </div>
        </button>
        <div class="w-full h-1 rounded-full bg-white/20 overflow-hidden">
          <div class="h-full bg-accent" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
      <div class="w-40 h-40 rounded-full absolute -top-10 -right-10 bg-white/10"></div>
    </div>
  </DefaultLayout>
</template>
