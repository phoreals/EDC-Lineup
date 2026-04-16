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

  it('toggles an artist into favorites', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggle('Tiësto'));
    expect(result.current.favorites.has('Tiësto')).toBe(true);
  });

  it('toggles an artist out of favorites', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggle('Tiësto'));
    act(() => result.current.toggle('Tiësto'));
    expect(result.current.favorites.has('Tiësto')).toBe(false);
  });

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggle('Zedd'));
    const stored = JSON.parse(localStorage.getItem('edc-lineup-favorites'));
    expect(stored).toContain('Zedd');
  });

  it('loads existing favorites from localStorage', () => {
    localStorage.setItem(
      'edc-lineup-favorites',
      JSON.stringify(['Armin Van Buuren (Sunrise Set)', 'ANNA']),
    );
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites.has('ANNA')).toBe(true);
    expect(result.current.favorites.size).toBe(2);
  });

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem('edc-lineup-favorites', '{invalid json');
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites.size).toBe(0);
  });
});
