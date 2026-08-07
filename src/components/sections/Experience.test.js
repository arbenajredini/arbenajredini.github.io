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
  it('renders the timeline line to draw', () => {
    const w = mount(Experience)
    expect(w.find('.timeline__line').exists()).toBe(true)
    expect(w.findAll('.timeline__item').length).toBe(cv.experience.length)
  })
  it('renders a margin note for roles that have one', () => {
    const w = mount(Experience)
    if (cv.experience.some(e => e.note)) {
      expect(w.findAll('.marginalia').length).toBeGreaterThan(0)
    }
  })
})
