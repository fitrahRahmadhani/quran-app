import BerandaView from '@/views/BerandaView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'beranda',
      component: BerandaView,
    },
  ],
})

export default router
