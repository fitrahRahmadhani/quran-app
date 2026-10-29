import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TheFooter from '@/components/ui/TheFooter.vue'
import { routerAt } from '../../helpers/router'

const factory = async () => {
  const router = await routerAt('/')
  return mount(TheFooter, { global: { plugins: [router] } })
}

describe('TheFooter', () => {
  it('menampilkan brand, judul menu jelajah, dan copyright tahun berjalan', async () => {
    const wrapper = await factory()
    const text = wrapper.text()

    expect(wrapper.find('footer').exists()).toBe(true)
    expect(text).toContain('Quran')
    expect(wrapper.get('h2').text()).toBe('Jelajah')
    expect(text).toContain(`© ${new Date().getFullYear()} Quran`)
  })

  it('menu jelajah berupa tautan ke Beranda, Daftar Surah, dan Daftar Juz', async () => {
    const wrapper = await factory()
    const links = wrapper.get('nav[aria-label="Navigasi footer"]').findAll('a')

    expect(links.map((a) => a.text())).toEqual(['Beranda', 'Daftar Surah', 'Daftar Juz'])
    expect(links.map((a) => a.attributes('href'))).toEqual(['/', '/surah', '/juz'])
  })

  it('mencantumkan sumber data dengan tautan eksternal yang aman', async () => {
    const wrapper = await factory()
    const source = wrapper.get('a[href="https://equran.id"]')

    expect(source.attributes('target')).toBe('_blank')
    expect(source.attributes('rel')).toContain('noopener')
  })

  it('memberi ruang bawah di mobile agar tidak tertutup navigasi bawah', async () => {
    const wrapper = await factory()
    expect(wrapper.get('footer').classes().join(' ')).toContain('pb-[calc(5rem')
  })
})
