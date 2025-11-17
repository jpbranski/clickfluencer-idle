// src/data/themes.ts
import { Theme } from '@/types/theme';

export const themes: Theme[] = [
  {
    id: 'dark',
    name: 'Dark',
    displayName: 'Dark',
    description: 'Default stormy slate theme. No bonus.',
    cost: 0,
    unlocked: true,
    preview: 'linear-gradient(135deg, #12141b 0%, #1e2230 100%)',
    active: true,
    bonusMultiplier: 1.0, // No bonus (default)
    backgroundImage: '/themes/default-bg.webp',
    iconImage: '/themes/default-icon.webp',
  },
  {
    id: 'light',
    name: 'Light',
    displayName: 'Light',
    description: 'Bright material-inspired palette. No bonus.',
    cost: 0,
    unlocked: false,
    preview: 'linear-gradient(to bottom right, #ffffff, #eaeef5)',
    active: false,
    bonusMultiplier: 1.0, // No bonus
    backgroundImage: '/themes/default-bg.webp',
    iconImage: '/themes/default-icon.webp',
  },
  {
    id: 'night-sky',
    name: 'Night Sky',
    displayName: 'Night Sky',
    description: 'Cool purples and silvers under starlight. +10% follower generation.',
    cost: 5,
    unlocked: false,
    preview: 'linear-gradient(135deg, #1a1440 0%, #362f7a 50%, #4b5ac8 100%)',
    active: false,
    bonusMultiplier: 1.1, // +10% follower generation
    backgroundImage: '/themes/default-bg.webp',
    iconImage: '/themes/default-icon.webp',
  },
  {
    id: 'touch-grass',
    name: 'Touch Grass',
    displayName: 'Touch Grass',
    description: 'A peaceful palette of greens and sunlight. +8% follower generation.',
    cost: 10,
    unlocked: false,
    preview: 'linear-gradient(135deg, #d6f7d7 0%, #9df2b2 50%, #6ed38d 100%)',
    active: false,
    bonusMultiplier: 1.08, // +8% follower generation
    backgroundImage: '/themes/default-bg.webp',
    iconImage: '/themes/default-icon.webp',
  },
  {
    id: 'terminal',
    name: 'Terminal',
    displayName: 'Terminal',
    description: 'Monokai dark for true hackers. +12% follower generation.',
    cost: 25,
    unlocked: false,
    preview: 'linear-gradient(135deg, #1b1d17 0%, #2f3322 50%, #515b2d 100%)',
    active: false,
    bonusMultiplier: 1.12, // +12% follower generation
    backgroundImage: '/themes/default-bg.webp',
    iconImage: '/themes/default-icon.webp',
  },
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    displayName: 'Cherry Blossom',
    description: 'Soft pinks drifting through spring air. +7% follower generation.',
    cost: 50,
    unlocked: false,
    preview: 'linear-gradient(135deg, #ffe0ec 0%, #f7b8d1 50%, #e48cb1 100%)',
    active: false,
    bonusMultiplier: 1.07, // +7% follower generation
    backgroundImage: '/themes/default-bg.webp',
    iconImage: '/themes/default-icon.webp',
  },
  {
    id: 'themevv',
    name: 'ThemeVV',
    displayName: 'ThemeVV',
    description: 'Largely white and black (like a panda), with red accents like a crayon. +6.9% click power.',
    cost: 69,
    unlocked: false,
    preview: 'linear-gradient(135deg, #0d0b0c 0%, #301316 50%, #862328 100%)',
    active: false,
    bonusMultiplier: 1.0, // No production bonus
    bonusClickPower: 6.9, // +6.9 to base click power
  },
  {
    id: 'nightshade',
    name: 'Nightshade',
    displayName: 'Nightshade',
    description: 'Belladonna tones of violet and green. +15% follower generation.',
    cost: 100,
    unlocked: false,
    preview: 'linear-gradient(135deg, #140e24 0%, #361c5a 50%, #5a2f83 100%)',
    active: false,
    bonusMultiplier: 1.15, // +15% follower generation
    backgroundImage: '/themes/default-bg.webp',
    iconImage: '/themes/default-icon.webp',
  },
  {
    id: 'el-blue',
    name: 'EL Blue',
    displayName: 'EL Blue',
    description: 'Inspired by Extra Life\'s heroic blue. +20% follower generation.',
    cost: 500,
    unlocked: false,
    preview: 'linear-gradient(135deg, #0b1b40 0%, #123d8a 50%, #1a6aff 100%)',
    active: false,
    bonusMultiplier: 1.2, // +20% follower generation
    backgroundImage: '/themes/default-bg.webp',
    iconImage: '/themes/default-icon.webp',
  },
  {
    id: 'gold',
    name: 'Gold',
    displayName: 'Gold',
    description: 'Luxury that shines bright and bold. +25% follower generation.',
    cost: 1000,
    unlocked: false,
    preview: 'linear-gradient(135deg, #5d4500 0%, #c9a034 60%, #f5d97d 100%)',
    active: false,
    bonusMultiplier: 1.25, // +25% follower generation
    backgroundImage: '/themes/default-bg.webp',
    iconImage: '/themes/default-icon.webp',
  },
];
