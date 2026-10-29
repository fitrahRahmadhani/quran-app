import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import BaseBadge from '@/components/ui/BaseBadge.vue'

describe('BaseBadge', () => {
  it('menampilkan title di dalam button', () => {
    const wrapper = mount(BaseBadge, { props: { title: 'Yasin' } })
    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.text()).toBe('Yasin')
  })

  it('meneruskan event click ke parent', async () => {
    const onClick = vi.fn()
    const wrapper = mount(BaseBadge, { props: { title: 'Yasin' }, attrs: { onClick } })
    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('atribut id mengikuti prop id', () => {
    const wrapper = mount(BaseBadge, { props: { id: 'surah-36', title: 'Yasin' } })
    expect(wrapper.attributes('id')).toBe('surah-36')
  })
})
