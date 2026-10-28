import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import BaseBreadcrumb from '@/components/ui/BaseBreadcrumb.vue'
import { routerAt } from '../../helpers/router'

const items = [
  { label: 'Beranda', to: { name: 'beranda' } },
  { label: 'Daftar Surah', to: { name: 'surah' } },
  { label: 'Al-Fatihah' },
]

const factory = async (props = { items }) =>
  mount(BaseBreadcrumb, { props, global: { plugins: [await routerAt('/')] } })

describe('BaseBreadcrumb', () => {
  it('item dengan "to" dirender sebagai link', async () => {
    const wrapper = await factory()
    const links = wrapper.findAll('a')
    expect(links.map((a) => a.attributes('href'))).toEqual(['/', '/surah'])
  })

  it('item terakhir tanpa "to" dirender sebagai teks tebal (bukan link)', async () => {
    const wrapper = await factory()
    const current = wrapper.get('p.font-semibold')
    expect(current.text()).toContain('Al-Fatihah')
    expect(current.element.closest('a')).toBeNull()
  })

  it('item pertama tanpa pemisah, item berikutnya diawali "/"', async () => {
    const wrapper = await factory()
    const labels = wrapper.findAll('p').map((p) => p.text())
    expect(labels).toEqual(['Beranda', '/ Daftar Surah', '/ Al-Fatihah'])
  })

  it('tidak merender apa pun di dalam container bila items kosong', async () => {
    const wrapper = await factory({ items: [] })
    expect(wrapper.findAll('p')).toHaveLength(0)
  })
})
