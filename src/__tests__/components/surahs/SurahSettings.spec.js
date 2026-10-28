import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SurahSettings from '@/components/surahs/SurahSettings.vue'

const factory = (props = {}) =>
  mount(SurahSettings, {
    props: {
      isFocusMode: false,
      arabicTextSize: 1,
      arabicTextSizeList: [{ name: 'Kecil' }, { name: 'Sedang' }, { name: 'Besar' }],
      translateTextSize: 1,
      translateTextSizeList: [{ name: 'XS' }, { name: 'M' }, { name: 'XL' }],
      indonesianTranslate: true,
      transliteration: false,
      qari: '01',
      qariOptions: [
        { value: '01', label: 'Abdullah Al-Juhany' },
        { value: '02', label: 'Abdul Muhsin Al-Qasim' },
      ],
      ...props,
    },
  })

// Urutan section: [0] ukuran Arab, [1] ukuran terjemahan, [2] qori
const sections = (w) => w.findAll('div.space-y-2')
const stepButtons = (w, i) => sections(w)[i].findAll('button')
const switches = (w) => w.findAll('[role="switch"]')

describe('SurahSettings', () => {
  describe('ukuran teks', () => {
    it('menampilkan nama ukuran aktif untuk teks Arab dan terjemahan', () => {
      const text = factory({ arabicTextSize: 0, translateTextSize: 2 }).text()
      expect(text).toContain('Kecil')
      expect(text).toContain('XL')
    })

    it('tombol + / - teks Arab meng-emit indeks baru', async () => {
      const wrapper = factory({ arabicTextSize: 1 })
      const [minus, plus] = stepButtons(wrapper, 0)

      await plus.trigger('click')
      await minus.trigger('click')
      expect(wrapper.emitted('update:arabicTextSize')).toEqual([[2], [0]])
    })

    it('tombol + / - terjemahan meng-emit indeks baru', async () => {
      const wrapper = factory({ translateTextSize: 1 })
      const [minus, plus] = stepButtons(wrapper, 1)

      await plus.trigger('click')
      await minus.trigger('click')
      expect(wrapper.emitted('update:translateTextSize')).toEqual([[2], [0]])
    })

    it('tombol - dinonaktifkan di ukuran terkecil', async () => {
      const wrapper = factory({ arabicTextSize: 0, translateTextSize: 0 })
      for (const i of [0, 1]) {
        const [minus, plus] = stepButtons(wrapper, i)
        expect(minus.attributes('disabled')).toBeDefined()
        expect(plus.attributes('disabled')).toBeUndefined()
      }
      await stepButtons(wrapper, 0)[0].trigger('click')
      expect(wrapper.emitted('update:arabicTextSize')).toBeUndefined()
    })

    it('tombol + dinonaktifkan di ukuran terbesar', async () => {
      const wrapper = factory({ arabicTextSize: 2, translateTextSize: 2 })
      for (const i of [0, 1]) {
        const [minus, plus] = stepButtons(wrapper, i)
        expect(plus.attributes('disabled')).toBeDefined()
        expect(minus.attributes('disabled')).toBeUndefined()
      }
      await stepButtons(wrapper, 1)[1].trigger('click')
      expect(wrapper.emitted('update:translateTextSize')).toBeUndefined()
    })
  })

  describe('toggle', () => {
    it('mencerminkan nilai awal terjemahan & transliterasi', () => {
      const wrapper = factory({ indonesianTranslate: true, transliteration: false })
      expect(switches(wrapper).map((s) => s.attributes('aria-checked'))).toEqual(['true', 'false'])
    })

    it('toggle terjemahan meng-emit update:indonesianTranslate', async () => {
      const wrapper = factory({ indonesianTranslate: true })
      await switches(wrapper)[0].trigger('click')
      expect(wrapper.emitted('update:indonesianTranslate')[0]).toEqual([false])
    })

    it('toggle transliterasi meng-emit update:transliteration', async () => {
      const wrapper = factory({ transliteration: false })
      await switches(wrapper)[1].trigger('click')
      expect(wrapper.emitted('update:transliteration')[0]).toEqual([true])
    })
  })

  describe('qori', () => {
    it('menampilkan qori terpilih', () => {
      expect(factory({ qari: '02' }).get('[role="combobox"]').text()).toBe('Abdul Muhsin Al-Qasim')
    })

    it('memilih qori lain meng-emit update:qari', async () => {
      const wrapper = factory({ qari: '01' })
      await wrapper.get('[role="combobox"]').trigger('click')
      await wrapper.findAll('[role="option"]')[1].trigger('click')
      expect(wrapper.emitted('update:qari')[0]).toEqual(['02'])
    })
  })

  describe('panel (mobile)', () => {
    const panel = (w) => w.get('div.absolute.bottom-14')

    it('panel tersembunyi di awal tanpa backdrop', () => {
      const wrapper = factory()
      expect(panel(wrapper).classes()).toContain('hidden')
      expect(wrapper.find('div.fixed.inset-0').exists()).toBe(false)
    })

    it('tombol pengaturan membuka panel dan backdrop', async () => {
      const wrapper = factory()
      await wrapper.get('button[aria-label="Pengaturan baca"]').trigger('click')
      expect(panel(wrapper).classes()).toContain('flex')
      expect(panel(wrapper).classes()).not.toContain('hidden')
      expect(wrapper.find('div.fixed.inset-0').exists()).toBe(true)
    })

    it('klik backdrop menutup panel', async () => {
      const wrapper = factory()
      await wrapper.get('button[aria-label="Pengaturan baca"]').trigger('click')
      await wrapper.get('div.fixed.inset-0').trigger('click')
      expect(panel(wrapper).classes()).toContain('hidden')
      expect(wrapper.find('div.fixed.inset-0').exists()).toBe(false)
    })

    it('tombol pengaturan menutup panel bila diklik lagi', async () => {
      const wrapper = factory()
      const btn = wrapper.get('button[aria-label="Pengaturan baca"]')
      await btn.trigger('click')
      await btn.trigger('click')
      expect(panel(wrapper).classes()).toContain('hidden')
    })
  })

  it('disembunyikan di desktop (lg:hidden) saat mode fokus', () => {
    expect(factory({ isFocusMode: true }).classes()).toContain('lg:hidden')
    expect(factory({ isFocusMode: false }).classes()).not.toContain('lg:hidden')
  })
})
