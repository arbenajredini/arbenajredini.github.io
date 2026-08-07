# Softened Zine Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the Risograph Zine portfolio into a quiet, printable "Softened Zine" — cream **paper** (never white) with a subtle paper texture, muted riso inks, **zero motion** (GSAP removed), real professional data from `Profile.pdf`, and a dedicated print stylesheet.

**Architecture:** Same Vue 3 + Vite + Tailwind 4 app. `ZinePage.vue` is the chrome (paper, grain, ruled-baseline layers, theme); `App.vue` composes one `SectionShell`-wrapped section per content area in a resume-then-appendix order. All content is read from `src/content/cv.js` (now real data). A `useTheme` composable (unchanged) manages the paper ⇄ night-paper toggle. All sections render statically — no animation composable, no GSAP. New document sections: Summary, Certifications, Education, Honors. Obsolete zine components are deleted.

**Tech Stack:** Vue 3.5, Vite 6, Tailwind 4, Vitest + @vue/test-utils + happy-dom, Fontsource (`space-grotesk`, `inter`, `jetbrains-mono`, `crimson-pro`). **GSAP is removed.**

## Global Constraints

- Vue 3 + Vite + Tailwind 4 stay; **no new framework**, no new animation library, no new font family. `npm run dev` / `build` / `preview` / `deploy` / `test` scripts unchanged.
- **Zero motion.** Nothing animates — no scroll reveals, staggers, count-ups, draw-ons, hover-shifts, tilts, or cursor glow. `prefers-reduced-motion` guard CSS retained (trivially satisfied).
- **Background is paper, never white** — in both themes and in print. Cream `#FAF8F3` (light) / warm near-black `#121215` (dark).
- Exact ink tokens (light "paper" / dark "night paper"): paper `#FAF8F3`/`#121215`; ink `#1B1B1F`/`#E9E6DF`; muted `#6B6B6B`/`#9C9A92`; experience `#FF4A00`/`#C2561F`; projects `#1F7DFF`/`#3E5F91`; research `#FF2E93`/`#A94A75`; books `#B08A00`/`#8A7A3C`; blog `#007A6A`/`#2E6B63`; skills `#5B4D8A`/`#5A4F78`.
- Theme attribute is `data-theme="paper"|"ink"` on `<html>`; persisted in `localStorage['zine-theme']`; default from `prefers-color-scheme`. `useTheme` is **not** modified.
- **All professional content** comes from `src/content/cv.js` sourced from `Profile.pdf`. Components never hard-code names, roles, or links.
- Section order is fixed: Hero → Summary → Experience → Skills → Certifications → Education → Honors → Projects → Books → Blog → Footer.
- Deploy (`npm run deploy`) runs **only when the owner asks** — never as a task's passing criteria.
- Obsolete zine files (`useReveal`, `MisregisterText`, `Marginalia`, `Research`) are **deleted**, and `gsap` is uninstalled — but only once the last importing component is rewritten (Task 8).

---

### Task 1: Content model → real data, Skills reset, drop Research

**Files:**
- Rewrite: `src/content/cv.js`, `src/content/cv.test.js`
- Rewrite: `src/components/sections/Skills.vue`, `src/components/sections/Skills.test.js`
- Delete: `src/components/sections/Research.vue`, `src/components/sections/Research.test.js`
- Modify: `src/App.vue` (remove the `Research` import + `<Research />` usage)

**Interfaces:**
- Produces `src/content/cv.js` exporting `export const cv = { profile, summary, experience, skills, certifications, education, honors, projects, books, posts, socials }`. Exact shapes later components rely on:
  - `profile`: `{ name, role, tagline, location, contact: { email, website } }`
  - `summary`: `{ headline, body }`
  - `experience[]`: `{ company, role, period, summary, bullets: string[], tags: string[], note? }` (flat; `note` optional, unused in real data)
  - `skills`: `{ top: [{ skill, level(0–100) }], toolbox: { [groupName]: string[] } }`
  - `certifications[]`: `{ title, courses: string[], issuer? }`
  - `education[]`: `{ school, degree, period }`
  - `honors[]`: `{ award, detail }`
  - `projects[]`, `books[]`, `posts[]`, `socials[]`: unchanged from before.
- `cv` **no longer has** a `research` field. `cv.experience` entries have no `note` values.

- [ ] **Step 1: Rewrite the failing content test** `src/content/cv.test.js`

```js
import { describe, it, expect } from 'vitest'
import { cv } from './cv'

describe('cv content model', () => {
  it('has all top-level sections', () => {
    for (const key of ['profile', 'summary', 'experience', 'skills', 'certifications', 'education', 'honors', 'projects', 'books', 'posts', 'socials']) {
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

  it('summary has a headline and body', () => {
    expect(typeof cv.summary.headline).toBe('string')
    expect(typeof cv.summary.body).toBe('string')
  })

  it('experience entries have company, role, period, bullets, tags', () => {
    for (const e of cv.experience) {
      expect(e.company && e.role && e.period).toBeTruthy()
      expect(Array.isArray(e.bullets)).toBe(true)
      expect(Array.isArray(e.tags)).toBe(true)
    }
  })

  it('skills have a top list with 0..100 levels and a toolbox map of string arrays', () => {
    for (const it of cv.skills.top) {
      expect(Number.isInteger(it.level)).toBe(true)
      expect(it.level).toBeGreaterThanOrEqual(0)
      expect(it.level).toBeLessThanOrEqual(100)
    }
    for (const items of Object.values(cv.skills.toolbox)) {
      expect(Array.isArray(items)).toBe(true)
      for (const t of items) expect(typeof t).toBe('string')
    }
  })

  it('certifications have a title and a list of courses', () => {
    for (const c of cv.certifications) {
      expect(typeof c.title).toBe('string')
      expect(Array.isArray(c.courses)).toBe(true)
    }
  })

  it('education entries have school, degree, period', () => {
    for (const e of cv.education) {
      expect(e.school && e.degree && e.period).toBeTruthy()
    }
  })

  it('honors entries have an award and detail', () => {
    for (const h of cv.honors) {
      expect(h.award && h.detail).toBeTruthy()
    }
  })

  it('projects have title, description, stack', () => {
    for (const p of cv.projects) {
      expect(typeof p.title).toBe('string')
      expect(typeof p.description).toBe('string')
      expect(Array.isArray(p.stack)).toBe(true)
    }
  })

  it('books have a valid status', () => {
    for (const b of cv.books) {
      expect(['read', 'reading', 'tbr']).toContain(b.status)
    }
  })
})
```

