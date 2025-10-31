import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{ts,tsx,mdx}',
    './src/components/**/*.{ts,tsx,mdx}',
    './src/hooks/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
    './src/game/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // NOTE: do NOT add background here — your --background can be a gradient.
        foreground: 'var(--foreground)',
        // If you want token shortcuts later, add: border, muted, accent, etc.
        // BUT use utilities for backgrounds so gradients work.
      },
      boxShadow: {
        accent: '0 0 12px var(--accent)',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
    },
  },
  plugins: [],
};

export default config;
