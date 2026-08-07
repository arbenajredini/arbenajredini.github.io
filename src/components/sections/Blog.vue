<script setup>
import { reactive } from 'vue'
import SectionShell from '../SectionShell.vue'
import { cv } from '../../content/cv'

const open = reactive({})

function iso(isoStr) {
  const m = /^(\d{4})-(\d{2})/.exec(isoStr)
  if (!m) return isoStr
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return months[+m[2] - 1] + ' ' + m[1]
}
</script>

<template>
  <SectionShell id="blog" kicker="C / Blog" title="Blog" ink="blog">
    <ul class="posts">
      <li v-for="(p, i) in cv.posts" :key="p.title" class="post">
        <p class="post__date mono muted">{{ iso(p.date) }}</p>
        <h3 class="post__title">{{ p.title }}</h3>
        <p class="post__tags mono muted"><span v-for="t in p.tags" :key="t">#{{ t }} </span></p>
        <button class="post__toggle mono" :aria-expanded="open[i] === true" @click="open[i] = !open[i]">
          {{ open[i] ? 'Less ▴' : 'More ▾' }}
        </button>
        <p v-show="open[i]" class="post__excerpt">{{ p.excerpt }}</p>
        <a class="post__link mono" :href="p.url" target="_blank" rel="noopener">→ read on blog</a>
      </li>
    </ul>
  </SectionShell>
</template>

<style scoped>
.posts { list-style: none; padding: 0; margin: 0; }
.post { margin: 0 0 26px; }
.post__date { margin: 0 0 2px; }
.post__title { font-family: var(--font-display); font-size: 1.3rem; color: var(--ink-blog); margin: 0 0 4px; }
.post__tags { margin: 0 0 8px; }
.post__toggle { background: none; border: none; cursor: pointer; color: var(--ink-blog); font: inherit; padding: 0; margin-right: 12px; }
.post__excerpt { border-left: 3px solid var(--ink-blog); padding-left: 12px; color: var(--ink-muted); margin: 8px 0; }
</style>
