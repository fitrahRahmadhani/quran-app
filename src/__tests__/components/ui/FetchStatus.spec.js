import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import FetchError from '@/components/ui/FetchError.vue'
import FetchLoading from '@/components/ui/FetchLoading.vue'

describe('FetchLoading', () => {
  it('menampilkan spinner dan teks memuat', () => {
    const wrapper = mount(FetchLoading)
    expect(wrapper.get('img').attributes('alt')).toBe('Memuat...')
    expect(wrapper.text()).toContain('Memuat Surah...')
  })
})

describe('FetchError', () => {
  it('menampilkan pesan gagal memuat data', () => {
    const wrapper = mount(FetchError, {
      // TriangleAlert tidak di-import di komponen -> abaikan warning resolve
      global: { config: { warnHandler: () => {} } },
    })
    expect(wrapper.get('h3').text()).toBe('Gagal Memuat Data')
    expect(wrapper.text()).toContain('Silakan coba lagi')
  })
})
