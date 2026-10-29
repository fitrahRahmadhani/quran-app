import { beforeEach, describe, expect, it } from 'vitest'
import router from '@/router'
import { SITE_URL } from '@/utils/seo'
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

  describe('SEO per halaman', () => {
    const robots = () => document.head.querySelector('meta[name="robots"]').content
    const canonical = () => document.head.querySelector('link[rel="canonical"]').href

    beforeEach(() => {
      document.head.innerHTML = ''
    })

    it('Beranda memakai judul default dan canonical "/"', async () => {
      await router.push('/surah')
      await router.push('/')
      expect(document.title).toBe('Quran Online - Baca Al-Qur’an, Latin & Terjemahan Indonesia')
      expect(canonical()).toBe(`${SITE_URL}/`)
    })

    it('Daftar Juz dan Daftar Surah punya judul unik', async () => {
      await router.push('/juz')
      expect(document.title).toContain('Daftar 30 Juz')
      await router.push('/surah')
      expect(document.title).toContain('Daftar 114 Surah')
    })

    it('canonical tidak menyertakan query string dan hasil pencarian di-noindex', async () => {
      await router.push('/surah')
      expect(robots()).toBe('index, follow')

      await router.push('/surah?q=yasin')
      expect(canonical()).toBe(`${SITE_URL}/surah`)
      expect(robots()).toBe('noindex, follow')
    })

    it('halaman surah memakai canonical dengan id surah', async () => {
      await router.push('/surah/36')
      expect(canonical()).toBe(`${SITE_URL}/surah/36`)
    })
  })
})
