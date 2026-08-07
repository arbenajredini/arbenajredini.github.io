import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Experience from './Experience.vue'
import { cv } from '../../content/cv'

describe('Experience', () => {
  it('renders every role from cv.experience', () => {
    const w = mount(Experience)
    for (const e of cv.experience) {
      expect(w.text()).toContain(e.company)
      expect(w.text()).toContain(e.role)
      expect(w.text()).toContain(e.period)
    }
  })

  it('renders a static timeline line and one item per role', () => {
    const w = mount(Experience)
    expect(w.find('.timeline__line').exists()).toBe(true)
    expect(w.findAll('.timeline__item').length).toBe(cv.experience.length)
  })

  it('renders a static note line for roles that have one', () => {
    const w = mount(Experience)
    const withNotes = cv.experience.filter(e => e.note).length
    expect(w.findAll('.timeline__note').length).toBe(withNotes)
  })
})
