# Portfolio — "Softened Zine" Design Spec

**Date:** 2026-08-07
**Status:** Approved for implementation (design approved 2026-08-07; papery-background amendment added 2026-08-07)
**Owner:** Arben Ajredini
**Supersedes:** `2026-08-07-portfolio-design.md` (Risograph Zine)

## 1. Overview

Restyle the existing Risograph Zine portfolio into a **quiet, printable, document-like
page** — the "Softened Zine". It keeps the risograph DNA (warm **paper** ground, the
spot-ink palette, mono kickers, serif-italic accents) but treats the page as a
**typeset document, not a live poster**: ink color appears only on section kickers,
titles, small rules, and numerals; body copy is near-black on paper; **nothing moves**.

The content is replaced with the owner's **real professional data** from
`/Users/endrit/Downloads/Profile.pdf` (a LinkedIn-style resume). The PDF's structure
comes first (Summary → Experience → Skills → Certifications → Education → Honors);
the site's personal extras (Projects, Books, Blog) are kept as a quieter **appendix**.

The page must also **print cleanly to PDF** via a dedicated `@media print` stylesheet,
and be reachable through a header **PDF** action.

## 2. Goals & Non-Goals

### Goals
- **Paper, not white.** The background is always warm cream paper (never pure white),
  with a subtle layered paper texture — grain/fibers — and a light hand-drawn accent.
- **Zero motion.** Remove every scroll reveal, stagger, draw-on, count-up, hover-shift,
  tilt, and cursor-glow effect. GSAP is deleted from the project.
- **Real data.** Every professional field comes from `Profile.pdf`. Placeholders remain
  only where the PDF genuinely has no data (project/books/blog extras).
- **PDF-faithful structure** with personal extras kept as an appendix.
- **Quiet dark theme** ("night paper"), not neon riso.
- **Print-ready**: `@media print` CSS plus a header "PDF" action.
- Keep deployability via the existing `gh-pages` script.

### Non-goals
- No re-introduction of scroll/hover animation choreography.
- No literal paginated PDF emulation on screen (no fixed A4 sheets, page numbers, or
  running heads). It reads like a document; it does not fake being a PDF viewer.
- No new frameworks, no new animation libraries, no new font families.
- No blog engine / CMS. Blog items remain external links.
- Spotlight search stays deferred (from the previous spec).

## 3. Design Concept — "Softened Zine"

The original spec's riso zine was vivid and kinetic: fluorescent spot colors per
section, misregistration ghosts, paper grain, cursor glow. This version keeps the
**materials** and drops the **theatrics**.

- **Paper**: warm cream `#FAF8F3` (light) / warm near-black `#121215` (dark). **Never
  pure white** — on any theme or in print. A low-opacity **grain/fiber texture** overlays
  the whole page so it reads as a sheet of paper, not a flat color.
- **Hand-drawn accent**: one quiet, hand-drawn detail — a short ink-underlined
  flourish beneath the hero name and/or a very faint ruled baseline in the background
  (see §6). This is the "drawing something" the owner asked for; it stays static and
  subtle.
- **Section inks**: kept from the riso palette, applied sparingly — kicker, section
  title, small rules, dates, numerals. Headlines are solid ink (no misregistration).
- **Interaction**: only functional expand/collapse toggles (case studies, book notes,
  blog excerpts). Everything else renders fully visible and static.

## 4. What Gets Removed

| Item | Files | Reason |
|---|---|---|
| GSAP + `useReveal` (reveal, stagger, drawLine, countUp) | `src/composables/useReveal.js`, `useReveal.test.js`; `gsap` in `package.json` | The "fancy animations" — no scroll choreography at all |
| Misregistration text + hover shift | `src/components/ui/MisregisterText.vue` (+test), `.misregister` CSS | It is an effect/motion; headlines become solid ink |
| Cursor glow | `.zine__glow` in `ZinePage.vue` / `style.css` | Decorative motion-following layer |
| Scroll-drawn timeline | draw-on in `Experience.vue` | Static vertical rule instead |
| Count-up skill bars | animation in `Skills.vue` | Static bars (final values hard-rendered) |
| Books tilt / hover-note reveal | `Books.vue` | Static cards; note shown statically |
| Stagger reveals (cards, lists, rows) | all section components | Static rendering |
| Marginalia hover-fade | `src/components/Marginalia.vue` (+test), `.marginalia` CSS | `note` becomes a static muted line under each role |
| Research section | `src/components/sections/Research.vue` (+test) | Its content was placeholder fabrication, absent from the PDF |

