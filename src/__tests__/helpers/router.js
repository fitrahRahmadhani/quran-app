import { defineComponent, h } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'

const stub = (name) =>
  defineComponent({
    name: `${name}Stub`,
    render: () => h('div', { 'data-testid': 'route-stub' }, name),
  })

/** Router dengan nama route yang sama seperti router asli, tapi komponennya stub. */
export function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'beranda', component: stub('beranda') },
      { path: '/surah', name: 'surah', component: stub('surah') },
      { path: '/surah/:id', name: 'surah-read', component: stub('surah-read') },
      { path: '/juz', name: 'juz', component: stub('juz') },
    ],
  })
}

/** Buat router lalu pindah ke `path` dan tunggu siap. */
export async function routerAt(path = '/') {
  const router = createTestRouter()
  await router.push(path)
  await router.isReady()
  return router
}
