import { describe, it, expect } from 'vitest'
import { useReveal } from './useReveal'

describe('useReveal', () => {
  it('canAnimate is false under reduced motion (the test-stub default)', () => {
    const { canAnimate } = useReveal()
    expect(canAnimate()).toBe(false)
  })

  it('canAnimate is true when motion is allowed', () => {
    window.matchMedia = (query) => ({ matches: false, media: query, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false })
    const { canAnimate } = useReveal()
    expect(canAnimate()).toBe(true)
  })

  it('all hooks are functions and tolerate null elements', () => {
    const r = useReveal()
    for (const fn of ['reveal', 'stagger', 'drawLine', 'countUp']) {
      expect(typeof r[fn]).toBe('function')
      expect(() => r[fn](null)).not.toThrow()
    }
  })
})
