import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Marginalia from './Marginalia.vue'

describe('Marginalia', () => {
  it('renders its note in an aside.marginalia', () => {
    const w = mount(Marginalia, { slots: { default: 'a margin note' } })
    expect(w.text()).toContain('a margin note')
    expect(w.find('aside.marginalia').exists()).toBe(true)
  })
})
