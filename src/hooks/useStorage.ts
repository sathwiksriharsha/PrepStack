import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export function useCompletionMap(storageKey: string) {
  const [completed, setCompleted] = useLocalStorage<Record<string | number, boolean>>(
    `${storageKey}-completed`, {}
  );
  const [bookmarked, setBookmarked] = useLocalStorage<Record<string | number, boolean>>(
    `${storageKey}-bookmarked`, {}
  );

  const toggleCompleted = useCallback((id: string | number) => {
    setCompleted(prev => ({ ...prev, [id]: !prev[id] }));
  }, [setCompleted]);

  const toggleBookmark = useCallback((id: string | number) => {
    setBookmarked(prev => ({ ...prev, [id]: !prev[id] }));
  }, [setBookmarked]);

  const completedCount = Object.values(completed).filter(Boolean).length;

  return { completed, bookmarked, toggleCompleted, toggleBookmark, completedCount };
}

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const toggle = useCallback(() => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle('dark', newDark);
    localStorage.setItem('prepstack-theme', newDark ? 'dark' : 'light');
  }, [isDark]);

  return { isDark, toggle };
}
