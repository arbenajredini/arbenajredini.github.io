<script setup>
import { onMounted, reactive, ref } from 'vue'
import SectionShell from '../SectionShell.vue'
import { useReveal } from '../../composables/useReveal'
import { cv } from '../../content/cv'

const list = ref(null)
const posts = ref([])
const open = reactive({})
const { stagger } = useReveal()

onMounted(() => stagger(list.value, { items: posts.value }))

function iso(isoStr) {
  const d = new Date(isoStr)
  return isNaN(d) ? isoStr : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short' })
}
</script>

<template>
  <SectionShell id="blog" kicker="06 / Blog" title="Blog" ink="blog">
    <ul ref="list" class="posts">
      <li v-for="(p, i) in cv.posts" :key="p.title" ref="posts" class="post">
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
