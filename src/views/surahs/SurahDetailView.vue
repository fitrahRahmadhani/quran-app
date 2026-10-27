<script setup>
import SurahAmin from '@/components/surahs/SurahAmin.vue'
import SurahAyat from '@/components/surahs/SurahAyat.vue'
import SurahBismillah from '@/components/surahs/SurahBismillah.vue'
import SurahHeader from '@/components/surahs/SurahHeader.vue'
import SurahNav from '@/components/surahs/SurahNav.vue'
import SurahPlayer from '@/components/surahs/SurahPlayer.vue'
import SurahSettings from '@/components/surahs/SurahSettings.vue'
import BaseBreadcrumb from '@/components/ui/BaseBreadcrumb.vue'
import FetchError from '@/components/ui/FetchError.vue'
import FetchLoading from '@/components/ui/FetchLoading.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { quranApi } from '@/services/quranApi'
import { useBookmark } from '@/stores/bookmark'
import { useMinimize } from '@/stores/minimize'
import { Expand, Minimize } from '@lucide/vue'
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const minimizeStore = useMinimize()
const bookmarkStore = useBookmark()
const route = useRoute()
const breadcrumbs = computed(() => [
  { label: 'Beranda', to: { name: 'beranda' } },
  { label: 'Daftar Surah', to: { name: 'surah' } },
  { label: surah.value?.namaLatin || 'Surah' },
])
const surah = ref('')
const isLoading = ref(true)
const errorMessage = ref('')
const audio = new Audio()
const activeAudio = ref(null)
const isPlaying = ref(false)
const qari = ref('01')
const arabicTextSize = ref(1)
const translateTextSize = ref(1)
const qariOptions = [
  { value: '01', label: 'Abdullah Al-Juhany' },
  { value: '02', label: 'Abdul Muhsin Al-Qasim' },
  { value: '03', label: 'Abdurrahman as-Sudais' },
  { value: '04', label: 'Ibrahim Al-Dossari' },
  { value: '05', label: 'Misyari Rasyid Al-Afasy' },
  { value: '06', label: 'Yasser-Al-Dosari' },
]

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
    <BaseBreadcrumb v-if="!minimizeStore.isFocusMode" :items="breadcrumbs" />
    <FetchLoading v-if="isLoading" />
    <FetchError v-else-if="errorMessage" />

    <div v-else class="w-full">
      <SurahHeader
        :namaLatin="surah.namaLatin"
        :arti="surah.arti"
        :tempatTurun="surah.tempatTurun"
        :jumlahAyat="surah.jumlahAyat"
        :nama="surah.nama"
        :isPlaying="isKeyPlaying('full')"
        @play="togglePlayer('full', surah.audioFull[qari])"
      />

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

          <SurahSettings
            v-model:arabicTextSize="arabicTextSize"
            v-model:translateTextSize="translateTextSize"
            v-model:indonesianTranslate="indonesianTranslate"
            v-model:transliteration="transliteration"
            v-model:qari="qari"
            :isFocusMode="minimizeStore.isFocusMode"
            :arabicTextSizeList="arabicTextSizeList"
            :translateTextSizeList="translateTextSizeList"
            :qariOptions="qariOptions"
          />
        </div>

        <div class="w-full min-w-0">
          <SurahBismillah />

          <div class="mt-8 sm:mt-20 divide-y divide-primary/20">
            <SurahAyat
              v-for="(ayat, index) in surah.ayat"
              :key="ayat.nomorAyat"
              :id="`ayat-${ayat.nomorAyat}`"
              :isActive="isActive(index)"
              :isFocusMode="minimizeStore.isFocusMode"
              :ayat="ayat"
              :arabicClass="arabicTextSizeList[arabicTextSize].class"
              :translateClass="translateTextSizeList[translateTextSize].class"
              :transliteration="transliteration"
              :indonesianTranslate="indonesianTranslate"
              :bookmarked="bookmarkStore.isBookmarked(surah.nomor, ayat.nomorAyat)"
              :isPlaying="isKeyPlaying(index)"
              @bookmark="toggleBookmark(ayat)"
              @play="togglePlayer(index, ayat.audio[qari])"
            />
          </div>

          <SurahAmin />

          <SurahNav
            :prev-surah="surah.suratSebelumnya || null"
            :next-surah="surah.suratSelanjutnya || null"
          />

          <SurahPlayer
            v-if="activeAudio !== null"
            :isPlaying="isPlaying"
            :isFocusMode="minimizeStore.isFocusMode"
            :surahName="surah.namaLatin"
            :nowPlayingLabel="nowPlayingLabel"
            :speed="speed"
            :currentTime="currentTime"
            :progress="progress"
            :duration="duration"
            @skip="skip"
            @toggle="togglePlayback"
            @cycleSpeed="cycleSpeed"
            @seek="seek"
          />
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
