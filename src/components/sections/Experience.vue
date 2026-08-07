<script setup>
import SectionShell from '../SectionShell.vue'
import { cv } from '../../content/cv'
</script>

<template>
  <SectionShell id="experience" kicker="01 / Experience" title="Experience" ink="experience">
    <div class="timeline">
      <div class="timeline__line" aria-hidden="true"></div>
      <article
        v-for="(e, i) in cv.experience"
        :key="e.company + i"
        class="timeline__item"
      >
        <p class="mono muted timeline__period">{{ e.period }}</p>
        <h3 class="timeline__company">{{ e.company }}</h3>
        <p class="timeline__role">{{ e.role }}</p>
        <p class="timeline__summary">{{ e.summary }}</p>
        <p v-if="e.note" class="timeline__note serif-i">{{ e.note }}</p>
        <ul class="timeline__bullets">
          <li v-for="b in e.bullets" :key="b">{{ b }}</li>
        </ul>
        <ul class="timeline__tags mono">
          <li v-for="t in e.tags" :key="t" class="timeline__tag">{{ t }}</li>
        </ul>
      </article>
    </div>
  </SectionShell>
</template>

<style scoped>
.timeline { position: relative; padding-left: 28px; }
.timeline__line { position: absolute; left: 0; top: 4px; bottom: 4px; width: 3px; background: var(--ink-experience); }
.timeline__item { position: relative; margin: 0 0 40px; }
.timeline__item:last-child { margin-bottom: 0; }
.timeline__period { margin: 0 0 6px; }
.timeline__company { font-family: var(--font-display); font-size: 1.35rem; margin: 0 0 2px; }
.timeline__role { margin: 0 0 8px; color: var(--ink-experience); font-weight: 600; }
.timeline__summary { margin: 0 0 10px; }
.timeline__note { margin: 0 0 10px; color: var(--ink-muted); }
.timeline__bullets { margin: 0 0 10px; padding-left: 20px; }
.timeline__tags { display: flex; flex-wrap: wrap; gap: 8px; padding: 0; list-style: none; }
.timeline__tag { color: var(--ink-muted); }
</style>
