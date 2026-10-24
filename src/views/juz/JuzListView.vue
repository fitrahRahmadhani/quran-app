<script setup>
import SurahCard from '@/components/surahs/SurahCard.vue'
import BaseTitle from '@/components/ui/BaseTitle.vue'
import FetchError from '@/components/ui/FetchError.vue'
import FetchLoading from '@/components/ui/FetchLoading.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { quranApi } from '@/services/quranApi'
import { computed, onMounted, ref } from 'vue'

const juzAlQuran = [
  { juz: 1, surah: [1, 2] },
  { juz: 2, surah: [2] },
  { juz: 3, surah: [2, 3] },
  { juz: 4, surah: [3, 4] },
  { juz: 5, surah: [4] },
  { juz: 6, surah: [4, 5] },
  { juz: 7, surah: [5, 6] },
  { juz: 8, surah: [6, 7] },
  { juz: 9, surah: [7, 8] },
  { juz: 10, surah: [8, 9] },
  { juz: 11, surah: [9, 10, 11] },
  { juz: 12, surah: [11, 12] },
  { juz: 13, surah: [12, 13, 14] },
  { juz: 14, surah: [15, 16] },
  { juz: 15, surah: [17, 18] },
  { juz: 16, surah: [18, 19, 20] },
  { juz: 17, surah: [21, 22] },
  { juz: 18, surah: [23, 24, 25] },
  { juz: 19, surah: [25, 26, 27] },
  { juz: 20, surah: [27, 28, 29] },
  { juz: 21, surah: [29, 30, 31, 32, 33] },
  { juz: 22, surah: [33, 34, 35, 36] },
  { juz: 23, surah: [36, 37, 38, 39] },
  { juz: 24, surah: [39, 40, 41] },
  { juz: 25, surah: [41, 42, 43, 44, 45] },
  { juz: 26, surah: [46, 47, 48, 49, 50, 51] },
  { juz: 27, surah: [51, 52, 53, 54, 55, 56, 57] },
  { juz: 28, surah: [58, 59, 60, 61, 62, 63, 64, 65, 66] },
  { juz: 29, surah: [67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77] },
  {
    juz: 30,
    surah: [
      78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100,
      101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114,
    ],
  },
]

const surahs = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    surahs.value = await quranApi.getAllSurah()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

const juzList = computed(() => {
  const surahMap = new Map(surahs.value.map((s) => [s.nomor, s]))

  return juzAlQuran.map((juz) => ({
    juz: juz.juz,
    surah: juz.surah.map((nomor) => surahMap.get(nomor)).filter(Boolean),
  }))
})
</script>

<template>
  <DefaultLayout>
    <div class="flex gap-2 mb-6">
      <RouterLink :to="{ name: 'beranda' }">
        <p class="text-sm text-gray-500">Beranda</p>
      </RouterLink>
      <p class="text-sm font-semibold text-primary">/ Daftar Juz</p>
    </div>

    <BaseTitle :title="'Daftar Juz'" />

    <div class="my-6">
      <FetchLoading v-if="loading" />
      <FetchError v-else-if="error" />

      <template v-else>
        <div v-for="juz in juzList" :key="juz.juz" class="mb-10">
          <p class="font-bold text-primary">Juz {{ juz.juz }}</p>

          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mt-4">
            <SurahCard
              v-for="surah in juz.surah"
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
      </template>
    </div>
  </DefaultLayout>
</template>
