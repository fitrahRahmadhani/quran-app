import BerandaView from '@/views/BerandaView.vue'
import JuzListView from '@/views/juz/JuzListView.vue'
import SurahDetailView from '@/views/surahs/SurahDetailView.vue'
import SurahListView from '@/views/surahs/SurahListView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'beranda',
      component: BerandaView,
    },
    {
      path: '/surah',
      name: 'surah',
      component: SurahListView,
    },
    {
      path: '/surah/:id',
      name: 'surah-read',
      component: SurahDetailView,
    },
    {
      path: '/juz',
      name: 'juz',
      component: JuzListView,
    },
  ],
})

export default router
