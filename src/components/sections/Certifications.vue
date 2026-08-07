<script setup>
import SectionShell from '../SectionShell.vue'
import { cv } from '../../content/cv'
</script>

<template>
  <SectionShell id="certifications" kicker="03 / Certifications" title="Certifications" ink="blog">
    <article v-for="c in cv.certifications" :key="c.title" class="cert">
      <h3 class="cert__title">{{ c.title }}</h3>
      <p v-if="c.issuer" class="cert__issuer mono muted">{{ c.issuer }}</p>
      <ul class="cert__courses">
        <li v-for="co in c.courses" :key="co">{{ co }}</li>
      </ul>
    </article>
  </SectionShell>
</template>

<style scoped>
.cert { margin: 0 0 20px; }
.cert__title { font-family: var(--font-display); font-size: 1.2rem; color: var(--ink-blog); margin: 0 0 4px; }
.cert__issuer { margin: 0 0 8px; }
.cert__courses { margin: 0; padding-left: 20px; }
</style>
