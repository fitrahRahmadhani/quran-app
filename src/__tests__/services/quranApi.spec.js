import axios from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { quranApi } from '@/services/quranApi'

vi.mock('axios', () => ({ default: { get: vi.fn() } }))

describe('quranApi', () => {
  beforeEach(() => {
    // Gunakan block body: nilai kembalian beforeEach yang berupa fungsi dianggap
    // sebagai cleanup oleh Vitest dan akan dipanggil setelah test selesai.
    vi.mocked(axios.get).mockReset()
  })

  describe('getAllSurah', () => {
    it('memanggil endpoint daftar surah dan mengembalikan res.data.data', async () => {
      const surahs = [{ nomor: 1 }, { nomor: 2 }]
      axios.get.mockResolvedValue({ data: { data: surahs } })

      await expect(quranApi.getAllSurah()).resolves.toEqual(surahs)
      expect(axios.get).toHaveBeenCalledWith('https://equran.id/api/v2/surat')
    })

    it('meneruskan error dari axios', async () => {
      axios.get.mockRejectedValue(new Error('Network Error'))
      await expect(quranApi.getAllSurah()).rejects.toThrow('Network Error')
    })
  })

  describe('getSurah', () => {
    it('memanggil endpoint surah berdasarkan id', async () => {
      const surah = { nomor: 36, namaLatin: 'Yasin' }
      axios.get.mockResolvedValue({ data: { data: surah } })

      await expect(quranApi.getSurah(36)).resolves.toEqual(surah)
      expect(axios.get).toHaveBeenCalledWith('https://equran.id/api/v2/surat/36')
    })

    it('meneruskan error dari axios', async () => {
      axios.get.mockRejectedValue(new Error('404'))
      await expect(quranApi.getSurah(999)).rejects.toThrow('404')
    })
  })
})
