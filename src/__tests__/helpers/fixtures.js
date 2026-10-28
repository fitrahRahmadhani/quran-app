export const surahList = [
  {
    nomor: 1,
    nama: 'الفاتحة',
    namaLatin: 'Al-Fatihah',
    jumlahAyat: 7,
    tempatTurun: 'Mekah',
    arti: 'Pembukaan',
  },
  {
    nomor: 2,
    nama: 'البقرة',
    namaLatin: 'Al-Baqarah',
    jumlahAyat: 286,
    tempatTurun: 'Madinah',
    arti: 'Sapi',
  },
  {
    nomor: 36,
    nama: 'يس',
    namaLatin: 'Yasin',
    jumlahAyat: 83,
    tempatTurun: 'Mekah',
    arti: 'Yasin',
  },
]

export const makeSurahDetail = () => ({
  nomor: 1,
  nama: 'الفاتحة',
  namaLatin: 'Al-Fatihah',
  jumlahAyat: 3,
  tempatTurun: 'Mekah',
  arti: 'Pembukaan',
  audioFull: { '01': 'full-01.mp3', '02': 'full-02.mp3' },
  ayat: [1, 2, 3].map((n) => ({
    nomorAyat: n,
    teksArab: `arab-${n}`,
    teksLatin: `latin-${n}`,
    teksIndonesia: `arti-${n}`,
    audio: { '01': `a${n}-01.mp3`, '02': `a${n}-02.mp3` },
  })),
  suratSebelumnya: false,
  suratSelanjutnya: {
    nomor: 2,
    nama: 'البقرة',
    namaLatin: 'Al-Baqarah',
    jumlahAyat: 286,
  },
})

export const sampleBookmark = {
  surah: 2,
  ayat: 5,
  namaLatin: 'Al-Baqarah',
  arti: 'Sapi',
}
