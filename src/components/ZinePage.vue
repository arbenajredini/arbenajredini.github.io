<script setup>
import { useTheme } from '../composables/useTheme'

const { theme } = useTheme()
</script>

<template>
  <div class="zine" :data-theme="theme">
    <div class="zine__rules" aria-hidden="true"></div>
    <div class="zine__main">
      <slot />
    </div>
    <div class="zine__grain" aria-hidden="true"></div>
  </div>
</template>
