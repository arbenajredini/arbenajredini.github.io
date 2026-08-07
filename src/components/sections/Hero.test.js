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
  it('renders social links from cv.socials', () => {
    const w = mount(Hero)
    const links = w.findAll('a').map(a => a.attributes('href'))
    for (const s of cv.socials) expect(links).toContain(s.url)
  })
})
