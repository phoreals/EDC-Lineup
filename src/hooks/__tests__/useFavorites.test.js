import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFavorites } from '../useFavorites';

beforeEach(() => {
  localStorage.clear();
});

describe('useFavorites', () => {
  it('starts with an empty set', () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites.size).toBe(0);
  });

  it('toggles a set into favorites', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggle('Tiësto::FRIDAY::22:00'));
    expect(result.current.favorites.has('Tiësto::FRIDAY::22:00')).toBe(true);
  });

  it('toggles a set out of favorites', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggle('Tiësto::FRIDAY::22:00'));
    act(() => result.current.toggle('Tiësto::FRIDAY::22:00'));
    expect(result.current.favorites.has('Tiësto::FRIDAY::22:00')).toBe(false);
  });

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggle('Zedd::SATURDAY::01:00'));
    const stored = JSON.parse(localStorage.getItem('edc-lineup-favorites'));
    expect(stored).toContain('Zedd::SATURDAY::01:00');
  });

  it('loads existing favorites from localStorage', () => {
    localStorage.setItem(
      'edc-lineup-favorites',
      JSON.stringify(['Armin Van Buuren (Sunrise Set)::SUNDAY::05:00', 'ANNA::FRIDAY::23:30']),
    );
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites.has('ANNA::FRIDAY::23:30')).toBe(true);
    expect(result.current.favorites.size).toBe(2);
  });

  it('discards old-format favorites without set keys', () => {
    localStorage.setItem(
      'edc-lineup-favorites',
      JSON.stringify(['ANNA', 'Zedd']),
    );
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites.size).toBe(0);
  });

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem('edc-lineup-favorites', '{invalid json');
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites.size).toBe(0);
  });
});
