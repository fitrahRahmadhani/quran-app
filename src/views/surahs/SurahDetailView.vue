<script setup>
import SelectDropdown from '@/components/ui/SelectDropdown.vue'
import ToggleSwitch from '@/components/ui/ToggleSwitch.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { Minus, Pause, Play, Plus } from '@lucide/vue'
import axios from 'axios'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const surah = ref('')
const isLoading = ref(true)
const errorMessage = ref('')
const audio = new Audio()
const activeAudio = ref(null)
const isPlaying = ref(false)
const qari = ref('01')
const qariOptions = [
  { value: '01', label: 'Abdullah Al-Juhany' },
  { value: '02', label: 'Abdul Muhsin Al-Qasim' },
  { value: '03', label: 'Abdurrahman as-Sudais' },
  { value: '04', label: 'Ibrahim Al-Dossari' },
  { value: '05', label: 'Misyari Rasyid Al-Afasy' },
  { value: '06', label: 'Yasser-Al-Dosari' },
]
const currentTime = ref(0)
const duration = ref(0)
const progress = computed(() => {
  if (!duration.value) return 0
  return (currentTime.value / duration.value) * 100
})
const indonesianTranslate = ref(true)
const transliteration = ref(true)
const toArabicNumber = (n) => n.toLocaleString('ar-EG')

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
    const res = await axios.get(`https://equran.id/api/v2/surat/${route.params.id}`)
    surah.value = res.data.data
  } catch (e) {
    errorMessage.value = e.message
  } finally {
    isLoading.value = false
  }
})

watch(qari, (newQari) => {
  if (activeAudio.value !== 'full' || !surah.value) return
  const wasPlaying = isPlaying.value
  audio.src = surah.value.audioFull[newQari]
  currentTime.value = 0
  if (wasPlaying) audio.play()
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
    <div class="flex gap-8 mt-8">
      <div
        class="bg-white sticky top-26 rounded-2xl p-4 w-62.5 h-fit space-y-4 divide-y divide-gray-200"
      >
        <div class="pb-4 border-b border-gray-200">
          <p class="font-semibold text-primary">Pengaturan Baca</p>
          <p class="text-xs text-gray-500">Sesuaikan kenyamananmu</p>
        </div>
        <div class="space-y-4 pb-4">
          <div class="space-y-2">
            <p class="text-sm font-semibold text-primary">Ukuran teks arab</p>
            <div
              class="flex items-center justify-between p-2 bg-primary/10 rounded-lg text-primary"
            >
              <button class="flex items-center text-sm">A<Minus :size="14" /></button>
              <p class="text-sm font-semibold">Sedang</p>
              <button class="flex items-center font-semibold">
                A<Plus :size="14" :stroke-width="3" />
              </button>
            </div>
          </div>
          <div class="space-y-2">
            <p class="text-sm font-semibold text-primary">Ukuran terjemahan</p>
            <div
              class="flex items-center justify-between p-2 bg-primary/10 rounded-lg text-primary"
            >
              <button class="flex items-center text-sm">A<Minus :size="14" /></button>
              <p class="text-sm font-semibold">Sedang</p>
              <button class="flex items-center font-semibold">
                A<Plus :size="14" :stroke-width="3" />
              </button>
            </div>
          </div>
        </div>
        <div class="space-y-4 pb-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-primary">Terjemahan</p>
              <p class="text-xs text-gray-500">Bahasa Indonesia</p>
            </div>
            <ToggleSwitch v-model="indonesianTranslate" />
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-primary">Transliterasi</p>
              <p class="text-xs text-gray-500">Tampilkan teks Latin</p>
            </div>
            <ToggleSwitch v-model="transliteration" />
          </div>
        </div>
        <div class="space-y-2">
          <p class="text-sm font-semibold text-primary">Qori</p>
          <SelectDropdown v-model="qari" :options="qariOptions" />
        </div>
      </div>
      <div class="w-full">
        <div class="w-full my-8">
          <img
            class="w-1/2 max-w-87.5 mx-auto"
            src="@/assets/decorative/bismillah.svg"
            alt="Bismillahirrahmanirrahim"
          />
        </div>
        <div class="mt-20 divide-y divide-primary/20">
          <div class="py-8" v-for="(ayat, index) in surah.ayat" :key="index" :id="index">
            <p dir="rtl" lang="ar" class="text-5xl leading-quran font-quran text-gray-800">
              {{ ayat.teksArab }}
              <span class="text-primary"> &#x06DD;{{ toArabicNumber(ayat.nomorAyat) }}</span>
            </p>
            <p class="mt-8 text-primary">{{ ayat.teksLatin }}</p>
            <p class="mt-2">{{ ayat.teksIndonesia }}</p>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
