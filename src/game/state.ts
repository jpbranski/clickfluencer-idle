/**
 * state.ts - Canonical Game State & Derived Selectors
 *
 * This module defines the complete game state structure and provides
 * selector functions for deriving computed values.
 *
 * Connected to:
 * - engine.ts: Subscribes to state changes via pub/sub
 * - actions.ts: Mutates state through action functions
 * - prestige.ts: Reads/resets state during prestige operations
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
import { themes as baseThemes } from "@/data/themes";
import {
  NOTORIETY_BASE_PER_SEC,
  NOTORIETY_UPKEEP_PER_SEC,
} from "./balance";
export interface Generator {
  id: string;
  name: string;
  count: number;
  baseFollowersPerSecond: number;
  baseCost: number;
  costMultiplier: number; // 1.10 - 1.22 per tier
  unlocked: boolean;
}

export interface NotorietyGenerator {
  id: string;
  name: string;
  count: number;
  baseNotorietyPerSecond: number; // Notoriety generated per second
  baseCost: number; // Cost in followers
  costMultiplier: number; // Growth rate
  upkeep: number; // Followers per second upkeep cost
  maxLevel: number; // Maximum count allowed
  unlocked: boolean;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  purchased: boolean;
  effect: UpgradeEffect;
  // For infinite upgrades
  maxLevel?: number; // undefined = infinite
  currentLevel?: number; // for tracking purchase count
  costMultiplier?: number; // for scaling costs (e.g., 1.15 = +15% per level)
  // For tiered upgrades
  tier?: number; // current tier (0-based)
  maxTier?: number; // maximum tier cap
}

export interface UpgradeEffect {
  type:
  | "clickMultiplier"
  | "clickAdditive"
  | "generatorMultiplier"
  | "globalMultiplier"
  | "special"
  | "awardDropRate"
  | "offlineEfficiency"
  | "credCacheRate";
  value: number;
  targetGeneratorId?: string;
}

export interface Theme {
  id: string;
  name: string;
  cost: number; // Cost in Awards
  unlocked: boolean;
  active: boolean;
  bonusMultiplier: number; // required for gameplay bonuses
  bonusClickPower?: number; // optional bonus to click power
}

export interface RandomEvent {
  id: string;
  name: string;
  description: string;
  duration: number; // milliseconds
  effect: EventEffect;
  active: boolean;
  endTime?: number;
}

export interface EventEffect {
  type: "followerMultiplier" | "clickMultiplier" | "generatorMultiplier";
  multiplier: number;
}

export interface Statistics {
  totalClicks: number;
  totalCredsEarned: number; // Total creds earned (renamed from totalFollowersEarned in v0.2.3)
  totalGeneratorsPurchased: number;
  totalUpgradesPurchased: number;
  prestigeCount: number;
  awardsEarned: number; // Awards earned (renamed from shardsEarned in v0.2.3)
  playTime: number; // milliseconds
  lastTickTime: number;
  runStartTime: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  icon: string; // emoji or icon identifier
}


export interface GameState {
  // Core Resources
  creds: number; // Primary currency (renamed from followers in v0.2.3)
  awards: number; // Premium currency from random drops (renamed from shards in v0.2.3)
  prestige: number; // Prestige currency (renamed from reputation in v0.2.3)
  notoriety: number; // Strategic drain resource from Notoriety Generators

  // Generators (content creation systems)
  generators: Generator[];

  // Notoriety Generators (strategic resource with upkeep)
  notorietyGenerators: Record<string, number>;

  // Upgrades (permanent improvements)
  upgrades: Upgrade[];

  // Notoriety Upgrades (permanent notoriety-based improvements)
  notorietyUpgrades: Record<string, number>; // { cache_value: 3, cred_boost: 1 }

  // Active Events
  activeEvents: RandomEvent[];

  // Statistics
  stats: Statistics;

  // Themes
  themes: Theme[];

  // Achievements (cosmetic placeholder from v1-test)
  achievements?: Achievement[];

  // Settings
  settings: {
    autoSave: boolean;
    showNotifications: boolean;
    soundEnabled: boolean;
    offlineProgressEnabled: boolean;
  };

  // Cached Values (computed each tick for efficiency)
  followersPerSecond?: number;

  // Meta
  version: string;
  lastSaveTime: number;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

export const INITIAL_NOTORIETY_GENERATORS: NotorietyGenerator[] = [
  {
    id: "smm",
    name: "📱 Social Media Manager",
    count: 0,
    baseNotorietyPerSecond: 1 / 3600, // +1 notoriety per hour = 1/3600 per second
    baseCost: 1e5, // 100,000 followers
    costMultiplier: 1.8,
    upkeep: 5000, // followers per second
    maxLevel: 10,
    unlocked: false,
  },
  {
    id: "pr_team",
    name: "📢 PR Team",
    count: 0,
    baseNotorietyPerSecond: 5 / 3600, // +5 notoriety per hour
    baseCost: 1e8, // 100,000,000 followers
    costMultiplier: 2.2,
    upkeep: 25000, // followers per second
    maxLevel: 10,
    unlocked: false,
  },
  {
    id: "key_client",
    name: "🔑 Key Client",
    count: 0,
    baseNotorietyPerSecond: 25 / 3600, // +25 notoriety per hour
    baseCost: 1e10, // 10,000,000,000 followers
    costMultiplier: 2.5,
    upkeep: 250000, // followers per second
    maxLevel: 10,
    unlocked: false,
  },
];

export const INITIAL_GENERATORS: Generator[] = [
  {
    id: "photo",
    name: "📸 Photo Post",
    count: 0,
    baseFollowersPerSecond: 0.1,
    baseCost: 10,
    costMultiplier: 1.15,
    unlocked: true,
  },
  {
    id: "video",
    name: "🎥 Video Content",
    count: 0,
    baseFollowersPerSecond: 1.0,
    baseCost: 100,
    costMultiplier: 1.14,
    unlocked: false,
  },
  {
    id: "stream",
    name: "📹 Live Stream",
    count: 0,
    baseFollowersPerSecond: 8.0,
    baseCost: 1100,
    costMultiplier: 1.13,
    unlocked: false,
  },
  {
    id: "collab",
    name: "🤝 Collaboration",
    count: 0,
    baseFollowersPerSecond: 47.0,
    baseCost: 12000,
    costMultiplier: 1.12,
    unlocked: false,
  },
  {
    id: "brand",
    name: "💼 Brand Deal",
    count: 0,
    baseFollowersPerSecond: 260.0,
    baseCost: 130000,
    costMultiplier: 1.11,
    unlocked: false,
  },
  {
    id: "agency",
    name: "🏢 Talent Agency",
    count: 0,
    baseFollowersPerSecond: 1500.0,
    baseCost: 750000,
    costMultiplier: 1.1,
    unlocked: false,
  },
];

export const INITIAL_UPGRADES: Upgrade[] = [
  // Multi-tier Better Camera system (additive bonuses)
  {
    id: "better_camera",
    name: "📸 Better Camera",
    description: "Adds to base click power per tier (7 tiers: +1, +2, +3, +5, +8, +15, +25)",
    cost: 500, // base cost
    purchased: false,
    effect: { type: "clickAdditive", value: 1 }, // tier 1 value
    tier: 0, // current tier (0 = not purchased yet)
    maxTier: 7, // 7 tiers total (expanded from 5)
    costMultiplier: 3, // cost triples each tier
  },
  {
    id: "editing_software",
    name: "✂️ Editing Software",
    description: "Photo Posts produce 2x followers",
    cost: 2500,
    purchased: false,
    effect: {
      type: "generatorMultiplier",
      value: 2,
      targetGeneratorId: "photo",
    },
  },
  {
    id: "viral_strategy",
    name: "🔥 Viral Strategy",
    description: "All production increased by 50%",
    cost: 50000,
    purchased: false,
    effect: { type: "globalMultiplier", value: 1.5 },
  },
  // Infinite AI Enhancements upgrade
  {
    id: "ai_enhancements",
    name: "🤖 AI Enhancements",
    description: "+5% to click power per level (infinite)",
    cost: 1000000,
    purchased: false,
    effect: { type: "globalMultiplier", value: 1.05 },
    maxLevel: undefined, // infinite
    currentLevel: 0,
    costMultiplier: 1.35, // cost increases 35% per level
  },
  // Lucky Charm - Tiered upgrade for award drop rate
  {
    id: "lucky_charm",
    name: "💎 Lucky Charm",
    description: "Increases award drop rate per tier (4 tiers: +0.3% each)",
    cost: 1000, // base cost
    purchased: false,
    effect: { type: "awardDropRate", value: 0.003 }, // tier 1 value (+0.3%)
    tier: 0, // current tier (0 = not purchased yet)
    maxTier: 4, // 4 tiers total
    costMultiplier: 15, // cost ×15 each tier (1000, 15000, 225000, 3375000)
  },
  // Overnight Success - Tiered upgrade for offline gain efficiency
  {
    id: "overnight_success",
    name: "🌙 Overnight Success",
    description: "Increases offline gain rate (4 tiers: 50%, 60%, 75%, 100%)",
    cost: 25000, // base cost
    purchased: false,
    effect: { type: "offlineEfficiency", value: 0.5 }, // tier 1 value (50%)
    tier: 0, // current tier (0 = not purchased yet)
    maxTier: 4, // 4 tiers total
    costMultiplier: 5, // cost ×5 each tier (25000, 125000, 625000, 3125000)
  },
  // Cred Cache - Tiered upgrade for bonus click drops
  {
    id: "cred_cache",
    name: "💰 Cred Cache",
    description: "Increases chance for bonus creds on click (6 tiers)",
    cost: 10000, // base cost
    purchased: false,
    effect: { type: "credCacheRate", value: 0.001 }, // tier 1: 1/1000 chance
    tier: 0, // current tier (0 = not purchased yet)
    maxTier: 6, // 6 tiers total (1/1000 → 1/900 → 1/800 → 1/700 → 1/600 → 1/500)
    costMultiplier: 5, // cost ×5 each tier (10000, 50000, 250000, 1250000, 6250000, 31250000)
  },
  // Better Filters - Infinite upgrade for click power
  {
    id: "better_filters",
    name: "📸 Better Filters",
    description: "+1% to base click power per level (infinite)",
    cost: 100000,
    purchased: false,
    effect: { type: "clickMultiplier", value: 1.01 },
    maxLevel: undefined, // infinite
    currentLevel: 0,
    costMultiplier: 1.25, // cost increases 25% per level
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_click",
    name: "First Click",
    description: "Click your first post",
    unlocked: false,
    icon: "👆",
  },
  {
    id: "hundred_followers",
    name: "Rising Star",
    description: "Reach 100 followers",
    unlocked: false,
    icon: "⭐",
  },
  {
    id: "first_generator",
    name: "Content Creator",
    description: "Purchase your first generator",
    unlocked: false,
    icon: "📸",
  },
  {
    id: "first_upgrade",
    name: "Self Improvement",
    description: "Purchase your first upgrade",
    unlocked: false,
    icon: "🔧",
  },
  {
    id: "million_followers",
    name: "Influencer Status",
    description: "Reach 1 million followers",
    unlocked: false,
    icon: "💫",
  },
  {
    id: "first_prestige",
    name: "Fresh Start",
    description: "Perform your first prestige",
    unlocked: false,
    icon: "🔄",
  },
  {
    id: "collector",
    name: "Award Collector",
    description: "Collect 100 Awards",
    unlocked: false,
    icon: "💎",
  },
  {
    id: "theme_master",
    name: "Fashion Icon",
    description: "Unlock all themes",
    unlocked: false,
    icon: "🎨",
  },
  {
    id: "notorious",
    name: "Notorious",
    description: "Reach 100 Notoriety",
    unlocked: false,
    icon: "😎",
  },
  {
    id: "prestige_veteran",
    name: "Prestige Veteran",
    description: "Reach prestige level 10",
    unlocked: false,
    icon: "🏆",
  },
];

export function createInitialState(): GameState {
  const now = Date.now();
  return {
    creds: 0,
    awards: 0,
    prestige: 0,
    notoriety: 0,
    generators: INITIAL_GENERATORS.map((g) => ({ ...g })),
    upgrades: INITIAL_UPGRADES.map((u) => ({ ...u })),
    activeEvents: [],
    stats: {
      totalClicks: 0,
      totalCredsEarned: 0,
      totalGeneratorsPurchased: 0,
      totalUpgradesPurchased: 0,
      prestigeCount: 0,
      awardsEarned: 0,
      playTime: 0,
      lastTickTime: now,
      runStartTime: now,
    },
    notorietyGenerators: {
      smm: 0,
      pr_team: 0,
      key_client: 0,
    },
    notorietyUpgrades: {
      cache_value: 0,
      drama_boost: 0,
      buy_creds: 0,
      cred_boost: 0,
      notoriety_boost: 0,
      influencer_endorsement: 0,
    },
    settings: {
      autoSave: true,
      showNotifications: true,
      soundEnabled: true,
      offlineProgressEnabled: true,
    },
    version: "v1.0.0",
    lastSaveTime: now,
    themes: baseThemes.map((t) => ({
      ...t,
      unlocked: t.id === "dark" || t.id === "light", // whatever defaults you want
      active: t.id === "dark", // default active
    })),
    achievements: INITIAL_ACHIEVEMENTS.map((a) => ({ ...a })),
  };
}

// ============================================================================
// DERIVED SELECTORS
// ============================================================================

/**
 * Calculate the current cost of purchasing a generator
 *
 * Uses exponential scaling formula: `baseCost * (costMultiplier ^ count)`
 *
 * @param generator - The generator to calculate cost for
 * @returns The cost in creds for the next purchase of this generator
 *
 * @example
 * ```ts
 * const photoPost = { baseCost: 10, costMultiplier: 1.15, count: 5 };
 * getGeneratorCost(photoPost); // Returns: 20 (10 * 1.15^5)
 * ```
 */
