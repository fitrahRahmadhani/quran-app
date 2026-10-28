import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { bookmarkStorage } from '@/services/bookmarkStorage'

const KEY = 'bookmark'

describe('bookmarkStorage', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => vi.restoreAllMocks())

  describe('load', () => {
    it('mengembalikan null bila belum ada data', () => {
      expect(bookmarkStorage.load()).toBeNull()
    })

    it('mengembalikan objek yang tersimpan', () => {
      const data = { surah: 1, ayat: 3, savedAt: 123 }
      localStorage.setItem(KEY, JSON.stringify(data))
      expect(bookmarkStorage.load()).toEqual(data)
    })

    it.each([
      ['JSON rusak', '{not json'],
      ['array', '[1,2]'],
      ['string', '"teks"'],
      ['angka', '42'],
      ['null', 'null'],
    ])('mengembalikan null untuk data berupa %s', (_label, raw) => {
      localStorage.setItem(KEY, raw)
      expect(bookmarkStorage.load()).toBeNull()
    })

    it('mengembalikan null bila localStorage melempar error', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('denied')
      })
      expect(bookmarkStorage.load()).toBeNull()
    })
  })

  describe('save', () => {
    it('menyimpan bookmark sebagai JSON', () => {
      const data = { surah: 2, ayat: 5 }
      bookmarkStorage.save(data)
      expect(JSON.parse(localStorage.getItem(KEY))).toEqual(data)
    })

    it('menimpa data lama', () => {
      bookmarkStorage.save({ surah: 1 })
      bookmarkStorage.save({ surah: 2 })
      expect(JSON.parse(localStorage.getItem(KEY))).toEqual({ surah: 2 })
    })

    it('menghapus key bila nilainya null', () => {
      bookmarkStorage.save({ surah: 1 })
      bookmarkStorage.save(null)
      expect(localStorage.getItem(KEY)).toBeNull()
    })

    it('tidak melempar error bila localStorage penuh/ditolak', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('quota')
      })
      expect(() => bookmarkStorage.save({ surah: 1 })).not.toThrow()
    })
  })
})
