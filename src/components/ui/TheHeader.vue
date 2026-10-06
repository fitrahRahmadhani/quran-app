<script setup lang="ts">
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
  <header class="sticky top-0 z-50 w-full border-b border-[#173C35]/10 bg-white/85 backdrop-blur">
    <div class="mx-auto flex h-20 max-w-360 items-center justify-between px-4 sm:px-6 lg:px-8">
      <RouterLink
        to="/"
        class="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#173C35]"
      >
        <img class="w-11" src="@/assets/logo/quran-logogram.svg" alt="" />
        <span class="text-2xl font-semibold tracking-tight text-[#173C35]">Quran</span>
      </RouterLink>

      <nav class="hidden md:block" aria-label="Navigasi utama">
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
        class="grid size-11 place-items-center rounded-lg text-[#173C35] transition-colors hover:bg-[#173C35]/5 focus-visible:outline-2 focus-visible:outline-[#173C35] md:hidden"
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

    <nav
      v-show="menuOpen"
      id="menu-mobile"
      class="border-t border-[#173C35]/10 bg-white md:hidden"
      aria-label="Navigasi utama"
    >
      <ul class="mx-auto max-w-360 space-y-1 px-4 py-3 sm:px-6">
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
  </header>
</template>
