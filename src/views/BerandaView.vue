<script setup lang="ts">
import SurahCard from '@/components/surahs/SurahCard.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { Bookmark, Search } from '@lucide/vue'
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
      <label
        for="search-bar"
        class="flex items-center justify-between bg-white shadow-lg border border-gray-200 p-4 rounded-3xl gap-4 transition-all duration-200 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20"
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
      <div class="mt-4 flex gap-2">
        <BaseBadge id="1" title="Al Fatihah" />
        <BaseBadge id="2" title="Al Baqarah" />
        <BaseBadge id="3" title="Yasin" />
      </div>
      <RouterLink :to="{ name: 'surah' }">
        <p class="text-sm font-medium text-primary text-right mt-2">Lihat semua surah →</p>
      </RouterLink>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mt-8">
      <SurahCard
        id="1"
        number="01"
        title="Al Fatihah"
        arabic-title="الفاتحة"
        number-of-verses="7"
        meaning="Pembuka"
      />
      <SurahCard
        id="1"
        number="01"
        title="Al Fatihah"
        arabic-title="الفاتحة"
        number-of-verses="7"
        meaning="Pembuka"
      />
      <SurahCard
        id="1"
        number="01"
        title="Al Fatihah"
        arabic-title="الفاتحة"
        number-of-verses="7"
        meaning="Pembuka"
      />
      <SurahCard
        id="1"
        number="01"
        title="Al Fatihah"
        arabic-title="الفاتحة"
        number-of-verses="7"
        meaning="Pembuka"
      />
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
