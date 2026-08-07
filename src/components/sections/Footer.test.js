import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Footer from './Footer.vue'
import { cv } from '../../content/cv'

describe('Footer', () => {
  it('renders every social link', () => {
    const w = mount(Footer)
    const hrefs = w.findAll('a').map(a => a.attributes('href'))
    for (const s of cv.socials) expect(hrefs).toContain(s.url)
  })
  it('has a back-to-top link', () => {
    const w = mount(Footer)
    expect(w.find('.footer__top').exists()).toBe(true)
  })
})
