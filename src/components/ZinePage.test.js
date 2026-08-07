import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ZinePage from './ZinePage.vue'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

describe('ZinePage', () => {
  it('renders slot content and paper/ink chrome', () => {
    const wrapper = mount(ZinePage, {
      slots: { default: '<p class="probe">hello</p>' },
    })
    expect(wrapper.find('.probe').exists()).toBe(true)
    expect(wrapper.find('.zine').exists()).toBe(true)
    expect(wrapper.find('.zine__grain').exists()).toBe(true)
  })

  it('initializes the theme attribute on the root element', () => {
    mount(ZinePage)
    expect(document.documentElement.dataset.theme).toBe('paper')
  })
})
