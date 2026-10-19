const STORAGE_KEY = 'bookmarks'

export const bookmarkStorage = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const parsed = raw ? JSON.parse(raw) : []
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  },

  save(bookmarks) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks))
    } catch {
      return
    }
  },
}
