import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useMinimize } from '@/stores/minimize'
import { routerAt } from '../helpers/router'

const factory = async () => {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = await routerAt('/')
  const wrapper = mount(DefaultLayout, {
    slots: { default: () => h('p', { id: 'konten' }, 'Isi halaman') },
    global: { plugins: [pinia, router] },
  })
  return { wrapper, store: useMinimize(pinia) }
}

describe('DefaultLayout', () => {
  it('merender slot di dalam <main>', async () => {
    const { wrapper } = await factory()
    expect(wrapper.get('main #konten').text()).toBe('Isi halaman')
  })

  it('menampilkan header dan footer secara default', async () => {
    const { wrapper } = await factory()
    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.find('footer').exists()).toBe(true)
  })

  it('menyembunyikan header & footer saat mode fokus, slot tetap tampil', async () => {
    const { wrapper, store } = await factory()
    store.toggleFocusMode()
    await nextTick()

    expect(wrapper.find('header').exists()).toBe(false)
    expect(wrapper.find('footer').exists()).toBe(false)
    expect(wrapper.find('#konten').exists()).toBe(true)
  })

  it('menampilkan kembali header & footer saat mode fokus dimatikan', async () => {
    const { wrapper, store } = await factory()
    store.toggleFocusMode()
    await nextTick()
    store.disableFocusMode()
    await nextTick()

    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.find('footer').exists()).toBe(true)
  })
})
