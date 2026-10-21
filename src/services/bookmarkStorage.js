const STORAGE_KEY = 'bookmark'

const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

export const bookmarkStorage = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw)
      return isPlainObject(parsed) ? parsed : null
    } catch {
      return null
    }
  },

  save(bookmark) {
    try {
      if (bookmark) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmark))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      return
    }
  },
}
