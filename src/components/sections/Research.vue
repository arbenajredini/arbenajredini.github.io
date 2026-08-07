<script setup>
import { onMounted, reactive, ref } from 'vue'
import SectionShell from '../SectionShell.vue'
import { useReveal } from '../../composables/useReveal'
import { cv } from '../../content/cv'

const list = ref(null)
const rows = ref([])
const open = reactive({})
const { stagger } = useReveal()

onMounted(() => stagger(list.value, { items: rows.value }))
</script>

<template>
  <SectionShell id="research" kicker="04 / Research" title="Research" ink="research">
    <ol ref="list" class="research">
      <li
        v-for="(r, i) in cv.research"
        :key="r.title"
        ref="rows"
        class="research__row"
        @mouseenter="open[i] = true"
        @focusin="open[i] = true"
        @mouseleave="open[i] = false"
        @focusout="open[i] = false"
      >
        <span class="research__cite-wrap">
          <button class="cite mono" :aria-expanded="open[i] === true" @click="open[i] = true">[{{ i + 1 }}]</button>
          <span class="research__meta">
            {{ r.title }} — <span class="muted">{{ r.venue }}, {{ r.year }}</span>
          </span>
        </span>
        <p v-show="open[i]" class="research__abstract">{{ r.abstract }}
          <a v-if="r.url" :href="r.url" target="_blank" rel="noopener" class="mono"> →</a>
        </p>
      </li>
    </ol>
  </SectionShell>
</template>

<style scoped>
.research { list-style: none; padding: 0; margin: 0; }
.research__row { margin: 0 0 18px; }
.cite { background: color-mix(in srgb, var(--ink-research) 12%, transparent); color: var(--ink-research); border: none; border-radius: 5px; font: inherit; cursor: pointer; padding: 2px 7px; margin-right: 10px; }
.research__abstract { border-left: 3px solid var(--ink-research); padding-left: 12px; margin: 8px 0 0 26px; color: var(--ink-muted); }
</style>
