import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Honors from './Honors.vue'
import { cv } from '../../content/cv'

describe('Honors', () => {
  it('renders every award and detail', () => {
    const w = mount(Honors)
    for (const h of cv.honors) {
      expect(w.text()).toContain(h.award)
      expect(w.text()).toContain(h.detail)
    }
  })
})
