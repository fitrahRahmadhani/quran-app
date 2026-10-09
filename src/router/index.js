import BerandaView from '@/views/BerandaView.vue'
import Index from '@/views/surahs/Index.vue'
import SurahRead from '@/views/surahs/SurahRead.vue'
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
      component: Index,
    },
    {
      path: '/surah/:id',
      name: 'surah-read',
      component: SurahRead,
    },
  ],
})

export default router
