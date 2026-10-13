<script setup>
import SurahCard from '@/components/surahs/SurahCard.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { Bookmark, Search } from '@lucide/vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const inputSearch = ref('')
const errorMessage = ref('')

const suggestionSurahs = [
  { id: 1, title: 'Al-Fatihah' },
  { id: 2, title: 'Al-Kahf' },
  { id: 3, title: 'Yasin' },
  { id: 4, title: "Al-Waqi'ah" },
]

const defaultSurahs = [
  {
    nomor: 1,
    nama: 'الفاتحة',
    namaLatin: 'Al-Fatihah',
    jumlahAyat: 7,
    tempatTurun: 'Mekah',
    arti: 'Pembukaan',
  },
  {
    nomor: 2,
    nama: 'البقرة',
    namaLatin: 'Al-Baqarah',
    jumlahAyat: 286,
    tempatTurun: 'Madinah',
    arti: 'Sapi',
  },
  {
    nomor: 3,
    nama: 'اٰل عمران',
    namaLatin: "Ali 'Imran",
    jumlahAyat: 200,
    tempatTurun: 'Madinah',
    arti: 'Keluarga Imran',
  },
  {
    nomor: 4,
    nama: 'النساۤء',
    namaLatin: "An-Nisa'",
    jumlahAyat: 176,
    tempatTurun: 'Madinah',
    arti: 'Wanita',
  },
]

function handleSearch() {
  const query = inputSearch.value.trim()
  if (!query) {
    errorMessage.value = 'Silahkan masukkan nama surah terlebih dahulu'
    return
  }
  errorMessage.value = ''
  router.push({ name: 'surah', query: { q: query } })
}

function handleSuggestion(value) {
  inputSearch.value = value
}
</script>

<template>
  <DefaultLayout>
    <div class="text-primary text-center space-y-2">
      <h2 class="text-4xl mt-4 md:mt-12 lg:mt-2 md:text-5xl font-bold tracking-wide">
        Tempat untuk Kembali,
      </h2>
      <h2 class="text-4xl md:text-5xl font-bold tracking-wide">Kapan Pun Kamu Butuhkan</h2>
      <p class="text-lg mt-4">
        Temukan surah, baca ayat, dan luangkan waktu untuk merenungkan maknanya
      </p>
    </div>
    <div
      class="md:w-2/3 lg:w-1/2 mx-auto mt-8 bg-white shadow-lg border border-gray-200 rounded-3xl p-4"
    >
      <form
        :class="
          errorMessage
            ? 'border-red-500'
            : 'border-gray-200 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20'
        "
        class="flex items-center justify-between bg-white shadow-lg border p-4 rounded-3xl gap-4 transition-all duration-200"
        @submit.prevent="handleSearch"
      >
        <div class="flex items-center gap-2 w-full">
          <Search :size="22" class="text-primary" />
          <input
            id="search-bar"
            v-model="inputSearch"
            type="text"
            class="w-full text-lg outline-none"
            placeholder="Cari surah..."
            @input="errorMessage = ''"
          />
        </div>
        <button
          type="submit"
          class="bg-primary text-white px-6 py-2 shadow-xl shadow-primary/20 rounded-3xl"
          aria-label="Tombol pencarian surah"
        >
          Cari
        </button>
      </form>
      <p v-if="errorMessage" class="text-sm text-red-500 mt-2 ml-2" role="alert">
        {{ errorMessage }}
      </p>
      <div class="space-y-2 mt-4">
        <p class="text-sm font-semibold text-primary it">Rekomendasi Surah populer</p>
        <div class="flex gap-2 flex-wrap">
          <BaseBadge
            v-for="surah in suggestionSurahs"
            :key="surah.id"
            :id="surah.id"
            :title="surah.title"
            @click="handleSuggestion(surah.title)"
          />
        </div>
      </div>
    </div>

    <div class="w-full flex flex-col mt-8">
      <div class="w-fit self-end">
        <RouterLink :to="{ name: 'surah' }">
          <p class="text-sm font-medium text-primary text-right mb-4">Lihat semua surah →</p>
        </RouterLink>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        <SurahCard
          v-for="surah in defaultSurahs"
          :key="surah.nomor"
          :id="surah.nomor"
          :number="surah.nomor"
          :title="surah.namaLatin"
          :arabic-title="surah.nama"
          :number-of-verses="surah.jumlahAyat"
          :meaning="surah.arti"
        />
      </div>
    </div>
    <div class="flex p-4 bg-primary rounded-2xl justify-between items-center mt-4">
      <div class="flex items-center gap-4">
        <div class="py-2 px-2 rounded-lg bg-secondary shadow-xl shadow-secondary/20 text-primary">
          <Bookmark :size="18" />
        </div>
        <div class="text-accent">
          <p class="font-medium">Al Fatihah</p>
          <p class="text-xs font-light">Pembuka • 7 ayat</p>
        </div>
      </div>
      <p class="text-accent">Lanjut membaca →</p>
    </div>
  </DefaultLayout>
</template>
