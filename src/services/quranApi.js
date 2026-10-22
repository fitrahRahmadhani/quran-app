import axios from 'axios'

export const quranApi = {
  async getSurah(id) {
    const res = await axios.get(`https://equran.id/api/v2/surat/${id}`)
    return res.data.data
  },

  async getAllSurah() {
    const res = await axios.get('https://equran.id/api/v2/surat')
    return res.data.data
  },
}
