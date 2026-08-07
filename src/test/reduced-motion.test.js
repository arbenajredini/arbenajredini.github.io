import { describe, it, expect } from 'vitest'
import { useReveal } from '../composables/useReveal'

describe('reduced-motion contract', () => {
  it('no-ops reveal when reduced motion is preferred', () => {
    window.matchMedia = (q) => ({ matches: q.includes('prefers-reduced-motion'), media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false })
    const el = { textContent: '0%' }
    const { canAnimate, countUp } = useReveal()
    expect(canAnimate()).toBe(false)
    countUp(el, { target: 88, suffix: '%' })
    expect(el.textContent).toBe('88%') // final value set even without animation
  })
})
