import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Skills from './Skills.vue'
import { cv } from '../../content/cv'

describe('Skills', () => {
  it('renders every group and item', () => {
    const w = mount(Skills)
    for (const g of cv.skills.groups) {
      expect(w.text()).toContain(g.name)
      for (const it of g.items) expect(w.text()).toContain(it.skill)
    }
  })
  it('bars carry their level as inline width and data-level', () => {
    const w = mount(Skills)
    const fills = w.findAll('.bar__fill')
    expect(fills.length).toBeGreaterThan(0)
    const first = cv.skills.groups[0].items[0]
    const fill = w.find('.bar__fill')
    expect(fill.attributes('data-level')).toBe(String(first.level))
    expect(fill.attributes('style')).toContain(`${first.level}%`)
  })
})
