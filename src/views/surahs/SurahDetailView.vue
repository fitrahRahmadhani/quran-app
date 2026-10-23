<script setup>
import ErrorFetch from '@/components/ui/ErrorFetch.vue'
import SelectDropdown from '@/components/ui/SelectDropdown.vue'
import ToggleSwitch from '@/components/ui/ToggleSwitch.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { quranApi } from '@/services/quranApi'
import { useBookmark } from '@/stores/bookmark'
import { useMinimize } from '@/stores/minimize'
import { toArabicNumber } from '@/utils/formatText'
import {
  Bookmark,
  Expand,
  Minimize,
  Minus,
  Pause,
  Play,
  Plus,
  Settings2,
  TriangleAlert,
} from '@lucide/vue'
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const minimizeStore = useMinimize()
const bookmarkStore = useBookmark()
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

const showSettings = ref(false)

const arabicTextSizeList = [
  { name: 'Kecil', class: 'text-2xl sm:text-3xl lg:text-4xl' },
  { name: 'Sedang', class: 'text-4xl sm:text-5xl lg:text-6xl' },
  { name: 'Besar', class: 'text-5xl sm:text-6xl lg:text-7xl' },
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

const speedOptions = [0.75, 1, 1.25, 1.5, 2]
const speedIndex = ref(1)
const speed = computed(() => speedOptions[speedIndex.value])

const nowPlayingLabel = computed(() => {
  if (activeAudio.value === 'full') return 'Surah penuh'
  const ayat = surah.value?.ayat?.[activeAudio.value]
  return ayat ? `Ayat ${ayat.nomorAyat}` : ''
})

const isActive = (index) => {
  const ayat = surah.value?.ayat?.[index]
  if (!ayat) return false
  return activeAudio.value === index || route.hash === `#ayat-${ayat.nomorAyat}`
}
const isKeyPlaying = (key) => activeAudio.value === key && isPlaying.value

const formatTime = (s) => {
  if (!Number.isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  const r = Math.floor(s % 60)
    .toString()
    .padStart(2, '0')
  return `${m}:${r}`
}

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

function toggleBookmark(ayat) {
  bookmarkStore.toggleBookmark({
    surah: surah.value.nomor,
    arti: surah.value.arti,
    ayat: ayat.nomorAyat,
    namaLatin: surah.value.namaLatin,
  })
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

  audio.play().catch(() => {})
  isPlaying.value = true
}

function togglePlayback() {
  if (activeAudio.value === null) return
  if (isPlaying.value) {
    audio.pause()
    isPlaying.value = false
  } else {
    audio.play().catch(() => {})
    isPlaying.value = true
  }
}

function skip(seconds) {
  if (activeAudio.value === null || !duration.value) return
  audio.currentTime = Math.min(Math.max(audio.currentTime + seconds, 0), duration.value)
}

function cycleSpeed() {
  speedIndex.value = (speedIndex.value + 1) % speedOptions.length
  audio.playbackRate = speed.value
}

function seek(event) {
  if (!duration.value) return
  const rect = event.currentTarget.getBoundingClientRect()
  const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1)
  audio.currentTime = ratio * duration.value
}

audio.ontimeupdate = () => {
  currentTime.value = audio.currentTime
}

audio.onloadedmetadata = () => {
  duration.value = audio.duration
  audio.playbackRate = speed.value
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
    surah.value = await quranApi.getSurah(id)
  } catch (e) {
    errorMessage.value = e.message
  } finally {
    isLoading.value = false
  }
}

async function scrollToHashOrTop() {
  await nextTick()
  if (route.hash) {
    document.querySelector(route.hash)?.scrollIntoView({ block: 'center' })
  } else {
    window.scrollTo({ top: 0 })
  }
}

watch(
  () => route.params.id,
  async (id) => {
    if (!id) return
    audio.pause()
    audio.src = ''
    activeAudio.value = null
    isPlaying.value = false
    currentTime.value = 0
    duration.value = 0

    await fetchSurah(id)
    scrollToHashOrTop()
  },
  { immediate: true },
)

onUnmounted(() => {
  audio.pause()
  audio.src = ''
  minimizeStore.disableFocusMode()
})

watch(qari, (newQari) => {
  if (activeAudio.value === null || !surah.value) return
  const wasPlaying = isPlaying.value
  const key = activeAudio.value

  audio.src = key === 'full' ? surah.value.audioFull[newQari] : surah.value.ayat[key].audio[newQari]

  currentTime.value = 0
  if (wasPlaying) audio.play().catch(() => {})
})

watch(activeAudio, (key) => {
  if (!Number.isInteger(key)) return
  const ayat = surah.value?.ayat?.[key]
  if (!ayat) return

  document.getElementById(`ayat-${ayat.nomorAyat}`)?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
})
</script>

