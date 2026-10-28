import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SurahHeader from '@/components/surahs/SurahHeader.vue'

const factory = (props = {}) =>
  mount(SurahHeader, {
    props: {
      namaLatin: 'Al-Fatihah',
      arti: 'Pembukaan',
      tempatTurun: 'Mekah',
      jumlahAyat: 7,
      nama: 'الفاتحة',
      isPlaying: false,
      ...props,
    },
  })

describe('SurahHeader', () => {
  it('menampilkan informasi surah', () => {
    const wrapper = factory()
    expect(wrapper.text()).toContain('Al-Fatihah')
    expect(wrapper.text()).toContain('Pembukaan • Mekah • 7 Ayat')
    expect(wrapper.get('p[dir="rtl"]').text()).toBe('الفاتحة')
  })

  it('tombol berlabel "Putar Surah" saat tidak diputar', () => {
    expect(factory({ isPlaying: false }).get('button').text()).toBe('Putar Surah')
  })

  it('tombol berlabel "Jeda" saat sedang diputar', () => {
    expect(factory({ isPlaying: true }).get('button').text()).toBe('Jeda')
  })

  it('klik tombol meng-emit "play"', async () => {
    const wrapper = factory()
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('play')).toHaveLength(1)
  })
})
