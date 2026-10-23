<script setup>
import { BookOpen, House, ScrollText } from '@lucide/vue'
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { label: 'Beranda', to: '/', icon: House },
  { label: 'Daftar Surah', to: '/surah', icon: BookOpen },
  { label: 'Daftar Juz', to: '/juz', icon: ScrollText },
]

const desktopActive = '!text-primary font-semibold after:!scale-x-100'
const tabletActive = '!bg-primary/5 !text-primary font-semibold'

const isActive = (to) =>
  to === '/' ? route.path === '/' : route.path === to || route.path.startsWith(`${to}/`)

const menuOpen = ref(false)

const menuButton = ref(null)
const menuTablet = ref(null)

onClickOutside(
  menuTablet,
  () => {
    menuOpen.value = false
  },
  { ignore: [menuButton] },
)
</script>

<template>
  <header
    class="sticky top-0 z-50 hidden w-full border-b border-primary/10 bg-white/85 backdrop-blur md:block"
  >
    <div class="mx-auto flex h-20 max-w-360 items-center justify-between px-4 sm:px-6 lg:px-8">
      <RouterLink
        to="/"
        class="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <img class="w-11" src="@/assets/logo/quran-logogram.svg" alt="" />
        <span class="text-2xl font-semibold tracking-tight text-primary">Quran</span>
      </RouterLink>

      <nav class="mx-auto hidden lg:block" aria-label="Navigasi utama">
        <ul class="flex items-center gap-10">
          <li v-for="nav in navItems" :key="nav.to">
            <RouterLink
              :to="nav.to"
              class="relative block py-2 font-medium text-gray-500 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-[#B8934A] after:transition-transform hover:after:scale-x-100"
              :class="isActive(nav.to) ? desktopActive : ''"
            >
              {{ nav.label }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <button
        ref="menuButton"
        type="button"
        class="grid size-11 place-items-center rounded-lg text-primary transition-colors hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-primary lg:hidden"
        :aria-expanded="menuOpen"
        aria-controls="menu-tablet"
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

  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 -translate-y-2 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 -translate-y-2 scale-95"
  >
    <nav
      v-show="menuOpen"
      id="menu-tablet"
      ref="menuTablet"
      class="fixed right-5 top-24 z-50 w-fit origin-top-right rounded-xl border-t border-primary/10 bg-white shadow-lg lg:hidden"
      aria-label="Navigasi utama"
    >
      <ul class="mx-auto w-64 space-y-1 p-4">
        <li v-for="nav in navItems" :key="nav.to">
          <RouterLink
            :to="nav.to"
            class="block rounded-lg px-3 py-3 font-medium text-gray-500 transition-colors hover:bg-primary/5 hover:text-primary"
            :class="isActive(nav.to) ? tabletActive : ''"
            @click="menuOpen = false"
          >
            {{ nav.label }}
          </RouterLink>
        </li>
      </ul>
    </nav>
  </Transition>

  <nav
    id="menu-mobile"
    class="fixed bottom-0 h-20 w-full bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
    aria-label="Navigasi utama"
  >
    <div class="mx-auto h-full max-w-[80%]">
      <ul class="flex h-full w-full items-center justify-between">
        <li v-for="nav in navItems" :key="nav.to">
          <RouterLink
            :to="nav.to"
            class="group flex flex-col items-center gap-1"
            :class="{ 'is-active': isActive(nav.to) }"
          >
            <component :is="nav.icon" class="text-gray-300 group-[.is-active]:text-[#B8934A]" />
            <span class="text-xs font-semibold text-gray-300 group-[.is-active]:text-primary">
              {{ nav.label }}
            </span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>
