<script setup>
import { onMounted, ref } from 'vue'
import SectionShell from '../SectionShell.vue'
import { useReveal } from '../../composables/useReveal'
import { cv } from '../../content/cv'

const groupsEl = ref(null)
const groupEls = ref([])
const numEls = ref([])
const { countUp, stagger } = useReveal()

onMounted(() => {
  stagger(groupsEl.value, { items: groupEls.value })
  numEls.value.forEach((el) => countUp(el, { target: Number(el.dataset.target), suffix: '%' }))
})
</script>

<template>
  <SectionShell id="skills" kicker="07 / Skills" title="Skills" ink="skills">
    <div ref="groupsEl" class="skill-groups">
      <section v-for="(g, gi) in cv.skills.groups" :key="g.name" ref="groupEls" class="skill-group">
        <h3 class="skill-group__name">{{ g.name }}</h3>
        <div v-for="it in g.items" :key="it.skill" class="bar">
          <div class="bar__row">
            <span class="bar__label">{{ it.skill }}</span>
            <span ref="numEls" class="bar__num mono" :data-target="it.level">0%</span>
          </div>
          <div class="bar__track">
            <div class="bar__fill" :data-level="it.level" :style="{ width: it.level + '%' }"></div>
          </div>
        </div>
      </section>
    </div>
    <div class="skills__tags mono">
      <span v-for="g in cv.skills.groups" :key="'tag-' + g.name">
        <span v-for="it in g.items" :key="it.skill" class="skills__tag">{{ it.skill }}</span>
      </span>
    </div>
  </SectionShell>
</template>

<style scoped>
.skill-groups { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 28px; }
.skill-group__name { font-family: var(--font-display); color: var(--ink-skills); margin: 0 0 12px; }
.bar { margin: 0 0 14px; }
.bar__row { display: flex; justify-content: space-between; margin-bottom: 4px; }
.bar__num { color: var(--ink-skills); }
.bar__track { height: 8px; border-radius: 99px; background: color-mix(in srgb, var(--ink-skills) 18%, transparent); }
.bar__fill { height: 100%; border-radius: 99px; background: var(--ink-skills); }
.skills__tags { margin-top: 28px; display: flex; flex-wrap: wrap; gap: 10px; }
.skills__tag { border: 1px solid var(--ink-skills); color: var(--ink-skills); border-radius: 99px; padding: 2px 12px; }
</style>
