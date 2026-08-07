import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MisregisterText from './MisregisterText.vue'

describe('MisregisterText', () => {
  it('renders the text and data-text for the ghost duplicate', () => {
    const w = mount(MisregisterText, { props: { text: 'EXPERIENCE' } })
    expect(w.text()).toContain('EXPERIENCE')
    expect(w.find('.misregister').attributes('data-text')).toBe('EXPERIENCE')
  })
  it('honors the `as` prop', () => {
    const w = mount(MisregisterText, { props: { as: 'h1', text: 'Hi' } })
    expect(w.find('h1').exists()).toBe(true)
  })
})
