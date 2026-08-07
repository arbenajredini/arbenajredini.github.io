# Risograph Zine Portfolio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the bare Vue scaffold into an interactive, colorful "Risograph Zine" personal-brand page — vivid spot-color sections, paper grain, misregistration effects, marginalia, and scroll/hover animations — with all content editable from one `cv.js` file.

**Architecture:** A hand-built Vue 3 app. `ZinePage.vue` is the chrome (paper, grain, cursor glow, theme); `App.vue` composes one `SectionShell`-wrapped section per content area. All content is read from `src/content/cv.js`. A `useTheme` composable manages the paper ⇄ ink toggle; a `useReveal` composable wraps GSAP + ScrollTrigger for scroll/hover choreography. All colors are CSS custom properties (riso ink tokens). Tests use Vitest + @vue/test-utils + happy-dom with a setup stub that reports reduced-motion so animation no-ops deterministically in tests.

**Tech Stack:** Vue 3.5, Vite 6, Tailwind 4 (kept), GSAP + ScrollTrigger, Vitest + @vue/test-utils + happy-dom, Fontsource (`space-grotesk`, `inter`, `jetbrains-mono`, `crimson-pro`).

## Global Constraints

- Vue 3 + Vite + Tailwind 4 stay; **no new framework**. `npm run dev` / `build` / `deploy` scripts unchanged.
- Animation = **GSAP + ScrollTrigger only** (import `gsap` + `ScrollTrigger`, register once). No other animation libs.
- Fonts self-hosted via Fontsource, `font-display: swap`: display = **Space Grotesk 700**, body = **Inter**, mono = **JetBrains Mono**, serif-italic accent = **Crimson Pro italic**. No other font families in v1.
- **All content** comes from `src/content/cv.js` (single editable file, realistic placeholder data). Components never hard-code names, roles, or links.
- Riso ink tokens — exact hexes (light "paper" / dark "night riso"): paper `#FAF8F3`/`#121215`; ink `#1B1B1F`/`#E9E6DF`; experience `#FF4A00`/`#FF6A1F`; projects `#1F7DFF`/`#4DA3FF`; research `#FF2E93`/`#FF4DA6`; books `#F5B400`/`#FFD21F`; blog `#00A896`/`#2BC9B4`; skills `#7C4DFF`/`#9B7BFF`; muted `#6B6B6B`/`#9C9A92`.
- Theme attribute is `data-theme="paper"|"ink"` on `<html>`; persisted in `localStorage['zine-theme']`; default from `prefers-color-scheme`.
- Every animation must **respect `prefers-reduced-motion`** and touch only `transform`/`opacity` (no layout thrash).
- No literal document scaffolding: **no** § numbering, TOC, paginated sheets, running heads, or `$` typewriter asides.
- Deploy (`npm run deploy`) runs **only when the owner asks** — never as part of a task's passing criteria.

---

### Task 1: Test toolchain + content model

**Files:**
- Modify: `package.json` (devDeps + scripts)
- Create: `src/test/setup.js`
- Modify: `vite.config.js` (vitest config)
- Create: `src/content/cv.js`
- Test: `src/content/cv.test.js`

**Interfaces:**
- Produces: `src/content/cv.js` exporting `export const cv = { profile, experience, projects, research, books, posts, skills, socials }`. Exact field shapes (components in later tasks rely on these names):
  - `profile`: `{ name, role, tagline, location, contact: { email, website } }`
  - `experience[]`: `{ company, role, period, summary, bullets: string[], tags: string[] }`
  - `projects[]`: `{ title, subtitle, description, problem, approach, stack: string[], links: { live?, repo? } }`
  - `research[]`: `{ title, venue, year, abstract, url? }`
  - `books[]`: `{ title, author, status: 'read'|'reading'|'tbr', note }`
  - `posts[]`: `{ title, date, excerpt, url, tags: string[] }`
  - `skills`: `{ groups: [{ name, items: [{ skill, level }] }] }` — `level` is integer 0–100
  - `socials[]`: `{ label, url }`

- [ ] **Step 1: Install dev dependencies**

```bash
npm i -D vitest @vue/test-utils happy-dom
```

- [ ] **Step 2: Add test scripts to `package.json`**

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "deploy": "vite build && gh-pages -d dist",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 3: Configure vitest in `vite.config.js`** (replace the file contents)

```js
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
  },
})
```

- [ ] **Step 4: Create the test setup stub** `src/test/setup.js`

This makes `matchMedia` report reduced-motion so every animation no-ops deterministically in tests (see `useReveal.canAnimate` in Task 4). `useTheme` tests override `window.matchMedia` locally.

```js
// Stub matchMedia: report reduced-motion so animation code no-ops in tests.
window.matchMedia = (query) => ({
  matches: query.includes('prefers-reduced-motion'),
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
})
```

- [ ] **Step 5: Write the failing content test** `src/content/cv.test.js`

