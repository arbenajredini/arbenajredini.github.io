<script setup>
import MisregisterText from '../ui/MisregisterText.vue'
import { cv } from '../../content/cv'

const p = cv.profile
</script>

<template>
  <header class="hero">
    <p class="mono muted">{{ p.location }}</p>
    <MisregisterText
      as="h1"
      class="hero__name"
      :text="p.name"
      :offset="4"
    />
    <p class="hero__role">{{ p.role }}</p>
    <p class="hero__tagline">“<span class="serif-i">{{ p.tagline }}</span>”</p>
    <div class="hero__contact mono">
      <a :href="'mailto:' + p.contact.email">{{ p.contact.email }}</a>
      <span aria-hidden="true"> · </span>
      <a :href="p.contact.website">{{ p.contact.website }}</a>
    </div>
    <nav class="hero__socials" aria-label="Social links">
      <a v-for="s in cv.socials" :key="s.label" :href="s.url" class="mono">{{ s.label }} ↗</a>
    </nav>
  </header>
</template>

<style scoped>
.hero { padding: 72px 0 48px; }
.hero__name { font-family: var(--font-display); font-size: clamp(2.6rem, 7vw, 4.6rem); line-height: 1.02; margin: 8px 0 8px; }
.hero__role { font-family: var(--font-display); font-size: 1.3rem; color: var(--ink-experience); margin: 0 0 16px; }
.hero__tagline { font-size: 1.15rem; color: var(--ink); max-width: 40em; }
.hero__socials { display: flex; flex-wrap: wrap; gap: 18px; margin-top: 24px; }
</style>
