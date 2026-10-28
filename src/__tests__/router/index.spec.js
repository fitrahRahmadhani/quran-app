import { describe, expect, it } from 'vitest'
import router from '@/router'
import BerandaView from '@/views/BerandaView.vue'
import JuzListView from '@/views/juz/JuzListView.vue'
import SurahDetailView from '@/views/surahs/SurahDetailView.vue'
import SurahListView from '@/views/surahs/SurahListView.vue'

describe('router', () => {
  it.each([
    ['beranda', '/', BerandaView],
    ['surah', '/surah', SurahListView],
    ['surah-read', '/surah/:id', SurahDetailView],
    ['juz', '/juz', JuzListView],
  ])('route "%s" -> %s', (name, path, component) => {
    const route = router.getRoutes().find((r) => r.name === name)
    expect(route).toBeDefined()
    expect(route.path).toBe(path)
    expect(route.components.default).toBe(component)
  })

  it('hanya memiliki 4 route', () => {
    expect(router.getRoutes()).toHaveLength(4)
  })

  it('me-resolve route surah-read dengan params dan hash', () => {
    const resolved = router.resolve({ name: 'surah-read', params: { id: 36 }, hash: '#ayat-5' })
    expect(resolved.href).toBe('/surah/36#ayat-5')
  })

  it('mencocokkan URL ke route yang benar', () => {
    expect(router.resolve('/surah/114').name).toBe('surah-read')
    expect(router.resolve('/surah/114').params.id).toBe('114')
    expect(router.resolve('/juz').name).toBe('juz')
  })
})