## 5. Color System — "paper" and "night paper"

CSS custom properties, one source of truth. Light = cream paper with near-black ink.
Dark = **night paper**: warm near-black ground, warm off-white text, and section inks
**desaturated** so they read as quiet accents, not neon.

| Token | Light (paper) | Dark (night paper) |
|---|---|---|
| `--paper` | `#FAF8F3` (warm cream, **not white**) | `#121215` |
| `--ink` (body) | `#1B1B1F` | `#E9E6DF` |
| `--ink-muted` | `#6B6B6B` | `#9C9A92` |
| `--ink-experience` | `#FF4A00` | `#C2561F` (muted orange) |
| `--ink-projects` | `#1F7DFF` | `#3E5F91` (muted blue) |
| `--ink-research` | `#FF2E93` | `#A94A75` (muted pink) |
| `--ink-books` | `#B08A00` (muted yellow for text legibility) | `#8A7A3C` (muted) |
| `--ink-blog` | `#007A6A` (muted teal) | `#2E6B63` (muted) |
| `--ink-skills` | `#5B4D8A` (muted violet) | `#5A4F78` (muted) |

Notes:
- The light theme inks are slightly **muted from the original neon** values — still
  clearly the riso palette, but calmer and print-friendly. (Where the original used
  `#FF4A00`, `#1F7DFF`, etc., they remain recognizably those hues.)
- Body text is near-black `--ink` everywhere; ink colors are reserved for accent
  elements (kickers, titles, rules, dates, numerals, tags) so contrast stays strong.
- Dark mode is **not** a grayscale inversion — it is "paper after dark": same layout,
  quiet desaturated accents.

## 6. Paper Texture & Hand-Drawn Accent

The papery feel is a requirement, not a detail:

1. **Cream ground** — `--paper` as above. No pure white anywhere (including print).
2. **Grain/fiber overlay** — the existing low-opacity SVG noise layer stays, tuned so
   it reads as paper fiber rather than static: ~`0.04` in light, ~`0.07` in dark.
   Optionally a second, very faint **fiber-stroke layer** (long horizontal hairlines)
   is layered beneath the grain to suggest laid paper.
3. **Hand-drawn accent** — a static, subtle **ink flourish** under the hero name:
   a short hand-drawn underline/squiggle in `--ink` (SVG path with a slightly uneven
   stroke, ~2px), plus a barely-visible **ruled baseline** (thin horizontal hairlines
   every `1.6rem` at ~3% opacity) in the page background behind content. Both are
   `aria-hidden` and static — no animation. If the ruled baseline proves visually
   noisy, it is dropped and the hero flourish remains.

## 7. Typography

Unchanged families from the riso spec — no new fonts:

- **Display** — Space Grotesk 700 (headlines, hero name, section titles).
- **Body** — Inter (400/600).
- **Mono** — JetBrains Mono (kickers, dates, metadata, tags).
- **Serif italic accent** — Crimson Pro italic (pull-out phrases, `note` lines,
  summary quote).
- Vertical rhythm stays on a strict modular scale; `text-wrap: balance` on titles.

## 8. Structure & Section Order

A flowing single column (the marginal gutter is removed — no more left margin column).
Order mirrors a resume document, with personal extras as an appendix:

1. **Hero** — name, role line, one-line tagline, location, contact (email + LinkedIn),
   socials, and the hand-drawn flourish.
2. **Summary** — headline "Software Engineer | Mathematics" plus a short paragraph.
3. **Experience** — static vertical timeline: ABEL, Independent, Mercor (2 roles),
   Matrics (2 roles). Per role: period (mono), company, role, summary, bullets, tags.
   `note` (if present) renders as a static muted serif-italic line.
4. **Top Skills & Toolbox** — the PDF's three Top Skills (TypeScript, Microservices,
   Keras) as **static bars** with conservative inferred levels; a **Toolbox** tag group
   listing technologies actually named in the PDF (NestJS, Go, Swift, SwiftUI, UIKit,
   XCTest, React Native, NextJS, Keras, Pandas, Microservices, AI evaluation).