- [ ] **Step 2: Rewrite the failing Skills test** `src/components/sections/Skills.test.js`

```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Skills from './Skills.vue'
import { cv } from '../../content/cv'

describe('Skills', () => {
  it('renders every top skill with its level', () => {
    const w = mount(Skills)
    for (const it of cv.skills.top) {
      expect(w.text()).toContain(it.skill)
      expect(w.text()).toContain(`${it.level}%`)
    }
  })

  it('renders every toolbox group and tag', () => {
    const w = mount(Skills)
    for (const [name, items] of Object.entries(cv.skills.toolbox)) {
      expect(w.text()).toContain(name)
      for (const t of items) expect(w.text()).toContain(t)
    }
  })

  it('bars carry their level as inline width and data-level', () => {
    const w = mount(Skills)
    const first = cv.skills.top[0]
    const fill = w.find('.bar__fill')
    expect(fill.attributes('data-level')).toBe(String(first.level))
    expect(fill.attributes('style')).toContain(`${first.level}%`)
  })
})
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — `cv.skills.groups` is undefined (`for...of` on undefined) and `cv.summary`/`cv.certifications`/`cv.education`/`cv.honors` are missing.

- [ ] **Step 4: Rewrite the content file** `src/content/cv.js`

```js
// Single source of truth for the entire portfolio.
// Professional data sourced from /Users/endrit/Downloads/Profile.pdf (2026-08-07).
export const cv = {
  profile: {
    name: 'Arben Ajredini',
    role: 'Software Engineer',
    tagline: 'Software Engineer | Mathematics',
    location: 'Pristina, Kosovo',
    contact: {
      email: 'arbenajredini55@gmail.com',
      website: 'https://www.linkedin.com/in/arben-ajredini',
    },
  },
  summary: {
    headline: 'Software Engineer | Mathematics',
    body: 'Software engineer with a mathematics background, shipping real-time mobile and cloud systems end to end — from NestJS microservices and native iOS apps to AI-model evaluation.',
  },
  experience: [
    {
      company: 'ABEL',
      role: 'Senior Software Engineer',
      period: 'Nov 2024 — Present',
      summary: 'Architected real-time mobile and cloud ecosystems, leading backend microservices and native iOS engineering across the full product lifecycle.',
      bullets: [
        'Backend Architecture: built scalable NestJS microservices for real-time data streaming, background processing, and low-latency API communication.',
        'iOS Engineering: engineered high-performance native iOS apps (Swift, SwiftUI) with an emphasis on offline-first state management, clean architecture, and rapid UI rendering.',
        'End-to-End Delivery: owned full-stack feature delivery from API design and service deployment to App Store release.',
      ],
      tags: ['NestJS', 'TypeScript', 'Swift', 'SwiftUI', 'Microservices'],
    },
    {
      company: 'Independent',
      role: 'Software Engineer',
      period: 'Jan 2020 — Present',
      summary: 'Provide software engineering services to several companies — education apps, trading automation apps, and AI integrations.',
      bullets: [
        'Delivered full-stack software engineering services across education apps, trading automation apps, and AI integrations.',
      ],
      tags: ['Full-stack', 'AI'],
    },
    {
      company: 'Mercor',
      role: 'Software Engineering Expert',
      period: 'Feb 2026 — Jun 2026',
      summary: 'Created and reviewed coding tasks used to evaluate AI models on benchmarks like SWE-bench.',
      bullets: [
        'Wrote test cases and rubrics to check whether model-generated code actually solves the problem.',
        'Reviewed pull requests and patches for correctness, code quality, and edge cases.',
      ],
      tags: ['AI evaluation', 'SWE-bench', 'Code review'],
    },
    {
      company: 'Mercor',
      role: 'Math Expert',
      period: 'Oct 2025 — Feb 2026',
      summary: 'Reviewed AI-generated math solutions for accuracy and clear reasoning.',
      bullets: [
        'Scored responses against rubrics, checking both the steps and the final answer.',
        'Wrote and vetted math problems used to train and test AI models.',
        'Worked with other math experts to keep grading consistent.',
      ],
      tags: ['AI evaluation', 'Mathematics'],
    },
    {
      company: 'Matrics',
      role: 'iOS Engineer',
      period: 'Mar 2022 — Nov 2024',
      summary: 'Built high-quality iOS UIs and tests as part of the core engineering team.',
      bullets: [
        'Created UIs using best practices and the chosen design pattern (UIKit + MVVM + Coordinator Pattern).',
        'Unit and UI testing with XCTest.',
        'Part of the core team refactoring from React Native to Swift.',
      ],
      tags: ['Swift', 'UIKit', 'MVVM', 'XCTest'],
    },
    {
      company: 'Matrics',
      role: 'Software Engineer',
      period: 'Jan 2021 — Mar 2022',
      summary: 'Full-stack engineering across backend, web, and mobile.',
      bullets: [
        'Microservices with NestJS and Go.',
        'NextJS website.',
        'React Native mobile application.',
      ],
      tags: ['NestJS', 'Go', 'NextJS', 'React Native'],
    },
  ],
  skills: {
    top: [
      { skill: 'TypeScript', level: 90 },
      { skill: 'Microservices', level: 85 },
      { skill: 'Keras', level: 75 },
    ],
    toolbox: {
      Backend: ['NestJS', 'Go', 'Microservices'],
      Mobile: ['Swift', 'SwiftUI', 'UIKit', 'React Native'],
      Frontend: ['NextJS', 'TypeScript'],
      'ML / AI': ['Keras', 'Pandas', 'AI evaluation', 'SWE-bench'],
    },
  },
  certifications: [
    {
      title: 'Machine Learning Specialization',
      courses: [
        'Supervised Machine Learning: Regression and Classification',
        'Unsupervised Learning, Recommenders, Reinforcement Learning',
        'Advanced Learning Algorithms',
      ],
    },
  ],
  education: [
    { school: 'University of Prishtina', degree: 'Bachelor of Science — Mathematics', period: '2019 — 2022' },
  ],
  honors: [
    { award: 'First Prize', detail: '29th International Mathematics Competition for University Students' },
    { award: 'First Prize', detail: '28th International Mathematics Competition for University Students' },
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
  socials: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/arben-ajredini' },
    { label: 'Email', url: 'mailto:arbenajredini55@gmail.com' },
  ],
}
```

- [ ] **Step 5: Rewrite the Skills section** `src/components/sections/Skills.vue`

```vue
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
```

- [ ] **Step 6: Delete the Research section and unwire it**

```bash
rm src/components/sections/Research.vue src/components/sections/Research.test.js
```

Then edit `src/App.vue`: remove the `import Research from './components/sections/Research.vue'` line and the `<Research />` line. (The rest of `App.vue` is rewritten wholesale in Task 8; for now it must simply not reference a missing module.)

- [ ] **Step 7: Run the full suite**

Run: `npm test`
Expected: PASS — all tests green. (The existing `Hero`, `Experience`, `Projects`, `Books`, `Blog`, `Footer`, `Marginalia`, `MisregisterText`, `useReveal`, `useTheme`, `reduced-motion`, `ZinePage` tests still pass against the current — still-animated — components, because their data shapes remain valid. `Experience.test.js`'s marginalia check is conditional on a `note` existing, and none do.)

- [ ] **Step 8: Commit**

```bash
git add src/content/cv.js src/content/cv.test.js src/components/sections/Skills.vue src/components/sections/Skills.test.js src/App.vue
git rm src/components/sections/Research.vue src/components/sections/Research.test.js
git commit -m "feat: load real profile data, reset skills, drop research section"
```

---

### Task 2: Design system — softened tokens, night paper, paper texture, print CSS

**Files:**
- Rewrite: `src/style.css`

**Interfaces:**
- Consumes: `useTheme` (unchanged) + the ink token names already used by components (`.ink-experience`, `.ink-projects`, `.ink-research`, `.ink-books`, `.ink-blog`, `.ink-skills`).
- Produces: the entire visual system — cream/night-paper tokens, `.zine` + `.zine__grain` + `.zine__rules` + `.zine__main` chrome, `.section` shell, `.page-actions` (fixed top-right cluster for the theme toggle + PDF button), `.theme-toggle` (non-fixed now), `.pdf-btn`, shared `.mono`/`.muted`/`.serif-i`, focus/skip-link, reduced-motion guard, and the `@media print` block. Removes `.zine__glow`, `.misregister`, `.marginalia`, and the left marginal gutter.

- [ ] **Step 1: Replace `src/style.css` with the full design system**

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
  --grain-opacity: 0.04;
  --rules-color: rgba(27, 27, 31, 0.04); /* ~3% ruled baseline, per spec §6 */
}

:root, :root[data-theme="paper"] {
  --paper: #FAF8F3;            /* warm cream — never white */
  --ink: #1B1B1F;
  --ink-muted: #6B6B6B;
  --ink-experience: #FF4A00;
  --ink-projects: #1F7DFF;
  --ink-research: #FF2E93;
  --ink-books: #B08A00;
  --ink-blog: #007A6A;
  --ink-skills: #5B4D8A;
}

:root[data-theme="ink"] {
  --paper: #121215;            /* warm near-black night paper */
  --ink: #E9E6DF;
  --ink-muted: #9C9A92;
  --ink-experience: #C2561F;
  --ink-projects: #3E5F91;
  --ink-research: #A94A75;
  --ink-books: #8A7A3C;
  --ink-blog: #2E6B63;
  --ink-skills: #5A4F78;
  --grain-opacity: 0.07;
  --rules-color: rgba(233, 230, 223, 0.04);
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
}

/* ink-color helper classes (used by section components) */
.ink-experience { color: var(--ink-experience); }
.ink-projects   { color: var(--ink-projects); }
.ink-research   { color: var(--ink-research); }
.ink-books      { color: var(--ink-books); }
.ink-blog       { color: var(--ink-blog); }
.ink-skills     { color: var(--ink-skills); }

/* ---- Page chrome ---- */
.zine { position: relative; min-height: 100vh; }

/* faint ruled baseline, behind content — the paper grid */
.zine__rules {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent calc(1.6rem - 1px),
    var(--rules-color) calc(1.6rem - 1px),
    var(--rules-color) 1.6rem
  );
}

.zine__main {
  position: relative; z-index: 2;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 24px;
}

.zine__grain {
  position: fixed; inset: 0;
  pointer-events: none;
  opacity: var(--grain-opacity);
  z-index: 60;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
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

.section__title {
  margin: 0 0 24px;
  font-family: var(--font-display);
  font-weight: 700;
  text-wrap: balance;
}

/* ---- Header actions (theme toggle + PDF) ---- */
.page-actions {
  position: fixed; top: 14px; right: 16px; z-index: 70;
  display: flex; gap: 10px;
}

.theme-toggle,
.pdf-btn {
  background: var(--paper); color: var(--ink);
  border: 1.5px solid currentColor; border-radius: 99px;
  padding: 6px 14px; cursor: pointer; font: inherit;
}
.theme-toggle:hover,
.pdf-btn:hover { color: var(--ink-experience); }

/* ---- Shared elements ---- */
.mono { font-family: var(--font-mono); font-size: 13px; }
.muted { color: var(--ink-muted); }
.rule { border: 0; border-top: 2px solid currentColor; margin: 0; }
.serif-i { font-family: var(--font-serif-italic); font-style: italic; }

a { color: var(--ink); text-decoration-color: var(--ink-muted); }
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

/* ---- Print / PDF ---- */
@media print {
  :root, :root[data-theme="paper"], :root[data-theme="ink"] {
    /* paper palette on paper, regardless of on-screen theme */
    --paper: #FAF8F3;
    --ink: #1B1B1F;
    --ink-muted: #6B6B6B;
    --ink-experience: #C8501E;
    --ink-projects: #1F7DFF;
    --ink-research: #B43A6F;
    --ink-books: #7A5A00;
    --ink-blog: #006B5F;
    --ink-skills: #5B4D8A;
  }

  html { scroll-behavior: auto; }
  body {
    background: var(--paper);
    color: var(--ink);
    font-size: 11pt;
    line-height: 1.5;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  @page { margin: 16mm 14mm; }

  .page-actions, .theme-toggle, .pdf-btn, .skip-link,
  .zine__rules, .zine__grain { display: none !important; }

  .zine__main { max-width: 100%; padding: 0; }
  .section { padding: 20px 0 12px; }
  .hero { padding-top: 0; }

  .timeline__item, .cert, .edu, .honor,
  .project-card, .book-card, .post { break-inside: avoid; }

  /* show collapsed content in print */
  .project-card__study, .post__excerpt { display: block !important; }
  .project-card__toggle, .post__toggle { display: none !important; }

  .book-card__note { display: block !important; }

  a { color: var(--ink) !important; text-decoration: underline; }
}
```

