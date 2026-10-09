import BerandaView from '@/views/BerandaView.vue'
import SurahList from '@/views/SurahList.vue'
import SurahRead from '@/views/SurahRead.vue'
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
      component: SurahList,
    },
    {
      path: '/surah/:id',
      name: 'surah-read',
      component: SurahRead,
    },
  ],
})

export default router
