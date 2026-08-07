import { ref } from 'vue'

const STORAGE_KEY = 'zine-theme'
const VALID = ['paper', 'ink']

function osPreference() {
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'ink' : 'paper'
  }
  return 'paper'
}

export function useTheme() {
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
  const theme = ref(VALID.includes(stored) ? stored : osPreference())

  function apply() {
    document.documentElement.dataset.theme = theme.value
  }

  function setTheme(name) {
    theme.value = VALID.includes(name) ? name : 'paper'
    localStorage.setItem(STORAGE_KEY, theme.value)
    apply()
  }

  function toggle() {
    setTheme(theme.value === 'paper' ? 'ink' : 'paper')
  }

  apply() // initial
  return { theme, setTheme, toggle }
}