5. **Certifications** — Machine Learning Specialization with its three courses listed.
6. **Education** — University of Prishtina, BSc Mathematics (2019–2022).
7. **Honors & Awards** — First Prize, 29th International Mathematics Competition for
   University Students; First Prize, 28th International Mathematics Competition for
   University Students.
8. **Appendix** — Projects, Books, Blog (existing content, restyled, static; expandable
   toggles retained).
9. **Footer** — socials + credit + back-to-top.

## 9. Content Model

Single source of truth: `src/content/cv.js`. Replaces placeholders with real data from
`Profile.pdf`. New top-level fields: `summary`, `certifications`, `honors`, `education`;
`skills` splits into `top` (bars) and `toolbox` (tags); `experience` is flattened to one
entry per role (Mercor and Matrics each contribute two).

```js
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
    // ABEL — Senior Software Engineer (Nov 2024 — Present)
    //   bullets: Backend (NestJS microservices, realtime streaming, background
    //            processing, low-latency APIs); iOS (Swift/SwiftUI, offline-first,
    //            clean architecture, rapid UI rendering); End-to-End (API design →
    //            deployment → App Store release)
    // Independent — Software Engineer (Jan 2020 — Present)
    //   summary: services to several companies — education apps, trading automation, AI
    // Mercor — Software Engineering Expert (Feb 2026 — Jun 2026)
    //   bullets: SWE-bench task creation/review; test cases + rubrics; PR/patches review
    // Mercor — Math Expert (Oct 2025 — Feb 2026)
    //   bullets: review AI math solutions; rubric scoring; write/vet math problems;
    //            consistent grading with other experts
    // Matrics — iOS Engineer (Mar 2022 — Nov 2024, Pristina)
    //   bullets: UIKit + MVVM + Coordinator UI; XCTest unit/UI testing; RN → Swift refactor
    // Matrics — Software Engineer (Jan 2021 — Mar 2022, Pristina)
    //   bullets: NestJS/Go microservices; NextJS website; React Native app
  ],
  skills: {
    top: [
      { skill: 'TypeScript', level: 90 },   // inferred from PDF evidence, editable
      { skill: 'Microservices', level: 85 },
      { skill: 'Keras', level: 75 },
    ],
    toolbox: {
      Backend:    ['NestJS', 'Go', 'Microservices'],
      Mobile:     ['Swift', 'SwiftUI', 'UIKit', 'React Native'],
      Frontend:   ['NextJS', 'TypeScript'],
      ML / AI:    ['Keras', 'Pandas', 'AI evaluation', 'SWE-bench'],
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
  projects: [ /* existing placeholder content kept */ ],
  books:    [ /* existing placeholder content kept */ ],
  posts:    [ /* existing placeholder content kept */ ],
  socials: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/arben-ajredini' },
    { label: 'Email', url: 'mailto:arbenajredini55@gmail.com' },
  ],
}
```

**Data decisions to flag to the owner during review:**
- Skill **levels** are inferred (the PDF lists no percentages) and live in `cv.js` for
  easy editing.
