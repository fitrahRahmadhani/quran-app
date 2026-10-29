<script setup>
import { RouterLink } from 'vue-router'

const year = new Date().getFullYear()

const links = [
  { label: 'Beranda', to: { name: 'beranda' } },
  { label: 'Daftar Surah', to: { name: 'surah' } },
  { label: 'Daftar Juz', to: { name: 'juz' } },
]

const linkClass =
  'rounded text-sm font-light text-accent/80 transition-colors hover:text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'
</script>

<template>
  <!-- pb-20 di mobile: ruang untuk navigasi bawah (fixed, h-20) agar footer tidak tertutup -->
  <footer class="w-full bg-primary pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
    <div class="mx-auto w-full max-w-360 px-4 py-10 sm:px-6 md:py-12 lg:px-8">
      <div
        class="flex flex-col gap-8 border-b border-accent/30 pb-8 md:flex-row md:items-start md:justify-between"
      >
        <div class="max-w-md space-y-2">
          <p class="text-2xl font-semibold tracking-tight text-accent">Quran</p>
          <p class="text-sm/5 font-light text-accent/90">
            Ruang digital untuk membaca dan menjelajahi Al-Qur’an dengan hati yang lebih tenang.
          </p>
        </div>

        <nav aria-label="Navigasi footer">
          <h2 class="font-semibold text-accent">Jelajah</h2>
          <ul class="mt-3 space-y-2">
            <li v-for="link in links" :key="link.label">
              <RouterLink :to="link.to" :class="linkClass">{{ link.label }}</RouterLink>
            </li>
          </ul>
        </nav>
      </div>

      <div
        class="mt-4 flex flex-col gap-1 text-sm/5 font-light text-accent/80 sm:flex-row sm:items-center sm:justify-between"
      >
        <p>© {{ year }} Quran</p>
        <p>
          Sumber data:
          <a
            href="https://equran.id"
            target="_blank"
            rel="noopener noreferrer"
            class="underline underline-offset-2 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >equran.id</a
          >
        </p>
      </div>
    </div>
  </footer>
</template>
