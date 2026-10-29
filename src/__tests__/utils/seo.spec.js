import { beforeEach, describe, expect, it } from 'vitest'
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_URL, setSeo } from '@/utils/seo'

const metaContent = (selector) => document.head.querySelector(selector)?.getAttribute('content')

describe('setSeo', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    document.title = ''
  })

  it('memakai judul & deskripsi default bila tanpa argumen', () => {
    setSeo()
    expect(document.title).toBe(DEFAULT_TITLE)
    expect(metaContent('meta[name="description"]')).toBe(DEFAULT_DESCRIPTION)
    expect(document.head.querySelector('link[rel="canonical"]').href).toBe(`${SITE_URL}/`)
  })

  it('menambahkan nama situs di belakang judul halaman', () => {
    setSeo({ title: 'Daftar Juz', path: '/juz' })
    expect(document.title).toBe('Daftar Juz | Quran')
    expect(metaContent('meta[property="og:title"]')).toBe('Daftar Juz | Quran')
    expect(metaContent('meta[property="og:url"]')).toBe(`${SITE_URL}/juz`)
    expect(metaContent('meta[name="twitter:title"]')).toBe('Daftar Juz | Quran')
  })

  it('tidak menduplikasi tag saat dipanggil berulang', () => {
    setSeo({ title: 'A', path: '/a' })
    setSeo({ title: 'B', path: '/b' })
    expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1)
    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1)
    expect(document.head.querySelector('link[rel="canonical"]').href).toBe(`${SITE_URL}/b`)
  })

  it('robots: index secara default, noindex bila diminta', () => {
    setSeo()
    expect(metaContent('meta[name="robots"]')).toBe('index, follow')
    setSeo({ noindex: true })
    expect(metaContent('meta[name="robots"]')).toBe('noindex, follow')
  })

  it('membuat, memperbarui, lalu menghapus JSON-LD breadcrumb', () => {
    setSeo({ breadcrumbs: [{ name: 'Beranda', path: '/' }, { name: 'Juz', path: '/juz' }] })
    const script = () => document.head.querySelectorAll('script[data-seo="breadcrumb"]')
    expect(script()).toHaveLength(1)

    const data = JSON.parse(script()[0].textContent)
    expect(data['@type']).toBe('BreadcrumbList')
    expect(data.itemListElement.map((i) => [i.position, i.name, i.item])).toEqual([
      [1, 'Beranda', `${SITE_URL}/`],
      [2, 'Juz', `${SITE_URL}/juz`],
    ])

    setSeo({ breadcrumbs: [{ name: 'Beranda', path: '/' }] })
    expect(script()).toHaveLength(1)
    expect(JSON.parse(script()[0].textContent).itemListElement).toHaveLength(1)

    setSeo()
    expect(script()).toHaveLength(0)
  })
})