- [ ] **Step 2: Run the tests**

Run: `npm test`
Expected: PASS — CSS changes do not affect the test suite.

- [ ] **Step 3: Commit**

```bash
git add src/style.css
git commit -m "feat: softened riso design system, night-paper theme, print CSS"
```

---

### Task 3: ZinePage + SectionShell rewrites (no glow, no misregister, no reveal)

**Files:**
- Rewrite: `src/components/ZinePage.vue`, `src/components/ZinePage.test.js`
- Rewrite: `src/components/SectionShell.vue`

**Interfaces:**
- Consumes: `useTheme()` → `{ theme }` (unchanged).
- Produces:
  - `ZinePage.vue` — default-slot wrapper rendering `.zine[data-theme]` with `.zine__rules`, `.zine__main > slot`, `.zine__grain`. **No** `.zine__glow`, no pointer-move listener, no `onMounted`.
  - `SectionShell.vue` — props `{ id, kicker, title, ink }`; renders `<section :id>` with `.section`, `.section__kicker` (class `'ink-' + ink`), an `<h2 class="section__title">` (class `'ink-' + ink`), and the default slot. **No** `MisregisterText`, **no** `useReveal`, **no** `onMounted`.

- [ ] **Step 1: Rewrite the failing ZinePage test**

`src/components/ZinePage.test.js`:
```js
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ZinePage from './ZinePage.vue'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

describe('ZinePage', () => {
  it('renders slot content and paper chrome', () => {
    const wrapper = mount(ZinePage, {
      slots: { default: '<p class="probe">hello</p>' },
    })
    expect(wrapper.find('.probe').exists()).toBe(true)
    expect(wrapper.find('.zine').exists()).toBe(true)
    expect(wrapper.find('.zine__grain').exists()).toBe(true)
    expect(wrapper.find('.zine__rules').exists()).toBe(true)
  })

  it('has no cursor-glow layer', () => {
    const wrapper = mount(ZinePage)
    expect(wrapper.find('.zine__glow').exists()).toBe(false)
  })

  it('initializes the theme attribute on the root element', () => {
    mount(ZinePage)
    expect(document.documentElement.dataset.theme).toBe('paper')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/ZinePage.test.js`
