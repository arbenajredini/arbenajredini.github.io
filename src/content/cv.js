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
