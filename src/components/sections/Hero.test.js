import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Hero from './Hero.vue'
import { cv } from '../../content/cv'

describe('Hero', () => {
  it('renders the profile name and role', () => {
    const w = mount(Hero)
    expect(w.text()).toContain(cv.profile.name)
    expect(w.text()).toContain(cv.profile.role)
  })

  it('renders the hand-drawn flourish', () => {
    const w = mount(Hero)
    expect(w.find('.hero__flourish').exists()).toBe(true)
  })

  it('has no misregistration text', () => {
    const w = mount(Hero)
    expect(w.find('.misregister').exists()).toBe(false)
  })

  it('renders social links from cv.socials', () => {
    const w = mount(Hero)
    const links = w.findAll('a').map(a => a.attributes('href'))
    for (const s of cv.socials) expect(links).toContain(s.url)
  })
})
