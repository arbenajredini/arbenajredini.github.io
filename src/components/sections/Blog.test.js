import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Blog from './Blog.vue'
import { cv } from '../../content/cv'

describe('Blog', () => {
  it('renders every post title and links to the blog', () => {
    const w = mount(Blog)
    for (const p of cv.posts) expect(w.text()).toContain(p.title)
    const hrefs = w.findAll('.post__link').map(a => a.attributes('href'))
    for (const p of cv.posts) expect(hrefs).toContain(p.url)
  })
  it('toggles the excerpt', async () => {
    const w = mount(Blog)
    await w.find('.post__toggle').trigger('click')
    expect(w.find('.post__excerpt').isVisible()).toBe(true)
  })
  it('formats post dates as "May 2026" regardless of timezone', () => {
    const w = mount(Blog)
    expect(w.findAll('.post__date')[0].text()).toBe('May 2026')
  })
})
