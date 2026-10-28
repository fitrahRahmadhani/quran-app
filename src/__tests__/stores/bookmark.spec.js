import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { useBookmark } from '@/stores/bookmark'

const NOW = 1_700_000_000_000
const item = { surah: 2, ayat: 5, namaLatin: 'Al-Baqarah', arti: 'Sapi' }

describe('bookmark store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    vi.spyOn(Date, 'now').mockReturnValue(NOW)
  })
  afterEach(() => vi.restoreAllMocks())

  it('awalnya null bila storage kosong', () => {
    expect(useBookmark().bookmark).toBeNull()
  })

  it('memuat bookmark yang tersimpan di localStorage', () => {
    const saved = { ...item, savedAt: 1 }
    localStorage.setItem('bookmark', JSON.stringify(saved))
    setActivePinia(createPinia())

    expect(useBookmark().bookmark).toEqual(saved)
  })

  describe('toggleBookmark', () => {
    it('menyimpan item beserta savedAt', () => {
      const store = useBookmark()
      store.toggleBookmark(item)
      expect(store.bookmark).toEqual({ ...item, savedAt: NOW })
    })

    it('menghapus bookmark bila ayat yang sama ditoggle lagi', () => {
      const store = useBookmark()
      store.toggleBookmark(item)
      store.toggleBookmark(item)
      expect(store.bookmark).toBeNull()
    })

    it('mengganti bookmark bila ayat berbeda (hanya satu bookmark)', () => {
      const store = useBookmark()
      store.toggleBookmark(item)
      store.toggleBookmark({ ...item, ayat: 6 })
      expect(store.bookmark).toMatchObject({ surah: 2, ayat: 6 })
    })

    it('mengganti bookmark bila surah berbeda', () => {
      const store = useBookmark()
      store.toggleBookmark(item)
      store.toggleBookmark({ ...item, surah: 3 })
      expect(store.bookmark).toMatchObject({ surah: 3, ayat: 5 })
    })
  })

  describe('isBookmarked', () => {
    it('false bila belum ada bookmark', () => {
      expect(useBookmark().isBookmarked(2, 5)).toBe(false)
    })

    it('true hanya bila surah DAN ayat sama', () => {
      const store = useBookmark()
      store.toggleBookmark(item)
      expect(store.isBookmarked(2, 5)).toBe(true)
      expect(store.isBookmarked(2, 6)).toBe(false)
      expect(store.isBookmarked(3, 5)).toBe(false)
    })
  })

  it('removeBookmark mengosongkan bookmark', () => {
    const store = useBookmark()
    store.toggleBookmark(item)
    store.removeBookmark()
    expect(store.bookmark).toBeNull()
  })

  describe('persistensi', () => {
    it('menyimpan perubahan ke localStorage', async () => {
      const store = useBookmark()
      store.toggleBookmark(item)
      await nextTick()

      expect(JSON.parse(localStorage.getItem('bookmark'))).toEqual({ ...item, savedAt: NOW })
    })

    it('menghapus key di localStorage saat bookmark dihapus', async () => {
      const store = useBookmark()
      store.toggleBookmark(item)
      await nextTick()
      store.removeBookmark()
      await nextTick()

      expect(localStorage.getItem('bookmark')).toBeNull()
    })
  })
})
