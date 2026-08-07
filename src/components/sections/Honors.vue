<script setup>
import SectionShell from '../SectionShell.vue'
import { cv } from '../../content/cv'
</script>

<template>
  <SectionShell id="honors" kicker="05 / Honors" title="Honors & Awards" ink="research">
    <ol class="honors">
      <li v-for="h in cv.honors" :key="h.detail" class="honor">
        <span class="honor__award">{{ h.award }}</span><span class="honor__detail"> — {{ h.detail }}</span>
      </li>
    </ol>
  </SectionShell>
</template>

<style scoped>
.honors { list-style: none; padding: 0; margin: 0; }
.honor { margin: 0 0 12px; }
.honor__award { color: var(--ink-research); font-weight: 600; }
.honor__detail { color: var(--ink); }
</style>