export function getGeneratorCost(generator: Generator): number {
  return Math.floor(
    generator.baseCost * Math.pow(generator.costMultiplier, generator.count),
  );
}

/**
 * Calculate click power (followers per click)
 *
 * **Calculation Order:**
 * 1. Base power starts at 1
 * 2. Add tier-based bonuses (Better Camera: +1 to +25 depending on tier)
 * 3. Add other additive click upgrades
 * 4. Add active theme click power bonus (if any)
 * 5. Apply click multipliers (Better Filters: 1.01^level)
 * 6. Apply global multipliers that affect clicks (AI Enhancements: 1.05^level)
 * 7. Apply prestige bonus (1 + prestige * 0.1)
 * 8. Apply active theme multiplier
 *
 * @param state - The current game state
 * @returns The total click power (creds gained per click)
 *
 * @example
 * ```ts
 * // With base=1, Better Camera tier 3 (+3), prestige 2 (+20%), theme 1.5x
 * // Result: (1 + 3) * 1.2 * 1.5 = 7.2 creds per click
 * const power = getClickPower(state);
 * ```
 */
export function getClickPower(state: GameState): number {
  let basePower = 1;

  // Apply Better Camera tiered upgrade
  const betterCamera = state.upgrades.find((u) => u.id === "better_camera");
  if (betterCamera && betterCamera.tier) {
    // Tier bonus mapping: 1→+1, 2→+2, 3→+3, 4→+5, 5→+8, 6→+15, 7→+25
    const tierBonuses = [0, 1, 2, 3, 5, 8, 15, 25];
    const tier = betterCamera.tier;
    if (tier > 0 && tier <= 7) {
      basePower += tierBonuses[tier];
    }
  }

  // Apply other additive click upgrades (if any)
  state.upgrades
    .filter((u) => u.purchased && u.effect.type === "clickAdditive" && u.id !== "better_camera")
    .forEach((u) => {
      basePower += u.effect.value;
    });

  // Apply active theme click power bonus (additive to base power)
  const activeTheme = state.themes.find((t) => t.active);
  if (activeTheme && activeTheme.bonusClickPower) {
    basePower += activeTheme.bonusClickPower;
  }

  let power = basePower;

  // Apply click multiplier upgrades
  state.upgrades
    .filter((u) => u.effect.type === "clickMultiplier")
    .forEach((u) => {
      const level = u.currentLevel ?? 0;

      if (level > 0) {
        // Infinite upgrade (e.g., Better Filters)
        power *= Math.pow(u.effect.value, level);
      } else if (u.purchased) {
        // One-time click multiplier
        power *= u.effect.value;
      }
    });


  // Apply AI Enhancements (global multiplier that applies to click power)
  state.upgrades
    .filter(
      (u) =>
        u.effect.type === "globalMultiplier" && u.id === "ai_enhancements"
    )
    .forEach((u) => {
      const level = u.currentLevel ?? 0;
      if (level > 0) {
        power *= Math.pow(u.effect.value, level);
      }
    });


  // Apply prestige bonus (+10% per prestige point)
  power *= 1 + state.prestige * 0.1;

  // Apply active theme multiplier bonus (only the active theme)
  if (activeTheme) {
    power *= activeTheme.bonusMultiplier;
  }

  return power;
}

