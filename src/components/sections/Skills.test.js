import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Skills from './Skills.vue'
import { cv } from '../../content/cv'

describe('Skills', () => {
  it('renders every top skill with its level', () => {
    const w = mount(Skills)
    for (const it of cv.skills.top) {
      expect(w.text()).toContain(it.skill)
      expect(w.text()).toContain(`${it.level}%`)
    }
  })

  it('renders every toolbox group and tag', () => {
    const w = mount(Skills)
    for (const [name, items] of Object.entries(cv.skills.toolbox)) {
      expect(w.text()).toContain(name)
      for (const t of items) expect(w.text()).toContain(t)
    }
  })

  it('bars carry their level as inline width and data-level', () => {
    const w = mount(Skills)
    const first = cv.skills.top[0]
    const fill = w.find('.bar__fill')
    expect(fill.attributes('data-level')).toBe(String(first.level))
    expect(fill.attributes('style')).toContain(`${first.level}%`)
  })
})
