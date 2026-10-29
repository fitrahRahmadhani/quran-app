import { Pause, Play } from '@lucide/vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SurahPlayer from '@/components/surahs/SurahPlayer.vue'

const factory = (props = {}) =>
  mount(SurahPlayer, {
    props: {
      isPlaying: false,
      isFocusMode: false,
      surahName: 'Al-Fatihah',
      nowPlayingLabel: 'Ayat 2',
      speed: 1,
      currentTime: 0,
      progress: 0,
      duration: 0,
      ...props,
    },
  })

const byLabel = (w, label) => w.get(`button[aria-label="${label}"]`)

describe('SurahPlayer', () => {
  describe('informasi', () => {
    it('menampilkan nama surah dan label yang sedang diputar', () => {
      const text = factory().text()
      expect(text).toContain('Al-Fatihah')
      expect(text).toContain('Ayat 2')
    })

    it('menampilkan kecepatan', () => {
      expect(byLabel(factory({ speed: 1.5 }), 'Ubah kecepatan').text()).toBe('1.5x')
    })

    it('memformat waktu berjalan dan durasi', () => {
      const times = factory({ currentTime: 65, duration: 125 })
        .findAll('span.tabular-nums')
        .map((s) => s.text())
      expect(times).toEqual(['1:05', '2:05'])
    })

    it('menampilkan 0:00 bila durasi belum tersedia (NaN)', () => {
      const times = factory({ currentTime: 0, duration: NaN })
        .findAll('span.tabular-nums')
        .map((s) => s.text())
      expect(times).toEqual(['0:00', '0:00'])
    })

    it('lebar progress bar mengikuti prop progress', () => {
      expect(factory({ progress: 40 }).get('.h-full').attributes('style')).toContain('width: 40%')
    })
  })

  describe('tombol putar/jeda', () => {
    it('saat berhenti: label "Putar" dan ikon Play', () => {
      const wrapper = factory({ isPlaying: false })
      expect(byLabel(wrapper, 'Putar').exists()).toBe(true)
      expect(wrapper.findComponent(Play).exists()).toBe(true)
      expect(wrapper.findComponent(Pause).exists()).toBe(false)
    })

    it('saat diputar: label "Jeda" dan ikon Pause', () => {
      const wrapper = factory({ isPlaying: true })
      expect(byLabel(wrapper, 'Jeda').exists()).toBe(true)
      expect(wrapper.findComponent(Pause).exists()).toBe(true)
      expect(wrapper.findComponent(Play).exists()).toBe(false)
    })
  })

  describe('event', () => {
    it('toggle', async () => {
      const wrapper = factory()
      await byLabel(wrapper, 'Putar').trigger('click')
      expect(wrapper.emitted('toggle')).toHaveLength(1)
    })

    it('skip mundur 5 detik', async () => {
      const wrapper = factory()
      await byLabel(wrapper, 'Mundur 5 detik').trigger('click')
      expect(wrapper.emitted('skip')[0]).toEqual([-5])
    })

    it('skip maju 5 detik', async () => {
      const wrapper = factory()
      await byLabel(wrapper, 'Maju 5 detik').trigger('click')
      expect(wrapper.emitted('skip')[0]).toEqual([5])
    })

    it('cycleSpeed', async () => {
      const wrapper = factory()
      await byLabel(wrapper, 'Ubah kecepatan').trigger('click')
      expect(wrapper.emitted('cycleSpeed')).toHaveLength(1)
    })

    it('seek saat progress bar diklik', async () => {
      const wrapper = factory()
      await wrapper.get('.flex-1.py-2').trigger('click')
      expect(wrapper.emitted('seek')).toHaveLength(1)
    })

    it('seek meneruskan event klik agar parent bisa menghitung posisi', async () => {
      const wrapper = factory()
      await wrapper.get('.flex-1.py-2').trigger('click', { clientX: 42 })
      const [event] = wrapper.emitted('seek')[0]
      expect(event).toBeInstanceOf(MouseEvent)
      expect(event.clientX).toBe(42)
    })
  })

  describe('posisi', () => {
    it('lebih tinggi (bottom-24) saat mode normal', () => {
      expect(factory({ isFocusMode: false }).classes()).toContain('bottom-24')
    })

    it('menempel di bottom-6 saat mode fokus', () => {
      const classes = factory({ isFocusMode: true }).classes()
      expect(classes).toContain('bottom-6')
      expect(classes).not.toContain('bottom-24')
    })
  })
})