/**
 * Calculate total creds per second from all generators
 *
 * **Calculation Order:**
 * 1. For each generator: baseOutput * count
 * 2. Apply generator-specific multipliers (e.g., Photo Post 2x upgrade)
 * 3. Sum all generator outputs
 * 4. Apply global multipliers (Viral Strategy: 1.5x, etc.)
 * 5. Apply prestige bonus (+10% per prestige point)
 * 6. Apply active theme multiplier
 * 7. Apply active event multipliers (Viral Post: 3x, etc.)
 * 8. Apply notoriety cred boost (+1% per notoriety upgrade level)
 *
 * @param state - The current game state
 * @returns The total creds gained per second from passive generation
 *
 * @example
 * ```ts
 * // With 10 Photo Posts (0.1/s each) and Viral Strategy (1.5x)
 * // Result: (10 * 0.1) * 1.5 = 1.5 creds/second
 * const production = getFollowersPerSecond(state);
 * ```
 *
 * @see {@link getClickPower} for click-based income calculation
 */
export function getFollowersPerSecond(state: GameState): number {
  let total = 0;

  // Calculate each generator's contribution
  state.generators.forEach((generator) => {
    if (generator.count === 0) return;

    let generatorOutput = generator.baseFollowersPerSecond * generator.count;

    // Apply generator-specific upgrades
    state.upgrades
      .filter(
        (u) =>
          u.purchased &&
          u.effect.type === "generatorMultiplier" &&
          u.effect.targetGeneratorId === generator.id,
      )
      .forEach((u) => {
        generatorOutput *= u.effect.value;
      });

    total += generatorOutput;
  });

  // Apply global multipliers (excluding AI Enhancements which only affects click power)
  state.upgrades
    .filter((u) => u.purchased && u.effect.type === "globalMultiplier" && u.id !== "ai_enhancements")
    .forEach((u) => {
      if (u.currentLevel !== undefined && u.currentLevel > 0) {
        // Infinite upgrade - apply effect once per level
        total *= Math.pow(u.effect.value, u.currentLevel);
      } else {
        // Regular one-time upgrade
        total *= u.effect.value;
      }
    });

  // Apply prestige bonus (+10% per prestige point)
  total *= 1 + state.prestige * 0.1;

  // Apply active theme bonus (only the active theme)
  const activeTheme = state.themes.find((t) => t.active);
  if (activeTheme) {
    total *= activeTheme.bonusMultiplier;
  }

  // Apply active event multipliers
  state.activeEvents.forEach((event) => {
    if (
      event.effect.type === "followerMultiplier" ||
      event.effect.type === "generatorMultiplier"
    ) {
      total *= event.effect.multiplier;
    }
  });

  // Apply Notoriety Cred Boost (from notoriety upgrades)
  if (state.notorietyUpgrades) {
    const credBoostLevel = state.notorietyUpgrades.cred_boost || 0;
    if (credBoostLevel > 0) {
      total *= 1 + credBoostLevel * 0.01; // +1% per level
    }
  }

  return total;
}

