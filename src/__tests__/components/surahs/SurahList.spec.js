import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SurahCard from '@/components/surahs/SurahCard.vue'
import SurahList from '@/components/surahs/SurahList.vue'
import { routerAt } from '../../helpers/router'
import { surahList } from '../../helpers/fixtures'

const factory = async (surahs) =>
  mount(SurahList, { props: { surahs }, global: { plugins: [await routerAt('/')] } })

describe('SurahList', () => {
  it('merender satu SurahCard per surah', async () => {
    const wrapper = await factory(surahList)
    expect(wrapper.findAllComponents(SurahCard)).toHaveLength(surahList.length)
  })

  it('memetakan field API ke props SurahCard', async () => {
    const wrapper = await factory(surahList)
    expect(wrapper.findAllComponents(SurahCard)[2].props()).toEqual({
      id: 36,
      number: 36,
      title: 'Yasin',
      arabicTitle: 'يس',
      numberOfVerses: 83,
      meaning: 'Yasin',
    })
  })

  it('tidak merender kartu bila daftar kosong', async () => {
    const wrapper = await factory([])
    expect(wrapper.findAllComponents(SurahCard)).toHaveLength(0)
  })
})
