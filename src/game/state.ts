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
export interface Generator {
  id: string;
  name: string;
  count: number;
  baseFollowersPerSecond: number;
  baseCost: number;
  costMultiplier: number; // 1.10 - 1.22 per tier
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
    | "awardDropRate";
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
  totalFollowersEarned: number;
  totalGeneratorsPurchased: number;
  totalUpgradesPurchased: number;
  prestigeCount: number;
  shardsEarned: number; // Awards earned
  playTime: number; // milliseconds
  lastTickTime: number;
  runStartTime: number;
}


export interface GameState {
  // Core Resources
  followers: number;
  shards: number; // Awards (premium currency from random drops)
  reputation: number; // Prestige currency

  // Generators (content creation systems)
  generators: Generator[];

  // Upgrades (permanent improvements)
  upgrades: Upgrade[];

  // Active Events
  activeEvents: RandomEvent[];

  // Statistics
  stats: Statistics;

  // Themes
  themes: Theme[];

  // Settings
  settings: {
    autoSave: boolean;
    showNotifications: boolean;
    soundEnabled: boolean;
    offlineProgressEnabled: boolean;
  };

  // Meta
  version: string;
  lastSaveTime: number;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

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
    baseFollowersPerSecond: 1400.0,
    baseCost: 1400000,
    costMultiplier: 1.1,
    unlocked: false,
  },
];

export const INITIAL_UPGRADES: Upgrade[] = [
  // Multi-tier Better Camera system (additive bonuses)
  {
    id: "better_camera",
    name: "📸 Better Camera",
    description: "Adds to base click power per tier (5 tiers: +1, +2, +3, +5, +8)",
    cost: 500, // base cost
    purchased: false,
    effect: { type: "clickAdditive", value: 1 }, // tier 1 value
    tier: 0, // current tier (0 = not purchased yet)
    maxTier: 5, // 5 tiers total
    costMultiplier: 3, // cost triples each tier (500, 1500, 4500, 13500, 40500)
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
  {
    id: "award_luck_1",
    name: "💎 Lucky Charm I",
    description: "Award drop rate: 0.3% → 0.6%",
    cost: 1000,
    purchased: false,
    effect: { type: "awardDropRate", value: 0.003 },
  },
  {
    id: "award_luck_2",
    name: "💎 Lucky Charm II",
    description: "Award drop rate: 0.6% → 0.9%",
    cost: 10000,
    purchased: false,
    effect: { type: "awardDropRate", value: 0.003 },
  },
  {
    id: "award_luck_3",
    name: "💎 Lucky Charm III",
    description: "Award drop rate: 0.9% → 1.2%",
    cost: 100000,
    purchased: false,
    effect: { type: "awardDropRate", value: 0.003 },
  },
  {
    id: "award_luck_4",
    name: "💎 Lucky Charm IV",
    description: "Award drop rate: 1.2% → 1.5%",
    cost: 1000000,
    purchased: false,
    effect: { type: "awardDropRate", value: 0.003 },
  },
];

export function createInitialState(): GameState {
  const now = Date.now();
  return {
    followers: 0,
    shards: 0,
    reputation: 0,
    generators: INITIAL_GENERATORS.map((g) => ({ ...g })),
    upgrades: INITIAL_UPGRADES.map((u) => ({ ...u })),
    activeEvents: [],
    stats: {
      totalClicks: 0,
      totalFollowersEarned: 0,
      totalGeneratorsPurchased: 0,
      totalUpgradesPurchased: 0,
      prestigeCount: 0,
      shardsEarned: 0,
      playTime: 0,
      lastTickTime: now,
      runStartTime: now,
    },
    settings: {
      autoSave: true,
      showNotifications: true,
      soundEnabled: true,
      offlineProgressEnabled: true,
    },
    version: "0.1.0",
    lastSaveTime: now,
    themes: baseThemes.map((t) => ({
      ...t,
      unlocked: t.id === "dark" || t.id === "light", // whatever defaults you want
      active: t.id === "dark", // default active
   })),
  };
}

// ============================================================================
// DERIVED SELECTORS
// ============================================================================

/**
 * Calculate the current cost of purchasing a generator
 * Uses exponential scaling: baseCost * (costMultiplier ^ count)
 */
export function getGeneratorCost(generator: Generator): number {
  return Math.floor(
    generator.baseCost * Math.pow(generator.costMultiplier, generator.count),
  );
}

/**
 * Calculate click power (followers per click)
 * Factors in: base click (1) + additive upgrades + multipliers + AI enhancements + reputation + theme bonuses
 */
export function getClickPower(state: GameState): number {
  let basePower = 1;

  // Apply Better Camera tiered upgrade
  const betterCamera = state.upgrades.find((u) => u.id === "better_camera");
  if (betterCamera && betterCamera.tier) {
    // Tier bonus mapping: 1→+1, 2→+2, 3→+3, 4→+5, 5→+8
    const tierBonuses = [0, 1, 2, 3, 5, 8];
    const tier = betterCamera.tier;
    if (tier > 0 && tier <= 5) {
      basePower += tierBonuses[tier];
    }
  }

  // Apply other additive click upgrades (if any)
  state.upgrades
    .filter((u) => u.purchased && u.effect.type === "clickAdditive" && u.id !== "better_camera")
    .forEach((u) => {
      basePower += u.effect.value;
    });

  let power = basePower;

  // Apply click multiplier upgrades
  state.upgrades
    .filter((u) => u.purchased && u.effect.type === "clickMultiplier")
    .forEach((u) => {
      power *= u.effect.value;
    });

  // Apply AI Enhancements (global multiplier that applies to click power)
  state.upgrades
    .filter((u) => u.purchased && u.effect.type === "globalMultiplier" && u.id === "ai_enhancements")
    .forEach((u) => {
      if (u.currentLevel !== undefined && u.currentLevel > 0) {
        // Apply 5% per level: (base + additive) * 1.05^level
        power *= Math.pow(u.effect.value, u.currentLevel);
      }
    });

  // Apply reputation bonus (+10% per reputation point)
  power *= 1 + state.reputation * 0.1;

  // Apply active theme bonus (only the active theme)
  const activeTheme = state.themes.find((t) => t.active);
  if (activeTheme) {
    power *= activeTheme.bonusMultiplier;
  }

  return power;
}

/**
 * Calculate total followers per second from all generators
 * Factors in: base generator output + upgrades + events + reputation + themes
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

  // Apply reputation bonus (+10% per reputation point)
  total *= 1 + state.reputation * 0.1;

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

  return total;
}

/**
 * Check if a generator should be unlocked based on followers
 * Unlock thresholds are roughly 100% of the base cost
 */
export function shouldUnlockGenerator(
  generator: Generator,
  followers: number,
): boolean {
  if (generator.unlocked) return false;
  return followers >= generator.baseCost * 1.0;
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
export function canAfford(followers: number, cost: number): boolean {
  return followers >= cost;
}

/**
 * Check if player can afford an award purchase
 */
export function canAffordShards(shards: number, cost: number): boolean {
  return shards >= cost;
}
