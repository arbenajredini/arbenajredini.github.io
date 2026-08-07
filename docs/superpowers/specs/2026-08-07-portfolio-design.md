# Portfolio — "Risograph Zine" Design Spec

**Date:** 2026-08-07
**Status:** Approved for implementation
**Owner:** Arben Ajredini

## 1. Overview

Turn the current GitHub Pages scaffold (a bare Vue 3 + Vite + Tailwind app) into a
polished, interactive personal-brand page that reads like a **handcrafted risograph
zine** — a color-printed publication with vivid spot-color chapters, paper grain,
and slight ink misregistration. It carries the *spirit* of a beautifully typeset
document (editorial craftsmanship, marginalia, citations) without imitating a literal
CV/PDF.

The page is a personal brand site, not a job-application CV: it presents Arben as a
software developer whose interests extend to research, books, and blogging.

## 2. Goals & Non-Goals

### Goals
- Deliver a site that is **visibly colorful and distinctive** on first load.
- Keep the content **fully editable from one data file** with realistic placeholders.
- Provide the three interaction layers the user explicitly chose: scroll-driven
  animations, hover/expand reveals, and dark mode + micro-fx.
- Remain deployable to GitHub Pages via the existing `gh-pages` script.

### Non-goals (deferred / excluded for v1)
- **Spotlight search (Cmd+K)** — deferred.
- **PDF / print export** — deferred.
- Literal document scaffolding: no § chapter numbering, no table of contents, no
  paginated paper sheets, no running heads/page numbers, no `$ whoami` typewriter
  asides. These were explicitly dropped during design.
- A real LaTeX/Typst compile pipeline — the look is hand-tuned, not generated.

## 3. Design Concept — "Risograph Zine"

A risograph is a stencil duplicator that prints vivid **spot colors** onto slightly
off-white paper. Real riso prints have visible grain, flat ink, and small
**misregistration** where print passes don't quite align. The site recreates this:

- **Paper**: cream ground `#FAF8F3` with a low-opacity SVG grain overlay.
- **Section inks**: each content section is inked in its own risograph spot color
  (see §4).
- **Misregistration**: large headlines carry a thin offset duplicate of the headline
  in a second ink at low opacity, like a slightly-off print pass. On hover the offset
  shifts a few pixels — a subtle, delightful "the print is alive" moment.
- **Ink overlap**: where sections' colored elements meet, a faint blend seam reads
  like two passes touching.
- **Marginalia** (the kept document nod): small colored margin notes that fade in
  beside content as you read or on hover, in the section's ink.
- **Citations**: research items render as `[1]`, `[2]`, … that expand their abstract
  in place.

## 4. Color System

Risograph inks on cream paper. Define as CSS custom properties so light/dark and
per-section theming share one source of truth.

| Token | Riso ink | Light (paper) hex | Dark (night riso) hex |
|-------|----------|-------------------|-----------------------|
| `--paper` | — | `#FAF8F3` | `#121215` |
| `--ink` (base text) | Black | `#1B1B1F` | `#E9E6DF` |
| `--ink-experience` | Fluorescent orange | `#FF4A00` | `#FF6A1F` |
| `--ink-projects` | Bright blue | `#1F7DFF` | `#4DA3FF` |
| `--ink-research` | Fluorescent pink | `#FF2E93` | `#FF4DA6` |
| `--ink-books` | Bright yellow | `#F5B400` | `#FFD21F` |
| `--ink-blog` | Teal / mint | `#00A896` | `#2BC9B4` |
| `--ink-skills` | Violet | `#7C4DFF` | `#9B7BFF` |
| `--ink-muted` (labels/notes) | Gray | `#6B6B6B` | `#9C9A92` |

- Light theme = "paper": cream background, near-black ink text, vivid section inks.
- Dark theme = "night riso": near-black background, warm off-white ink text, the
  fluorescent inks brightened so they glow against the dark (right-hand hex column).
- All ink colors must hold **AA contrast** against their theme's paper for text use;
  colors are allowed to be used decoratively (large display type, rules, notes) where
  contrast requirements are relaxed but still legible.

## 5. Typography

The zine combo — display + body + mono:

