import { describe, it, expect } from 'vitest';
import { formatTime, getSetTime } from '../schedule';

describe('formatTime', () => {
  it('converts afternoon time', () => {
    expect(formatTime('19:30')).toBe('7:30pm');
  });

  it('converts exact hour', () => {
    expect(formatTime('20:00')).toBe('8pm');
  });

  it('converts morning time', () => {
    expect(formatTime('9:00')).toBe('9am');
  });

  it('handles >24h wrapping (next day)', () => {
    expect(formatTime('25:00')).toBe('1am');
  });

  it('handles midnight', () => {
    expect(formatTime('24:00')).toBe('12am');
  });

  it('handles noon', () => {
    expect(formatTime('12:00')).toBe('12pm');
  });

  it('converts time with minutes and >24h', () => {
    expect(formatTime('25:30')).toBe('1:30am');
  });
});

describe('getSetTime', () => {
  it('returns formatted range for a known artist', () => {
    const result = getSetTime('FRIDAY', 'Kinetic Field', 'Argy');
    expect(result).toBe('5:30pm\u2009–\u20096:30pm');
  });

  it('handles sets crossing midnight', () => {
    const result = getSetTime('FRIDAY', 'Kinetic Field', 'Laidback Luke b2b Chuckie');
    // start 25:00 (1am), duration 90 → end 26:30 (2:30am)
    expect(result).toBe('1am\u2009–\u20092:30am');
  });

  it('returns null for unknown artist', () => {
    expect(getSetTime('FRIDAY', 'Kinetic Field', 'Nonexistent')).toBeNull();
  });

  it('returns null for unknown day', () => {
    expect(getSetTime('MONDAY', 'Kinetic Field', 'Argy')).toBeNull();
  });

  it('returns null for unknown stage', () => {
    expect(getSetTime('FRIDAY', 'Fake Stage', 'Argy')).toBeNull();
  });
});
