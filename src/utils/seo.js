export const SITE_NAME = 'Quran'
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://quran.example.com').replace(
  /\/+$/,
  '',
)
export const DEFAULT_TITLE = 'Quran Online - Baca Al-Qur’an, Latin & Terjemahan Indonesia'
export const DEFAULT_DESCRIPTION =
  'Baca Al-Qur’an online lengkap 114 surah dan 30 juz dengan teks Arab, transliterasi latin, terjemahan Bahasa Indonesia, dan audio murottal. Gratis dan nyaman dibaca.'

function upsert(selector, tag, attrs) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement(tag)
    document.head.appendChild(el)
  }
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value))
  return el
}

const meta = (name, content) => upsert(`meta[name="${name}"]`, 'meta', { name, content })
const property = (name, content) =>
  upsert(`meta[property="${name}"]`, 'meta', { property: name, content })

export const absoluteUrl = (path = '/') => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

/**
 * Perbarui <title>, meta description, canonical, Open Graph, Twitter, robots, dan JSON-LD.
 * Dipanggil dari router (per halaman) dan dari view yang datanya baru tersedia setelah fetch.
 */
export function setSeo({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  noindex = false,
  breadcrumbs,
} = {}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE
  const url = absoluteUrl(path)

  document.title = fullTitle
  meta('description', description)
  meta('robots', noindex ? 'noindex, follow' : 'index, follow')
  upsert('link[rel="canonical"]', 'link', { rel: 'canonical', href: url })

  property('og:type', 'website')
  property('og:site_name', SITE_NAME)
  property('og:locale', 'id_ID')
  property('og:title', fullTitle)
  property('og:description', description)
  property('og:url', url)

  meta('twitter:card', 'summary')
  meta('twitter:title', fullTitle)
  meta('twitter:description', description)

  const ld = document.head.querySelector('script[data-seo="breadcrumb"]')
  if (breadcrumbs?.length) {
    const script = ld || document.createElement('script')
    script.type = 'application/ld+json'
    script.dataset.seo = 'breadcrumb'
    script.textContent = JSON.stringify(breadcrumbJsonLd(breadcrumbs))
    if (!ld) document.head.appendChild(script)
  } else {
    ld?.remove()
  }
}
