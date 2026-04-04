import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'edc-lineup-favorites';

function readFromStorage() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
  } catch {
    return new Set();
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(readFromStorage);

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

  const has = useCallback(name => favorites.has(name), [favorites]);

  return { favorites, toggle, has };
}
