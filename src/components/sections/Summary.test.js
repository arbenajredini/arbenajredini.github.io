import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Summary from './Summary.vue'
import { cv } from '../../content/cv'

describe('Summary', () => {
  it('renders the headline and body', () => {
    const w = mount(Summary)
    expect(w.text()).toContain(cv.summary.headline)
    expect(w.text()).toContain(cv.summary.body)
  })
})
