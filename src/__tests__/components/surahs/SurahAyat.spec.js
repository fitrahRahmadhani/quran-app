import { Bookmark, Pause, Play } from '@lucide/vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SurahAyat from '@/components/surahs/SurahAyat.vue'

const ayat = {
  nomorAyat: 3,
  teksArab: 'الرَّحْمٰنِ الرَّحِيْمِۙ',
  teksLatin: 'Ar-rahmanir-rahim',
  teksIndonesia: 'Yang Maha Pengasih, Maha Penyayang',
}

const factory = (props = {}) =>
  mount(SurahAyat, {
    props: {
      ayat,
      arabicClass: 'text-4xl',
      translateClass: 'text-base',
      transliteration: true,
      indonesianTranslate: true,
      ...props,
    },
  })

const bookmarkBtn = (w) => w.get('button[aria-pressed]')
const playBtn = (w) => w.findAll('button').at(-1)

describe('SurahAyat', () => {
  describe('konten', () => {
    it('menampilkan teks Arab beserta nomor ayat dalam angka Arab', () => {
      const wrapper = factory()
      const arab = wrapper.get('p[dir="rtl"]')
      expect(arab.text()).toContain(ayat.teksArab)
      expect(arab.text()).toContain('٣')
      expect(arab.attributes('lang')).toBe('ar')
    })

    it('menerapkan arabicClass pada teks Arab dan translateClass pada terjemahan', () => {
      const wrapper = factory({ arabicClass: 'ukuran-arab', translateClass: 'ukuran-terjemah' })
      expect(wrapper.get('p[dir="rtl"]').classes()).toContain('ukuran-arab')
      expect(wrapper.findAll('p').find((p) => p.text() === ayat.teksIndonesia).classes()).toContain(
        'ukuran-terjemah',
      )
    })

    it('transliterasi dan terjemahan tampil sesuai prop', () => {
      const both = factory().text()
      expect(both).toContain(ayat.teksLatin)
      expect(both).toContain(ayat.teksIndonesia)

      const none = factory({ transliteration: false, indonesianTranslate: false }).text()
      expect(none).not.toContain(ayat.teksLatin)
      expect(none).not.toContain(ayat.teksIndonesia)
    })

    it('bisa menampilkan hanya salah satu dari transliterasi/terjemahan', () => {
      const onlyLatin = factory({ indonesianTranslate: false }).text()
      expect(onlyLatin).toContain(ayat.teksLatin)
      expect(onlyLatin).not.toContain(ayat.teksIndonesia)

      const onlyId = factory({ transliteration: false }).text()
      expect(onlyId).not.toContain(ayat.teksLatin)
      expect(onlyId).toContain(ayat.teksIndonesia)
    })
  })

  describe('styling kondisional', () => {
    it('aktif -> background sorot', () => {
      expect(factory({ isActive: true }).classes()).toContain('bg-primary/10')
      expect(factory({ isActive: false }).classes()).not.toContain('bg-primary/10')
    })

    it('scroll margin berbeda pada mode fokus', () => {
      expect(factory({ isFocusMode: true }).classes()).toContain('scroll-mt-6')
      expect(factory({ isFocusMode: false }).classes()).toContain('scroll-mt-28')
    })
  })

  describe('bookmark', () => {
    it('belum di-bookmark', () => {
      const wrapper = factory({ bookmarked: false })
      expect(bookmarkBtn(wrapper).attributes('aria-label')).toBe('Tambah bookmark')
      expect(bookmarkBtn(wrapper).attributes('aria-pressed')).toBe('false')
      expect(wrapper.text()).not.toContain('Hapus Bookmark')
      expect(wrapper.findComponent(Bookmark).exists()).toBe(true)
    })

    it('sudah di-bookmark', () => {
      const wrapper = factory({ bookmarked: true })
      expect(bookmarkBtn(wrapper).attributes('aria-label')).toBe('Hapus bookmark')
      expect(bookmarkBtn(wrapper).attributes('aria-pressed')).toBe('true')
      expect(wrapper.text()).toContain('Hapus Bookmark')
    })

    it('klik meng-emit "bookmark"', async () => {
      const wrapper = factory()
      await bookmarkBtn(wrapper).trigger('click')
      expect(wrapper.emitted('bookmark')).toHaveLength(1)
    })
  })

  describe('audio', () => {
    it('menampilkan ikon Play saat tidak diputar', () => {
      const wrapper = factory({ isPlaying: false })
      expect(wrapper.findComponent(Play).exists()).toBe(true)
      expect(wrapper.findComponent(Pause).exists()).toBe(false)
    })

    it('menampilkan ikon Pause saat sedang diputar', () => {
      const wrapper = factory({ isPlaying: true })
      expect(wrapper.findComponent(Pause).exists()).toBe(true)
      expect(wrapper.findComponent(Play).exists()).toBe(false)
    })

    it('klik tombol audio meng-emit "play"', async () => {
      const wrapper = factory()
      await playBtn(wrapper).trigger('click')
      expect(wrapper.emitted('play')).toHaveLength(1)
      expect(wrapper.emitted('bookmark')).toBeUndefined()
    })
  })
})
