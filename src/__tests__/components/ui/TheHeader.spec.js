import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TheHeader from '@/components/ui/TheHeader.vue'
import { routerAt } from '../../helpers/router'

const factory = async (path = '/') => {
  const router = await routerAt(path)
  const wrapper = mount(TheHeader, { global: { plugins: [router] } })
  return { wrapper, router }
}

const linkByText = (root, text) => root.findAll('a').find((a) => a.text() === text)

describe('TheHeader', () => {
  describe('navigasi', () => {
    it('logo mengarah ke beranda', async () => {
      const { wrapper } = await factory()
      const logo = wrapper.get('header a')
      expect(logo.attributes('href')).toBe('/')
      expect(logo.text()).toContain('Quran')
    })

    it('navigasi mobile berisi 3 menu dengan tujuan yang benar', async () => {
      const { wrapper } = await factory()
      const links = wrapper.get('#menu-mobile').findAll('a')
      expect(links.map((a) => [a.text(), a.attributes('href')])).toEqual([
        ['Beranda', '/'],
        ['Daftar Surah', '/surah'],
        ['Daftar Juz', '/juz'],
      ])
    })

    it('navigasi desktop dan tablet memiliki menu yang sama', async () => {
      const { wrapper } = await factory()
      const desktop = wrapper.findAll('header nav a')
      const tablet = wrapper.get('#menu-tablet').findAll('a')
      expect(desktop).toHaveLength(3)
      expect(tablet.map((a) => a.text())).toEqual(['Beranda', 'Daftar Surah', 'Daftar Juz'])
    })
  })

  describe('menu aktif', () => {
    it.each([
      ['/', 'Beranda'],
      ['/surah', 'Daftar Surah'],
      ['/surah/36', 'Daftar Surah'],
      ['/juz', 'Daftar Juz'],
    ])('di %s menu "%s" aktif (satu-satunya)', async (path, label) => {
      const { wrapper } = await factory(path)

      const mobileActive = wrapper.get('#menu-mobile').findAll('a.is-active')
      expect(mobileActive.map((a) => a.text())).toEqual([label])

      const desktopActive = wrapper
        .findAll('header nav a')
        .filter((a) => a.classes().includes('!text-primary'))
      expect(desktopActive.map((a) => a.text())).toEqual([label])

      const tabletActive = wrapper
        .get('#menu-tablet')
        .findAll('a')
        .filter((a) => a.classes().includes('!bg-primary/5'))
      expect(tabletActive.map((a) => a.text())).toEqual([label])
    })

    it('Beranda tidak aktif di halaman lain', async () => {
      const { wrapper } = await factory('/juz')
      const beranda = linkByText(wrapper.get('#menu-mobile'), 'Beranda')
      expect(beranda.classes()).not.toContain('is-active')
    })

    it('berubah mengikuti perpindahan route', async () => {
      const { wrapper, router } = await factory('/')
      await router.push('/juz')
      await flushPromises()
      expect(wrapper.get('#menu-mobile').get('a.is-active').text()).toBe('Daftar Juz')
    })
  })

  describe('menu tablet', () => {
    const toggle = (wrapper) => wrapper.get('button[aria-controls="menu-tablet"]')
    const isHidden = (wrapper) => wrapper.get('#menu-tablet').element.style.display === 'none'

    it('tertutup di awal', async () => {
      const { wrapper } = await factory()
      expect(isHidden(wrapper)).toBe(true)
      expect(toggle(wrapper).attributes('aria-label')).toBe('Buka menu')
      expect(toggle(wrapper).attributes('aria-expanded')).toBe('false')
    })

    it('tombol membuka dan menutup menu', async () => {
      const { wrapper } = await factory()

      await toggle(wrapper).trigger('click')
      expect(isHidden(wrapper)).toBe(false)
      expect(toggle(wrapper).attributes('aria-label')).toBe('Tutup menu')
      expect(toggle(wrapper).attributes('aria-expanded')).toBe('true')

      await toggle(wrapper).trigger('click')
      expect(isHidden(wrapper)).toBe(true)
    })

    it('memilih menu menutup menu dan berpindah halaman', async () => {
      const { wrapper, router } = await factory('/')
      await toggle(wrapper).trigger('click')

      await linkByText(wrapper.get('#menu-tablet'), 'Daftar Surah').trigger('click')
      await flushPromises()

      expect(router.currentRoute.value.path).toBe('/surah')
      expect(isHidden(wrapper)).toBe(true)
    })
  })
})
