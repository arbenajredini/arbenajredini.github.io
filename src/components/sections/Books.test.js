import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Books from './Books.vue'
import { cv } from '../../content/cv'

describe('Books', () => {
  it('renders every book title, author, and status', () => {
    const w = mount(Books)
    for (const b of cv.books) {
      expect(w.text()).toContain(b.title)
      expect(w.text()).toContain(b.author)
    }
    const badges = w.findAll('.book-card__status')
    expect(badges.length).toBe(cv.books.length)
  })
  it('badges use uppercase read/reading/tbr labels', () => {
    const w = mount(Books)
    const texts = w.findAll('.book-card__status').map(n => n.text())
    for (const b of cv.books) expect(texts).toContain(b.status.toUpperCase())
  })
})
