// src/data/themes.ts
import { Theme } from '@/types/theme';

export const themes: Theme[] = [
  {
    id: 'dark',
    name: 'Dark',
    displayName: 'Dark',
    description: 'Default stormy slate theme.',
    cost: 0,
    unlocked: true,
    preview: 'linear-gradient(to bottom right, #1b2330, #2b3350)',
    active: true,
    bonusMultiplier: 1.0, // No bonus (default)
  },
  {
    id: 'light',
    name: 'Light',
    displayName: 'Light',
    description: 'Bright material-inspired palette. +5% follower generation.',
    cost: 0,
    unlocked: false,
    preview: 'linear-gradient(to bottom right, #ffffff, #eaeef5)',
    active: false,
    bonusMultiplier: 1.05, // +5% follower generation
  },
  {
    id: 'night-sky',
    name: 'Night Sky',
    displayName: 'Night Sky',
    description: 'Cool purples and silvers under starlight. +10% follower generation.',
    cost: 0,
    unlocked: false,
    preview: 'linear-gradient(to bottom right, #1b1f3b 0%, #2a2450 50%, #0b0d1e 100%)',
    active: false,
    bonusMultiplier: 1.1, // +10% follower generation
  },
  {
    id: 'touch-grass',
    name: 'Touch Grass',
    displayName: 'Touch Grass',
    description: 'A peaceful palette of greens and sunlight. +8% follower generation.',
    cost: 0,
    unlocked: false,
    preview: 'linear-gradient(to bottom right, #d8f3dc 0%, #b7e4c7 50%, #95d5b2 100%)',
    active: false,
    bonusMultiplier: 1.08, // +8% follower generation
  },
  {
    id: 'terminal',
    name: 'Terminal',
    displayName: 'Terminal',
    description: 'Monokai dark for true hackers. +12% follower generation.',
    cost: 0,
    unlocked: false,
    preview: 'linear-gradient(to bottom right, #2a2b24 0%, #272822 50%, #1e1f1c 100%)',
    active: false,
    bonusMultiplier: 1.12, // +12% follower generation
  },
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    displayName: 'Cherry Blossom',
    description: 'Soft pinks drifting through spring air. +7% follower generation.',
    cost: 0,
    unlocked: false,
    preview: 'linear-gradient(to bottom right, #fff1f5 0%, #ffd9e5 50%, #ffc1d6 100%)',
    active: false,
    bonusMultiplier: 1.07, // +7% follower generation
  },
  {
    id: 'nightshade',
    name: 'Nightshade',
    displayName: 'Nightshade',
    description: 'Belladonna tones of violet and green. +15% follower generation.',
    cost: 0,
    unlocked: false,
    preview: 'linear-gradient(to bottom right, #211326 0%, #311b3a 50%, #0c0c0d 100%)',
    active: false,
    bonusMultiplier: 1.15, // +15% follower generation
  },
  {
    id: 'el-blue',
    name: 'EL Blue',
    displayName: 'EL Blue',
    description: 'Inspired by Extra Life\'s heroic blue. +20% follower generation.',
    cost: 0,
    unlocked: false,
    preview: 'linear-gradient(to bottom right, #0a192f 0%, #112240 50%, #0d2742 100%)',
    active: false,
    bonusMultiplier: 1.2, // +20% follower generation
  },
  {
    id: 'gold',
    name: 'Gold',
    displayName: 'Gold',
    description: 'Luxury that shines bright and bold. +25% follower generation.',
    cost: 0,
    unlocked: false,
    preview: 'linear-gradient(to bottom right, #3a2a10 0%, #6f5215 50%, #d4af37 100%)',
    active: false,
    bonusMultiplier: 1.25, // +25% follower generation
  },
];