<template>
  <DefaultLayout>
    <div v-if="!minimizeStore.isFocusMode" class="hidden flex-wrap gap-x-2 gap-y-1 mb-6 md:flex">
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
    <ErrorFetch v-else-if="errorMessage" />

    <div v-else class="w-full">
      <div
        class="w-full h-fit relative flex flex-col bg-primary rounded-3xl overflow-hidden p-5 sm:p-8 gap-6 sm:gap-8"
      >
        <div class="flex justify-between items-center gap-4">
          <div class="min-w-0">
            <p class="text-secondary text-2xl sm:text-3xl font-semibold">{{ surah.namaLatin }}</p>
            <p class="text-accent/50 text-sm sm:text-base">
              {{ surah.arti }} • {{ surah.tempatTurun }} • {{ surah.jumlahAyat }} Ayat
            </p>
          </div>
          <p
            dir="rtl"
            lang="ar"
            class="text-secondary text-4xl sm:text-5xl lg:text-6xl font-quran self-start shrink-0"
          >
            {{ surah.nama }}
          </p>
        </div>
        <div class="flex items-center">
          <button
            type="button"
            class="bg-secondary shrink-0 py-2 px-4 font-semibold rounded-full text-primary text-sm sm:text-base cursor-pointer"
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
        </div>
        <div class="w-40 h-40 rounded-full absolute -top-10 -right-10 bg-white/10"></div>
      </div>

      <div class="flex flex-col lg:flex-row gap-6 lg:gap-8 mt-6 lg:mt-8">
        <div
          class="fixed right-4 z-40 flex flex-col items-end gap-4 md:bottom-6 lg:sticky lg:z-auto lg:shrink-0 lg:items-stretch lg:self-start"
          :class="
            minimizeStore.isFocusMode
              ? 'bottom-4 lg:top-6 lg:w-fit'
              : 'bottom-24 lg:top-26 lg:w-62.5'
          "
        >
          <button
            type="button"
            :aria-label="minimizeStore.isFocusMode ? 'Keluar mode fokus' : 'Mode fokus baca'"
            class="w-full flex gap-2 items-center justify-center p-4 bg-white/80 lg:bg-white text-primary rounded-full lg:rounded-2xl cursor-pointer hover:bg-white transition duration-300"
            @click="minimizeStore.toggleFocusMode()"
          >
            <component :is="minimizeStore.isFocusMode ? Minimize : Expand" :size="20" />
            <p v-if="!minimizeStore.isFocusMode" class="hidden lg:block font-semibold">
              Mode fokus baca
            </p>
          </button>

          <div class="lg:w-full" :class="minimizeStore.isFocusMode ? 'lg:hidden' : ''">
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
                  <p class="text-sm font-semibold">{{ arabicTextSizeList[arabicTextSize].name }}</p>
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
                    :disabled="translateTextSize === 0"
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

              <div class="space-y-2">
                <p class="text-sm font-semibold text-primary">Qori</p>
                <SelectDropdown v-model="qari" :options="qariOptions" />
              </div>
            </div>
          </div>
        </div>

        <div class="w-full min-w-0">
          <div class="w-full my-4 sm:my-8">
            <img
              class="w-3/4 sm:w-1/2 max-w-100 mx-auto"
              src="@/assets/decorative/bismillah.svg"
              alt="Bismillahirrahmanirrahim"
            />
          </div>

          <div class="mt-8 sm:mt-20 divide-y divide-primary/20">
            <div
              class="py-6 sm:py-8 px-3 sm:px-4 transition-colors"
              :class="[
                isActive(index) ? 'bg-primary/10' : '',
                minimizeStore.isFocusMode ? 'scroll-mt-6' : 'scroll-mt-28',
              ]"
              v-for="(ayat, index) in surah.ayat"
              :key="ayat.nomorAyat"
              :id="`ayat-${ayat.nomorAyat}`"
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
              <p v-if="transliteration" class="mt-6 sm:mt-8 text-primary text-sm sm:text-base">
                {{ ayat.teksLatin }}
              </p>
              <p
                v-if="indonesianTranslate"
                class="mt-2"
                :class="translateTextSizeList[translateTextSize].class"
              >
                {{ ayat.teksIndonesia }}
              </p>
              <div class="mt-2 flex items-center">
                <button
                  type="button"
                  :aria-label="
                    bookmarkStore.isBookmarked(surah.nomor, ayat.nomorAyat)
                      ? 'Hapus bookmark'
                      : 'Tambah bookmark'
                  "
                  :aria-pressed="bookmarkStore.isBookmarked(surah.nomor, ayat.nomorAyat)"
                  class="flex items-center gap-1 shrink-0 font-semibold cursor-pointer"
                  :class="
                    bookmarkStore.isBookmarked(surah.nomor, ayat.nomorAyat)
                      ? 'text-white bg-primary rounded-xl px-2 py-2'
                      : 'text-primary/50 pr-1 py-1'
                  "
                  @click="toggleBookmark(ayat)"
                >
                  <Bookmark
                    :size="18"
                    :stroke-width="2.5"
                    :fill="
                      bookmarkStore.isBookmarked(surah.nomor, ayat.nomorAyat)
                        ? 'currentColor'
                        : 'none'
                    "
                  />
                  <span
                    class="text-xs"
                    v-if="bookmarkStore.isBookmarked(surah.nomor, ayat.nomorAyat)"
                    >Hapus Bookmark</span
                  >
                </button>
                <button
                  type="button"
                  class="shrink-0 p-1 font-semibold text-primary/50 cursor-pointer"
                  @click="togglePlayer(index, ayat.audio[qari])"
                >
                  <div v-if="!isKeyPlaying(index)" class="flex gap-2 items-center">
                    <Play :size="18" :stroke-width="2.5" />
                  </div>
                  <div v-else class="flex gap-2 items-center">
                    <Pause :size="18" :stroke-width="2.5" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div class="w-full bg-primary/20 p-6 sm:p-8 rounded-2xl text-center mt-8">
            <p class="font-quran text-4xl sm:text-5xl text-primary">آمِيْن</p>
            <p class="mt-6 sm:mt-8 text-primary">Aamiin</p>
            <p class="mt-2">Ya Allah, kabulkanlah</p>
          </div>

          <div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mt-8">
            <RouterLink
              v-if="surah.suratSebelumnya"
              :to="{ name: 'surah-read', params: { id: surah.suratSebelumnya.nomor } }"
              class="sm:col-start-1 flex items-center justify-between gap-4 p-4 bg-white rounded-2xl"
            >
              <div class="flex items-center gap-3 sm:gap-4 min-w-0">
                <div class="shrink-0 rounded-lg bg-primary/10 text-primary p-2">
                  <p dir="rtl" lang="ar" class="font-quran text-2xl sm:text-3xl leading-none">
                    &#x06DD;{{ toArabicNumber(surah.suratSebelumnya.nomor) }}
                  </p>
                </div>
                <div class="text-primary min-w-0">
                  <p class="font-medium truncate">{{ surah.suratSebelumnya.namaLatin }}</p>
                  <p class="text-xs font-light">{{ surah.suratSebelumnya.jumlahAyat }} ayat</p>
                </div>
              </div>
              <p
                dir="rtl"
                lang="ar"
                class="font-quran text-2xl sm:text-3xl text-primary self-baseline shrink-0"
              >
                {{ surah.suratSebelumnya.nama }}
              </p>
            </RouterLink>

            <RouterLink
              v-if="surah.suratSelanjutnya"
              :to="{ name: 'surah-read', params: { id: surah.suratSelanjutnya.nomor } }"
              class="sm:col-start-2 flex items-center justify-between gap-4 p-4 bg-primary rounded-2xl"
            >
              <div class="flex items-center gap-3 sm:gap-4 min-w-0">
                <div class="shrink-0 rounded-lg bg-white/10 text-accent p-2">
                  <p dir="rtl" lang="ar" class="font-quran text-2xl sm:text-3xl leading-none">
                    &#x06DD;{{ toArabicNumber(surah.suratSelanjutnya.nomor) }}
                  </p>
                </div>
                <div class="text-white min-w-0">
                  <p class="font-medium truncate">{{ surah.suratSelanjutnya.namaLatin }}</p>
                  <p class="text-xs font-light">{{ surah.suratSelanjutnya.jumlahAyat }} ayat</p>
                </div>
              </div>
              <p
                dir="rtl"
                lang="ar"
                class="font-quran text-2xl sm:text-3xl text-accent self-baseline shrink-0"
              >
                {{ surah.suratSelanjutnya.nama }}
              </p>
            </RouterLink>
          </div>

          <div
            v-if="activeAudio !== null"
            class="sticky z-30 mt-8 mr-16 lg:mr-0 flex flex-col gap-3 bg-white p-4 rounded-2xl shadow-xl"
            :class="minimizeStore.isFocusMode ? 'bottom-6 ' : 'bottom-24 lg:bottom-6'"
          >
            <div class="flex items-center gap-4">
              <div class="flex-1 min-w-0 flex flex-col">
                <p class="font-semibold text-primary truncate">{{ surah.namaLatin }}</p>
                <p class="text-sm text-gray-500 truncate">{{ nowPlayingLabel }}</p>
              </div>

              <div class="shrink-0 flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Mundur 5 detik"
                  class="p-1 rounded-full text-primary hover:bg-primary/10 cursor-pointer"
                  @click="skip(-5)"
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
                  @click="togglePlayback"
                >
                  <Pause v-if="isPlaying" />
                  <Play v-else />
                </button>

                <button
                  type="button"
                  aria-label="Maju 5 detik"
                  class="p-1 rounded-full text-primary hover:bg-primary/10 cursor-pointer"
                  @click="skip(5)"
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
                  @click="cycleSpeed"
                >
                  {{ speed }}x
                </button>
              </div>
            </div>

            <div class="flex items-center gap-3 text-xs text-gray-500">
              <span class="w-9 text-right tabular-nums">{{ formatTime(currentTime) }}</span>
              <div class="flex-1 py-2 cursor-pointer" @click="seek">
                <div class="h-1.5 rounded-full bg-primary/20 overflow-hidden">
                  <div class="h-full bg-primary" :style="{ width: progress + '%' }"></div>
                </div>
              </div>
              <span class="w-9 tabular-nums">{{ formatTime(duration) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
