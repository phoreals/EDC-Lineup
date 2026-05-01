import { describe, it, expect } from 'vitest';
import { formatTime, getSetTime, getSubStage } from '../schedule';

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

describe('getSubStage', () => {
  it('returns the real sub-stage name for a Smaller Stages artist', () => {
    expect(getSubStage('FRIDAY', 'Big Daddy Kess')).toBe('Forest House');
  });

  it('returns null for an unknown artist', () => {
    expect(getSubStage('FRIDAY', 'Nonexistent')).toBeNull();
  });

  it('returns null for an unknown day', () => {
    expect(getSubStage('MONDAY', 'Big Daddy Kess')).toBeNull();
  });
});

describe('getSetTime', () => {
  it('returns formatted range for a known artist', () => {
    const result = getSetTime('FRIDAY', 'Kinetic Field', 'Argy');
    // start 21:00 (9pm), duration 60 → end 22:00 (10pm)
    expect(result).toBe('9pm\u2009–\u200910pm');
  });

  it('handles sets crossing midnight', () => {
    const result = getSetTime('FRIDAY', 'Kinetic Field', 'The Chainsmokers');
    // start 24:32 (12:32am), duration 68 → end 25:40 (1:40am)
    expect(result).toBe('12:32am\u2009–\u20091:40am');
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
