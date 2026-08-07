<script setup>
import SectionShell from '../SectionShell.vue'
import { cv } from '../../content/cv'
</script>

<template>
  <SectionShell id="summary" kicker="Summary" title="Summary" ink="experience">
    <p class="summary__headline serif-i">{{ cv.summary.headline }}</p>
    <p class="summary__body">{{ cv.summary.body }}</p>
  </SectionShell>
</template>

<style scoped>
.summary__headline { font-size: 1.5rem; color: var(--ink); margin: 0 0 10px; }
.summary__body { max-width: 46em; margin: 0; }
</style>
