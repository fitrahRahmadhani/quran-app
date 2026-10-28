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

  // Saat ini template memakai id="{{ id }}" (string literal, bukan binding).
  it.todo('atribut id mengikuti prop id (gunakan :id="id")')
})
