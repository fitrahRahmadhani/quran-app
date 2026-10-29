import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import SurahCard from '@/components/surahs/SurahCard.vue'
import { quranApi } from '@/services/quranApi'
import { useBookmark } from '@/stores/bookmark'
import SurahListView from '@/views/surahs/SurahListView.vue'
import { sampleBookmark, surahList } from '../helpers/fixtures'
import { routerAt } from '../helpers/router'

vi.mock('@/services/quranApi', () => ({
  quranApi: { getAllSurah: vi.fn(), getSurah: vi.fn() },
}))

const factory = async ({ path = '/surah', bookmark = null } = {}) => {
  const pinia = createPinia()
  setActivePinia(pinia)
  if (bookmark) useBookmark(pinia).bookmark = bookmark
  const router = await routerAt(path)
  const wrapper = mount(SurahListView, { global: { plugins: [pinia, router] } })
  await flushPromises()
  return { wrapper, router }
}

const titles = (w) => w.findAllComponents(SurahCard).map((c) => c.props('title'))

describe('SurahListView', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.mocked(quranApi.getAllSurah).mockReset().mockResolvedValue(surahList)
  })

  describe('loading & error', () => {
    it('menampilkan loading selama data diambil', async () => {
      quranApi.getAllSurah.mockReturnValue(new Promise(() => {}))
      const { wrapper } = await factory()
      expect(wrapper.text()).toContain('Memuat Surah...')
      expect(wrapper.findAllComponents(SurahCard)).toHaveLength(0)
    })

    it('menampilkan error saat API gagal', async () => {
      quranApi.getAllSurah.mockRejectedValue(new Error('Network Error'))
      const { wrapper } = await factory()
      expect(wrapper.text()).toContain('Gagal Memuat Data')
      expect(wrapper.text()).not.toContain('Memuat Surah...')
      expect(wrapper.findAllComponents(SurahCard)).toHaveLength(0)
    })
  })

  describe('daftar', () => {
    it('menampilkan semua surah setelah dimuat', async () => {
      const { wrapper } = await factory()
      expect(quranApi.getAllSurah).toHaveBeenCalledTimes(1)
      expect(titles(wrapper)).toEqual(['Al-Fatihah', 'Al-Baqarah', 'Yasin'])
      expect(wrapper.text()).not.toContain('Memuat Surah...')
    })

    it('judul default "Daftar Surah" tanpa query', async () => {
      const { wrapper } = await factory()
      expect(wrapper.get('h1').text()).toBe('Daftar Surah')
    })

    it('breadcrumb berisi Beranda dan Daftar Surah', async () => {
      const { wrapper } = await factory()
      const crumbs = wrapper.findAll('p').map((p) => p.text())
      expect(crumbs).toContain('Beranda')
      expect(crumbs).toContain('/ Daftar Surah')
    })
  })

  describe('pencarian lewat query ?q=', () => {
    it('memfilter surah berdasarkan namaLatin', async () => {
      const { wrapper } = await factory({ path: '/surah?q=baq' })
      expect(titles(wrapper)).toEqual(['Al-Baqarah'])
    })

    it('pencarian tidak sensitif huruf besar/kecil dan mengabaikan spasi tepi', async () => {
      const { wrapper } = await factory({ path: '/surah?q=%20YASIN%20' })
      expect(titles(wrapper)).toEqual(['Yasin'])
    })

    it('cocok sebagian di tengah nama', async () => {
      const { wrapper } = await factory({ path: '/surah?q=al-' })
      expect(titles(wrapper)).toEqual(['Al-Fatihah', 'Al-Baqarah'])
    })

    it('judul berubah menjadi hasil pencarian', async () => {
      const { wrapper } = await factory({ path: '/surah?q=yasin' })
      expect(wrapper.get('h1').text()).toBe('Hasil pencarian "yasin"')
    })

    it('mengisi kolom pencarian dari query', async () => {
      const { wrapper } = await factory({ path: '/surah?q=yasin' })
      expect(wrapper.get('#search-bar').element.value).toBe('yasin')
    })

    it('menampilkan pesan bila tidak ada hasil', async () => {
      const { wrapper } = await factory({ path: '/surah?q=xyz' })
      expect(wrapper.findAllComponents(SurahCard)).toHaveLength(0)
      expect(wrapper.text()).toContain('Surah "xyz" tidak ditemukan.')
    })
  })

  describe('form pencarian', () => {
    it('submit memperbarui query di URL (trim)', async () => {
      const { wrapper, router } = await factory()
      await wrapper.get('#search-bar').setValue('  Yasin ')
      await wrapper.get('form').trigger('submit')
      await flushPromises()

      expect(router.currentRoute.value.path).toBe('/surah')
      expect(router.currentRoute.value.query.q).toBe('Yasin')
      expect(titles(wrapper)).toEqual(['Yasin'])
    })

    it('submit kosong menghapus query dan menampilkan semua surah', async () => {
      const { wrapper, router } = await factory({ path: '/surah?q=yasin' })
      await wrapper.get('#search-bar').setValue('')
      await wrapper.get('form').trigger('submit')
      await flushPromises()

      expect(router.currentRoute.value.query).toEqual({})
      expect(titles(wrapper)).toHaveLength(3)
    })
  })

  describe('bookmark', () => {
    it('menampilkan bookmark tersimpan', async () => {
      const { wrapper } = await factory({ bookmark: { ...sampleBookmark, savedAt: 1 } })
      expect(wrapper.text()).toContain('Lanjut membaca →')
    })

    it('tidak menampilkan bookmark bila kosong', async () => {
      const { wrapper } = await factory()
      expect(wrapper.text()).not.toContain('Lanjut membaca')
    })
  })
})
