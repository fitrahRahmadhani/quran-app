import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import SurahCard from '@/components/surahs/SurahCard.vue'
import { quranApi } from '@/services/quranApi'
import JuzListView from '@/views/juz/JuzListView.vue'
import { surahList } from '../helpers/fixtures'
import { routerAt } from '../helpers/router'

vi.mock('@/services/quranApi', () => ({
  quranApi: { getAllSurah: vi.fn(), getSurah: vi.fn() },
}))

const factory = async () => {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = await routerAt('/juz')
  const wrapper = mount(JuzListView, { global: { plugins: [pinia, router] } })
  await flushPromises()
  return wrapper
}

const juzHeadings = (w) => w.findAll('p.font-bold.text-primary').map((p) => p.text())

describe('JuzListView', () => {
  beforeEach(() => {
    vi.mocked(quranApi.getAllSurah).mockReset().mockResolvedValue(surahList)
  })

  it('menampilkan loading selama data diambil', async () => {
    quranApi.getAllSurah.mockReturnValue(new Promise(() => {}))
    const wrapper = await factory()
    expect(wrapper.text()).toContain('Memuat Surah...')
    expect(juzHeadings(wrapper)).toHaveLength(0)
  })

  it('menampilkan error saat API gagal', async () => {
    quranApi.getAllSurah.mockRejectedValue(new Error('boom'))
    const wrapper = await factory()
    expect(wrapper.text()).toContain('Gagal Memuat Data')
    expect(juzHeadings(wrapper)).toHaveLength(0)
  })

  it('judul halaman "Daftar Juz"', async () => {
    const wrapper = await factory()
    expect(wrapper.get('h2').text()).toBe('Daftar Juz')
  })

  it('menampilkan 30 juz berurutan', async () => {
    const wrapper = await factory()
    expect(juzHeadings(wrapper)).toEqual(Array.from({ length: 30 }, (_, i) => `Juz ${i + 1}`))
  })

  it('mengelompokkan surah ke juz yang tepat', async () => {
    const wrapper = await factory()
    const blocks = wrapper.findAll('div.mb-10')
    const titlesIn = (n) => blocks[n - 1].findAllComponents(SurahCard).map((c) => c.props('title'))

    expect(titlesIn(1)).toEqual(['Al-Fatihah', 'Al-Baqarah'])
    expect(titlesIn(2)).toEqual(['Al-Baqarah'])
    expect(titlesIn(22)).toEqual(['Yasin'])
    expect(titlesIn(23)).toEqual(['Yasin'])
  })

  it('surah yang tidak ada di respons API dilewati (bukan error)', async () => {
    const wrapper = await factory()
    // fixture hanya berisi surah 1, 2, 36 -> Al-Baqarah di juz 1,2,3; Yasin di juz 22,23
    expect(wrapper.findAllComponents(SurahCard)).toHaveLength(1 + 3 + 2)
    const juz30 = wrapper.findAll('div.mb-10')[29]
    expect(juz30.findAllComponents(SurahCard)).toHaveLength(0)
  })

  it('memanggil API satu kali', async () => {
    await factory()
    expect(quranApi.getAllSurah).toHaveBeenCalledTimes(1)
  })
})
