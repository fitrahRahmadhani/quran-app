import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SurahAmin from '@/components/surahs/SurahAmin.vue'
import SurahBismillah from '@/components/surahs/SurahBismillah.vue'

describe('SurahAmin', () => {
  it('menampilkan teks Arab, latin, dan artinya', () => {
    const text = mount(SurahAmin).text()
    expect(text).toContain('آمِيْن')
    expect(text).toContain('Aamiin')
    expect(text).toContain('Ya Allah, kabulkanlah')
  })
})

describe('SurahBismillah', () => {
  it('menampilkan gambar bismillah dengan alt yang benar', () => {
    const img = mount(SurahBismillah).get('img')
    expect(img.attributes('alt')).toBe('Bismillahirrahmanirrahim')
    expect(img.attributes('src')).toBeTruthy()
  })
})