Expected: FAIL — `.zine__rules` is missing and `.zine__glow` is still present.

- [ ] **Step 3: Rewrite `src/components/ZinePage.vue`**

```vue
<script setup>
import { useTheme } from '../composables/useTheme'

const { theme } = useTheme()
</script>

<template>
  <div class="zine" :data-theme="theme">
    <div class="zine__rules" aria-hidden="true"></div>
    <div class="zine__main">
      <slot />
    </div>
    <div class="zine__grain" aria-hidden="true"></div>
  </div>
</template>
```

- [ ] **Step 4: Rewrite `src/components/SectionShell.vue`**

```vue
<script setup>
defineProps({
  id: { type: String, required: true },
  kicker: { type: String, required: true },
  title: { type: String, required: true },
  ink: { type: String, required: true },
})
</script>

<template>
  <section :id="id" class="section">
    <p class="section__kicker" :class="'ink-' + ink">{{ kicker }}</p>
    <h2 class="section__title" :class="'ink-' + ink">{{ title }}</h2>
    <slot />
  </section>
</template>
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/ZinePage.test.js`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add src/components/ZinePage.vue src/components/ZinePage.test.js src/components/SectionShell.vue
git commit -m "feat: static page chrome and section shell (no glow, no reveal)"
```

---

### Task 4: Hero + Summary

**Files:**
- Rewrite: `src/components/sections/Hero.vue`, `src/components/sections/Hero.test.js`
- Create: `src/components/sections/Summary.vue`, `src/components/sections/Summary.test.js`

**Interfaces:**
- Consumes: `cv.profile`, `cv.summary`, `cv.socials`, `SectionShell`.
- Produces:
  - `Hero.vue` — `<header class="hero">` with location, `h1.hero__name`, an inline SVG `.hero__flourish` (hand-drawn underline, `aria-hidden`), `p.hero__role`, `p.hero__tagline`, `.hero__contact` (email + website), and a `.hero__socials` nav. **No** `MisregisterText`.
  - `Summary.vue` — `<SectionShell id="summary" kicker="Summary" title="Summary" ink="experience">` with `p.summary__headline` (serif italic) and `p.summary__body`.

- [ ] **Step 1: Write the failing Hero test** `src/components/sections/Hero.test.js`

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

  it('renders the hand-drawn flourish', () => {
    const w = mount(Hero)
    expect(w.find('.hero__flourish').exists()).toBe(true)
  })

  it('has no misregistration text', () => {
    const w = mount(Hero)
    expect(w.find('.misregister').exists()).toBe(false)
  })

  it('renders social links from cv.socials', () => {
    const w = mount(Hero)
    const links = w.findAll('a').map(a => a.attributes('href'))
    for (const s of cv.socials) expect(links).toContain(s.url)
  })
})
```

