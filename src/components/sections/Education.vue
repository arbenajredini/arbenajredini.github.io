<script setup>
import SectionShell from '../SectionShell.vue'
import { cv } from '../../content/cv'
</script>

<template>
  <SectionShell id="education" kicker="04 / Education" title="Education" ink="projects">
    <article v-for="e in cv.education" :key="e.school + e.degree" class="edu">
      <p class="mono muted edu__period">{{ e.period }}</p>
      <h3 class="edu__school">{{ e.school }}</h3>
      <p class="edu__degree">{{ e.degree }}</p>
    </article>
  </SectionShell>
</template>

<style scoped>
.edu { margin: 0 0 20px; }
.edu__period { margin: 0 0 4px; }
.edu__school { font-family: var(--font-display); font-size: 1.3rem; margin: 0 0 2px; }
.edu__degree { margin: 0; color: var(--ink-muted); }
</style>
