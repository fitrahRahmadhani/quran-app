<script setup>
import SurahCard from '@/components/surahs/SurahCard.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { Bookmark, Fingerprint, RefreshCw, Search, TriangleAlert } from '@lucide/vue'
import { onMounted, ref } from 'vue'
import axios from 'axios'

const surahs = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const res = await axios.get('https://equran.id/api/v2/surat')
    surahs.value = res.data.data
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <DefaultLayout>
    <div class="flex gap-2 mb-6">
      <RouterLink :to="{ name: 'beranda' }"
        ><p class="text-sm text-gray-500">Beranda</p>
      </RouterLink>
      <p class="text-sm font-semibold text-primary">/ Daftar Surah</p>
    </div>
    <h2 class="text-4xl font-bold text-primary">Daftar Surah</h2>
    <p class="text-primary mt-2">
      Temukan surah yang ingin kamu baca, atau jelajahi sesuai urutan mushaf.
    </p>
    <label
      for="search-bar"
      class="sticky top-22 flex items-center justify-between bg-white shadow-lg my-6 border border-gray-200 p-4 rounded-3xl gap-4 transition-all duration-200 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20"
    >
      <div class="flex items-center gap-2 w-full">
        <Search :size="22" class="text-primary" />
        <input
          id="search-bar"
          type="text"
          class="w-full text-lg outline-none"
          placeholder="Cari surah..."
        />
      </div>
      <button
        type="button"
        class="bg-primary text-white px-6 py-2 shadow-xl shadow-primary/20 rounded-3xl"
      >
        Cari
      </button>
    </label>
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
    <div v-if="loading" class="flex flex-col items-center py-10 space-y-2 text-primary/50">
      <img class="w-12" src="@/assets/icons/loading-spinner.svg" alt="Memuat..." />
      <p class="text-sm italic">Memuat Surah...</p>
    </div>
    <div
      v-else-if="error"
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

    <!-- List -->
    <div v-else class="grid md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mt-8">
      <SurahCard
        v-for="surah in surahs"
        :key="surah.nomor"
        :id="surah.nomor"
        :number="surah.nomor"
        :title="surah.namaLatin"
        :arabic-title="surah.nama"
        :number-of-verses="surah.jumlahAyat"
        :meaning="surah.arti"
      />
    </div>
  </DefaultLayout>
</template>
