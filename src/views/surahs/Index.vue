<script setup lang="ts">
import SurahCard from '@/components/surahs/SurahCard.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { Bookmark, Search } from '@lucide/vue'
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
  </DefaultLayout>
</template>
