import { describe, it, expect } from 'vitest';
import { STAGES, DAYS, LINEUP, getArtistsByStage, toTitle } from '../lineup';

describe('constants', () => {
  it('has 9 stages', () => {
    expect(STAGES).toHaveLength(9);
  });

  it('has 3 days', () => {
    expect(DAYS).toEqual(['FRIDAY', 'SATURDAY', 'SUNDAY']);
  });

  it('LINEUP has an entry for each day', () => {
    for (const day of DAYS) {
      expect(Array.isArray(LINEUP[day])).toBe(true);
      expect(LINEUP[day].length).toBeGreaterThan(0);
    }
  });
});

describe('getArtistsByStage', () => {
  it('returns an object keyed by stage name', () => {
    const result = getArtistsByStage('FRIDAY');
    expect(Object.keys(result)).toEqual(STAGES);
  });

  it('distributes artists across stages', () => {
    const result = getArtistsByStage('FRIDAY');
    const totalArtists = Object.values(result).reduce(
      (sum, arr) => sum + arr.length,
      0,
    );
    expect(totalArtists).toBeGreaterThan(0);
  });

  it('filters out empty strings', () => {
    const result = getArtistsByStage('FRIDAY');
    for (const artists of Object.values(result)) {
      for (const a of artists) {
        expect(a.trim()).not.toBe('');
      }
    }
  });

  it('each stage gets artists via modulo distribution', () => {
    const result = getArtistsByStage('FRIDAY');
    // First non-empty artist at index 0 should go to STAGES[0]
    const firstArtist = LINEUP.FRIDAY[0];
    if (firstArtist?.trim()) {
      expect(result[STAGES[0]]).toContain(firstArtist);
    }
  });
});

describe('toTitle', () => {
  it('capitalizes first letter and lowercases the rest', () => {
    expect(toTitle('FRIDAY')).toBe('Friday');
    expect(toTitle('hello')).toBe('Hello');
    expect(toTitle('SATURDAY')).toBe('Saturday');
  });
});
