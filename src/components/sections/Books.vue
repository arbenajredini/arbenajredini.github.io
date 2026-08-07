<script setup>
import SectionShell from '../SectionShell.vue'
import { cv } from '../../content/cv'
</script>

<template>
  <SectionShell id="books" kicker="B / Books" title="Books" ink="books">
    <div class="shelf">
      <article
        v-for="(b, i) in cv.books"
        :key="b.title + i"
        class="book-card"
      >
        <div class="book-card__cover" aria-hidden="true">
          <span class="book-card__spine">{{ b.title }}</span>
        </div>
        <h3 class="book-card__title">{{ b.title }}</h3>
        <p class="book-card__author mono muted">{{ b.author }}</p>
        <span class="book-card__status mono">{{ b.status.toUpperCase() }}</span>
        <p class="book-card__note">{{ b.note }}</p>
      </article>
    </div>
  </SectionShell>
</template>

<style scoped>
.shelf { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 24px; }
.book-card { cursor: default; }
.book-card__cover {
  aspect-ratio: 2 / 3;
  background: linear-gradient(115deg, var(--ink-books) 0%, color-mix(in srgb, var(--ink-books) 60%, var(--paper)) 100%);
  border-radius: 4px 10px 10px 4px;
  padding: 10px 8px;
  display: flex;
  box-shadow: 0 10px 18px -12px rgba(0, 0, 0, 0.45);
}
.book-card__spine { align-self: flex-end; font-family: var(--font-display); color: #1B1B1F; font-size: 0.8rem; writing-mode: vertical-rl; text-orientation: mixed; }
.book-card__title { font-family: var(--font-display); font-size: 1rem; margin: 8px 0 2px; }
.book-card__author { margin: 0 0 6px; }
.book-card__status { color: var(--ink-books); font-weight: 600; }
.book-card__note { margin: 8px 0 0; color: var(--ink-muted); }
</style>
