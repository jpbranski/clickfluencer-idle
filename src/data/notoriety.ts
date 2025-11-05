/**
 * notoriety.ts - Notoriety System Data
 *
 * Defines all notoriety generators and upgrades.
 * Notoriety is a secondary currency system that:
 * - Generators produce Notoriety/second but consume Creds/second (upkeep)
 * - Upgrades cost Notoriety and provide various bonuses
 * - Persists through prestige
 * - Infinite upgrades never reset on prestige
 */

export interface NotorietyGenerator {
  id: string;
  name: string;
  description: string;
  baseCost: number; // Cost in Creds
  costMultiplier: number; // Cost scaling per purchase
  baseNotorietyPerSecond: number; // Notoriety production
  baseUpkeep: number; // Creds/second drain
  unlocked: boolean;
}

export interface NotorietyUpgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number; // Base cost in Notoriety
  costFormula?: (level: number) => number; // For infinite upgrades
  cap: number; // Infinity for infinite upgrades
  effect: {
    type: 'cacheValue' | 'dramaBoost' | 'credBoost' | 'notorietyBoost' | 'influencerEndorsement';
    value: number;
  };
}

// ============================================================================
// NOTORIETY GENERATORS
// ============================================================================

export const NOTORIETY_GENERATORS: NotorietyGenerator[] = [
  {
    id: 'smm',
    name: '📱 Social Media Manager',
    description: 'Builds your online presence and reputation',
    baseCost: 50000,
    costMultiplier: 1.15,
    baseNotorietyPerSecond: 0.1,
    baseUpkeep: 5, // Costs 5 Creds/s
    unlocked: true,
  },
  {
    id: 'pr_team',
    name: '📰 PR Team',
    description: 'Handles publicity and media relations',
    baseCost: 500000,
    costMultiplier: 1.14,
    baseNotorietyPerSecond: 1.0,
    baseUpkeep: 50,
    unlocked: false,
  },
  {
    id: 'key_client',
    name: '💼 Key Client',
    description: 'High-profile partnerships boost your notoriety',
    baseCost: 5000000,
    costMultiplier: 1.13,
    baseNotorietyPerSecond: 8.0,
    baseUpkeep: 400,
    unlocked: false,
  },
  {
    id: 'celebrity_sponsor',
    name: '⭐ Celebrity Sponsor',
    description: 'Famous endorsements skyrocket your reputation',
    baseCost: 50000000,
    costMultiplier: 1.12,
    baseNotorietyPerSecond: 50.0,
    baseUpkeep: 3000,
    unlocked: false,
  },
];

// ============================================================================
// NOTORIETY UPGRADES
// ============================================================================

export const NOTORIETY_UPGRADES: NotorietyUpgrade[] = [
  // Infinite Upgrades (persist through prestige)
  {
    id: 'cred_boost',
    name: '💰 Cred Boost',
    description: '+1% to all Cred production (infinite, persists on prestige)',
    baseCost: 10,
    costFormula: (level: number) => Math.floor(10 * Math.pow(1.5, level)),
    cap: Infinity,
    effect: {
      type: 'credBoost',
      value: 0.01, // 1% per level
    },
  },
  {
    id: 'notoriety_boost',
    name: '🌟 Notoriety Boost',
    description: '+1% to all Notoriety production (infinite, persists on prestige)',
    baseCost: 15,
    costFormula: (level: number) => Math.floor(15 * Math.pow(1.5, level)),
    cap: Infinity,
    effect: {
      type: 'notorietyBoost',
      value: 0.01, // 1% per level
    },
  },

  // Capped Upgrades (reset on prestige)
  {
    id: 'cache_value',
    name: '💎 Cache Value',
    description: '+5% to Cred Cache bonus amount (max 5 levels, resets on prestige)',
    baseCost: 5,
    costFormula: (level: number) => Math.floor(5 * Math.pow(3, level)),
    cap: 5,
    effect: {
      type: 'cacheValue',
      value: 0.05, // 5% per level
    },
  },
  {
    id: 'drama_boost',
    name: '🎭 Drama Boost',
    description: '+0.2% global prestige bonus (max 10 levels, resets on prestige)',
    baseCost: 20,
    costFormula: (level: number) => Math.floor(20 * Math.pow(2, level)),
    cap: 10,
    effect: {
      type: 'dramaBoost',
      value: 0.002, // 0.2% per level
    },
  },
  {
    id: 'influencer_endorsement',
    name: '🤝 Influencer Endorsement',
    description: '+10% to prestige gain multiplier (max 3 levels, resets on prestige)',
    baseCost: 100,
    costFormula: (level: number) => Math.floor(100 * Math.pow(5, level)),
    cap: 3,
    effect: {
      type: 'influencerEndorsement',
      value: 0.1, // 10% per level
    },
  },
];
