import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SurahBookmark from '@/components/surahs/SurahBookmark.vue'
import { routerAt } from '../../helpers/router'
import { sampleBookmark } from '../../helpers/fixtures'

const factory = async (bookmark) =>
  mount(SurahBookmark, {
    props: { bookmark },
    global: { plugins: [await routerAt('/')] },
  })

describe('SurahBookmark', () => {
  it('tidak merender apa pun bila tidak ada bookmark', async () => {
    const wrapper = await factory(undefined)
    expect(wrapper.find('a').exists()).toBe(false)
    expect(wrapper.text()).toBe('')
  })

  it('menampilkan nama surah, arti, dan nomor ayat', async () => {
    const wrapper = await factory(sampleBookmark)
    expect(wrapper.text()).toContain('Al-Baqarah')
    expect(wrapper.text()).toContain('Sapi • ayat ke 5')
    expect(wrapper.text()).toContain('Lanjut membaca →')
  })

  it('link menuju surah dan ayat yang di-bookmark', async () => {
    const wrapper = await factory(sampleBookmark)
    expect(wrapper.get('a').attributes('href')).toBe('/surah/2#ayat-5')
  })
})
