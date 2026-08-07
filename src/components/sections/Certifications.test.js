import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Certifications from './Certifications.vue'
import { cv } from '../../content/cv'

describe('Certifications', () => {
  it('renders every certification title and course', () => {
    const w = mount(Certifications)
    for (const c of cv.certifications) {
      expect(w.text()).toContain(c.title)
      for (const co of c.courses) expect(w.text()).toContain(co)
    }
  })
})