- **Display / headlines** — a bold, punchy grotesque (e.g. **Space Grotesk** Bold or
  **Archivo Black**), set in the section's ink color. This is where color lives
  hardest. Self-hosted via Fontsource, subset + preloaded.
- **Body** — **Inter** (humanist grotesque) in `--ink`, chosen for scannability.
  Editorial flavor comes from **serif italic accents** (New Computer Modern Italic) in
  pull-out phrases. Do not introduce additional body families in v1.
- **Mono** — for small metadata labels: dates, tags, footnote numbers, section
  kickers. e.g. **JetBrains Mono** or **IBM Plex Mono**, self-hosted.
- **Vertical rhythm**: a strict modular scale so spacing reads as set type.
- **Kickers**: each section has a small mono uppercase kicker (e.g. `02 / EXPERIENCE`)
  in the section ink — the lightweight descendant of the dropped § numbering.

## 6. Structure

A flowing single column (with wide left margin gutter on desktop for marginalia),
not paginated:

1. **Hero** — name, role line, one-line tagline, contact/socials. Big fluorescent
   misregistered headline.
2. **Experience** — vertical timeline in fluorescent orange; draws itself on scroll.
3. **Projects** — cards in bright blue; stagger in; click expands a case-study drawer.
4. **Research** — `[1]`-style citations in fluorescent pink; hover/click expands the
   abstract in place.
5. **Books** — an interactive bookshelf in bright yellow; covers tilt on hover,
   reveal a one-line reading note.
6. **Blog** — posts in teal with expandable abstracts and `→ read on blog` links.
7. **Skills** — count-up bars + tag cloud in violet.
8. **Footer / colophon** — socials, "typeset with Vue · GSAP · riso ink" credit,
   back-to-top.

### The marginal gutter
Desktop layout reserves a left margin column (~160px) where marginalia notes appear
aligned to the content they annotate. On mobile the gutter collapses and margin notes
become inline popovers on tap.

## 7. Content Model

Single source of truth: `src/content/cv.js`. Every section reads from it. Each entry
ships with realistic **placeholder** data the owner replaces (not removes).

```js
export const cv = {
  profile: {
    name: 'Arben Ajredini',
    role: 'Software Developer',
    tagline: '…',
    location: '…',
    contact: { email: '…', website: '…' },
    socials: [ { label: 'GitHub', url: '…' }, /* … */ ],
  },
  experience: [ /* { company, role, period, summary, bullets[], tags[] } */ ],
  projects:  [ /* { title, subtitle, description, problem, approach, stack[], links{} } */ ],
  research:  [ /* { title, venue, year, abstract, url } */ ],
  books:     [ /* { title, author, status: 'read'|'reading'|'tbr', note } */ ],
  posts:     [ /* { title, date, excerpt, url, tags[] } */ ],
  skills:    { groups: [ /* { name, items: [ { skill, level(0-100) } ] } */ ] },
}
```

## 8. Interaction & Animation Layer

All three layers from the approved design, recolored for the zine:

### ① Scroll-driven (GSAP + ScrollTrigger)
- **Section reveals**: each section's headline kicks in with an **ink-flash** — the
  kicker slides in, then the headline clips across in its ink color, then content
  staggers in (12px rise + fade, cascading by index).
- **Experience timeline** draws itself top-to-bottom, scrubbed to scroll; role markers
  pop as the line reaches them.
- **Skill bars** count up from 0 when scrolled into view (number + fill).
- Reveals are one-shot on entry; only the timeline is scroll-scrubbed.

### ② Hover / expand reveals
- **Marginalia**: colored notes fade in the gutter beside the annotated content
  (focus-reachable, see §10).
- **Misregistration shift**: large headlines' offset duplicate moves a few px on
  hover.
- **Project cards**: lift on hover; click toggles an in-place case-study drawer
  (problem → approach → stack → live link).
- **Citations `[1]`**: expand the abstract in place on hover.
- **Books**: covers tilt toward the cursor; hover reveals the reading note.

### ③ Micro-fx (polish)
- **Paper grain** (SVG noise, ~4–6% opacity) over the whole page.
- **Ink-fade**: links/headings saturate slightly on hover, like ink drying.
- **Cursor glow** in night-riso mode following the pointer.
- **Theme crossfade** via CSS custom properties.

