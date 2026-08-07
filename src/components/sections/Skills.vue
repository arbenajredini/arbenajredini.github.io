<script setup>
import SectionShell from '../SectionShell.vue'
import { cv } from '../../content/cv'
</script>

<template>
  <SectionShell id="skills" kicker="02 / Skills" title="Skills" ink="skills">
    <div class="skills__top">
      <h3 class="skills__label">Top Skills</h3>
      <div v-for="it in cv.skills.top" :key="it.skill" class="bar">
        <div class="bar__row">
          <span class="bar__label">{{ it.skill }}</span>
          <span class="bar__num mono">{{ it.level }}%</span>
        </div>
        <div class="bar__track">
          <div class="bar__fill" :data-level="it.level" :style="{ width: it.level + '%' }"></div>
        </div>
      </div>
    </div>
    <div class="toolbox">
      <h3 class="skills__label">Toolbox</h3>
      <div v-for="(items, name) in cv.skills.toolbox" :key="name" class="toolbox__group">
        <h4 class="toolbox__name mono">{{ name }}</h4>
        <ul class="toolbox__items mono">
          <li v-for="t in items" :key="t" class="toolbox__item">{{ t }}</li>
        </ul>
      </div>
    </div>
  </SectionShell>
</template>

<style scoped>
.skills__label { font-family: var(--font-display); color: var(--ink-skills); margin: 0 0 12px; }
.skills__top { margin-bottom: 28px; max-width: 480px; }
.bar { margin: 0 0 14px; }
.bar__row { display: flex; justify-content: space-between; margin-bottom: 4px; }
.bar__num { color: var(--ink-skills); }
.bar__track { height: 8px; border-radius: 99px; background: color-mix(in srgb, var(--ink-skills) 18%, transparent); }
.bar__fill { height: 100%; border-radius: 99px; background: var(--ink-skills); }
.toolbox { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
.toolbox__name { color: var(--ink-muted); margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.08em; }
.toolbox__items { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 8px; }
.toolbox__item { border: 1px solid var(--ink-skills); color: var(--ink-skills); border-radius: 99px; padding: 2px 12px; }
</style>
