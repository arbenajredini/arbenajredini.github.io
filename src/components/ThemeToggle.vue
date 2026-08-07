<script setup>
import { useTheme } from '../composables/useTheme'
const { theme, toggle } = useTheme()
</script>

<template>
  <button class="theme-toggle mono" type="button" :aria-label="'Switch to ' + (theme === 'paper' ? 'ink' : 'paper') + ' mode'" @click="toggle">
    {{ theme === 'paper' ? 'INK ⇄' : 'PAPER ⇄' }}
  </button>
</template>
