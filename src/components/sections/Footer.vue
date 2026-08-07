<script setup>
import { cv } from '../../content/cv'
</script>

<template>
  <footer class="footer">
    <nav class="footer__socials" aria-label="Social links">
      <a v-for="s in cv.socials" :key="s.label" :href="s.url" class="mono">{{ s.label }} ↗</a>
    </nav>
    <p class="footer__credit serif-i">Typeset with Vue · GSAP · riso ink</p>
    <a href="#top" class="footer__top mono">↑ back to top</a>
  </footer>
</template>

<style scoped>
.footer { border-top: 2px solid var(--ink); margin-top: 72px; padding: 32px 0 56px; display: flex; flex-direction: column; gap: 10px; }
.footer__socials { display: flex; flex-wrap: wrap; gap: 18px; }
.footer__credit { color: var(--ink-muted); margin: 0; }
.footer__top { color: var(--ink); }
</style>
