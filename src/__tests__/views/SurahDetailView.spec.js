import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import SurahAmin from '@/components/surahs/SurahAmin.vue'
import SurahAyat from '@/components/surahs/SurahAyat.vue'
import SurahBismillah from '@/components/surahs/SurahBismillah.vue'
import SurahHeader from '@/components/surahs/SurahHeader.vue'
import SurahNav from '@/components/surahs/SurahNav.vue'
import SurahPlayer from '@/components/surahs/SurahPlayer.vue'
import SurahSettings from '@/components/surahs/SurahSettings.vue'
import { quranApi } from '@/services/quranApi'
import { useBookmark } from '@/stores/bookmark'
import { useMinimize } from '@/stores/minimize'
import SurahDetailView from '@/views/surahs/SurahDetailView.vue'
import { makeSurahDetail } from '../helpers/fixtures'
import { routerAt } from '../helpers/router'

vi.mock('@/services/quranApi', () => ({
  quranApi: { getAllSurah: vi.fn(), getSurah: vi.fn() },
}))

/* ---------- Audio palsu (jsdom tidak mengimplementasikan HTMLMediaElement.play) ---------- */
let audios = []
class FakeAudio {
  constructor() {
    this.src = ''
    this.currentTime = 0
    this.duration = 0
    this.playbackRate = 1
    this.play = vi.fn(() => Promise.resolve())
    this.pause = vi.fn()
    audios.push(this)
  }
}
const audio = () => audios[0]

/** Simulasikan browser selesai memuat metadata audio. */
const loadMetadata = (duration) => {
  audio().duration = duration
  audio().onloadedmetadata()
}

/* ---------- Helper mount ---------- */
const factory = async ({ path = '/surah/1', beforeMount } = {}) => {
  const pinia = createPinia()
  setActivePinia(pinia)
  beforeMount?.(pinia)
  const router = await routerAt(path)
  const wrapper = mount(SurahDetailView, { global: { plugins: [pinia, router] } })
  await flushPromises()
  return {
    wrapper,
    router,
    pinia,
    bookmarkStore: useBookmark(pinia),
    minimizeStore: useMinimize(pinia),
  }
}

const ayatAt = (w, i) => w.findAllComponents(SurahAyat)[i]
const clickAyatPlay = (w, i) => ayatAt(w, i).findAll('button').at(-1).trigger('click')
const clickHeaderPlay = (w) => w.getComponent(SurahHeader).get('button').trigger('click')
const player = (w) => w.findComponent(SurahPlayer)
const playerBtn = (w, label) => player(w).get(`button[aria-label="${label}"]`)

