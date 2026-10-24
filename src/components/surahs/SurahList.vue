<script setup>
import SurahCard from './SurahCard.vue'

const props = defineProps({
  surahs: Array,
})
</script>
<template>
  <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mt-4">
    <SurahCard
      v-for="surah in props.surahs"
      :key="surah.nomor"
      :id="surah.nomor"
      :number="surah.nomor"
      :title="surah.namaLatin"
      :arabic-title="surah.nama"
      :number-of-verses="surah.jumlahAyat"
      :meaning="surah.arti"
    />
  </div>
</template>
