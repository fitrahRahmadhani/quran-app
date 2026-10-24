<script setup>
import SurahCard from '@/components/surahs/SurahCard.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { Search } from '@lucide/vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookmark } from '@/stores/bookmark'
import { quranApi } from '@/services/quranApi'
import FetchLoading from '@/components/ui/FetchLoading.vue'
import FetchError from '@/components/ui/FetchError.vue'
import SurahBookmark from '@/components/surahs/SurahBookmark.vue'
import BaseTitle from '@/components/ui/BaseTitle.vue'
import SurahList from '@/components/surahs/SurahList.vue'

const surahs = ref([])
const loading = ref(true)
const error = ref(null)
const route = useRoute()
const router = useRouter()
const bookmarkStore = useBookmark()
const inputSearch = ref(String(route.query.q ?? ''))

const searchStatusMessage = computed(() => {
  const q = String(route.query.q ?? '').trim()
  if (!q) return 'Daftar Surah'
  return `Hasil pencarian "${q}"`
})

const searchQuery = computed(() => {
  return String(route.query.q ?? '')
    .trim()
    .toLowerCase()
})

function onSearch() {
  router.replace({ query: { q: inputSearch.value.trim() || undefined } })
}

const filteredSurah = computed(() => {
  if (!searchQuery.value) return surahs.value
  return surahs.value.filter((s) => s.namaLatin.toLowerCase().includes(searchQuery.value))
})

onMounted(async () => {
  try {
    surahs.value = await quranApi.getAllSurah()
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
    <BaseTitle :title="searchStatusMessage" />
    <form
      class="sticky top-8 md:top-22 flex items-center justify-between bg-white shadow-lg my-6 border border-gray-200 p-4 rounded-2xl gap-4 transition-all duration-200 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20"
      @submit.prevent="onSearch"
    >
      <label for="search-bar" class="flex items-center gap-2 w-full">
        <Search :size="22" class="text-primary" />
        <input
          id="search-bar"
          v-model="inputSearch"
          type="text"
          class="w-full text-lg outline-none"
          placeholder="Cari surah..."
        />
      </label>
      <button
        type="submit"
        class="bg-primary text-white px-6 py-2 shadow-xl shadow-primary/20 rounded-3xl"
      >
        Cari
      </button>
    </form>
    <SurahBookmark :bookmark="bookmarkStore.bookmark || null" />
    <FetchLoading v-if="loading" />
    <FetchError v-else-if="error" />

    <div v-else-if="filteredSurah.length === 0" class="mt-12 text-center text-gray-500">
      Surah "{{ route.query.q }}" tidak ditemukan.
    </div>

    <SurahList :surahs="filteredSurah" />
  </DefaultLayout>
</template>