describe('SurahDetailView', () => {
  beforeEach(() => {
    localStorage.clear()
    audios = []
    vi.stubGlobal('Audio', FakeAudio)
    window.scrollTo = vi.fn()
    Element.prototype.scrollIntoView = vi.fn()
    vi.mocked(quranApi.getSurah).mockReset().mockImplementation(async () => makeSurahDetail())
  })
  afterEach(() => vi.unstubAllGlobals())

  /* ======================= Pemuatan data ======================= */
  describe('pemuatan data', () => {
    it('menampilkan loading selama data diambil', async () => {
      quranApi.getSurah.mockReturnValue(new Promise(() => {}))
      const { wrapper } = await factory()
      expect(wrapper.text()).toContain('Memuat Surah...')
      expect(wrapper.findComponent(SurahHeader).exists()).toBe(false)
    })

    it('mengambil surah sesuai param id di URL', async () => {
      await factory({ path: '/surah/36' })
      expect(quranApi.getSurah).toHaveBeenCalledWith('36')
    })

    it('menampilkan error bila API gagal', async () => {
      quranApi.getSurah.mockRejectedValue(new Error('Network Error'))
      const { wrapper } = await factory()
      expect(wrapper.text()).toContain('Gagal Memuat Data')
      expect(wrapper.findComponent(SurahHeader).exists()).toBe(false)
      expect(wrapper.findComponent(SurahAyat).exists()).toBe(false)
    })

    it('scroll ke atas bila URL tanpa hash', async () => {
      await factory()
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0 })
    })

    it('mengambil ulang data saat id berubah dan menghentikan audio', async () => {
      const { wrapper, router } = await factory()
      await clickAyatPlay(wrapper, 0)
      expect(player(wrapper).exists()).toBe(true)

      await router.push('/surah/2')
      await flushPromises()

      expect(quranApi.getSurah).toHaveBeenLastCalledWith('2')
      expect(audio().pause).toHaveBeenCalled()
      expect(audio().src).toBe('')
      expect(player(wrapper).exists()).toBe(false)
    })
  })

  describe('SEO', () => {
    it('mengisi title, description, dan canonical dari data surah', async () => {
      await factory({ path: '/surah/1' })
      expect(document.title).toBe(
        'Surat Al-Fatihah (Pembukaan) - Baca Online, Latin & Terjemahan | Quran',
      )
      const description = document.head.querySelector('meta[name="description"]').content
      expect(description).toContain('Surat Al-Fatihah')
      expect(description).toContain('3 ayat')
      expect(description).toContain('Mekah')
      expect(document.head.querySelector('link[rel="canonical"]').href).toMatch(/\/surah\/1$/)
    })

    it('menyertakan breadcrumb JSON-LD tiga tingkat', async () => {
      await factory({ path: '/surah/1' })
      const data = JSON.parse(document.head.querySelector('script[data-seo="breadcrumb"]').textContent)
      expect(data.itemListElement.map((i) => i.name)).toEqual([
        'Beranda',
        'Daftar Surah',
        'Surat Al-Fatihah',
      ])
    })

    it('judul surah tampil sebagai satu-satunya h1', async () => {
      const { wrapper } = await factory()
      expect(wrapper.findAll('h1')).toHaveLength(1)
      expect(wrapper.get('h1').text()).toBe('Al-Fatihah')
    })
  })

  /* ======================= Konten ======================= */
  describe('konten', () => {
    it('menampilkan header surah', async () => {
      const { wrapper } = await factory()
      expect(wrapper.getComponent(SurahHeader).props()).toMatchObject({
        namaLatin: 'Al-Fatihah',
        arti: 'Pembukaan',
        tempatTurun: 'Mekah',
        jumlahAyat: 3,
        nama: 'الفاتحة',
        isPlaying: false,
      })
    })

    it('menampilkan bismillah, semua ayat, dan amin', async () => {
      const { wrapper } = await factory()
      expect(wrapper.findComponent(SurahBismillah).exists()).toBe(true)
      expect(wrapper.findAllComponents(SurahAyat)).toHaveLength(3)
      expect(wrapper.findComponent(SurahAmin).exists()).toBe(true)
    })

    it('setiap ayat memiliki id anchor ayat-N', async () => {
      const { wrapper } = await factory()
      expect(wrapper.findAllComponents(SurahAyat).map((a) => a.attributes('id'))).toEqual([
        'ayat-1',
        'ayat-2',
        'ayat-3',
      ])
    })

    it('breadcrumb memuat nama surah', async () => {
      const { wrapper } = await factory()
      expect(wrapper.find('p.font-semibold.text-primary').text()).toContain('Al-Fatihah')
    })

    it('navigasi: prev false -> null, next diteruskan', async () => {
      const { wrapper } = await factory()
      const props = wrapper.getComponent(SurahNav).props()
      expect(props.prevSurah).toBeNull()
      expect(props.nextSurah).toMatchObject({ nomor: 2, namaLatin: 'Al-Baqarah' })
    })
  })

  /* ======================= Pengaturan baca ======================= */
  describe('pengaturan baca', () => {
    it('default: ukuran sedang, terjemahan & transliterasi aktif, qori 01', async () => {
      const { wrapper } = await factory()
      expect(wrapper.getComponent(SurahSettings).props()).toMatchObject({
        arabicTextSize: 1,
        translateTextSize: 1,
        indonesianTranslate: true,
        transliteration: true,
        qari: '01',
      })
    })

    it('ukuran teks diteruskan sebagai class ke setiap ayat', async () => {
      const { wrapper } = await factory()
      const settings = wrapper.getComponent(SurahSettings)
      expect(ayatAt(wrapper, 0).props('arabicClass')).toBe('text-4xl sm:text-5xl lg:text-6xl')
      expect(ayatAt(wrapper, 0).props('translateClass')).toBe('text-base')

      settings.vm.$emit('update:arabicTextSize', 2)
      settings.vm.$emit('update:translateTextSize', 0)
      await nextTick()

      expect(ayatAt(wrapper, 0).props('arabicClass')).toBe('text-5xl sm:text-6xl lg:text-7xl')
      expect(ayatAt(wrapper, 0).props('translateClass')).toBe('text-sm')
    })

    it('menyembunyikan terjemahan & transliterasi mengubah props ayat', async () => {
      const { wrapper } = await factory()
      const settings = wrapper.getComponent(SurahSettings)
      settings.vm.$emit('update:indonesianTranslate', false)
      settings.vm.$emit('update:transliteration', false)
      await nextTick()

      expect(ayatAt(wrapper, 0).props()).toMatchObject({
        indonesianTranslate: false,
        transliteration: false,
      })
    })
  })

  /* ======================= Bookmark ======================= */
  describe('bookmark', () => {
    const bookmarkBtn = (w, i) => ayatAt(w, i).get('button[aria-pressed]')

    it('klik bookmark menyimpan surah/ayat ke store', async () => {
      const { wrapper, bookmarkStore } = await factory()
      await bookmarkBtn(wrapper, 1).trigger('click')

      expect(bookmarkStore.bookmark).toMatchObject({
        surah: 1,
        ayat: 2,
        arti: 'Pembukaan',
        namaLatin: 'Al-Fatihah',
      })
      expect(typeof bookmarkStore.bookmark.savedAt).toBe('number')
      expect(ayatAt(wrapper, 1).props('bookmarked')).toBe(true)
      expect(ayatAt(wrapper, 0).props('bookmarked')).toBe(false)
    })

    it('klik lagi menghapus bookmark', async () => {
      const { wrapper, bookmarkStore } = await factory()
      await bookmarkBtn(wrapper, 1).trigger('click')
      await bookmarkBtn(wrapper, 1).trigger('click')

      expect(bookmarkStore.bookmark).toBeNull()
      expect(ayatAt(wrapper, 1).props('bookmarked')).toBe(false)
    })

    it('mem-bookmark ayat lain memindahkan bookmark', async () => {
      const { wrapper, bookmarkStore } = await factory()
      await bookmarkBtn(wrapper, 0).trigger('click')
      await bookmarkBtn(wrapper, 2).trigger('click')

      expect(bookmarkStore.bookmark.ayat).toBe(3)
      expect(ayatAt(wrapper, 0).props('bookmarked')).toBe(false)
      expect(ayatAt(wrapper, 2).props('bookmarked')).toBe(true)
    })

    it('menandai ayat yang sudah di-bookmark sebelumnya', async () => {
      const { wrapper } = await factory({
        beforeMount: (pinia) => {
          useBookmark(pinia).bookmark = { surah: 1, ayat: 3, savedAt: 1 }
        },
      })
      expect(ayatAt(wrapper, 2).props('bookmarked')).toBe(true)
      expect(ayatAt(wrapper, 0).props('bookmarked')).toBe(false)
    })
  })

  /* ======================= Ayat aktif (hash) ======================= */
  describe('ayat aktif', () => {
    it('menyorot ayat sesuai hash URL', async () => {
      const { wrapper } = await factory({ path: '/surah/1#ayat-2' })
      expect([0, 1, 2].map((i) => ayatAt(wrapper, i).props('isActive'))).toEqual([
        false,
        true,
        false,
      ])
    })

    it('menyorot ayat yang sedang diputar', async () => {
      const { wrapper } = await factory()
      await clickAyatPlay(wrapper, 2)
      expect([0, 1, 2].map((i) => ayatAt(wrapper, i).props('isActive'))).toEqual([
        false,
        false,
        true,
      ])
    })
  })

  /* ======================= Pemutaran audio ======================= */
  describe('pemutaran audio', () => {
    it('player tidak tampil sebelum ada audio dipilih', async () => {
      const { wrapper } = await factory()
      expect(player(wrapper).exists()).toBe(false)
    })

    it('memutar audio ayat dengan qori terpilih', async () => {
      const { wrapper } = await factory()
      await clickAyatPlay(wrapper, 1)

      expect(audio().src).toBe('a2-01.mp3')
      expect(audio().play).toHaveBeenCalledTimes(1)
      expect(ayatAt(wrapper, 1).props('isPlaying')).toBe(true)
      expect(ayatAt(wrapper, 0).props('isPlaying')).toBe(false)
      expect(player(wrapper).props()).toMatchObject({
        isPlaying: true,
        surahName: 'Al-Fatihah',
        nowPlayingLabel: 'Ayat 2',
      })
    })

    it('memutar surah penuh dari header', async () => {
      const { wrapper } = await factory()
      await clickHeaderPlay(wrapper)

      expect(audio().src).toBe('full-01.mp3')
      expect(wrapper.getComponent(SurahHeader).props('isPlaying')).toBe(true)
      expect(player(wrapper).props('nowPlayingLabel')).toBe('Surah penuh')
    })

    it('klik ayat yang sedang diputar menjeda audio', async () => {
      const { wrapper } = await factory()
      audio().pause.mockClear() // pause() sempat dipanggil saat inisialisasi
      await clickAyatPlay(wrapper, 0)
      await clickAyatPlay(wrapper, 0)

      expect(audio().pause).toHaveBeenCalledTimes(1)
      expect(ayatAt(wrapper, 0).props('isPlaying')).toBe(false)
      expect(player(wrapper).exists()).toBe(true) // player tetap ada saat dijeda
    })

    it('klik ayat yang sama setelah dijeda melanjutkan tanpa mereset src', async () => {
      const { wrapper } = await factory()
      await clickAyatPlay(wrapper, 0)
      audio().currentTime = 12
      await clickAyatPlay(wrapper, 0) // jeda
      await clickAyatPlay(wrapper, 0) // lanjut

      expect(audio().play).toHaveBeenCalledTimes(2)
      expect(audio().src).toBe('a1-01.mp3')
      expect(ayatAt(wrapper, 0).props('isPlaying')).toBe(true)
    })

    it('berpindah ke ayat lain mengganti sumber audio', async () => {
      const { wrapper } = await factory()
      await clickAyatPlay(wrapper, 0)
      await clickAyatPlay(wrapper, 2)

      expect(audio().src).toBe('a3-01.mp3')
      expect(ayatAt(wrapper, 0).props('isPlaying')).toBe(false)
      expect(ayatAt(wrapper, 2).props('isPlaying')).toBe(true)
    })

    it('tombol toggle di player menjeda dan melanjutkan', async () => {
      const { wrapper } = await factory()
      audio().pause.mockClear() // pause() sempat dipanggil saat inisialisasi
      await clickAyatPlay(wrapper, 0)

      await playerBtn(wrapper, 'Jeda').trigger('click')
      expect(audio().pause).toHaveBeenCalledTimes(1)
      expect(player(wrapper).props('isPlaying')).toBe(false)

      await playerBtn(wrapper, 'Putar').trigger('click')
      expect(audio().play).toHaveBeenCalledTimes(2)
      expect(player(wrapper).props('isPlaying')).toBe(true)
    })

    it('tetap berjalan walau audio.play() ditolak browser', async () => {
      const { wrapper } = await factory()
      audio().play.mockRejectedValue(new Error('NotAllowedError'))
      await clickAyatPlay(wrapper, 0)
      await flushPromises()
      expect(player(wrapper).exists()).toBe(true)
    })
  })

  /* ======================= Kontrol player ======================= */
  describe('kontrol player', () => {
    it('metadata audio mengisi durasi', async () => {
      const { wrapper } = await factory()
      await clickAyatPlay(wrapper, 0)
      loadMetadata(125)
      await nextTick()
      expect(player(wrapper).props('duration')).toBe(125)
    })

    it('timeupdate memperbarui waktu berjalan dan progress', async () => {
      const { wrapper } = await factory()
      await clickAyatPlay(wrapper, 0)
      loadMetadata(100)
      audio().currentTime = 25
      audio().ontimeupdate()
      await nextTick()

      expect(player(wrapper).props()).toMatchObject({ currentTime: 25, progress: 25 })
    })

    it('progress 0 selama durasi belum diketahui', async () => {
      const { wrapper } = await factory()
      await clickAyatPlay(wrapper, 0)
      audio().currentTime = 10
      audio().ontimeupdate()
      await nextTick()
      expect(player(wrapper).props('progress')).toBe(0)
    })

    it('skip maju/mundur 5 detik', async () => {
      const { wrapper } = await factory()
      await clickAyatPlay(wrapper, 0)
      loadMetadata(100)
      audio().currentTime = 10

      await playerBtn(wrapper, 'Maju 5 detik').trigger('click')
      expect(audio().currentTime).toBe(15)

      await playerBtn(wrapper, 'Mundur 5 detik').trigger('click')
      expect(audio().currentTime).toBe(10)
    })

    it('skip dibatasi antara 0 dan durasi', async () => {
      const { wrapper } = await factory()
      await clickAyatPlay(wrapper, 0)
      loadMetadata(100)

      audio().currentTime = 3
      await playerBtn(wrapper, 'Mundur 5 detik').trigger('click')
      expect(audio().currentTime).toBe(0)

      audio().currentTime = 98
      await playerBtn(wrapper, 'Maju 5 detik').trigger('click')
      expect(audio().currentTime).toBe(100)
    })

    it('skip tidak berefek bila durasi belum diketahui', async () => {
      const { wrapper } = await factory()
      await clickAyatPlay(wrapper, 0)
      audio().currentTime = 10
      await playerBtn(wrapper, 'Maju 5 detik').trigger('click')
      expect(audio().currentTime).toBe(10)
    })

    it('mengganti kecepatan secara melingkar: 1 -> 1.25 -> 1.5 -> 2 -> 0.75 -> 1', async () => {
      const { wrapper } = await factory()
      await clickAyatPlay(wrapper, 0)

      const seen = []
      for (let i = 0; i < 5; i++) {
        await playerBtn(wrapper, 'Ubah kecepatan').trigger('click')
        seen.push(player(wrapper).props('speed'))
      }
      expect(seen).toEqual([1.25, 1.5, 2, 0.75, 1])
      expect(audio().playbackRate).toBe(1)
    })

    it('kecepatan diterapkan ke audio dan dipertahankan setelah metadata dimuat', async () => {
      const { wrapper } = await factory()
      await clickAyatPlay(wrapper, 0)
      await playerBtn(wrapper, 'Ubah kecepatan').trigger('click') // 1.25
      expect(audio().playbackRate).toBe(1.25)

      audio().playbackRate = 1 // browser mereset saat src berganti
      loadMetadata(60)
      expect(audio().playbackRate).toBe(1.25)
    })

    it('seek mengubah currentTime sesuai posisi klik pada progress bar', async () => {
      const { wrapper } = await factory()
      await clickAyatPlay(wrapper, 0)
      loadMetadata(100)

      const bar = player(wrapper).get('.flex-1.py-2')
      bar.element.getBoundingClientRect = () => ({ left: 10, width: 200 })

      await bar.trigger('click', { clientX: 60 }) // (60 - 10) / 200 = 25%
      expect(audio().currentTime).toBe(25)

      await bar.trigger('click', { clientX: 1000 }) // dibatasi 100%
      expect(audio().currentTime).toBe(100)
    })

    it('seek tidak berefek bila durasi belum diketahui', async () => {
      const { wrapper } = await factory()
      await clickAyatPlay(wrapper, 0)
      audio().currentTime = 7
      await player(wrapper).get('.flex-1.py-2').trigger('click', { clientX: 50 })
      expect(audio().currentTime).toBe(7)
    })
  })

  /* ======================= Auto-lanjut ======================= */
  describe('saat audio selesai', () => {
    it('otomatis lanjut ke ayat berikutnya', async () => {
      const { wrapper } = await factory()
      await clickAyatPlay(wrapper, 0)
      audio().onended()
      await nextTick()

      expect(audio().src).toBe('a2-01.mp3')
      expect(player(wrapper).props('nowPlayingLabel')).toBe('Ayat 2')
      expect(player(wrapper).props('isPlaying')).toBe(true)
    })

    it('memakai qori terpilih untuk ayat berikutnya', async () => {
      const { wrapper } = await factory()
      wrapper.getComponent(SurahSettings).vm.$emit('update:qari', '02')
      await nextTick()
      await clickAyatPlay(wrapper, 0)
      expect(audio().src).toBe('a1-02.mp3')

      audio().onended()
      expect(audio().src).toBe('a2-02.mp3')
    })

    it('berhenti dan menyembunyikan player setelah ayat terakhir', async () => {
      const { wrapper } = await factory()
      await clickAyatPlay(wrapper, 2)
      audio().onended()
      await nextTick()

      expect(player(wrapper).exists()).toBe(false)
      expect(ayatAt(wrapper, 2).props('isPlaying')).toBe(false)
    })

    it('surah penuh tidak lanjut ke ayat, langsung berhenti', async () => {
      const { wrapper } = await factory()
      await clickHeaderPlay(wrapper)
      audio().onended()
      await nextTick()

      expect(audio().src).toBe('full-01.mp3')
      expect(player(wrapper).exists()).toBe(false)
      expect(wrapper.getComponent(SurahHeader).props('isPlaying')).toBe(false)
    })
  })

  /* ======================= Ganti qori ======================= */
  describe('ganti qori', () => {
    const changeQari = async (wrapper, value) => {
      wrapper.getComponent(SurahSettings).vm.$emit('update:qari', value)
      await nextTick()
    }

    it('tidak mengubah audio bila belum ada yang dipilih', async () => {
      const { wrapper } = await factory()
      await changeQari(wrapper, '02')
      expect(audio().src).toBe('')
      expect(audio().play).not.toHaveBeenCalled()
    })

    it('mengganti sumber ayat yang aktif dan melanjutkan pemutaran', async () => {
      const { wrapper } = await factory()
      await clickAyatPlay(wrapper, 0)
      await changeQari(wrapper, '02')

      expect(audio().src).toBe('a1-02.mp3')
      expect(audio().play).toHaveBeenCalledTimes(2)
    })

    it('mengganti sumber surah penuh', async () => {
      const { wrapper } = await factory()
      await clickHeaderPlay(wrapper)
      await changeQari(wrapper, '02')
      expect(audio().src).toBe('full-02.mp3')
    })

    it('tidak otomatis memutar bila sedang dijeda', async () => {
      const { wrapper } = await factory()
      await clickAyatPlay(wrapper, 0)
      await clickAyatPlay(wrapper, 0) // jeda
      await changeQari(wrapper, '02')

      expect(audio().src).toBe('a1-02.mp3')
      expect(audio().play).toHaveBeenCalledTimes(1)
    })
  })

  /* ======================= Mode fokus ======================= */
  describe('mode fokus', () => {
    it('tombol mengaktifkan dan menonaktifkan mode fokus', async () => {
      const { wrapper, minimizeStore } = await factory()

      await wrapper.get('button[aria-label="Mode fokus baca"]').trigger('click')
      expect(minimizeStore.isFocusMode).toBe(true)

      await wrapper.get('button[aria-label="Keluar mode fokus"]').trigger('click')
      expect(minimizeStore.isFocusMode).toBe(false)
    })

    it('menyembunyikan header situs, footer, dan breadcrumb', async () => {
      const { wrapper } = await factory()
      expect(wrapper.find('header').exists()).toBe(true)

      await wrapper.get('button[aria-label="Mode fokus baca"]').trigger('click')

      expect(wrapper.find('header').exists()).toBe(false)
      expect(wrapper.find('footer').exists()).toBe(false)
      expect(wrapper.text()).not.toContain('Daftar Surah')
    })

    it('mode fokus diteruskan ke ayat dan player', async () => {
      const { wrapper, minimizeStore } = await factory()
      await clickAyatPlay(wrapper, 0)
      minimizeStore.toggleFocusMode()
      await nextTick()

      expect(ayatAt(wrapper, 0).props('isFocusMode')).toBe(true)
      expect(player(wrapper).props('isFocusMode')).toBe(true)
      expect(wrapper.getComponent(SurahSettings).props('isFocusMode')).toBe(true)
    })
  })

  /* ======================= Unmount ======================= */
  describe('saat komponen dilepas', () => {
    it('menghentikan audio dan mematikan mode fokus', async () => {
      const { wrapper, minimizeStore } = await factory()
      await clickAyatPlay(wrapper, 0)
      minimizeStore.toggleFocusMode()

      wrapper.unmount()

      expect(audio().pause).toHaveBeenCalled()
      expect(audio().src).toBe('')
      expect(minimizeStore.isFocusMode).toBe(false)
    })
  })
})
