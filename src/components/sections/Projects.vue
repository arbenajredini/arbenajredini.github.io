<script setup>
import { onMounted, reactive, ref } from 'vue'
import SectionShell from '../SectionShell.vue'
import { useReveal } from '../../composables/useReveal'
import { cv } from '../../content/cv'

const grid = ref(null)
const cards = ref([])
const open = reactive({})
const { stagger } = useReveal()

onMounted(() => stagger(grid.value, { items: cards.value }))
</script>

<template>
  <SectionShell id="projects" kicker="03 / Projects" title="Projects" ink="projects">
    <div ref="grid" class="projects">
      <article
        v-for="(p, i) in cv.projects"
        :key="p.title"
        ref="cards"
        class="project-card"
        :class="{ 'is-open': open[i] }"
      >
        <h3 class="project-card__title">{{ p.title }}</h3>
        <p class="project-card__subtitle serif-i">{{ p.subtitle }}</p>
        <p class="project-card__desc">{{ p.description }}</p>
        <ul class="project-card__stack mono">
          <li v-for="t in p.stack" :key="t">{{ t }}</li>
        </ul>
        <button
          class="project-card__toggle mono"
          :aria-expanded="open[i] === true"
          :aria-controls="'study-' + i"
          @click="open[i] = !open[i]"
        >{{ open[i] ? 'Close study' : 'Case study ▾' }}</button>

        <div :id="'study-' + i" class="project-card__study" v-show="open[i]">
          <p><strong>Problem.</strong> {{ p.problem }}</p>
          <p><strong>Approach.</strong> {{ p.approach }}</p>
          <p class="mono">
            <a v-if="p.links.live" :href="p.links.live" target="_blank" rel="noopener">live ↗</a>
            <a v-if="p.links.repo" :href="p.links.repo" target="_blank" rel="noopener"> repo ↗</a>
          </p>
        </div>
      </article>
    </div>
  </SectionShell>
</template>

<style scoped>
.projects { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
.project-card { background: color-mix(in srgb, var(--ink-projects) 6%, var(--paper)); border: 2px solid color-mix(in srgb, var(--ink-projects) 40%, transparent); padding: 20px; border-radius: 10px; }
.project-card__title { font-family: var(--font-display); font-size: 1.25rem; color: var(--ink-projects); margin: 0 0 4px; }
.project-card__subtitle { margin: 0 0 10px; color: var(--ink-muted); }
.project-card__stack { display: flex; flex-wrap: wrap; gap: 8px; padding: 0; list-style: none; margin: 0 0 12px; }
.project-card__toggle { background: none; border: none; cursor: pointer; font: inherit; color: var(--ink-projects); text-decoration: underline; padding: 0; }
.project-card__study { border-top: 1px dashed var(--ink-muted); margin-top: 12px; padding-top: 12px; }
</style>
