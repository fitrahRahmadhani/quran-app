import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SurahCard from '@/components/surahs/SurahCard.vue'
import { routerAt } from '../../helpers/router'

const factory = async (props = {}) =>
  mount(SurahCard, {
    props: {
      id: 1,
      number: 1,
      title: 'Al-Fatihah',
      arabicTitle: 'الفاتحة',
      numberOfVerses: 7,
      meaning: 'Pembukaan',
      ...props,
    },
    global: { plugins: [await routerAt('/')] },
  })

describe('SurahCard', () => {
  it('menampilkan judul, arti, jumlah ayat, dan judul Arab', async () => {
    const wrapper = await factory()
    const text = wrapper.text()
    expect(text).toContain('Al-Fatihah')
    expect(text).toContain('Pembukaan • 7 ayat')
    expect(text).toContain('الفاتحة')
  })

  it('menampilkan nomor surah dalam angka Arab', async () => {
    const wrapper = await factory({ number: 114 })
    expect(wrapper.text()).toContain('١١٤')
  })

  it('link mengarah ke halaman baca surah berdasarkan id', async () => {
    const wrapper = await factory({ id: 36 })
    expect(wrapper.get('a').attributes('href')).toBe('/surah/36')
  })
})
