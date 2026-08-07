import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Education from './Education.vue'
import { cv } from '../../content/cv'

describe('Education', () => {
  it('renders every school, degree, and period', () => {
    const w = mount(Education)
    for (const e of cv.education) {
      expect(w.text()).toContain(e.school)
      expect(w.text()).toContain(e.degree)
      expect(w.text()).toContain(e.period)
    }
  })
})
