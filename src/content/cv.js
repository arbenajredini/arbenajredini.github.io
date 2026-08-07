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