/**
 * Check if a generator should be unlocked based on creds
 * Unlock thresholds are roughly 100% of the base cost
 */
export function shouldUnlockGenerator(
  generator: Generator,
  creds: number,
): boolean {
  if (generator.unlocked) return false;
  return creds >= generator.baseCost * 1.0;
}

/**
 * Calculate cumulative cost for buying multiple generators
 * Uses geometric series formula: baseCost * (multiplier^count) * (1 - multiplier^quantity) / (1 - multiplier)
 */
export function getBulkGeneratorCost(generator: Generator, quantity: number): number {
  const { baseCost, costMultiplier, count } = generator;

  if (quantity <= 0) return 0;
  if (quantity === 1) return getGeneratorCost(generator);

  // Geometric series sum: a * (1 - r^n) / (1 - r) where a = baseCost * multiplier^count
  const firstCost = baseCost * Math.pow(costMultiplier, count);
  const sum = firstCost * (1 - Math.pow(costMultiplier, quantity)) / (1 - costMultiplier);

  return Math.floor(sum);
}

/**
 * Get the active event multiplier for clicks
 */
export function getClickEventMultiplier(state: GameState): number {
  let multiplier = 1;
  state.activeEvents.forEach((event) => {
    if (event.effect.type === "clickMultiplier") {
      multiplier *= event.effect.multiplier;
    }
  });
  return multiplier;
}

