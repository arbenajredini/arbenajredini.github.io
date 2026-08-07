import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Research from './Research.vue'
import { cv } from '../../content/cv'

describe('Research', () => {
  it('numbers citations [1], [2], … and lists titles', () => {
    const w = mount(Research)
    const cites = w.findAll('.cite')
    expect(cites.length).toBe(cv.research.length)
    cites.forEach((c, i) => expect(c.text()).toBe(`[${i + 1}]`))
    for (const r of cv.research) expect(w.text()).toContain(r.title)
  })
  it('expands the abstract when activated', async () => {
    const w = mount(Research)
    await w.find('.cite').trigger('click')
    expect(w.find('.research__abstract').isVisible()).toBe(true)
  })
})