- [ ] **Step 2: Write the failing Summary test** `src/components/sections/Summary.test.js`

```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Summary from './Summary.vue'
import { cv } from '../../content/cv'

describe('Summary', () => {
  it('renders the headline and body', () => {
    const w = mount(Summary)
    expect(w.text()).toContain(cv.summary.headline)
    expect(w.text()).toContain(cv.summary.body)
  })
})
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npx vitest run src/components/sections/Hero.test.js src/components/sections/Summary.test.js`
Expected: FAIL — Hero still renders `.misregister` and has no `.hero__flourish`; `./Summary.vue` not found.

- [ ] **Step 4: Rewrite `src/components/sections/Hero.vue`**

```vue
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
```

- [ ] **Step 5: Create `src/components/sections/Summary.vue`**

```vue
<script setup>
import SectionShell from '../SectionShell.vue'
import { cv } from '../../content/cv'
</script>

<template>
  <SectionShell id="summary" kicker="Summary" title="Summary" ink="experience">
    <p class="summary__headline serif-i">{{ cv.summary.headline }}</p>
    <p class="summary__body">{{ cv.summary.body }}</p>
  </SectionShell>
</template>

<style scoped>
.summary__headline { font-size: 1.5rem; color: var(--ink); margin: 0 0 10px; }
.summary__body { max-width: 46em; margin: 0; }
</style>
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npx vitest run src/components/sections/Hero.test.js src/components/sections/Summary.test.js`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/Hero.vue src/components/sections/Hero.test.js src/components/sections/Summary.vue src/components/sections/Summary.test.js
git commit -m "feat: static hero with hand-drawn flourish and summary section"
```

---

### Task 5: Experience — static timeline

**Files:**
- Rewrite: `src/components/sections/Experience.vue`, `src/components/sections/Experience.test.js`

**Interfaces:**
- Consumes: `cv.experience`, `SectionShell`.
- Produces: `Experience.vue` — `<SectionShell id="experience" kicker="01 / Experience" title="Experience" ink="experience">` with `.timeline` containing a static `.timeline__line` (no draw-on) and one `.timeline__item` per entry: `period` (mono), `company`, `role`, `summary`, optional `.timeline__note` (serif italic, static), `bullets`, `tags`. **No** `Marginalia`, **no** `useReveal`.

- [ ] **Step 1: Rewrite the failing test** `src/components/sections/Experience.test.js`

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

  it('renders a static timeline line and one item per role', () => {
    const w = mount(Experience)
    expect(w.find('.timeline__line').exists()).toBe(true)
    expect(w.findAll('.timeline__item').length).toBe(cv.experience.length)
  })

  it('renders a static note line for roles that have one', () => {
    const w = mount(Experience)
    const withNotes = cv.experience.filter(e => e.note).length
    expect(w.findAll('.timeline__note').length).toBe(withNotes)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/sections/Experience.test.js`
Expected: FAIL — `.timeline__note` count is 0 but the component renders `<Marginalia>` (no `.timeline__note`).

- [ ] **Step 3: Rewrite `src/components/sections/Experience.vue`**