/**
 * Calculate total play time including current session
 */
export function getTotalPlayTime(state: GameState): number {
  return state.stats.playTime + (Date.now() - state.stats.runStartTime);
}

/**
 * Check if player can afford a purchase
 */
export function canAfford(creds: number, cost: number): boolean {
  return creds >= cost;
}

/**
 * Check if player can afford an award purchase
 */
export function canAffordAwards(awards: number, cost: number): boolean {
  return awards >= cost;
}

/**
 * Calculate offline efficiency based on Overnight Success upgrade
 * Base: 50%, Tier 1: 50%, Tier 2: 60%, Tier 3: 75%, Tier 4: 100%
 */
export function getOfflineEfficiency(state: GameState): number {
  const overnightSuccess = state.upgrades.find((u) => u.id === "overnight_success");
  if (!overnightSuccess || !overnightSuccess.tier || overnightSuccess.tier === 0) {
    return 0.5; // 50% base efficiency
  }

  // Tier-based efficiency: 50%, 60%, 75%, 100%
  const efficiencyByTier = [0.5, 0.5, 0.6, 0.75, 1.0];
  const tier = overnightSuccess.tier;
  return efficiencyByTier[tier] || 0.5;
}

/**
 * Calculate Cred Cache drop rate based on upgrade tier
 * Base: 0 (no drops), Tier 1-6: 1/1000 → 1/900 → 1/800 → 1/700 → 1/600 → 1/500
 * Also applies Notoriety Cache Value boost
 */
export function getCredCacheRate(state: GameState): number {
  const credCache = state.upgrades.find((u) => u.id === "cred_cache");
  if (!credCache || !credCache.tier || credCache.tier === 0) {
    return 0; // No Cred Cache drops without upgrade
  }

  // Tier-based drop rates: 1/1000, 1/900, 1/800, 1/700, 1/600, 1/500
  const rateByTier = [0, 1 / 1000, 1 / 900, 1 / 800, 1 / 700, 1 / 600, 1 / 500];
  const tier = credCache.tier;
  return rateByTier[tier] || 0;
}

/**
 * Calculate Cred Cache payout multiplier based on Notoriety Cache Value upgrade
 * This multiplies the payout amount when Cred Cache drops occur
 */
export function getCredCachePayoutMultiplier(state: GameState): number {
  if (!state.notorietyUpgrades) return 1;

  const cacheValueLevel = state.notorietyUpgrades.cache_value || 0;
  if (cacheValueLevel === 0) return 1;

  // +5% per level
  return 1 + cacheValueLevel * 0.05;
}

