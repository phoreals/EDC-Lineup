import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'edc-lineup-favorites';

function readStorage() {
  try {
    const arr = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    // Migrate: old format was plain artist names (no '::'); clear stale data
    if (arr.some(item => !item.includes('::'))) return new Set();
    return new Set(arr);
  } catch {
    return new Set();
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(readStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
  }, [favorites]);

  const toggle = useCallback(name => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }, []);

  return { favorites, toggle };
}
