<script setup>
import { onMounted, ref } from 'vue'
import SectionShell from '../SectionShell.vue'
import Marginalia from '../Marginalia.vue'
import { useReveal } from '../../composables/useReveal'
import { cv } from '../../content/cv'

const timeline = ref(null)
const line = ref(null)
const items = ref([])
const { drawLine, stagger } = useReveal()

onMounted(() => {
  drawLine(line.value)
  stagger(timeline.value, { items: items.value })
})
</script>

<template>
  <SectionShell id="experience" kicker="02 / Experience" title="Experience" ink="experience">
    <div ref="timeline" class="timeline">
      <div ref="line" class="timeline__line" aria-hidden="true"></div>
      <article
        v-for="(e, i) in cv.experience"
        :key="e.company + i"
        ref="items"
        class="timeline__item"
        tabindex="0"
      >
        <Marginalia v-if="e.note" :ink="'var(--ink-experience)'">{{ e.note }}</Marginalia>
        <p class="mono muted timeline__period">{{ e.period }}</p>
        <h3 class="timeline__company">{{ e.company }}</h3>
        <p class="timeline__role">{{ e.role }}</p>
        <p class="timeline__summary">{{ e.summary }}</p>
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
.timeline__line {
  position: absolute; left: 0; top: 4px; bottom: 4px; width: 3px;
  background: var(--ink-experience); transform-origin: top center;
}
.timeline__item { position: relative; margin: 0 0 40px; }
.timeline__item:last-child { margin-bottom: 0; }
.timeline__period { margin: 0 0 6px; }
.timeline__company { font-family: var(--font-display); font-size: 1.35rem; margin: 0 0 2px; }
.timeline__role { margin: 0 0 8px; color: var(--ink-experience); font-weight: 600; }
.timeline__summary { margin: 0 0 10px; }
.timeline__bullets { margin: 0 0 10px; padding-left: 20px; }
.timeline__tags { display: flex; flex-wrap: wrap; gap: 8px; padding: 0; list-style: none; }
.timeline__tag { color: var(--ink-muted); }
</style>
