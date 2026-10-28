import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useMinimize } from '@/stores/minimize'

describe('minimize store', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('mode fokus mati secara default', () => {
    expect(useMinimize().isFocusMode).toBe(false)
  })

  it('toggleFocusMode membalik nilai', () => {
    const store = useMinimize()
    store.toggleFocusMode()
    expect(store.isFocusMode).toBe(true)
    store.toggleFocusMode()
    expect(store.isFocusMode).toBe(false)
  })

  it('disableFocusMode selalu mematikan mode fokus', () => {
    const store = useMinimize()
    store.disableFocusMode()
    expect(store.isFocusMode).toBe(false)

    store.toggleFocusMode()
    store.disableFocusMode()
    expect(store.isFocusMode).toBe(false)
  })
})
