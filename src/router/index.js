import BerandaView from '@/views/BerandaView.vue'
import JuzListView from '@/views/juz/JuzListView.vue'
import SurahDetailView from '@/views/surahs/SurahDetailView.vue'
import SurahListView from '@/views/surahs/SurahListView.vue'
import { setSeo } from '@/utils/seo'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'beranda',
      component: BerandaView,
      meta: {
        seo: {
          title: null,
          breadcrumbs: [{ name: 'Beranda', path: '/' }],
        },
      },
    },
    {
      path: '/surah',
      name: 'surah',
      component: SurahListView,
      meta: {
        seo: {
          title: 'Daftar 114 Surah Al-Qur’an',
          description:
            'Daftar lengkap 114 surah Al-Qur’an beserta arti, jumlah ayat, dan tempat turunnya. Cari dan baca surah favoritmu dengan teks Arab, latin, dan terjemahan Indonesia.',
          breadcrumbs: [
            { name: 'Beranda', path: '/' },
            { name: 'Daftar Surah', path: '/surah' },
          ],
        },
      },
    },
    {
      path: '/surah/:id',
      name: 'surah-read',
      component: SurahDetailView,
      // Judul & deskripsi final diisi SurahDetailView setelah data surah dimuat.
      meta: { seo: { title: 'Baca Surah Al-Qur’an' } },
    },
    {
      path: '/juz',
      name: 'juz',
      component: JuzListView,
      meta: {
        seo: {
          title: 'Daftar 30 Juz Al-Qur’an',
          description:
            'Jelajahi Al-Qur’an per juz: 30 juz lengkap dengan daftar surah di dalamnya. Pilih juz, lalu baca dengan teks Arab, latin, dan terjemahan Bahasa Indonesia.',
          breadcrumbs: [
            { name: 'Beranda', path: '/' },
            { name: 'Daftar Juz', path: '/juz' },
          ],
        },
      },
    },
  ],
})

router.afterEach((to) => {
  const seo = to.meta.seo ?? {}
  setSeo({
    ...seo,
    path: to.path, // tanpa query string, supaya canonical tetap bersih
    // hasil pencarian (?q=) tidak perlu diindeks
    noindex: to.name === 'surah' && Boolean(to.query.q),
  })
})

export default router
