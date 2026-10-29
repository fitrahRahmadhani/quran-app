import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import SurahCard from '@/components/surahs/SurahCard.vue'
import { useBookmark } from '@/stores/bookmark'
import BerandaView from '@/views/BerandaView.vue'
import { sampleBookmark } from '../helpers/fixtures'
import { routerAt } from '../helpers/router'

const factory = async () => {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = await routerAt('/')
  const pushSpy = vi.spyOn(router, 'push')
  const wrapper = mount(BerandaView, { global: { plugins: [pinia, router] } })
  return { wrapper, router, pushSpy, pinia }
}

describe('BerandaView', () => {
  beforeEach(() => localStorage.clear())

  it('menampilkan judul hero', async () => {
    const { wrapper } = await factory()
    expect(wrapper.text()).toContain('Tempat untuk Kembali,')
    expect(wrapper.text()).toContain('Kapan Pun Kamu Butuhkan')
  })

  describe('daftar surah', () => {
    it('menampilkan 4 surah default dengan link ke halaman baca', async () => {
      const { wrapper } = await factory()
      const cards = wrapper.findAllComponents(SurahCard)
      expect(cards).toHaveLength(4)
      expect(cards.map((c) => c.props('title'))).toEqual([
        'Al-Fatihah',
        'Al-Baqarah',
        "Ali 'Imran",
        "An-Nisa'",
      ])
      expect(cards.map((c) => c.get('a').attributes('href'))).toEqual([
        '/surah/1',
        '/surah/2',
        '/surah/3',
        '/surah/4',
      ])
    })

    it('memiliki link "Lihat semua surah"', async () => {
      const { wrapper } = await factory()
      const link = wrapper.findAll('a').find((a) => a.text().includes('Lihat semua surah'))
      expect(link.attributes('href')).toBe('/surah')
    })
  })

  describe('pencarian', () => {
    it('submit kosong menampilkan error dan tidak berpindah halaman', async () => {
      const { wrapper, pushSpy } = await factory()
      await wrapper.get('form').trigger('submit')

      expect(wrapper.get('[role="alert"]').text()).toBe(
        'Silahkan masukkan nama surah terlebih dahulu',
      )
      expect(pushSpy).not.toHaveBeenCalled()
    })

    it('input hanya spasi dianggap kosong', async () => {
      const { wrapper, pushSpy } = await factory()
      await wrapper.get('#search-bar').setValue('    ')
      await wrapper.get('form').trigger('submit')

      expect(wrapper.find('[role="alert"]').exists()).toBe(true)
      expect(pushSpy).not.toHaveBeenCalled()
    })

    it('mengetik menghapus pesan error', async () => {
      const { wrapper } = await factory()
      await wrapper.get('form').trigger('submit')
      expect(wrapper.find('[role="alert"]').exists()).toBe(true)

      await wrapper.get('#search-bar').setValue('y')
      expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    })

    it('submit berisi query berpindah ke daftar surah dengan q yang sudah di-trim', async () => {
      const { wrapper, pushSpy } = await factory()
      await wrapper.get('#search-bar').setValue('  yasin ')
      await wrapper.get('form').trigger('submit')

      expect(pushSpy).toHaveBeenCalledWith({ name: 'surah', query: { q: 'yasin' } })
      expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    })

    it('menandai form dengan border merah saat error', async () => {
      const { wrapper } = await factory()
      expect(wrapper.get('form').classes()).not.toContain('border-red-500')
      await wrapper.get('form').trigger('submit')
      expect(wrapper.get('form').classes()).toContain('border-red-500')
    })
  })

  describe('struktur heading & aksesibilitas', () => {
    it('memiliki satu h1 berisi headline utama', async () => {
      const { wrapper } = await factory()
      expect(wrapper.findAll('h1')).toHaveLength(1)
      expect(wrapper.get('h1').text()).toContain('Tempat untuk Kembali')
      expect(wrapper.get('h1').text()).toContain('Kapan Pun Kamu Butuhkan')
    })

    it('kolom pencarian punya label aksesibel', async () => {
      const { wrapper } = await factory()
      expect(wrapper.get('#search-bar').attributes('aria-label')).toBe('Cari surah')
    })
  })

  describe('rekomendasi surah populer', () => {
    it('menampilkan 4 badge', async () => {
      const { wrapper } = await factory()
      expect(wrapper.findAllComponents(BaseBadge).map((b) => b.text())).toEqual([
        'Al-Fatihah',
        'Al-Kahf',
        'Yasin',
        "Al-Waqi'ah",
      ])
    })

    it('badge memakai id string unik tanpa warning prop', async () => {
      const { wrapper } = await factory()
      const ids = wrapper.findAllComponents(BaseBadge).map((b) => b.attributes('id'))
      expect(ids).toEqual(['suggestion-1', 'suggestion-18', 'suggestion-36', 'suggestion-56'])
    })

    it('klik badge mengisi kolom pencarian', async () => {
      const { wrapper } = await factory()
      const badge = wrapper.findAllComponents(BaseBadge).find((b) => b.text() === 'Yasin')
      await badge.trigger('click')
      expect(wrapper.get('#search-bar').element.value).toBe('Yasin')
    })
  })

  describe('bookmark', () => {
    it('tidak menampilkan "Lanjut membaca" bila belum ada bookmark', async () => {
      const { wrapper } = await factory()
      expect(wrapper.text()).not.toContain('Lanjut membaca')
    })

    it('menampilkan bookmark tersimpan', async () => {
      const pinia = createPinia()
      setActivePinia(pinia)
      useBookmark(pinia).bookmark = { ...sampleBookmark, savedAt: 1 }
      const router = await routerAt('/')
      const wrapper = mount(BerandaView, { global: { plugins: [pinia, router] } })

      expect(wrapper.text()).toContain('Lanjut membaca →')
      const link = wrapper.findAll('a').find((a) => a.text().includes('Lanjut membaca'))
      expect(link.attributes('href')).toBe('/surah/2#ayat-5')
    })
  })
})
