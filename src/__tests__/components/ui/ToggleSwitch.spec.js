import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ToggleSwitch from '@/components/ui/ToggleSwitch.vue'

const factory = (modelValue) => {
  const wrapper = mount(ToggleSwitch, {
    props: {
      modelValue,
      'onUpdate:modelValue': (v) => wrapper.setProps({ modelValue: v }),
    },
  })
  return wrapper
}

describe('ToggleSwitch', () => {
  it('memiliki role switch dan aria-checked sesuai nilai', () => {
    const off = factory(false)
    expect(off.attributes('role')).toBe('switch')
    expect(off.attributes('aria-checked')).toBe('false')
    expect(off.classes()).toContain('bg-gray-300')

    const on = factory(true)
    expect(on.attributes('aria-checked')).toBe('true')
    expect(on.classes()).toContain('bg-primary')
  })

  it('meng-emit update:modelValue dan berganti state saat diklik', async () => {
    const wrapper = factory(false)

    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([true])
    expect(wrapper.attributes('aria-checked')).toBe('true')

    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')[1]).toEqual([false])
    expect(wrapper.attributes('aria-checked')).toBe('false')
  })
})
