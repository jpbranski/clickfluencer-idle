// src/hooks/useThemeManager.ts
'use client';
import { useEffect, useState } from 'react';

export function useThemeManager() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('active-theme') || 'dark';
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } catch {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const changeTheme = (newTheme: string) => {
    // if clicking the same theme again, deactivate (fallback to default dark)
    const nextTheme = newTheme === theme ? 'dark' : newTheme;
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    try {
      localStorage.setItem('active-theme', nextTheme);
    } catch {
      /* ignore storage errors */
    }
  };

  return { theme, changeTheme };
}