```vue
<script setup>
import SectionShell from '../SectionShell.vue'
import { cv } from '../../content/cv'
</script>

<template>
  <SectionShell id="experience" kicker="01 / Experience" title="Experience" ink="experience">
    <div class="timeline">
      <div class="timeline__line" aria-hidden="true"></div>
      <article
        v-for="(e, i) in cv.experience"
        :key="e.company + i"
        class="timeline__item"
      >
        <p class="mono muted timeline__period">{{ e.period }}</p>
        <h3 class="timeline__company">{{ e.company }}</h3>
        <p class="timeline__role">{{ e.role }}</p>
        <p class="timeline__summary">{{ e.summary }}</p>
        <p v-if="e.note" class="timeline__note serif-i">{{ e.note }}</p>
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
.timeline__line { position: absolute; left: 0; top: 4px; bottom: 4px; width: 3px; background: var(--ink-experience); }
.timeline__item { position: relative; margin: 0 0 40px; }
.timeline__item:last-child { margin-bottom: 0; }
.timeline__period { margin: 0 0 6px; }
.timeline__company { font-family: var(--font-display); font-size: 1.35rem; margin: 0 0 2px; }
.timeline__role { margin: 0 0 8px; color: var(--ink-experience); font-weight: 600; }
.timeline__summary { margin: 0 0 10px; }
.timeline__note { margin: 0 0 10px; color: var(--ink-muted); }
.timeline__bullets { margin: 0 0 10px; padding-left: 20px; }
.timeline__tags { display: flex; flex-wrap: wrap; gap: 8px; padding: 0; list-style: none; }
.timeline__tag { color: var(--ink-muted); }
</style>
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/sections/Experience.test.js`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Experience.vue src/components/sections/Experience.test.js
git commit -m "feat: static experience timeline"
```

---

### Task 6: Certifications, Education, Honors

**Files:**
- Create: `src/components/sections/Certifications.vue`, `src/components/sections/Certifications.test.js`
- Create: `src/components/sections/Education.vue`, `src/components/sections/Education.test.js`
- Create: `src/components/sections/Honors.vue`, `src/components/sections/Honors.test.js`

**Interfaces:**
- Consumes: `cv.certifications`, `cv.education`, `cv.honors`, `SectionShell`.
- Produces:
  - `Certifications.vue` — `<SectionShell id="certifications" kicker="03 / Certifications" title="Certifications" ink="blog">`, one `.cert` per entry: `h3.cert__title`, optional `.cert__issuer` (mono), `ul.cert__courses`.
  - `Education.vue` — `<SectionShell id="education" kicker="04 / Education" title="Education" ink="projects">`, one `.edu` per entry: `.edu__period` (mono), `h3.edu__school`, `.edu__degree`.
  - `Honors.vue` — `<SectionShell id="honors" kicker="05 / Honors" title="Honors & Awards" ink="research">`, an `ol.honors` with one `.honor` per entry: `.honor__award` + `.honor__detail`.

- [ ] **Step 1: Write the failing tests**

`src/components/sections/Certifications.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Certifications from './Certifications.vue'
import { cv } from '../../content/cv'

describe('Certifications', () => {
  it('renders every certification title and course', () => {
    const w = mount(Certifications)
    for (const c of cv.certifications) {
      expect(w.text()).toContain(c.title)
      for (const co of c.courses) expect(w.text()).toContain(co)
    }
  })
})
```

`src/components/sections/Education.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Education from './Education.vue'
import { cv } from '../../content/cv'

describe('Education', () => {
  it('renders every school, degree, and period', () => {
    const w = mount(Education)
    for (const e of cv.education) {
      expect(w.text()).toContain(e.school)
      expect(w.text()).toContain(e.degree)
      expect(w.text()).toContain(e.period)
    }
  })
})
```

`src/components/sections/Honors.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Honors from './Honors.vue'
import { cv } from '../../content/cv'

