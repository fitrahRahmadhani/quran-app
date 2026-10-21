import { bookmarkStorage } from '@/services/bookmarkStorage'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useBookmark = defineStore('bookmark', () => {
  const bookmark = ref(bookmarkStorage.load())

  watch(bookmark, (value) => bookmarkStorage.save(value), { deep: true })

  function isBookmarked(surahNomor, ayatNomor) {
    return bookmark.value?.surah === surahNomor && bookmark.value?.ayat === ayatNomor
  }

  function toggleBookmark(item) {
    if (isBookmarked(item.surah, item.ayat)) {
      bookmark.value = null
    } else {
      bookmark.value = { ...item, savedAt: Date.now() }
    }
  }

  function removeBookmark() {
    bookmark.value = null
  }

  return {
    bookmark,
    isBookmarked,
    toggleBookmark,
    removeBookmark,
  }
})
