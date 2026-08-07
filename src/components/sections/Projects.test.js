import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Projects from './Projects.vue'
import { cv } from '../../content/cv'

describe('Projects', () => {
  it('renders every project title', () => {
    const w = mount(Projects)
    for (const p of cv.projects) expect(w.text()).toContain(p.title)
  })
  it('toggles the case-study drawer with aria-expanded', async () => {
    const w = mount(Projects)
    const toggle = w.find('.project-card__toggle')
    expect(toggle.attributes('aria-expanded')).toBe('false')
    await toggle.trigger('click')
    expect(w.find('.project-card__study').isVisible()).toBe(true)
    expect(w.find('.project-card__toggle').attributes('aria-expanded')).toBe('true')
  })
})