```js
import { describe, it, expect } from 'vitest'
import { cv } from './cv'

describe('cv content model', () => {
  it('has all top-level sections', () => {
    for (const key of ['profile', 'experience', 'projects', 'research', 'books', 'posts', 'skills', 'socials']) {
      expect(cv[key], `missing ${key}`).toBeDefined()
    }
  })

  it('profile has name, role, tagline, contact', () => {
    expect(typeof cv.profile.name).toBe('string')
    expect(typeof cv.profile.role).toBe('string')
    expect(typeof cv.profile.tagline).toBe('string')
    expect(typeof cv.profile.contact.email).toBe('string')
    expect(typeof cv.profile.contact.website).toBe('string')
  })

  it('experience entries have the required fields', () => {
    for (const e of cv.experience) {
      expect(e.company && e.role && e.period).toBeTruthy()
      expect(Array.isArray(e.bullets)).toBe(true)
      expect(Array.isArray(e.tags)).toBe(true)
    }
  })

  it('projects have title, description, stack', () => {
    for (const p of cv.projects) {
      expect(typeof p.title).toBe('string')
      expect(typeof p.description).toBe('string')
      expect(Array.isArray(p.stack)).toBe(true)
    }
  })

  it('research entries have title, venue, year', () => {
    for (const r of cv.research) {
      expect(typeof r.title).toBe('string')
      expect(typeof r.venue).toBe('string')
      expect(typeof r.year).toBe('number')
    }
  })

  it('books have a valid status', () => {
    for (const b of cv.books) {
      expect(['read', 'reading', 'tbr']).toContain(b.status)
    }
  })

  it('skill levels are integers in 0..100', () => {
    for (const g of cv.skills.groups) {
      for (const it of g.items) {
        expect(Number.isInteger(it.level)).toBe(true)
        expect(it.level).toBeGreaterThanOrEqual(0)
        expect(it.level).toBeLessThanOrEqual(100)
      }
    }
  })
})
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot find module `./cv` (file does not exist yet).

- [ ] **Step 7: Create the content file** `src/content/cv.js`

Realistic placeholder content the owner will replace. Realistic enough that the site looks alive on day one.

```js
// Single source of truth for the entire portfolio.
// Replace these placeholders with your real content — do not change the shape.
export const cv = {
  profile: {
    name: 'Arben Ajredini',
    role: 'Software Developer',
    tagline: 'Builds fast, colorful software. Reads. Researches. Writes it down.',
    location: 'Prishtina, Kosovo',
    contact: {
      email: 'you@example.com',
      website: 'https://github.com/you',
    },
  },
  experience: [
    {
      company: 'Acme Corp',
      role: 'Senior Software Engineer',
      period: '2022 — Present',
      summary: 'Building the team’s realtime platform on Vue and Go.',
      note: 'The event-driven migration that made p95 drops real.',
      bullets: [
        'Led migration of the billing service to event-driven architecture, cutting p95 latency 40%.',
        'Mentored three junior engineers; ran the frontend guild.',
      ],
      tags: ['Vue', 'Go', 'Kafka', 'Postgres'],
    },
    {
      company: 'Beta Labs',
      role: 'Software Engineer',
      period: '2019 — 2022',
      summary: 'Full-stack features across a research-data product.',
      bullets: [
        'Shipped the annotation pipeline used by 200+ researchers.',
        'Introduced typed API client generation, removing a whole class of bugs.',
      ],
      tags: ['TypeScript', 'React', 'Python', 'Docker'],
    },
  ],
  projects: [
    {
      title: 'papergrid',
      subtitle: 'A tiny layout grid for experimental zines',
      description: 'A zero-dependency CSS grid for making riso-style layouts.',
      problem: 'Every zine tool assumed print; the web needed a live grid.',
      approach: 'A 12-column fluid grid with riso ink palettes built in.',
      stack: ['CSS', 'JS', 'PostCSS'],
      links: { live: 'https://example.com/papergrid', repo: 'https://github.com/you/papergrid' },
    },
    {
      title: 'marginalia',
      subtitle: 'Commentary that lives in the margin',
      description: 'A bookmarklet that adds margin notes to any page.',
      problem: 'Comments destroy document layout.',
      approach: 'Position annotations in a reflowed gutter beside their anchor.',
      stack: ['TypeScript', 'DOM', 'Vite'],
      links: { repo: 'https://github.com/you/marginalia' },
    },
  ],
  research: [
    {
      title: 'Realtime layouts with constraint-based editors',
      venue: 'Example Conference on Interactive Systems',
      year: 2024,
      abstract: 'A framework for layout engines that keep interactive editors realtime by constraining the recompute surface.',
      url: 'https://example.com/paper-1',
    },
    {
      title: 'The typographic baseline grid as a UX primitive',
      venue: 'Journal of Interface Craft',
      year: 2023,
      abstract: 'Argues the print baseline grid is a usable spatial grammar for web interfaces.',
      url: 'https://example.com/paper-2',
    },
  ],
  books: [
    { title: 'The Design of Everyday Things', author: 'Don Norman', status: 'read', note: 'Reread every two years; still sharp.' },
    { title: 'Thinking in Systems', author: 'Donella Meadows', status: 'reading', note: 'Midway — chapter on leverage points.' },
    { title: 'A Pattern Language', author: 'Christopher Alexander', status: 'tbr', note: 'Waiting on the shelf, it’s huge.' },
  ],
  posts: [
    {
      title: 'Why your portfolio should look like a zine',
      date: '2026-05-12',
      excerpt: 'Printed ephemera has a visual honesty that corporate templates lost.',
      url: 'https://example.com/blog/zine',
      tags: ['design', 'web'],
    },
    {
      title: 'Notes on baseline grids',
      date: '2026-03-02',
      excerpt: 'A practical cheatsheet for vertical rhythm with CSS.',
      url: 'https://example.com/blog/grids',
      tags: ['typography', 'css'],
    },
  ],
  skills: {
    groups: [
      { name: 'Languages', items: [ { skill: 'JavaScript', level: 95 }, { skill: 'TypeScript', level: 90 }, { skill: 'Go', level: 80 } ] },
      { name: 'Frontend', items: [ { skill: 'Vue', level: 92 }, { skill: 'CSS/Tailwind', level: 88 }, { skill: 'WebGL', level: 60 } ] },
      { name: 'Tools', items: [ { skill: 'Git', level: 96 }, { skill: 'Docker', level: 74 }, { skill: 'CI', level: 70 } ] },
    ],
  },
  socials: [
    { label: 'GitHub', url: 'https://github.com/you' },
    { label: 'X', url: 'https://x.com/you' },
    { label: 'Email', url: 'mailto:you@example.com' },
  ],
}
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `npm test`
Expected: PASS (all content-shape assertions).

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json vite.config.js src/test/setup.js src/content/cv.js src/content/cv.test.js
git commit -m "feat: add content model and vitest toolchain"
```

---

### Task 2: Theme composable (paper / night-riso)

**Files:**
- Create: `src/composables/useTheme.js`
- Test: `src/composables/useTheme.test.js`

**Interfaces:**
- Produces: `useTheme()` returns `{ theme: Ref<'paper'|'ink'>, setTheme(name), toggle() }`.
  - On init: read `localStorage['zine-theme']`; if unset, use `matchMedia('(prefers-color-scheme: dark)').matches` → `'ink'`, else `'paper'`.
  - Side effect: sets `document.documentElement.dataset.theme = theme` on init and on every change.
  - `setTheme(name)` clamps to the two valid values and writes `localStorage['zine-theme']`.
  - `toggle()` flips `paper ⇄ ink`.

- [ ] **Step 1: Write the failing test** `src/composables/useTheme.test.js`

```js
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTheme } from './useTheme'

