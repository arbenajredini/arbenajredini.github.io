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