### Motion principles
- `prefers-reduced-motion` disables the choreography layer entirely; content stays
  readable and unshifted.
- Hovers ~0.2s; scroll reveals 0.5–0.7s ease-out "settle"; nothing floaty; the only
  bounce is a deliberate footnote pop.
- Animations touch `transform`/`opacity` only.

## 9. Theming

- Toggle in the header; **persists in `localStorage`**; defaults to
  `prefers-color-scheme`.
- Light = "paper", dark = "night riso" (see §4). Both themes are colorful — dark is
  not a grayscale inversion.
- All colors are CSS custom properties; the toggle swaps token values with a smooth
  crossfade.

## 10. Accessibility

- Semantic HTML (`header`/`main`/`section`/`article`/`footer`), real heading
  hierarchy, skip-to-content link.
- Every expandable is a `<button>` with `aria-expanded` and `aria-controls`; visible
  focus rings.
- Hover-only information (marginalia, citation abstracts, book notes) is **also
  reachable on keyboard focus**.
- `prefers-reduced-motion` honored globally.
- AA contrast for text on both themes.

## 11. Performance

- GSAP tree-shaken; only ScrollTrigger + gsap core imported.
- Fonts self-hosted, subsetted, `font-display: swap`, preloaded.
- No image dependencies in v1 — book covers are **CSS-generated placeholder covers**
  (ink-colored spine + title type). Real covers can slot in later.
- Animations touch `transform`/`opacity` only; no layout thrash.
- Below-the-fold sections render their reveal hooks only on scroll.

## 12. Edge Cases

- **Missing data**: any empty array/field renders nothing (no broken sections), or a
  clearly-marked placeholder where content is expected.
- **Long content**: sections flow vertically; the marginal gutter grows with content;
  nothing clips.
- **Long titles/labels**: wrap gracefully; display type uses `text-wrap: balance`.
- **Mobile**: single column, gutter collapses, margin notes become tap popovers,
  hover reveals become tap reveals.
- **Reduced motion**: choreography off; content static and readable.
- **No-JS**: content should not be fully hidden; the site requires JS for the app
  (Vue SPA) but reveals must not trap content invisibly.

## 13. Verification

- `npm run build` passes with no errors.
- `npm run preview` + manual checklist:
  - All sections render from placeholder content.
  - Theme toggle flips paper ⇄ night riso, persists across reload, respects
    prefers-color-scheme on first visit.
  - Experience timeline draws on scroll; skill bars count up.
  - Marginalia, citations, project drawers, and book notes all open on hover AND
    keyboard focus.
  - Misregistration shift works on headlines.
  - `prefers-reduced-motion` (emulated in DevTools) degrades cleanly.
  - Mobile viewport (~390px): gutter collapses, reveals work on tap, no horizontal
    scroll.

## 14. File Structure

```
src/
  content/cv.js              ← the only file the owner edits
  composables/
    useTheme.js              ← paper/ink toggle, localStorage, prefers-color-scheme
    useReveal.js             ← GSAP/ScrollTrigger reveal + draw hooks
  components/
    ZinePage.vue             ← page wrapper: paper bg, grain, theme, cursor glow
    SectionShell.vue         ← kicker + headline + content slot, ink color, reveal
    Marginalia.vue           ← gutter note (hover/focus reveal)
    sections/
      Hero.vue
      Experience.vue         ← scrubbed timeline
      Projects.vue           ← expandable case-study cards
      Research.vue           ← [n] citations + expandable abstracts
      Books.vue              ← CSS-placeholder covers, tilt, notes
      Blog.vue               ← expandable post abstracts
      Skills.vue             ← count-up bars + tags
    ui/
      MisregisterText.vue    ← offset-duplicate headline (hover shift)
      InkButton.vue / InkLink.vue
  style.css                  ← tokens (colors, type), grain, base
```

## 15. Out of Scope (future)

- Spotlight search (Cmd+K) over content.
- Real PDF / print export.
- Real book cover images; real project screenshots.
- Blog engine / CMS — blog items are links to an external blog.
