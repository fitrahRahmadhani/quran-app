<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { Bookmark, Search } from '@lucide/vue'
</script>

<template>
  <DefaultLayout>
    <div class="text-primary text-center space-y-2">
      <h2 class="text-5xl font-bold tracking-wide">Tempat untuk Kembali,</h2>
      <h2 class="text-5xl font-bold tracking-wide">Kapan Pun Kamu Butuhkan</h2>
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
        <div class="flex items-center gap-4 w-full">
          <Search :size="20" class="text-gray-400" />
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
        <button
          type="button"
          class="text-sm border border-primary/20 font-medium py-2 px-4 text-primary bg-primary/10 rounded-full"
        >
          Al Fatihah
        </button>
        <button
          type="button"
          class="text-sm border border-primary/20 font-medium py-2 px-4 text-primary bg-primary/10 rounded-full"
        >
          Al-Baqarah
        </button>
        <button
          type="button"
          class="text-sm border border-primary/20 font-medium py-2 px-4 text-primary bg-primary/10 rounded-full"
        >
          Yasin
        </button>
      </div>
      <p class="text-sm font-medium text-primary text-right mt-2">Lihat semua surah →</p>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
      <div
        class="flex p-4 bg-white rounded-2xl border border-gray-200 justify-between items-center"
      >
        <div class="flex items-center gap-4">
          <div class="py-2 px-3 rounded-lg bg-primary/10 text-primary">
            <p class="font-medium text-sm">01</p>
          </div>
          <div class="text-primary">
            <p class="font-medium">Al Fatihah</p>
            <p class="text-xs font-light">Pembuka • 7 ayat</p>
          </div>
        </div>
        <div>
          <p dir="rtl" lang="ar" class="font-quran text-3xl text-primary">الفاتحة</p>
        </div>
      </div>
      <div
        class="flex p-4 bg-white rounded-2xl border border-gray-200 justify-between items-center"
      >
        <div class="flex items-center gap-4">
          <div class="py-2 px-3 rounded-lg bg-primary/10 text-primary">
            <p class="font-medium text-sm">01</p>
          </div>
          <div class="text-primary">
            <p class="font-medium">Al Fatihah</p>
            <p class="text-xs font-light">Pembuka • 7 ayat</p>
          </div>
        </div>
        <div>
          <p dir="rtl" lang="ar" class="font-quran text-3xl text-primary">الفاتحة</p>
        </div>
      </div>
      <div
        class="flex p-4 bg-white rounded-2xl border border-gray-200 justify-between items-center"
      >
        <div class="flex items-center gap-4">
          <div class="py-2 px-3 rounded-lg bg-primary/10 text-primary">
            <p class="font-medium text-sm">01</p>
          </div>
          <div class="text-primary">
            <p class="font-medium">Al Fatihah</p>
            <p class="text-xs font-light">Pembuka • 7 ayat</p>
          </div>
        </div>
        <div>
          <p dir="rtl" lang="ar" class="font-quran text-3xl text-primary">الفاتحة</p>
        </div>
      </div>
      <div
        class="flex p-4 bg-white rounded-2xl border border-gray-200 justify-between items-center"
      >
        <div class="flex items-center gap-4">
          <div class="py-2 px-3 rounded-lg bg-primary/10 text-primary">
            <p class="font-medium text-sm">01</p>
          </div>
          <div class="text-primary">
            <p class="font-medium">Al Fatihah</p>
            <p class="text-xs font-light">Pembuka • 7 ayat</p>
          </div>
        </div>
        <div>
          <p dir="rtl" lang="ar" class="font-quran text-3xl text-primary">الفاتحة</p>
        </div>
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
