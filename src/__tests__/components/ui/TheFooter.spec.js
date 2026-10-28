import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TheFooter from '@/components/ui/TheFooter.vue'

describe('TheFooter', () => {
  it('menampilkan brand, menu jelajah, dan copyright', () => {
    const wrapper = mount(TheFooter)
    const text = wrapper.text()

    expect(wrapper.find('footer').exists()).toBe(true)
    expect(text).toContain('Quran')
    expect(text).toContain('Jelajah')
    expect(text).toContain('Beranda')
    expect(text).toContain('Daftar Surah')
    expect(text).toContain('Daftar Juz')
    expect(text).toContain('© 2026 Quran')
  })
})
