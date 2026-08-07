<script setup>
import { cv } from '../../content/cv'

const p = cv.profile
</script>

<template>
  <header class="hero">
    <p class="mono muted hero__location">{{ p.location }}</p>
    <h1 class="hero__name">{{ p.name }}</h1>
    <svg class="hero__flourish" viewBox="0 0 220 12" aria-hidden="true" focusable="false">
      <path d="M2 8 Q 40 2 110 6 T 218 5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
    </svg>
    <p class="hero__role">{{ p.role }}</p>
    <p class="hero__tagline">“<span class="serif-i">{{ p.tagline }}</span>”</p>
    <div class="hero__contact mono">
      <a :href="'mailto:' + p.contact.email">{{ p.contact.email }}</a>
      <span aria-hidden="true"> · </span>
      <a :href="p.contact.website" target="_blank" rel="noopener">{{ p.contact.website }}</a>
    </div>
    <nav class="hero__socials" aria-label="Social links">
      <a v-for="s in cv.socials" :key="s.label" :href="s.url" class="mono">{{ s.label }} ↗</a>
    </nav>
  </header>
</template>

<style scoped>
.hero { padding: 72px 0 48px; }
.hero__location { margin: 0 0 12px; }
.hero__name { font-family: var(--font-display); font-size: clamp(2.6rem, 7vw, 4.4rem); line-height: 1.02; margin: 0 0 6px; text-wrap: balance; }
.hero__flourish { display: block; width: 220px; max-width: 60%; height: 12px; color: var(--ink); margin: 4px 0 20px; }
.hero__role { font-family: var(--font-display); font-size: 1.3rem; color: var(--ink-experience); margin: 0 0 14px; }
.hero__tagline { font-size: 1.12rem; color: var(--ink); max-width: 40em; margin: 0 0 18px; }
.hero__contact { display: flex; flex-wrap: wrap; gap: 10px; }
.hero__socials { display: flex; flex-wrap: wrap; gap: 18px; margin-top: 20px; }
</style>