describe('Honors', () => {
  it('renders every award and detail', () => {
    const w = mount(Honors)
    for (const h of cv.honors) {
      expect(w.text()).toContain(h.award)
      expect(w.text()).toContain(h.detail)
    }
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/sections/Certifications.test.js src/components/sections/Education.test.js src/components/sections/Honors.test.js`
Expected: FAIL — cannot find modules `./Certifications.vue`, `./Education.vue`, `./Honors.vue`.

- [ ] **Step 3: Create `src/components/sections/Certifications.vue`**

```vue
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
```

- [ ] **Step 4: Create `src/components/sections/Education.vue`**

```vue
<script setup>
import SectionShell from '../SectionShell.vue'
import { cv } from '../../content/cv'
</script>

<template>
  <SectionShell id="education" kicker="04 / Education" title="Education" ink="projects">
    <article v-for="e in cv.education" :key="e.school + e.degree" class="edu">
      <p class="mono muted edu__period">{{ e.period }}</p>
      <h3 class="edu__school">{{ e.school }}</h3>
      <p class="edu__degree">{{ e.degree }}</p>
    </article>
  </SectionShell>
</template>

<style scoped>
.edu { margin: 0 0 20px; }
.edu__period { margin: 0 0 4px; }
.edu__school { font-family: var(--font-display); font-size: 1.3rem; margin: 0 0 2px; }
.edu__degree { margin: 0; color: var(--ink-muted); }
</style>
```

- [ ] **Step 5: Create `src/components/sections/Honors.vue`**

```vue
<script setup>
import SectionShell from '../SectionShell.vue'
import { cv } from '../../content/cv'
</script>

<template>
  <SectionShell id="honors" kicker="05 / Honors" title="Honors & Awards" ink="research">
    <ol class="honors">
      <li v-for="h in cv.honors" :key="h.detail" class="honor">
        <span class="honor__award">{{ h.award }}</span><span class="honor__detail"> — {{ h.detail }}</span>
      </li>
    </ol>
  </SectionShell>
</template>

<style scoped>
.honors { list-style: none; padding: 0; margin: 0; }
.honor { margin: 0 0 12px; }
.honor__award { color: var(--ink-research); font-weight: 600; }
.honor__detail { color: var(--ink); }
</style>
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npx vitest run src/components/sections/Certifications.test.js src/components/sections/Education.test.js src/components/sections/Honors.test.js`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/Certifications.vue src/components/sections/Certifications.test.js src/components/sections/Education.vue src/components/sections/Education.test.js src/components/sections/Honors.vue src/components/sections/Honors.test.js
git commit -m "feat: add certifications, education, and honors sections"
```

---

### Task 7: Projects, Books, Blog — static rewrites

**Files:**
- Rewrite: `src/components/sections/Projects.vue`
- Rewrite: `src/components/sections/Books.vue`
- Rewrite: `src/components/sections/Blog.vue`
- Tests: existing `Projects.test.js`, `Books.test.js`, `Blog.test.js` are **unchanged** and must keep passing.

**Interfaces:**
- Consumes: `cv.projects`, `cv.books`, `cv.posts`, `SectionShell`.
- Produces:
  - `Projects.vue` — kicker changed to `A / Projects`; same card + case-study toggle structure, **no** `useReveal`/`stagger`.
  - `Books.vue` — kicker changed to `B / Books`; covers static (no tilt, no hover-note), note **always visible** (`.book-card__note` no longer `display: none`).
  - `Blog.vue` — kicker changed to `C / Blog`; same post + excerpt toggle structure, **no** `useReveal`/`stagger`.

- [ ] **Step 1: Rewrite `src/components/sections/Projects.vue`**

```vue
<script setup>
import { reactive } from 'vue'
import SectionShell from '../SectionShell.vue'
import { cv } from '../../content/cv'

const open = reactive({})
</script>

<template>
  <SectionShell id="projects" kicker="A / Projects" title="Projects" ink="projects">
    <div class="projects">
      <article
        v-for="(p, i) in cv.projects"
        :key="p.title"
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

- [ ] **Step 2: Rewrite `src/components/sections/Books.vue`**

```vue
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
.book-card__spine { align-self: flex-end; font-family: var(--font-display); color: var(--ink); font-size: 0.8rem; writing-mode: vertical-rl; text-orientation: mixed; }
.book-card__title { font-family: var(--font-display); font-size: 1rem; margin: 8px 0 2px; }
.book-card__author { margin: 0 0 6px; }
.book-card__status { color: var(--ink-books); font-weight: 600; }
.book-card__note { margin: 8px 0 0; color: var(--ink-muted); }
</style>
```

- [ ] **Step 3: Rewrite `src/components/sections/Blog.vue`**

```vue
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
```

- [ ] **Step 4: Run the section tests**

Run: `npx vitest run src/components/sections/Projects.test.js src/components/sections/Books.test.js src/components/sections/Blog.test.js`
Expected: PASS — unchanged tests still green.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Projects.vue src/components/sections/Books.vue src/components/sections/Blog.vue
git commit -m "feat: static projects, books, and blog sections"
```

---

### Task 8: App composition, header PDF action, footer, index, cleanup

**Files:**
- Rewrite: `src/App.vue`
- Modify: `src/components/sections/Footer.vue` (credit text), `index.html` (meta description)
- Delete: `src/composables/useReveal.js`, `src/composables/useReveal.test.js`, `src/test/reduced-motion.test.js`, `src/components/ui/MisregisterText.vue`, `src/components/ui/MisregisterText.test.js`, `src/components/Marginalia.vue`, `src/components/Marginalia.test.js`
- Modify: `package.json` (`npm uninstall gsap`)

**Interfaces:**
- Consumes: all section components from Tasks 1–7, `ZinePage`, `ThemeToggle`, `cv.socials`.
- Produces:
  - `App.vue` — skip link, `.page-actions` (ThemeToggle + `PDF ↓` button calling `window.print()`), `ZinePage > main#main` with sections in the fixed order: Hero, Summary, Experience, Skills, Certifications, Education, Honors, Projects, Books, Blog, Footer.
  - `Footer.vue` — social links + credit `"Typeset with Vue · riso ink · paper"` + back-to-top.
  - After this task **no file imports** `useReveal`, `MisregisterText`, `Marginalia`, or `Research`, so deleting them is safe, and `gsap` is uninstallable.

- [ ] **Step 1: Rewrite `src/App.vue`**

```vue
<script setup>
import ZinePage from './components/ZinePage.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import Hero from './components/sections/Hero.vue'
import Summary from './components/sections/Summary.vue'
import Experience from './components/sections/Experience.vue'
import Skills from './components/sections/Skills.vue'
import Certifications from './components/sections/Certifications.vue'
import Education from './components/sections/Education.vue'
import Honors from './components/sections/Honors.vue'
import Projects from './components/sections/Projects.vue'
import Books from './components/sections/Books.vue'
import Blog from './components/sections/Blog.vue'
import Footer from './components/sections/Footer.vue'

function onPrint() {
  window.print()
}
</script>

<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="page-actions">
    <ThemeToggle />
    <button class="pdf-btn mono" type="button" @click="onPrint">PDF ↓</button>
  </div>
  <ZinePage>
    <main id="main">
      <Hero />
      <Summary />
      <Experience />
      <Skills />
      <Certifications />
      <Education />
      <Honors />
      <Projects />
      <Books />
      <Blog />
      <Footer />
    </main>
  </ZinePage>
</template>
```

- [ ] **Step 2: Update the footer credit** in `src/components/sections/Footer.vue`

Change the credit line from `Typeset with Vue · GSAP · riso ink` to:

```html
<p class="footer__credit serif-i">Typeset with Vue · riso ink · paper</p>
```

- [ ] **Step 3: Update `index.html` meta description and title**

Change the `<title>` from `Arben Ajredini` to:

```html
<title>Arben Ajredini — Software Engineer</title>
```

Change the `<meta name="description" ...>` content to:

```html
<meta name="description" content="Arben Ajredini — Software Engineer. Real-time mobile & cloud systems, native iOS, AI evaluation. A quiet, papery portfolio." />
```

- [ ] **Step 4: Delete the obsolete zine files**

```bash
rm src/composables/useReveal.js src/composables/useReveal.test.js
rm src/test/reduced-motion.test.js
rm src/components/ui/MisregisterText.vue src/components/ui/MisregisterText.test.js
rm src/components/Marginalia.vue src/components/Marginalia.test.js
rmdir src/components/ui 2>/dev/null || true
```

- [ ] **Step 5: Uninstall GSAP**

```bash
npm uninstall gsap
```

- [ ] **Step 6: Run the full suite**

Run: `npm test`
Expected: PASS — every remaining test is green (the deleted tests are gone; nothing imports the deleted modules).

- [ ] **Step 7: Commit**

```bash
git add src/App.vue src/components/sections/Footer.vue index.html package.json package-lock.json
git rm src/composables/useReveal.js src/composables/useReveal.test.js src/test/reduced-motion.test.js src/components/ui/MisregisterText.vue src/components/ui/MisregisterText.test.js src/components/Marginalia.vue src/components/Marginalia.test.js
git commit -m "feat: compose softened-zine page, add PDF action, remove GSAP and zine effects"
```

---

### Task 9: Full verification

**Files:**
- None created — verification only.

**Interfaces:**
- Consumes: everything from Tasks 1–8.

- [ ] **Step 1: Build**

Run: `npm run build`
Expected: builds without errors; `dist/` regenerated. (If `dist/` still contains stale files, `rm -rf dist` first is fine.)

- [ ] **Step 2: Confirm GSAP is gone from the bundle**

Run: `grep -r "gsap" dist/assets/*.js || echo "no gsap in bundle"` — expect `no gsap in bundle`.

- [ ] **Step 3: Preview + manual checklist**

Run: `npm run preview`, then walk the spec §17 checklist:

- [ ] No motion anywhere — scroll does nothing but scroll; no reveals, no count-ups, no draws; emulate `prefers-reduced-motion` and confirm nothing changes.
- [ ] Background is cream paper `#FAF8F3` in light theme, warm near-black `#121215` in dark; never white. Grain + faint ruled baseline visible; hero flourish under the name.
- [ ] Sections in order: Hero → Summary → Experience → Skills → Certifications → Education → Honors → Projects → Books → Blog → Footer.
- [ ] Real data present: ABEL, Independent, Mercor ×2, Matrics ×2, University of Prishtina, Machine Learning Specialization, the two First-Prize honors, LinkedIn + email contact.
- [ ] Toggles work with `aria-expanded` (Projects case studies, Blog excerpts) and are keyboard-reachable; Book notes always visible.
- [ ] Theme toggle flips paper ⇄ night paper and persists across reload.
- [ ] **Print preview** (Cmd+P): single clean column, cream paper background, no toggle/PDF buttons, entries not split across pages, collapsed case-study/blog content expanded.
- [ ] 390px viewport: no horizontal scroll.

- [ ] **Step 4: Report**

Summarize what was built, that the owner's content lives in `src/content/cv.js`, that the design is specified in `docs/superpowers/specs/2026-08-07-softened-zine-design.md`, and that deployment is one command away: `npm run deploy` (only when the owner asks).

---

## Self-Review Notes

**Spec coverage → tasks:**
- Paper-not-white + texture (spec §1/§6) → Task 2 (`.zine__rules`, `.zine__grain`, cream tokens) + Task 3 (ZinePage layers).
- Zero motion / removals (spec §2/§4) → Tasks 3–7 (static rewrites) + Task 8 (delete `useReveal`/`MisregisterText`/`Marginalia`/`Research`, uninstall `gsap`).
- Muted palette + night paper (spec §5) → Task 2 tokens.
- Typography (spec §7) → Task 2 font imports (unchanged set).
- Section order + new sections (spec §8) → Task 4 (Summary), Task 5 (Experience), Task 6 (Certs/Education/Honors), Task 7 (appendix), Task 8 (App composition).
- Content model real data (spec §9) → Task 1.
- Interactions (spec §10) → Task 7 toggles; Task 8 PDF action.
- Theming (spec §11) → unchanged `useTheme` + Task 2 night-paper tokens.
- Print/PDF (spec §12) → Task 2 `@media print` + Task 8 `PDF ↓` button.
- Accessibility (spec §13) → Task 3 skip link/focus (kept), Task 4 flourish `aria-hidden`, toggles `aria-expanded`, Task 2 focus + reduced-motion guard.
- Performance (spec §14) → Task 8 `npm uninstall gsap`; Task 2 inline-SVG texture.
- Edge cases (spec §15) → Task 1 optional-field shapes (`issuer`, `note`, `location` omitted when absent), Task 2 print overrides.
- Verification (spec §17) → Task 9.

**Placeholder scan:** no TBD/TODO; every code block is complete and runnable.

**Type/name consistency:** `cv.summary.headline/body`, `cv.skills.top[]` (`{skill, level}`), `cv.skills.toolbox{}` (`[name]: string[]`), `cv.certifications[].title/courses/issuer?`, `cv.education[].school/degree/period`, `cv.honors[].award/detail` are identical in Task 1 data and their Tasks 4/6 consumers. SectionShell props (`id/kicker/title/ink`) unchanged and used consistently. Class names used by tests (`.bar__fill`, `.timeline__line`, `.timeline__item`, `.timeline__note`, `.hero__flourish`, `.project-card__toggle`, `.post__toggle`) match the components that render them.
