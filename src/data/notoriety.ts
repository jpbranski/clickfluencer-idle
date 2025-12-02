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
    description: 'Builds your online presence and reputation (+2 notoriety/hour)',
    baseCost: 100000, // 100k Creds (buffed from 50k)
    costMultiplier: 1.8, // Higher scaling
    baseNotorietyPerSecond: 2 / 3600, // 2 per hour = 0.000556/s (buffed 2x)
    baseUpkeep: 2000, // 2k Creds/s (reduced from 5)
    unlocked: true,
  },
  {
    id: 'pr_team',
    name: '📰 PR Team',
    description: 'Handles publicity and media relations (+10 notoriety/hour)',
    baseCost: 50000000, // 50M Creds (reduced from 100M)
    costMultiplier: 2.2, // Higher scaling
    baseNotorietyPerSecond: 10 / 3600, // 10 per hour = 0.00278/s (buffed 2x)
    baseUpkeep: 10000, // 10k Creds/s (reduced from 25k)
    unlocked: false,
  },
  {
    id: 'key_client',
    name: '💼 Key Client',
    description: 'High-profile partnerships boost your notoriety (+50 notoriety/hour)',
    baseCost: 5000000000, // 5B Creds (reduced from 10B)
    costMultiplier: 2.5, // Higher scaling
    baseNotorietyPerSecond: 50 / 3600, // 50 per hour = 0.0139/s (buffed 2x)
    baseUpkeep: 100000, // 100k Creds/s (reduced from 250k)
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
    description: '+1% to all Cred production (infinite)',
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
    description: '+1% to all Notoriety production (infinite)',
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
    description: '+5% to Cred Cache bonus amount (max 5 levels)',
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
    description: '+0.2% global prestige bonus (max 10 levels)',
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
    description: '+10% to prestige gain multiplier (max 3 levels)',
    baseCost: 100,
    costFormula: (level: number) => Math.floor(100 * Math.pow(5, level)),
    cap: 3,
    effect: {
      type: 'influencerEndorsement',
      value: 0.1, // 10% per level
    },
  },
];