- "Pandas" is treated as a skill (appears in the PDF's skills column), not a cert.
- Socials are exactly what the PDF shows (LinkedIn, Email). GitHub/X placeholders are
  removed; the owner can re-add any links in `cv.socials`.

## 10. Interactions (what remains)

- **Expand/collapse toggles** — Projects case-study drawers and Blog excerpts.
  Implemented as `<button aria-expanded>` + `v-show`; instant, no animation.
- **Book notes** render statically (always visible, muted) — no toggle, no hover.
- **Theme toggle** — paper ⇄ night paper, `localStorage['zine-theme']`, defaults to
  `prefers-color-scheme`. Same behavior as the current `useTheme` (unchanged).
- **PDF action** — a small header link/button calling `window.print()`.
- Everything else renders fully visible and static. `prefers-reduced-motion` is
  trivially honored (there is no motion), but the CSS guard is retained.

## 11. Theming

- Toggle persists in `localStorage`; defaults to `prefers-color-scheme`; `data-theme`
  on `<html>` as today.
- Light = "paper" (cream). Dark = "night paper" (warm near-black, desaturated accents).
  Both are papery; neither is white; neither is neon.
- Colors are CSS custom properties; no transition animation required on toggle (instant
  swap is fine and more "printed").

## 12. Print / PDF

A dedicated `@media print` block plus a header **PDF** action:

- Force `--paper` to the **cream** paper (via `print-color-adjust: exact`), so even
  print output is papery, not white — per the owner's requirement.
- Hide fixed chrome: theme toggle, PDF button, grain layer (or reduce to nothing), skip
  link.
- Collapse any gutter/padding to a single clean column; remove `position: fixed`.
- `break-inside: avoid` on each experience/education/honor/project/book/post entry;
  page-break-before major sections as needed.
- Expand hidden content in print (case-study drawers, blog excerpts) via `display`
  overrides so nothing is lost.
- Set sensible print type sizes and margins (`@page { margin: … }`), and keep ink
  accent rules for structure.

## 13. Accessibility

- Semantic `header`/`main`/`section`/`article`/`footer`; real heading hierarchy;
  skip-to-content link retained.
- Every expandable is a `<button>` with `aria-expanded`/`aria-controls`; visible focus
  rings.
- No hover-only information (removed with the motion layer).
- AA contrast for text on both themes (muted inks are for accents/large type only).
- Grain/flourish layers are `aria-hidden`.
- `prefers-reduced-motion` CSS guard retained (trivially satisfied).

## 14. Performance

- GSAP removed → zero animation libraries.
- Fonts self-hosted via Fontsource, `font-display: swap`, unchanged set.
- Paper texture is inline SVG (data URI) / CSS — no image requests.
- No layout thrash (no animation touching layout).

## 15. Edge Cases

- **Missing data**: any empty array/field renders nothing (no broken sections); optional
  fields (`issuer`, `location`, `note`) omit their element when absent.
- **Long content**: sections flow; entries wrap gracefully; `text-wrap: balance` on
  titles.
- **Mobile (~390px)**: single column; toolbox groups stack; no horizontal scroll.
- **Print**: entries never split awkwardly (`break-inside: avoid`); fixed elements
  hidden.
- **No-JS**: unchanged — Vue SPA requires JS, but nothing is hidden behind reveals.

## 16. File Structure & Changes

```
src/
  content/cv.js                    ← REWRITE: real data + new fields
  content/cv.test.js               ← REWRITE: new shapes
  composables/useTheme.js          ← keep (unchanged)
  composables/useReveal.js         ← DELETE (+ test)
  components/
    ZinePage.vue                   ← REWRITE: paper + grain + fiber layer; remove glow
    SectionShell.vue               ← REWRITE: no reveal
    ThemeToggle.vue                ← keep; add header "PDF" action (or in App.vue)
    Marginalia.vue                 ← DELETE (+ test)
    ui/MisregisterText.vue         ← DELETE (+ test)
    sections/
      Hero.vue                     ← REWRITE: no misregister; flourish; real data
      Summary.vue                  ← NEW
      Experience.vue               ← REWRITE: static timeline; no draw; static note line
      Skills.vue                   ← REWRITE: static bars + toolbox; real data
      Certifications.vue           ← NEW
      Education.vue                ← NEW
      Honors.vue                   ← NEW
      Projects.vue                 ← REWRITE: no stagger; keep toggle
      Books.vue                    ← REWRITE: no tilt; static note
      Blog.vue                     ← REWRITE: no stagger; keep toggle
      Research.vue                 ← DELETE (+ test)
  style.css                        ← REWRITE: softened tokens, night-paper dark,
                                     paper texture, hand-drawn accent, print CSS
src/App.vue                        ← REWRITE: new section order + header PDF action
index.html                         ← UPDATE: meta description/title
package.json                       ← REMOVE: gsap
```

## 17. Verification

- `npm test` green (updated content shape tests + component tests without reveal/motion
  dependencies).
- `npm run build` passes; `npm run preview` renders all sections from real data.
- Manual checklist:
  - No motion anywhere (no GSAP in bundle; nothing animates; reduced-motion emulation
    changes nothing).
  - Background is cream paper in both themes and in print preview (never white);
    grain/fiber texture visible but subtle; hero flourish present.
  - Sections in spec §8 order; PDF data correct (ABEL, Mercor ×2, Matrics ×2, education,
    honors, certs, contact).
  - Toggles (projects/books/blog) work with `aria-expanded`; focus-reachable.
  - Theme toggle persists; dark is muted "night paper".
  - **Print preview** (Cmd+P) clean: single column, entries not split, chrome hidden,
    papery cream background.
  - 390px viewport: no horizontal scroll.
