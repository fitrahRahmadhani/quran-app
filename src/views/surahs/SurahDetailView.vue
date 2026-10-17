<script setup>
import SelectDropdown from '@/components/ui/SelectDropdown.vue'
import ToggleSwitch from '@/components/ui/ToggleSwitch.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { Bookmark, Minus, Pause, Play, Plus, TriangleAlert } from '@lucide/vue'
import axios from 'axios'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

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
const arabicTextSizeList = [
  { name: 'Kecil', class: 'text-4xl' },
  { name: 'Sedang', class: 'text-5xl' },
  { name: 'Besar', class: 'text-6xl' },
]
const translateTextSizeList = [
  { name: 'Kecil', class: 'text-sm' },
  { name: 'Sedang', class: 'text-base' },
  { name: 'Besar', class: 'text-lg' },
]
const arabicTextSize = ref(1)
const translateTextSize = ref(1)
const currentTime = ref(0)
const duration = ref(0)
const progress = computed(() => {
  if (!duration.value) return 0
  return (currentTime.value / duration.value) * 100
})
const indonesianTranslate = ref(true)
const transliteration = ref(true)
const toArabicNumber = (n) => n.toLocaleString('ar-EG')

const isActive = (key) => activeAudio.value === key
const isKeyPlaying = (key) => activeAudio.value === key && isPlaying.value

function changeArabicTextSize(step) {
  const next = arabicTextSize.value + step
  if (next < 0 || next >= arabicTextSizeList.length) return
  arabicTextSize.value = next
}

function changeTranslateTextSize(step) {
  const next = translateTextSize.value + step
  if (next < 0 || next >= translateTextSizeList.length) return
  translateTextSize.value = next
}

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
    currentTime.value = 0
    duration.value = 0
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
  const current = activeAudio.value
  const next = Number.isInteger(current) ? current + 1 : null
  const nextAyat = next !== null ? surah.value.ayat[next] : null

  if (nextAyat) {
    togglePlayer(next, nextAyat.audio[qari.value])
    return
  }

  isPlaying.value = false
  activeAudio.value = null
  currentTime.value = 0
  duration.value = 0
}

async function fetchSurah(id) {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const res = await axios.get(`https://equran.id/api/v2/surat/${id}`)
    surah.value = res.data.data
  } catch (e) {
    errorMessage.value = e.message
  } finally {
    isLoading.value = false
  }
}

watch(
  () => route.params.id,
  (id) => {
    if (!id) return
    audio.pause()
    audio.src = ''
    activeAudio.value = null
    isPlaying.value = false
    currentTime.value = 0
    duration.value = 0

    fetchSurah(id)
    window.scrollTo({ top: 0 })
  },
  { immediate: true },
)

onUnmounted(() => {
  audio.pause()
  audio.src = ''
})

watch(qari, (newQari) => {
  if (activeAudio.value === null || !surah.value) return
  const wasPlaying = isPlaying.value
  const key = activeAudio.value

  audio.src = key === 'full' ? surah.value.audioFull[newQari] : surah.value.ayat[key].audio[newQari]

  currentTime.value = 0
  if (wasPlaying) audio.play()
})

watch(activeAudio, (key) => {
  if (!Number.isInteger(key)) return

  document.getElementById(`ayat-${key}`)?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
})
</script>

