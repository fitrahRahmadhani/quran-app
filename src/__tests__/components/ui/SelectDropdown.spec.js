import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import SelectDropdown from '@/components/ui/SelectDropdown.vue'

enableAutoUnmount(afterEach)

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
]

const factory = (props = {}) =>
  mount(SelectDropdown, {
    props: { options, modelValue: 'a', ...props },
    attachTo: document.body,
  })

const key = (wrapper, k) => wrapper.get('button').trigger('keydown', { key: k })
const lastEmit = (wrapper) => wrapper.emitted('update:modelValue').at(-1)

describe('SelectDropdown', () => {
  describe('tampilan', () => {
    it('menampilkan label opsi terpilih', () => {
      expect(factory().get('button').text()).toBe('Alpha')
    })

    it('menampilkan placeholder default bila tidak ada yang cocok', () => {
      expect(factory({ modelValue: 'zzz' }).get('button').text()).toBe('Pilih salah satu')
    })

    it('menampilkan placeholder kustom', () => {
      const wrapper = factory({ modelValue: undefined, placeholder: 'Pilih qori' })
      expect(wrapper.get('button').text()).toBe('Pilih qori')
    })

    it('daftar opsi tertutup di awal', () => {
      const wrapper = factory()
      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
      expect(wrapper.get('[role="combobox"]').attributes('aria-expanded')).toBe('false')
    })
  })

  describe('mouse', () => {
    it('klik tombol membuka lalu menutup daftar', async () => {
      const wrapper = factory()
      await wrapper.get('button').trigger('click')
      expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
      expect(wrapper.get('[role="combobox"]').attributes('aria-expanded')).toBe('true')
      expect(wrapper.findAll('[role="option"]')).toHaveLength(3)

      await wrapper.get('button').trigger('click')
      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    })

    it('menandai opsi terpilih lewat aria-selected', async () => {
      const wrapper = factory({ modelValue: 'b' })
      await wrapper.get('button').trigger('click')
      const selected = wrapper.findAll('[role="option"]').map((o) => o.attributes('aria-selected'))
      expect(selected).toEqual(['false', 'true', 'false'])
    })

    it('klik opsi meng-emit value dan menutup daftar', async () => {
      const wrapper = factory()
      await wrapper.get('button').trigger('click')
      await wrapper.findAll('[role="option"]')[2].trigger('click')

      expect(lastEmit(wrapper)).toEqual(['c'])
      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    })

    it('hover menyorot opsi', async () => {
      const wrapper = factory()
      await wrapper.get('button').trigger('click')
      const items = wrapper.findAll('[role="option"]')

      await items[2].trigger('mouseenter')
      expect(items[2].classes()).toContain('bg-primary/10')
      expect(items[0].classes()).not.toContain('bg-primary/10')
    })

    it('klik di luar menutup daftar', async () => {
      const wrapper = factory()
      await wrapper.get('button').trigger('click')
      document.body.click()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    })

    it('klik di dalam komponen tidak dianggap klik di luar', async () => {
      const wrapper = factory()
      await wrapper.get('button').trigger('click')
      await wrapper.get('[role="listbox"]').trigger('click')
      expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
    })
  })

  describe('keyboard', () => {
    it.each(['Enter', ' ', 'ArrowDown'])('"%s" membuka daftar saat tertutup', async (k) => {
      const wrapper = factory()
      await key(wrapper, k)
      expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('opsi aktif awal adalah opsi terpilih', async () => {
      const wrapper = factory({ modelValue: 'b' })
      await key(wrapper, 'Enter')
      expect(wrapper.findAll('[role="option"]')[1].classes()).toContain('bg-primary/10')
    })

    it('ArrowDown + Enter memilih opsi berikutnya', async () => {
      const wrapper = factory()
      await key(wrapper, 'ArrowDown') // buka
      await key(wrapper, 'ArrowDown') // ke Beta
      await key(wrapper, 'Enter')
      expect(lastEmit(wrapper)).toEqual(['b'])
      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    })

    it('ArrowUp tidak melewati opsi pertama', async () => {
      const wrapper = factory()
      await key(wrapper, 'Enter')
      await key(wrapper, 'ArrowUp')
      await key(wrapper, 'Enter')
      expect(lastEmit(wrapper)).toEqual(['a'])
    })

    it('ArrowDown tidak melewati opsi terakhir', async () => {
      const wrapper = factory({ modelValue: 'c' })
      await key(wrapper, 'Enter')
      await key(wrapper, 'ArrowDown')
      await key(wrapper, 'Enter')
      expect(lastEmit(wrapper)).toEqual(['c'])
    })

    it.each(['Escape', 'Tab'])('"%s" menutup daftar', async (k) => {
      const wrapper = factory()
      await key(wrapper, 'Enter')
      await key(wrapper, k)
      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    })
  })

  describe('disabled', () => {
    it('tombol disabled dan tidak bisa dibuka', async () => {
      const wrapper = factory({ disabled: true })
      expect(wrapper.get('button').attributes('disabled')).toBeDefined()
      await wrapper.get('button').trigger('click')
      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    })
  })
})
