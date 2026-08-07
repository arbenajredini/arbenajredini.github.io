import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useReveal() {
  function canAnimate() {
    if (typeof window === 'undefined') return false
    if (typeof window.matchMedia !== 'function') return false
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  function reveal(el, { y = 12, duration = 0.6, delay = 0 } = {}) {
    if (!el || !canAnimate()) return
    gsap.fromTo(el,
      { autoAlpha: 0, y },
      { autoAlpha: 1, y: 0, duration, delay, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
  }

  function stagger(container, { items, y = 12, each = 0.08 } = {}) {
    if (!container || !items || !items.length || !canAnimate()) return
    const els = Array.from(items)
    gsap.fromTo(els,
      { autoAlpha: 0, y },
      { autoAlpha: 1, y: 0, duration: 0.5, stagger: each, ease: 'power2.out',
        scrollTrigger: { trigger: container, start: 'top 80%', once: true } })
  }

  function drawLine(el) {
    if (!el || !canAnimate()) return
    gsap.fromTo(el,
      { scaleY: 0 },
      { scaleY: 1, ease: 'none',
        transformOrigin: 'top center',
        scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 40%', scrub: 0.6 } })
  }

  function countUp(el, { target = 0, suffix = '' } = {}) {
    if (!el || !canAnimate()) { if (el) el.textContent = target + suffix; return }
    const obj = { v: 0 }
    gsap.to(obj, {
      v: target, duration: 1.1, ease: 'power1.out',
      onUpdate: () => { el.textContent = Math.round(obj.v) + suffix },
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    })
  }

  return { canAnimate, reveal, stagger, drawLine, countUp }
}
