import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SurahNav from '@/components/surahs/SurahNav.vue'
import { routerAt } from '../../helpers/router'

const prev = { nomor: 1, namaLatin: 'Al-Fatihah', jumlahAyat: 7, nama: 'الفاتحة' }
const next = { nomor: 3, namaLatin: "Ali 'Imran", jumlahAyat: 200, nama: 'اٰل عمران' }

const factory = async (props) =>
  mount(SurahNav, { props, global: { plugins: [await routerAt('/')] } })

describe('SurahNav', () => {
  it('tanpa prev & next tidak ada link', async () => {
    const wrapper = await factory({ prevSurah: null, nextSurah: null })
    expect(wrapper.findAll('a')).toHaveLength(0)
  })

  it('hanya prev', async () => {
    const wrapper = await factory({ prevSurah: prev, nextSurah: null })
    const links = wrapper.findAll('a')
    expect(links).toHaveLength(1)
    expect(links[0].attributes('href')).toBe('/surah/1')
    expect(links[0].text()).toContain('Al-Fatihah')
    expect(links[0].text()).toContain('7 ayat')
    expect(links[0].text()).toContain('الفاتحة')
  })

  it('hanya next', async () => {
    const wrapper = await factory({ prevSurah: null, nextSurah: next })
    const links = wrapper.findAll('a')
    expect(links).toHaveLength(1)
    expect(links[0].attributes('href')).toBe('/surah/3')
    expect(links[0].text()).toContain("Ali 'Imran")
    expect(links[0].text()).toContain('200 ayat')
  })

  it('prev dan next: prev di kiri, next di kanan, nomor dalam angka Arab', async () => {
    const wrapper = await factory({ prevSurah: prev, nextSurah: next })
    const [left, right] = wrapper.findAll('a')

    expect(left.attributes('href')).toBe('/surah/1')
    expect(left.classes()).toContain('sm:col-start-1')
    expect(left.text()).toContain('١')

    expect(right.attributes('href')).toBe('/surah/3')
    expect(right.classes()).toContain('sm:col-start-2')
    expect(right.text()).toContain('٣')
  })
})
