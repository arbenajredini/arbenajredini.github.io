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
