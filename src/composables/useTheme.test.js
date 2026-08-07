import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTheme } from './useTheme'

function stubMatchMedia(queries) {
  window.matchMedia = (query) => ({
    matches: Boolean(queries[query]),
    media: query,
    addListener: () => {}, removeListener: () => {},
    addEventListener: () => {}, removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

describe('useTheme', () => {
  it('defaults to paper when no preference is stored and OS is light', () => {
    stubMatchMedia({ '(prefers-color-scheme: dark)': false })
    const { theme } = useTheme()
    expect(theme.value).toBe('paper')
    expect(document.documentElement.dataset.theme).toBe('paper')
  })

  it('defaults to ink when the OS prefers dark', () => {
    stubMatchMedia({ '(prefers-color-scheme: dark)': true })
    const { theme } = useTheme()
    expect(theme.value).toBe('ink')
  })

  it('persists the choice and restores it on next init', () => {
    stubMatchMedia({ '(prefers-color-scheme: dark)': false })
    const a = useTheme()
    a.toggle() // paper -> ink
    expect(localStorage.getItem('zine-theme')).toBe('ink')

    const b = useTheme() // fresh call reads storage first
    expect(b.theme.value).toBe('ink')
    expect(document.documentElement.dataset.theme).toBe('ink')
  })

  it('setTheme clamps invalid values to paper', () => {
    stubMatchMedia({ '(prefers-color-scheme: dark)': false })
    const { setTheme } = useTheme()
    setTheme('nonsense')
    expect(document.documentElement.dataset.theme).toBe('paper')
  })
})
