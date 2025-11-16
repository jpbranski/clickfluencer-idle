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
      fontFamily: {
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
      },
      // Premium shadow system for idle game polish
      boxShadow: {
        'accent': '0 0 12px var(--accent)',
        'accent-lg': '0 0 24px var(--accent)',
        'premium': '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 0, 0, 0.1)',
        'premium-lg': '0 8px 32px rgba(0, 0, 0, 0.2), 0 0 1px rgba(0, 0, 0, 0.15)',
        'game-card': '0 2px 8px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'game-card-hover': '0 4px 16px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      // Enhanced animation system for commercial polish
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'glow': 'glow 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        glow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
      },
      // Typography scale for consistent hierarchy
      fontSize: {
        'display-1': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-2': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'heading-1': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'heading-2': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'heading-3': ['1.5rem', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '600' }],
        'heading-4': ['1.25rem', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.4' }],
      },
      // Spacing scale (extended from Tailwind defaults)
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
};

export default config;
