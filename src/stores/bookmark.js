import { bookmarkStorage } from '@/services/bookmarkStorage'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useBookmark = defineStore('bookmark', () => {
  const bookmarks = ref(bookmarkStorage.load())

  watch(bookmarks, (value) => bookmarkStorage.save(value), { deep: true })

  function findIndex(surahNomor, ayatNomor) {
    return bookmarks.value.findIndex((b) => b.surah === surahNomor && b.ayat === ayatNomor)
  }

  function isBookmarked(surahNomor, ayatNomor) {
    return findIndex(surahNomor, ayatNomor) !== -1
  }

  function toggleBookmark(item) {
    const index = findIndex(item.surah, item.ayat)
    if (index === -1) {
      bookmarks.value.push({ ...item, savedAt: Date.now() })
    } else {
      bookmarks.value.splice(index, 1)
    }
  }

  function removeBookmark(surahNomor, ayatNomor) {
    const index = findIndex(surahNomor, ayatNomor)
    if (index !== -1) bookmarks.value.splice(index, 1)
  }

  return {
    bookmarks,
    isBookmarked,
    toggleBookmark,
    removeBookmark,
  }
})
