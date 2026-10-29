import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import BaseTitle from '@/components/ui/BaseTitle.vue'

describe('BaseTitle', () => {
  it('merender title di h1 dan teks deskripsi', () => {
    const wrapper = mount(BaseTitle, { props: { title: 'Daftar Juz' } })
    expect(wrapper.get('h1').text()).toBe('Daftar Juz')
    expect(wrapper.get('p').text()).toContain('Temukan surah yang ingin kamu baca')
  })
})
