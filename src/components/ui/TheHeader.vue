<script setup lang="ts">
import { BookOpen, House, ScrollText } from '@lucide/vue'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const navItems = [
  { label: 'Beranda', to: '/' },
  { label: 'Daftar Surah', to: '/surah' },
  { label: 'Daftar Juz', to: '/juz' },
]

const menuOpen = ref(false)
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-[#173C35]/10 bg-white/85 backdrop-blur hidden md:block"
  >
    <div class="mx-auto flex h-20 max-w-360 items-center justify-between px-4 sm:px-6 lg:px-8">
      <RouterLink
        to="/"
        class="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#173C35]"
      >
        <img class="w-11" src="@/assets/logo/quran-logogram.svg" alt="" />
        <h1 class="text-2xl font-semibold tracking-tight text-[#173C35]">Quran</h1>
      </RouterLink>

      <nav class="hidden mx-auto lg:block" aria-label="Navigasi utama">
        <ul class="flex items-center gap-10">
          <li v-for="item in navItems" :key="item.to">
            <RouterLink
              :to="item.to"
              class="relative block py-2 font-medium text-gray-500 transition-colors hover:text-[#173C35] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#173C35] after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-[#B8934A] after:transition-transform hover:after:scale-x-100"
              active-class="!text-[#173C35] font-semibold after:!scale-x-100"
            >
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <button
        type="button"
        class="grid size-11 place-items-center rounded-lg text-[#173C35] transition-colors hover:bg-[#173C35]/5 focus-visible:outline-2 focus-visible:outline-[#173C35] md:block lg:hidden"
        :aria-expanded="menuOpen"
        aria-controls="menu-mobile"
        :aria-label="menuOpen ? 'Tutup menu' : 'Buka menu'"
        @click="menuOpen = !menuOpen"
      >
        <svg
          v-if="!menuOpen"
          class="size-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
        <svg
          v-else
          class="size-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  </header>
  <nav
    v-show="menuOpen"
    id="menu-tablet"
    class="border-t border-[#173C35]/10 bg-white rounded-xl top-24 fixed right-5 w-fit md:block lg:hidden"
    aria-label="Navigasi utama"
  >
    <ul class="mx-auto w-64 space-y-1 p-4">
      <li v-for="item in navItems" :key="item.to">
        <RouterLink
          :to="item.to"
          class="block rounded-lg px-3 py-3 font-medium text-gray-500 transition-colors hover:bg-[#173C35]/5 hover:text-[#173C35]"
          active-class="!bg-[#173C35]/5 !text-[#173C35] font-semibold"
          @click="menuOpen = false"
        >
          {{ item.label }}
        </RouterLink>
      </li>
    </ul>
  </nav>
  <nav
    id="menu-mobile"
    class="w-full h-20 fixed bottom-0 bg-white md:hidden"
    aria-label="Navigasi utama"
  >
    <div class="max-w-[80%] h-full mx-auto">
      <ul class="h-full w-full flex items-center justify-between">
        <li class="flex flex-col items-center gap-1 text-[#B8934A] rounded-full">
          <House />
          <span class="text-xs font-semibold text-[#173C35]">Beranda</span>
        </li>
        <li class="flex flex-col items-center gap-1 text-gray-300 rounded-full">
          <BookOpen />
          <span class="text-xs">Daftar Surah</span>
        </li>
        <li class="flex flex-col items-center gap-1 text-gray-300 rounded-full">
          <ScrollText />
          <span class="text-xs">Daftar Juz</span>
        </li>
      </ul>
    </div>
  </nav>
</template>