<template>
  <DefaultLayout>
    <div class="flex gap-2 mb-6">
      <RouterLink :to="{ name: 'beranda' }"
        ><p class="text-sm text-gray-500">Beranda</p>
      </RouterLink>
      <RouterLink :to="{ name: 'surah' }"
        ><p class="text-sm text-gray-500">/ Daftar Surah</p>
      </RouterLink>
      <p class="text-sm font-semibold text-primary">/ Surah</p>
    </div>

    <div v-if="isLoading" class="flex flex-col items-center py-10 space-y-2 text-primary/50">
      <img class="w-12" src="@/assets/icons/loading-spinner.svg" alt="Memuat..." />
      <p class="text-sm italic">Memuat Surah...</p>
    </div>
    <div
      v-else-if="errorMessage"
      class="flex flex-col items-center text-center gap-4 mt-12 p-8 bg-white border border-red-100 rounded-3xl"
    >
      <div class="p-4 rounded-full bg-red-50 text-red-500">
        <TriangleAlert :size="40" />
      </div>

      <div>
        <h3 class="text-xl font-bold text-primary">Gagal Memuat Data</h3>
        <p class="mt-1 text-gray-500 max-w-md">
          Terjadi kesalahan saat memuat data. Silakan coba lagi
        </p>
      </div>
    </div>

    <div v-else class="w-full">
      <div
        class="w-full h-fit relative flex flex-col bg-primary rounded-3xl overflow-hidden p-8 gap-8"
      >
        <div class="flex justify-between items-center">
          <div>
            <p class="text-secondary text-3xl font-semibold">{{ surah.namaLatin }}</p>
            <p class="text-accent/50">
              {{ surah.arti }} • {{ surah.tempatTurun }} • {{ surah.jumlahAyat }} Ayat
            </p>
          </div>
          <p dir="rtl" lang="ar" class="text-secondary text-6xl font-quran self-start">
            {{ surah.nama }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="bg-secondary shrink-0 py-2 px-4 font-semibold rounded-full text-primary"
            @click="togglePlayer('full', surah.audioFull[qari])"
          >
            <div v-if="!isKeyPlaying('full')" class="flex gap-2 items-center">
              <Play :size="18" :stroke-width="2.5" />
              Putar Surah
            </div>
            <div v-else class="flex gap-2 items-center">
              <Pause :size="18" :stroke-width="2.5" />
              Jeda
            </div>
          </button>
          <div class="w-full h-1 rounded-full bg-white/20 overflow-hidden">
            <div
              class="h-full bg-accent"
              :style="{ width: (isActive('full') ? progress : 0) + '%' }"
            ></div>
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
                <button
                  @click="changeArabicTextSize(-1)"
                  :disabled="arabicTextSize === 0"
                  class="flex items-center text-sm cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  A<Minus :size="14" />
                </button>
                <p class="text-sm font-semibold">
                  {{ arabicTextSizeList[arabicTextSize].name }}
                </p>
                <button
                  @click="changeArabicTextSize(1)"
                  :disabled="arabicTextSize === arabicTextSizeList.length - 1"
                  class="flex items-center font-semibold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  A<Plus :size="14" :stroke-width="3" />
                </button>
              </div>
            </div>
            <div class="space-y-2">
              <p class="text-sm font-semibold text-primary">Ukuran terjemahan</p>
              <div
                class="flex items-center justify-between p-2 bg-primary/10 rounded-lg text-primary"
              >
                <button
                  @click="changeTranslateTextSize(-1)"
                  :disabled="translatTextSize === 0"
                  class="flex items-center text-sm cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  A<Minus :size="14" />
                </button>
                <p class="text-sm font-semibold">
                  {{ translateTextSizeList[translateTextSize].name }}
                </p>
                <button
                  @click="changeTranslateTextSize(1)"
                  :disabled="translateTextSize === translateTextSizeList.length - 1"
                  class="flex items-center font-semibold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
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
              class="w-1/2 max-w-100 mx-auto"
              src="@/assets/decorative/bismillah.svg"
              alt="Bismillahirrahmanirrahim"
            />
          </div>
          <div class="mt-20 divide-y divide-primary/20">
            <div
              class="py-8 px-4 scroll-mt-28 transition-colors"
              :class="isActive(index) ? 'bg-primary/10' : ''"
              v-for="(ayat, index) in surah.ayat"
              :key="index"
              :id="`ayat-${index}`"
            >
              <p
                dir="rtl"
                lang="ar"
                class="leading-quran font-quran text-gray-800"
                :class="arabicTextSizeList[arabicTextSize].class"
              >
                {{ ayat.teksArab }}
                <span class="text-primary"> &#x06DD;{{ toArabicNumber(ayat.nomorAyat) }}</span>
              </p>
              <p v-if="transliteration" class="mt-8 text-primary">{{ ayat.teksLatin }}</p>
              <p
                v-if="indonesianTranslate"
                class="mt-2"
                :class="translateTextSizeList[translateTextSize].class"
              >
                {{ ayat.teksIndonesia }}
              </p>
              <div class="mt-2 flex items-center">
                <button class="shrink-0 pr-1 py-1 font-semibold text-primary/50">
                  <Bookmark :size="18" :stroke-width="2.5" />
                </button>
                <button
                  type="button"
                  class="shrink-0 p-1 font-semibold text-primary/50"
                  @click="togglePlayer(index, ayat.audio[qari])"
                >
                  <div v-if="!isKeyPlaying(index)" class="flex gap-2 items-center">
                    <Play :size="18" :stroke-width="2.5" />
                  </div>
                  <div v-else class="flex gap-2 items-center">
                    <Pause :size="18" :stroke-width="2.5" />
                  </div>
                </button>
                <div
                  v-if="isActive(index)"
                  class="w-50 h-1 rounded-full bg-primary/20 overflow-hidden"
                >
                  <div class="h-full bg-primary" :style="{ width: progress + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="w-full bg-primary/20 p-8 rounded-2xl text-center mt-8">
            <p class="font-quran text-5xl text-primary">آمِيْن</p>
            <p class="mt-8 text-primary">Aamiin</p>
            <p class="mt-2">Ya Allah, kabulkanlah</p>
          </div>
          <div class="w-full grid grid-cols-2 gap-8 mt-8">
            <RouterLink
              v-if="surah.suratSebelumnya"
              :to="{ name: 'surah-read', params: { id: surah.suratSebelumnya.nomor } }"
              class="col-start-1 flex items-center justify-between gap-4 p-4 bg-white rounded-2xl"
            >
              <div class="flex items-center gap-4">
                <div class="shrink-0 rounded-lg bg-primary/10 text-primary p-2">
                  <p dir="rtl" lang="ar" class="font-quran text-3xl leading-none">
                    &#x06DD;{{ toArabicNumber(surah.suratSebelumnya.nomor) }}
                  </p>
                </div>
                <div class="text-primary">
                  <p class="font-medium">{{ surah.suratSebelumnya.namaLatin }}</p>
                  <p class="text-xs font-light">{{ surah.suratSebelumnya.jumlahAyat }} ayat</p>
                </div>
              </div>
              <p dir="rtl" lang="ar" class="font-quran text-3xl text-primary self-baseline">
                {{ surah.suratSebelumnya.nama }}
              </p>
            </RouterLink>

            <RouterLink
              v-if="surah.suratSelanjutnya"
              :to="{ name: 'surah-read', params: { id: surah.suratSelanjutnya.nomor } }"
              class="col-start-2 flex items-center justify-between gap-4 p-4 bg-primary rounded-2xl"
            >
              <div class="flex items-center gap-4">
                <div class="shrink-0 rounded-lg bg-white/10 text-accent p-2">
                  <p dir="rtl" lang="ar" class="font-quran text-3xl leading-none">
                    &#x06DD;{{ toArabicNumber(surah.suratSelanjutnya.nomor) }}
                  </p>
                </div>
                <div class="text-white">
                  <p class="font-medium">{{ surah.suratSelanjutnya.namaLatin }}</p>
                  <p class="text-xs font-light">{{ surah.suratSelanjutnya.jumlahAyat }} ayat</p>
                </div>
              </div>
              <p dir="rtl" lang="ar" class="font-quran text-3xl text-accent self-baseline">
                {{ surah.suratSelanjutnya.nama }}
              </p>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