function stubMatchMedia(queries) {
  window.matchMedia = (query) => ({
    matches: Boolean(queries[query]),
    media: query,
    addListener: () => {}, removeListener: () => {},
    addEventListener: () => {}, removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

describe('useTheme', () => {
  it('defaults to paper when no preference is stored and OS is light', () => {
    stubMatchMedia({ '(prefers-color-scheme: dark)': false })
    const { theme } = useTheme()
    expect(theme.value).toBe('paper')
    expect(document.documentElement.dataset.theme).toBe('paper')
  })

  it('defaults to ink when the OS prefers dark', () => {
    stubMatchMedia({ '(prefers-color-scheme: dark)': true })
    const { theme } = useTheme()
    expect(theme.value).toBe('ink')
  })

  it('persists the choice and restores it on next init', () => {
    stubMatchMedia({ '(prefers-color-scheme: dark)': false })
    const a = useTheme()
    a.toggle() // paper -> ink
    expect(localStorage.getItem('zine-theme')).toBe('ink')

    const b = useTheme() // fresh call reads storage first
    expect(b.theme.value).toBe('ink')
    expect(document.documentElement.dataset.theme).toBe('ink')
  })

  it('setTheme clamps invalid values to paper', () => {
    stubMatchMedia({ '(prefers-color-scheme: dark)': false })
    const { setTheme } = useTheme()
    setTheme('nonsense')
    expect(document.documentElement.dataset.theme).toBe('paper')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/composables/useTheme.test.js`
Expected: FAIL — cannot find module `./useTheme`.

- [ ] **Step 3: Implement `src/composables/useTheme.js`**

```js
import { ref } from 'vue'

const STORAGE_KEY = 'zine-theme'
const VALID = ['paper', 'ink']

function osPreference() {
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'ink' : 'paper'
  }
  return 'paper'
}

export function useTheme() {
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
  const theme = ref(VALID.includes(stored) ? stored : osPreference())

  function apply() {
    document.documentElement.dataset.theme = theme.value
  }

  function setTheme(name) {
    theme.value = VALID.includes(name) ? name : 'paper'
    localStorage.setItem(STORAGE_KEY, theme.value)
    apply()
  }

  function toggle() {
    setTheme(theme.value === 'paper' ? 'ink' : 'paper')
  }

  apply() // initial
  return { theme, setTheme, toggle }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/composables/useTheme.test.js`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/composables/useTheme.js src/composables/useTheme.test.js
git commit -m "feat: add paper/ink theme composable"
```

---

### Task 3: Style foundation + ZinePage chrome + App wiring

**Files:**
- Modify: `src/style.css` (full design system)
- Create: `src/components/ZinePage.vue`
- Modify: `src/App.vue`
- Test: `src/components/ZinePage.test.js`

**Interfaces:**
- Consumes: `useTheme()` from Task 2.
- Produces: `ZinePage.vue` — default-slot wrapper that (a) initializes the theme, (b) renders the paper, grain overlay, and cursor-glow layers, and (c) provides `.zine__main` with a left marginal gutter on desktop. Later tasks slot section components into it. CSS classes/components that later tasks rely on: `.zine`, `.zine__grain`, `.zine__glow`, `.zine__main`, `.zine__gutter`, `.zine__content`, and token classes `.ink-experience`, `.ink-projects`, `.ink-research`, `.ink-books`, `.ink-blog`, `.ink-skills`.

- [ ] **Step 1: Install fonts + gsap**

```bash
npm i gsap @fontsource/space-grotesk @fontsource/inter @fontsource/jetbrains-mono @fontsource/crimson-pro
```

- [ ] **Step 2: Write the failing ZinePage test** `src/components/ZinePage.test.js`

```js
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ZinePage from './ZinePage.vue'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

describe('ZinePage', () => {
  it('renders slot content and paper/ink chrome', () => {
    const wrapper = mount(ZinePage, {
      slots: { default: '<p class="probe">hello</p>' },
    })
    expect(wrapper.find('.probe').exists()).toBe(true)
    expect(wrapper.find('.zine').exists()).toBe(true)
    expect(wrapper.find('.zine__grain').exists()).toBe(true)
  })

  it('initializes the theme attribute on the root element', () => {
    mount(ZinePage)
    expect(document.documentElement.dataset.theme).toBe('paper')
  })
})
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npx vitest run src/components/ZinePage.test.js`
Expected: FAIL — cannot find module `./ZinePage.vue`.

- [ ] **Step 4: Write the design system** — replace `src/style.css`

```css
@import "tailwindcss";
@import "@fontsource/inter/400.css";
@import "@fontsource/inter/600.css";
@import "@fontsource/space-grotesk/700.css";
@import "@fontsource/jetbrains-mono/400.css";
@import "@fontsource/crimson-pro/400-italic.css";

:root {
  --font-display: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
  --font-serif-italic: "Crimson Pro", Georgia, serif;
  --grain-opacity: 0.05;
}

:root, :root[data-theme="paper"] {
  --paper: #FAF8F3;
  --ink: #1B1B1F;
  --ink-muted: #6B6B6B;
  --ink-experience: #FF4A00;
  --ink-projects: #1F7DFF;
  --ink-research: #FF2E93;
  --ink-books: #F5B400;
  --ink-blog: #00A896;
  --ink-skills: #7C4DFF;
}

:root[data-theme="ink"] {
  --paper: #121215;
  --ink: #E9E6DF;
  --ink-muted: #9C9A92;
  --ink-experience: #FF6A1F;
  --ink-projects: #4DA3FF;
  --ink-research: #FF4DA6;
  --ink-books: #FFD21F;
  --ink-blog: #2BC9B4;
  --ink-skills: #9B7BFF;
  --grain-opacity: 0.08;
}

html { scroll-behavior: smooth; }

body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 17px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  transition: background 0.4s ease, color 0.4s ease;
}

/* ink-color helper classes (used by section components) */
.ink-experience { color: var(--ink-experience); }
.ink-projects   { color: var(--ink-projects); }
.ink-research   { color: var(--ink-research); }
.ink-books      { color: var(--ink-books); }
.ink-blog       { color: var(--ink-blog); }
.ink-skills     { color: var(--ink-skills); }

/* ---- Zine page chrome ---- */
.zine { position: relative; min-height: 100vh; }

.zine__grain {
  position: fixed; inset: 0;
  pointer-events: none;
  opacity: var(--grain-opacity);
  z-index: 60;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

.zine__glow {
  position: fixed; inset: 0; pointer-events: none; z-index: 55;
  background: radial-gradient(420px at var(--mx, 50%) var(--my, 30%), color-mix(in srgb, var(--ink-blog) 10%, transparent), transparent 70%);
  opacity: 0; transition: opacity 0.4s ease;
}
:root[data-theme="ink"] .zine__glow { opacity: 1; }
@media (hover: none) { .zine__glow { display: none; } }

.zine__main {
  position: relative;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (min-width: 960px) {
  .zine__main { padding-left: 200px; } /* reserve the marginal gutter */
}

/* ---- Section shell ---- */
.section { padding: 64px 0 32px; }

.section__kicker {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin: 0 0 12px;
}

.section__title { margin: 0 0 24px; }

/* ---- Misregistration headline ---- */
.misregister { position: relative; display: inline-block; }
.misregister::after {
  content: attr(data-text);
  position: absolute; inset: 0;
  color: var(--ghost, var(--ink-blog));
  transform: translate(var(--offset, 3px), var(--offset, 3px));
  z-index: -1;
  transition: transform 0.25s ease;
}
.misregister:hover::after { transform: translate(calc(var(--offset, 3px) + 3px), calc(var(--offset, 3px) + 3px)); }

/* ---- Shared elements ---- */
.mono { font-family: var(--font-mono); font-size: 13px; }
.muted { color: var(--ink-muted); }
.rule { border: 0; border-top: 2px solid currentColor; margin: 0; }
.serif-i { font-family: var(--font-serif-italic); font-style: italic; }

a { color: var(--ink); text-decoration-color: var(--ink-muted); transition: color 0.2s ease; }
a:hover { color: var(--ink-experience); }

:focus-visible { outline: 2px solid var(--ink-skills); outline-offset: 3px; }

.skip-link {
  position: absolute; left: -999px; top: 8px; z-index: 100;
  background: var(--paper); padding: 8px 12px; border-radius: 6px;
}
.skip-link:focus { left: 8px; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { transition: none !important; animation: none !important; }
}
```

- [ ] **Step 5: Create `src/components/ZinePage.vue`**

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useTheme } from '../composables/useTheme'

const { theme } = useTheme()
const glow = ref(null)

function onPointer(e) {
  if (!glow.value) return
  glow.value.style.setProperty('--mx', `${e.clientX}px`)
  glow.value.style.setProperty('--my', `${e.clientY}px`)
}

onMounted(() => {
  window.addEventListener('pointermove', onPointer)
})
</script>

<template>
  <div class="zine" :data-theme="theme">
    <div ref="glow" class="zine__glow" aria-hidden="true"></div>
    <div class="zine__main">
      <slot />
    </div>
    <div class="zine__grain" aria-hidden="true"></div>
  </div>
</template>
```

- [ ] **Step 6: Wire `App.vue`** (hero comes in Task 5; for now render a placeholder section so the app builds)

```vue
<script setup>
import ZinePage from './components/ZinePage.vue'
</script>

<template>
  <ZinePage>
    <p class="serif-i" style="padding-top: 4rem">The zine is being typeset…</p>
  </ZinePage>
</template>
```

- [ ] **Step 7: Run the tests**

Run: `npm test`
Expected: PASS — content model + useTheme + ZinePage tests all green.

- [ ] **Step 8: Commit**

```bash
git add src/style.css src/components/ZinePage.vue src/App.vue src/components/ZinePage.test.js package.json package-lock.json
git commit -m "feat: add riso design system and zine page chrome"
```

---

### Task 4: useReveal composable (GSAP scroll choreography)

**Files:**
- Create: `src/composables/useReveal.js`
- Test: `src/composables/useReveal.test.js`

**Interfaces:**
- Consumes: GSAP (installed in Task 3).
- Produces: `useReveal()` returning:
  - `canAnimate(): boolean` — `false` if no `window`/`matchMedia`, or `prefers-reduced-motion: reduce` matches.
  - `reveal(el, { y = 12, duration = 0.6, delay = 0 } = {})` — one-shot fade/slide on scroll entry.
  - `stagger(container, { items, y = 12, each = 0.08 } = {})` — cascade reveal for `items` (NodeList or array) inside `container`.
  - `drawLine(el)` — scrubbed scaleY 0→1 tied to scroll (used by the experience timeline).
  - `countUp(el, { target = 0, suffix = '' } = {})` — animates the element’s text from 0 → `target` on entry.
  - All functions **no-op** when `canAnimate()` is false (this is what keeps component tests deterministic).

- [ ] **Step 1: Write the failing test** `src/composables/useReveal.test.js`

```js
import { describe, it, expect } from 'vitest'
import { useReveal } from './useReveal'

describe('useReveal', () => {
  it('canAnimate is false under reduced motion (the test-stub default)', () => {
    const { canAnimate } = useReveal()
    expect(canAnimate()).toBe(false)
  })

  it('canAnimate is true when motion is allowed', () => {
    window.matchMedia = (query) => ({ matches: false, media: query, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false })
    const { canAnimate } = useReveal()
    expect(canAnimate()).toBe(true)
  })

  it('all hooks are functions and tolerate null elements', () => {
    const r = useReveal()
    for (const fn of ['reveal', 'stagger', 'drawLine', 'countUp']) {
      expect(typeof r[fn]).toBe('function')
      expect(() => r[fn](null)).not.toThrow()
    }
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/composables/useReveal.test.js`
Expected: FAIL — cannot find module `./useReveal`.

- [ ] **Step 3: Implement `src/composables/useReveal.js`**

```js
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useReveal() {
  function canAnimate() {
    if (typeof window === 'undefined') return false
    if (typeof window.matchMedia !== 'function') return false
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  function reveal(el, { y = 12, duration = 0.6, delay = 0 } = {}) {
    if (!el || !canAnimate()) return
    gsap.fromTo(el,
      { autoAlpha: 0, y },
      { autoAlpha: 1, y: 0, duration, delay, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
  }

  function stagger(container, { items, y = 12, each = 0.08 } = {}) {
    if (!container || !items || !items.length || !canAnimate()) return
    const els = Array.from(items)
    gsap.fromTo(els,
      { autoAlpha: 0, y },
      { autoAlpha: 1, y: 0, duration: 0.5, stagger: each, ease: 'power2.out',
        scrollTrigger: { trigger: container, start: 'top 80%', once: true } })
  }

  function drawLine(el) {
    if (!el || !canAnimate()) return
    gsap.fromTo(el,
      { scaleY: 0 },
      { scaleY: 1, ease: 'none',
        transformOrigin: 'top center',
        scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 40%', scrub: 0.6 } })
  }

  function countUp(el, { target = 0, suffix = '' } = {}) {
    if (!el || !canAnimate()) { if (el) el.textContent = target + suffix; return }
    const obj = { v: 0 }
    gsap.to(obj, {
      v: target, duration: 1.1, ease: 'power1.out',
      onUpdate: () => { el.textContent = Math.round(obj.v) + suffix },
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    })
  }

  return { canAnimate, reveal, stagger, drawLine, countUp }
}
```

Note: when `canAnimate()` is false, `countUp` still sets the final text so static render shows the number.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/composables/useReveal.test.js`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/composables/useReveal.js src/composables/useReveal.test.js
git commit -m "feat: add GSAP scroll choreography composable"
```

---

### Task 5: SectionShell + MisregisterText + Hero

**Files:**
- Create: `src/components/ui/MisregisterText.vue`
- Create: `src/components/SectionShell.vue`
- Create: `src/components/sections/Hero.vue`
- Modify: `src/App.vue`
- Tests: `src/components/ui/MisregisterText.test.js`, `src/components/sections/Hero.test.js`

**Interfaces:**
- Consumes: `useReveal()` (Task 4), `cv` (Task 1).
- Produces:
  - `MisregisterText` props: `{ as = 'h2', text, ghost = 'var(--ink-blog)', offset = 3 }`. Renders a `<component :is="as">` with class `misregister`, `data-text` = text, inline style `--ghost` and `--offset`. The `::after` pseudo (CSS in Task 3) creates the offset duplicate; hover shifts it.
  - `SectionShell` props: `{ id, kicker, title, ink }` — renders `<section :id>` with `.section`, the mono kicker line (`kicker` e.g. `02 / EXPERIENCE`), a `.section__title` `MisregisterText`, and a default slot. `ink` (e.g. `'experiences'`) maps to a token class via `'ink-' + ink`.
  - `Hero.vue` — reads `cv.profile` + `cv.socials`; renders name as a giant `MisregisterText` (as `h1`, black ink + fluorescent ghost), role, tagline (with a `.serif-i` accent), location, contact links, and social links.
- CSS the components rely on (already in `style.css`): `.section`, `.section__kicker`, `.section__title`, `.misregister`, `.serif-i`, `.mono`, `.muted`, `.ink-*`.

- [ ] **Step 1: Write failing tests**

`src/components/ui/MisregisterText.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MisregisterText from './MisregisterText.vue'

describe('MisregisterText', () => {
  it('renders the text and data-text for the ghost duplicate', () => {
    const w = mount(MisregisterText, { props: { text: 'EXPERIENCE' } })
    expect(w.text()).toContain('EXPERIENCE')
    expect(w.find('.misregister').attributes('data-text')).toBe('EXPERIENCE')
  })
  it('honors the `as` prop', () => {
    const w = mount(MisregisterText, { props: { as: 'h1', text: 'Hi' } })
    expect(w.find('h1').exists()).toBe(true)
  })
})
```

`src/components/sections/Hero.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Hero from './Hero.vue'
import { cv } from '../../content/cv'

describe('Hero', () => {
  it('renders the profile name and role', () => {
    const w = mount(Hero)
    expect(w.text()).toContain(cv.profile.name)
    expect(w.text()).toContain(cv.profile.role)
  })
  it('renders social links from cv.socials', () => {
    const w = mount(Hero)
    const links = w.findAll('a').map(a => a.attributes('href'))
    for (const s of cv.socials) expect(links).toContain(s.url)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/ui/MisregisterText.test.js src/components/sections/Hero.test.js`
Expected: FAIL — cannot find modules `./MisregisterText.vue` / `./Hero.vue`.

- [ ] **Step 3: Create `src/components/ui/MisregisterText.vue`**

```vue
<script setup>
defineProps({
  as: { type: String, default: 'h2' },
  text: { type: String, required: true },
  ghost: { type: String, default: 'var(--ink-blog)' },
  offset: { type: Number, default: 3 },
})
</script>

<template>
  <component
    :is="as"
    class="misregister"
    :data-text="text"
    :style="{ '--ghost': ghost, '--offset': offset + 'px' }"
  >{{ text }}</component>
</template>
```

- [ ] **Step 4: Create `src/components/SectionShell.vue`**

```vue
<script setup>
import { onMounted, ref } from 'vue'
import MisregisterText from './ui/MisregisterText.vue'
import { useReveal } from '../composables/useReveal'

const props = defineProps({
  id: { type: String, required: true },
  kicker: { type: String, required: true },
  title: { type: String, required: true },
  ink: { type: String, required: true },
})

const root = ref(null)
const { reveal } = useReveal()
onMounted(() => { reveal(root.value) })
</script>

<template>
  <section :id="id" ref="root" class="section">
    <p class="section__kicker" :class="'ink-' + ink">{{ kicker }}</p>
    <MisregisterText as="h2" class="section__title" :text="title" :class="'ink-' + ink" />
    <slot />
  </section>
</template>
```

- [ ] **Step 5: Create `src/components/sections/Hero.vue`**

```vue
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
```

- [ ] **Step 6: Update `App.vue`**

```vue
<script setup>
import ZinePage from './components/ZinePage.vue'
import Hero from './components/sections/Hero.vue'
</script>

<template>
  <ZinePage>
    <Hero />
  </ZinePage>
</template>
```

- [ ] **Step 7: Run the full test suite**

Run: `npm test`
Expected: PASS — all tests green.

- [ ] **Step 8: Manual smoke check**

Run: `npm run dev` → open the page. The hero should show the fluorescent-offset name, and the theme toggle chip should not exist yet (added in Task 12) — but the page must render paper, grain, and the hero.

- [ ] **Step 9: Commit**

```bash
git add src/components/ui/MisregisterText.vue src/components/SectionShell.vue src/components/sections/Hero.vue src/App.vue src/components/ui/MisregisterText.test.js src/components/sections/Hero.test.js
git commit -m "feat: add section shell, misregistration text, and hero"
```

---

### Task 6: Marginalia + Experience timeline

**Files:**
- Create: `src/components/Marginalia.vue`
- Create: `src/components/sections/Experience.vue`
- Modify: `src/style.css` (global `.marginalia` styles + mobile media query)
- Modify: `src/App.vue`
- Tests: `src/components/Marginalia.test.js`, `src/components/sections/Experience.test.js`

**Interfaces:**
- Consumes: `cv.experience` (each entry may have an optional `note`), `SectionShell`, `useReveal.drawLine` + `stagger`.
- Produces:
  - `Marginalia.vue` — `<aside class="marginalia">` with a default slot and optional `ink` prop (a CSS color, default `var(--ink-muted)`) exposed as `--mink`. Positioning is handled by global CSS (below): absolutely placed in the left gutter (`right: calc(100% + 28px)`, `width: 170px`), hidden below 960px, and fades in when its anchor (a `position: relative` parent such as `.timeline__item`) is hovered or focused. This is the zine’s kept *marginalia* feature.
  - `Experience.vue` — `<SectionShell id="experience" kicker="02 / Experience" title="Experience" ink="experience">` with a `.timeline`, a `.timeline__line` (the scroll-drawn rule), and one `.timeline__item` per role (`period` mono, `company`, `role`, `summary`, `bullets`, `tags`). Items with `e.note` render `<Marginalia :ink="'var(--ink-experience)'">{{ e.note }}</Marginalia>`. On mount: `drawLine(line)`, `stagger(timeline, { items })`.

- [ ] **Step 1: Write the failing tests**

`src/components/Marginalia.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Marginalia from './Marginalia.vue'

describe('Marginalia', () => {
  it('renders its note in an aside.marginalia', () => {
    const w = mount(Marginalia, { slots: { default: 'a margin note' } })
    expect(w.text()).toContain('a margin note')
    expect(w.find('aside.marginalia').exists()).toBe(true)
  })
})
```

`src/components/sections/Experience.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Experience from './Experience.vue'
import { cv } from '../../content/cv'

describe('Experience', () => {
  it('renders every role from cv.experience', () => {
    const w = mount(Experience)
    for (const e of cv.experience) {
      expect(w.text()).toContain(e.company)
      expect(w.text()).toContain(e.role)
      expect(w.text()).toContain(e.period)
    }
  })
  it('renders the timeline line to draw', () => {
    const w = mount(Experience)
    expect(w.find('.timeline__line').exists()).toBe(true)
    expect(w.findAll('.timeline__item').length).toBe(cv.experience.length)
  })
  it('renders a margin note for roles that have one', () => {
    const w = mount(Experience)
    if (cv.experience.some(e => e.note)) {
      expect(w.findAll('.marginalia').length).toBeGreaterThan(0)
    }
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/Marginalia.test.js src/components/sections/Experience.test.js`
Expected: FAIL — cannot find modules `./Marginalia.vue` / `./Experience.vue`.

- [ ] **Step 3: Add global marginalia styles to `src/style.css`**

Append (after the `.marginalia`-free block that ends the existing stylesheet, i.e. after the reduced-motion media query):

```css
/* ---- Marginalia (gutter notes) ---- */
.marginalia {
  position: absolute;
  right: calc(100% + 28px);
  width: 170px;
  top: 4px;
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--mink, var(--ink-muted));
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 0.25s ease, transform 0.25s ease;
  pointer-events: none;
}
.marginalia::before { content: "\21B3 "; color: var(--mink, var(--ink-muted)); }
.timeline__item:hover .marginalia,
.timeline__item:focus-within .marginalia { opacity: 1; transform: translateX(0); }
@media (max-width: 959px) { .marginalia { display: none; } }
```

- [ ] **Step 4: Create `src/components/Marginalia.vue`**

```vue
<script setup>
defineProps({
  ink: { type: String, default: 'var(--ink-muted)' },
})
</script>

<template>
  <aside class="marginalia mono" :style="{ '--mink': ink }">
    <slot />
  </aside>
</template>
```

- [ ] **Step 5: Create `src/components/sections/Experience.vue`**

```vue
<script setup>
import { onMounted, ref } from 'vue'
import SectionShell from '../SectionShell.vue'
import Marginalia from '../Marginalia.vue'
import { useReveal } from '../../composables/useReveal'
import { cv } from '../../content/cv'

const timeline = ref(null)
const line = ref(null)
const items = ref([])
const { drawLine, stagger } = useReveal()

onMounted(() => {
  drawLine(line.value)
  stagger(timeline.value, { items: items.value })
})
</script>

<template>
  <SectionShell id="experience" kicker="02 / Experience" title="Experience" ink="experience">
    <div ref="timeline" class="timeline">
      <div ref="line" class="timeline__line" aria-hidden="true"></div>
      <article
        v-for="(e, i) in cv.experience"
        :key="e.company + i"
        ref="items"
        class="timeline__item"
      >
        <Marginalia v-if="e.note" :ink="'var(--ink-experience)'">{{ e.note }}</Marginalia>
        <p class="mono muted timeline__period">{{ e.period }}</p>
        <h3 class="timeline__company">{{ e.company }}</h3>
        <p class="timeline__role">{{ e.role }}</p>
        <p class="timeline__summary">{{ e.summary }}</p>
        <ul class="timeline__bullets">
          <li v-for="b in e.bullets" :key="b">{{ b }}</li>
        </ul>
        <ul class="timeline__tags mono">
          <li v-for="t in e.tags" :key="t" class="timeline__tag">{{ t }}</li>
        </ul>
      </article>
    </div>
  </SectionShell>
</template>

<style scoped>
.timeline { position: relative; padding-left: 28px; }
.timeline__line {
  position: absolute; left: 0; top: 4px; bottom: 4px; width: 3px;
  background: var(--ink-experience); transform-origin: top center;
}
.timeline__item { position: relative; margin: 0 0 40px; }
.timeline__item:last-child { margin-bottom: 0; }
.timeline__period { margin: 0 0 6px; }
.timeline__company { font-family: var(--font-display); font-size: 1.35rem; margin: 0 0 2px; }
.timeline__role { margin: 0 0 8px; color: var(--ink-experience); font-weight: 600; }
.timeline__summary { margin: 0 0 10px; }
.timeline__bullets { margin: 0 0 10px; padding-left: 20px; }
.timeline__tags { display: flex; flex-wrap: wrap; gap: 8px; padding: 0; list-style: none; }
.timeline__tag { color: var(--ink-muted); }
</style>
```

- [ ] **Step 6: Update `App.vue`** — add `Experience` after `Hero` inside `ZinePage`.

```vue
<script setup>
import ZinePage from './components/ZinePage.vue'
import Hero from './components/sections/Hero.vue'
import Experience from './components/sections/Experience.vue'
</script>

<template>
  <ZinePage>
    <Hero />
    <Experience />
  </ZinePage>
</template>
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npx vitest run src/components/Marginalia.test.js src/components/sections/Experience.test.js`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/components/Marginalia.vue src/components/sections/Experience.vue src/style.css src/App.vue src/components/Marginalia.test.js src/components/sections/Experience.test.js
git commit -m "feat: add scroll-drawn experience timeline and marginalia"
```

---

### Task 7: Projects with expandable case studies

**Files:**
- Create: `src/components/sections/Projects.vue`
- Modify: `src/App.vue`
- Test: `src/components/sections/Projects.test.js`

**Interfaces:**
- Consumes: `cv.projects`, `SectionShell`, `useReveal.stagger`.
- Produces: `Projects.vue` — `<SectionShell id="projects" kicker="03 / Projects" title="Projects" ink="projects">` containing a `.projects` grid of `.project-card`s. Each card: `title`, `subtitle`, `description`, `stack` tags, and a toggle `<button class="project-card__toggle" aria-expanded>` labelled “Case study”. Expanded content (`.project-card__study`) shows `problem`, `approach`, and `links.live` / `links.repo`. Cards reveal via `stagger` on mount. Toggle uses local `reactive` state keyed by index.

- [ ] **Step 1: Write the failing test** `src/components/sections/Projects.test.js`

```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Projects from './Projects.vue'
import { cv } from '../../content/cv'

describe('Projects', () => {
  it('renders every project title', () => {
    const w = mount(Projects)
    for (const p of cv.projects) expect(w.text()).toContain(p.title)
  })
  it('toggles the case-study drawer with aria-expanded', async () => {
    const w = mount(Projects)
    const toggle = w.find('.project-card__toggle')
    expect(toggle.attributes('aria-expanded')).toBe('false')
    await toggle.trigger('click')
    expect(w.find('.project-card__study').isVisible()).toBe(true)
    expect(w.find('.project-card__toggle').attributes('aria-expanded')).toBe('true')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/sections/Projects.test.js`
Expected: FAIL — cannot find module `./Projects.vue`.

- [ ] **Step 3: Create `src/components/sections/Projects.vue`**

```vue
<script setup>
import { onMounted, reactive, ref } from 'vue'
import SectionShell from '../SectionShell.vue'
import { useReveal } from '../../composables/useReveal'
import { cv } from '../../content/cv'

const grid = ref(null)
const cards = ref([])
const open = reactive({})
const { stagger } = useReveal()

onMounted(() => stagger(grid.value, { items: cards.value }))
</script>

<template>
  <SectionShell id="projects" kicker="03 / Projects" title="Projects" ink="projects">
    <div ref="grid" class="projects">
      <article
        v-for="(p, i) in cv.projects"
        :key="p.title"
        ref="cards"
        class="project-card"
        :class="{ 'is-open': open[i] }"
      >
        <h3 class="project-card__title">{{ p.title }}</h3>
        <p class="project-card__subtitle serif-i">{{ p.subtitle }}</p>
        <p class="project-card__desc">{{ p.description }}</p>
        <ul class="project-card__stack mono">
          <li v-for="t in p.stack" :key="t">{{ t }}</li>
        </ul>
        <button
          class="project-card__toggle mono"
          :aria-expanded="open[i] === true"
          :aria-controls="'study-' + i"
          @click="open[i] = !open[i]"
        >{{ open[i] ? 'Close study' : 'Case study ▾' }}</button>

        <div :id="'study-' + i" class="project-card__study" v-show="open[i]">
          <p><strong>Problem.</strong> {{ p.problem }}</p>
          <p><strong>Approach.</strong> {{ p.approach }}</p>
          <p class="mono">
            <a v-if="p.links.live" :href="p.links.live" target="_blank" rel="noopener">live ↗</a>
            <a v-if="p.links.repo" :href="p.links.repo" target="_blank" rel="noopener"> repo ↗</a>
          </p>
        </div>
      </article>
    </div>
  </SectionShell>
</template>

<style scoped>
.projects { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
.project-card { background: color-mix(in srgb, var(--ink-projects) 6%, var(--paper)); border: 2px solid color-mix(in srgb, var(--ink-projects) 40%, transparent); padding: 20px; border-radius: 10px; }
.project-card__title { font-family: var(--font-display); font-size: 1.25rem; color: var(--ink-projects); margin: 0 0 4px; }
.project-card__subtitle { margin: 0 0 10px; color: var(--ink-muted); }
.project-card__stack { display: flex; flex-wrap: wrap; gap: 8px; padding: 0; list-style: none; margin: 0 0 12px; }
.project-card__toggle { background: none; border: none; cursor: pointer; font: inherit; color: var(--ink-projects); text-decoration: underline; padding: 0; }
.project-card__study { border-top: 1px dashed var(--ink-muted); margin-top: 12px; padding-top: 12px; }
</style>
```

- [ ] **Step 4: Update `App.vue`** — import and render `<Projects />` after `<Experience />`.

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/sections/Projects.test.js`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Projects.vue src/App.vue src/components/sections/Projects.test.js
git commit -m "feat: add projects with expandable case studies"
```

---

### Task 8: Research citations

**Files:**
- Create: `src/components/sections/Research.vue`
- Modify: `src/App.vue`
- Test: `src/components/sections/Research.test.js`

**Interfaces:**
- Consumes: `cv.research`, `SectionShell`, `useReveal.stagger`.
- Produces: `Research.vue` — `<SectionShell id="research" kicker="04 / Research" title="Research" ink="research">` listing works as `<button class="cite" aria-expanded>[n]</button>` followed by title/venue/year. Activating (hover, focus, or click) expands the abstract inline. Numbering is 1-based by array index.

- [ ] **Step 1: Write the failing test** `src/components/sections/Research.test.js`

```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Research from './Research.vue'
import { cv } from '../../content/cv'

describe('Research', () => {
  it('numbers citations [1], [2], … and lists titles', () => {
    const w = mount(Research)
    const cites = w.findAll('.cite')
    expect(cites.length).toBe(cv.research.length)
    cites.forEach((c, i) => expect(c.text()).toBe(`[${i + 1}]`))
    for (const r of cv.research) expect(w.text()).toContain(r.title)
  })
  it('expands the abstract when activated', async () => {
    const w = mount(Research)
    await w.find('.cite').trigger('click')
    expect(w.find('.research__abstract').isVisible()).toBe(true)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/sections/Research.test.js`
Expected: FAIL — cannot find module `./Research.vue`.

- [ ] **Step 3: Create `src/components/sections/Research.vue`**

```vue
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
          <button class="cite mono" :aria-expanded="open[i] === true" @click="open[i] = !open[i]">[{{ i + 1 }}]</button>
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
```

- [ ] **Step 4: Update `App.vue`** — import and render `<Research />` after `<Projects />`.

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/sections/Research.test.js`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Research.vue src/App.vue src/components/sections/Research.test.js
git commit -m "feat: add expandable research citations"
```

---

### Task 9: Books shelf

**Files:**
- Create: `src/components/sections/Books.vue`
- Modify: `src/App.vue`
- Test: `src/components/sections/Books.test.js`

**Interfaces:**
- Consumes: `cv.books`, `SectionShell`, `useReveal.stagger`.
- Produces: `Books.vue` — `<SectionShell id="books" kicker="05 / Books" title="Books" ink="books">` with a `.shelf` grid of `.book-card`s. Each card: a CSS-generated `.book-card__cover` (ink-colored spine — uses `--ink-books`, the title set in display type along the spine), the title/author below, a status badge (`READ` / `READING` / `TBR`), and the one-line `note` revealed on hover/focus.

- [ ] **Step 1: Write the failing test** `src/components/sections/Books.test.js`

```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Books from './Books.vue'
import { cv } from '../../content/cv'

describe('Books', () => {
  it('renders every book title, author, and status', () => {
    const w = mount(Books)
    for (const b of cv.books) {
      expect(w.text()).toContain(b.title)
      expect(w.text()).toContain(b.author)
    }
    const badges = w.findAll('.book-card__status')
    expect(badges.length).toBe(cv.books.length)
  })
  it('badges use uppercase read/reading/tbr labels', () => {
    const w = mount(Books)
    const texts = w.findAll('.book-card__status').map(n => n.text())
    for (const b of cv.books) expect(texts).toContain(b.status.toUpperCase())
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/sections/Books.test.js`
Expected: FAIL — cannot find module `./Books.vue`.

- [ ] **Step 3: Create `src/components/sections/Books.vue`**

```vue
<script setup>
import { onMounted, ref } from 'vue'
import SectionShell from '../SectionShell.vue'
import { useReveal } from '../../composables/useReveal'
import { cv } from '../../content/cv'

const shelf = ref(null)
const books = ref([])
const { stagger } = useReveal()

onMounted(() => stagger(shelf.value, { items: books.value }))
</script>

<template>
  <SectionShell id="books" kicker="05 / Books" title="Books" ink="books">
    <div ref="shelf" class="shelf">
      <article
        v-for="(b, i) in cv.books"
        :key="b.title + i"
        ref="books"
        class="book-card"
        tabindex="0"
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
  transition: transform 0.3s ease;
}
.book-card:hover .book-card__cover, .book-card:focus-visible .book-card__cover { transform: rotate(-2deg) translateY(-4px); }
.book-card__spine { align-self: flex-end; font-family: var(--font-display); color: #1B1B1F; font-size: 0.8rem; writing-mode: vertical-rl; text-orientation: mixed; }
.book-card__title { font-family: var(--font-display); font-size: 1rem; margin: 8px 0 2px; }
.book-card__author { margin: 0 0 6px; }
.book-card__status { color: var(--ink-books); font-weight: 600; }
.book-card__note { display: none; color: var(--ink-muted); }
.book-card:hover .book-card__note, .book-card:focus-visible .book-card__note { display: block; }
</style>
```

- [ ] **Step 4: Update `App.vue`** — import and render `<Books />` after `<Research />`.

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/sections/Books.test.js`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Books.vue src/App.vue src/components/sections/Books.test.js
git commit -m "feat: add interactive bookshelf with CSS covers"
```

---

### Task 10: Blog

**Files:**
- Create: `src/components/sections/Blog.vue`
- Modify: `src/App.vue`
- Test: `src/components/sections/Blog.test.js`

**Interfaces:**
- Consumes: `cv.posts`, `SectionShell`, `useReveal.stagger`.
- Produces: `Blog.vue` — `<SectionShell id="blog" kicker="06 / Blog" title="Blog" ink="blog">` listing posts: date (mono), title, tags, a toggleable excerpt (`.post__excerpt`), and a `→ read on blog` link (`.post__link`, `href` = `post.url`, `target="_blank"`).

- [ ] **Step 1: Write the failing test** `src/components/sections/Blog.test.js`

```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Blog from './Blog.vue'
import { cv } from '../../content/cv'

describe('Blog', () => {
  it('renders every post title and links to the blog', () => {
    const w = mount(Blog)
    for (const p of cv.posts) expect(w.text()).toContain(p.title)
    const hrefs = w.findAll('.post__link').map(a => a.attributes('href'))
    for (const p of cv.posts) expect(hrefs).toContain(p.url)
  })
  it('toggles the excerpt', async () => {
    const w = mount(Blog)
    await w.find('.post__toggle').trigger('click')
    expect(w.find('.post__excerpt').isVisible()).toBe(true)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/sections/Blog.test.js`
Expected: FAIL — cannot find module `./Blog.vue`.

- [ ] **Step 3: Create `src/components/sections/Blog.vue`**

```vue
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
```

- [ ] **Step 4: Update `App.vue`** — import and render `<Blog />` after `<Books />`.

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/sections/Blog.test.js`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Blog.vue src/App.vue src/components/sections/Blog.test.js
git commit -m "feat: add blog section with expandable abstracts"
```

---

### Task 11: Skills

**Files:**
- Create: `src/components/sections/Skills.vue`
- Modify: `src/App.vue`
- Test: `src/components/sections/Skills.test.js`

**Interfaces:**
- Consumes: `cv.skills`, `SectionShell`, `useReveal.countUp` + `stagger`.
- Produces: `Skills.vue` — `<SectionShell id="skills" kicker="07 / Skills" title="Skills" ink="skills">` with one `.skill-group` per group. Each item renders a `.bar` with `.bar__label` (skill name), `.bar__num` (the count-up `%`), and `.bar__fill` (width = `level%`, `data-level` attr). Tags cloud `.skills__tags` lists every item name as a chip. On mount: `countUp` each `.bar__num`, `stagger` groups. When reduced-motion (tests), `countUp` still writes the final text and fill width stays inline.

- [ ] **Step 1: Write the failing test** `src/components/sections/Skills.test.js`

```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Skills from './Skills.vue'
import { cv } from '../../content/cv'

describe('Skills', () => {
  it('renders every group and item', () => {
    const w = mount(Skills)
    for (const g of cv.skills.groups) {
      expect(w.text()).toContain(g.name)
      for (const it of g.items) expect(w.text()).toContain(it.skill)
    }
  })
  it('bars carry their level as inline width and data-level', () => {
    const w = mount(Skills)
    const fills = w.findAll('.bar__fill')
    expect(fills.length).toBeGreaterThan(0)
    const first = cv.skills.groups[0].items[0]
    const fill = w.find('.bar__fill')
    expect(fill.attributes('data-level')).toBe(String(first.level))
    expect(fill.attributes('style')).toContain(`${first.level}%`)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/sections/Skills.test.js`
Expected: FAIL — cannot find module `./Skills.vue`.

- [ ] **Step 3: Create `src/components/sections/Skills.vue`**

```vue
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
```

- [ ] **Step 4: Update `App.vue`** — import and render `<Skills />` after `<Blog />`.

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/sections/Skills.test.js`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Skills.vue src/App.vue src/components/sections/Skills.test.js
git commit -m "feat: add skills with count-up bars"
```

---

### Task 12: Footer, theme toggle, global polish

**Files:**
- Create: `src/components/sections/Footer.vue`
- Create: `src/components/ThemeToggle.vue`
- Modify: `src/App.vue`
- Modify: `src/style.css` (toggle button styles, mobile gutter collapse, focus/skip styles are already present)
- Modify: `index.html` (title, meta description, skip link target)
- Test: `src/components/sections/Footer.test.js`

**Interfaces:**
- Consumes: `useTheme`, `cv.socials`.
- Produces:
  - `ThemeToggle.vue` — a header-affixed `<button class="theme-toggle mono">` showing `INK ⇄` / `PAPER ⇄`; calls `toggle()`. Rendered outside the main gutter (fixed top-right).
  - `Footer.vue` — social links from `cv.socials`, a one-line credit “typeset with Vue · GSAP · riso ink”, and a `back-to-top` link to `#top`.
  - Mobile: `.section` padding trims, `.zine__main` collapses its left gutter below 960px (already handled by the media query in Task 3).

- [ ] **Step 1: Write the failing test** `src/components/sections/Footer.test.js`

```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Footer from './Footer.vue'
import { cv } from '../../content/cv'

describe('Footer', () => {
  it('renders every social link', () => {
    const w = mount(Footer)
    const hrefs = w.findAll('a').map(a => a.attributes('href'))
    for (const s of cv.socials) expect(hrefs).toContain(s.url)
  })
  it('has a back-to-top link', () => {
    const w = mount(Footer)
    expect(w.find('.footer__top').exists()).toBe(true)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/sections/Footer.test.js`
Expected: FAIL — cannot find module `./Footer.vue`.

- [ ] **Step 3: Create `src/components/sections/Footer.vue`**

```vue
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
```

- [ ] **Step 4: Create `src/components/ThemeToggle.vue`**

```vue
<script setup>
import { useTheme } from '../composables/useTheme'
const { theme, toggle } = useTheme()
</script>

<template>
  <button class="theme-toggle mono" type="button" :aria-label="'Switch to ' + (theme === 'paper' ? 'ink' : 'paper') + ' mode'" @click="toggle">
    {{ theme === 'paper' ? 'INK ⇄' : 'PAPER ⇄' }}
  </button>
</template>
```

Note: calling `useTheme()` again in a second component re-initializes from the same `localStorage` and keeps `document.documentElement.dataset.theme` in sync, so both ZinePage and the toggle agree on the current theme.

- [ ] **Step 5: Add toggle styles to `src/style.css`**

```css
.theme-toggle {
  position: fixed; top: 14px; right: 16px; z-index: 70;
  background: var(--paper); color: var(--ink);
  border: 1.5px solid currentColor; border-radius: 99px;
  padding: 6px 14px; cursor: pointer; font: inherit;
  transition: background 0.3s ease, color 0.3s ease;
}
.theme-toggle:hover { color: var(--ink-experience); }
```

- [ ] **Step 6: Update `App.vue`** to the final composition

```vue
<script setup>
import ZinePage from './components/ZinePage.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import Hero from './components/sections/Hero.vue'
import Experience from './components/sections/Experience.vue'
import Projects from './components/sections/Projects.vue'
import Research from './components/sections/Research.vue'
import Books from './components/sections/Books.vue'
import Blog from './components/sections/Blog.vue'
import Skills from './components/sections/Skills.vue'
import Footer from './components/sections/Footer.vue'
</script>

<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <ThemeToggle />
  <ZinePage>
    <main id="main">
      <Hero />
      <Experience />
      <Projects />
      <Research />
      <Books />
      <Blog />
      <Skills />
      <Footer />
    </main>
  </ZinePage>
</template>
```

Note: `#main` is the skip-link target; `Hero` remains a `<header>`.

- [ ] **Step 7: Update `index.html`** — title, description, and `<html>` anchor for back-to-top

```html
<!doctype html>
<html lang="en" id="top">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Arben Ajredini — software developer, researcher, reader. A risograph-zine style portfolio." />
    <title>Arben Ajredini</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

- [ ] **Step 8: Run the full test suite**

Run: `npm test`
Expected: PASS — all tasks’ tests green.

- [ ] **Step 9: Manual polish check**

Run: `npm run dev`
Check: toggle flips paper/ink and persists on reload; all eight sections render; the skip link appears on keyboard focus; grain overlay is subtle; no horizontal scroll at 390px width.

- [ ] **Step 10: Commit**

```bash
git add src/components/sections/Footer.vue src/components/ThemeToggle.vue src/App.vue src/style.css index.html src/components/sections/Footer.test.js
git commit -m "feat: add footer, theme toggle, and global polish"
```

---

### Task 13: Full verification

**Files:**
- None created — verification only.

**Interfaces:**
- Consumes: everything from Tasks 1–12.

- [ ] **Step 1: Build**

Run: `npm run build`
Expected: builds without errors; `dist/` regenerated.

- [ ] **Step 2: Preview + manual checklist**

Run: `npm run preview`, then open the printed URL and walk the spec §13 checklist:

- [ ] All eight sections render from placeholder content.
- [ ] Theme toggle flips paper ⇄ night-riso, persists across reload, respects `prefers-color-scheme` on first visit.
- [ ] Experience timeline draws on scroll; skill bars count up to their `%`.
- [ ] Marginalia-adjacent reveals (citations, project drawers, book notes, blog excerpts) open on hover **and** keyboard focus.
- [ ] Misregistration headline ghost shifts on hover.
- [ ] Emulate `prefers-reduced-motion` in DevTools → choreography off, content static and readable.
- [ ] 390px viewport: no horizontal scroll, sections single-column, tap reveals work.

- [ ] **Step 3: Reduced-motion emulation test (headless)** — add `src/test/reduced-motion.test.js`

```js
import { describe, it, expect } from 'vitest'
import { useReveal } from '../composables/useReveal'

describe('reduced-motion contract', () => {
  it('no-ops reveal when reduced motion is preferred', () => {
    window.matchMedia = (q) => ({ matches: q.includes('prefers-reduced-motion'), media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false })
    const el = { textContent: '0%' }
    const { canAnimate, countUp } = useReveal()
    expect(canAnimate()).toBe(false)
    countUp(el, { target: 88, suffix: '%' })
    expect(el.textContent).toBe('88%') // final value set even without animation
  })
})
```

Run: `npm test`
Expected: PASS.

- [ ] **Step 4: Commit the reduced-motion test**

```bash
git add src/test/reduced-motion.test.js
git commit -m "test: cover reduced-motion degradation"
```

- [ ] **Step 5: Report**

Summarize what was built, where the owner’s content lives (`src/content/cv.js`), and that deployment is one command away: `npm run deploy` (only when the owner asks).

---

## Self-Review Notes

**Spec coverage → tasks:**
- Riso ink tokens (spec §4) → Task 3 `style.css`.
- Typography (spec §5) → Task 3 font imports + `--font-*` tokens; Task 5 Hero/headlines.
- Structure/sections (spec §6) → Tasks 5–12 (Hero, Experience, Projects, Research, Books, Blog, Skills, Footer).
- Marginalia + citations (spec §6/§8) → Task 8 (citations) + Task 6 (`Marginalia.vue` in the reserved gutter, anchored to `.timeline__item`, keyboard-reachable via `:focus-within`).
- Content model (spec §7) → Task 1 `cv.js` + shape tests.
- Interactions (spec §8) → Task 4 (choreography) + Tasks 6–11 (draw, count-up, stagger, expands).
- Theming (spec §9) → Task 2 `useTheme` + Task 12 toggle + Task 3 tokens.
- Accessibility (spec §10) → Task 3 skip-link/focus/reduced-motion CSS, Task 12 skip link + toggle aria, keyboard-reachable reveals (buttons + `tabindex` on book cards).
- Performance (spec §11) → Task 3 font handling, transform/opacity-only animations (Task 4), CSS-generated covers (Task 9), GSAP only (Task 4).
- Edge cases (spec §12) → Task 1 shape tests, Task 4 no-op behavior, Task 9 cover fallback, Task 12 mobile gutter collapse, Task 13 reduced-motion test.
- Verification (spec §13) → Task 13.

**Placeholder scan:** no TBD/TODO; every code block is complete and runnable.

**Type/name consistency:** `useTheme` returns `{ theme, setTheme, toggle }` everywhere; `useReveal` returns `{ canAnimate, reveal, stagger, drawLine, countUp }` everywhere; `cv` shapes match Task 1 and all consumers.
