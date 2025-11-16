/**
 * achievements.ts - Comprehensive Achievement System Data
 *
 * Defines ~50 achievements across multiple categories:
 * - Progression (story/main milestones)
 * - Currency Milestones (creds, awards, prestige)
 * - Generator/Upgrade Milestones
 * - Click/Post Value thresholds
 * - Prestige achievements
 * - Meta/Time played
 * - Hidden (special conditions)
 *
 * Achievement condition logic is evaluated in src/lib/achievements/evaluator.ts
 */

export type AchievementCategory =
  | "progression"
  | "currency"
  | "generators"
  | "clicks"
  | "prestige"
  | "meta"
  | "hidden";

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  icon: string; // Emoji or icon identifier
  hidden: boolean; // True if hidden until unlocked
  tier?: number; // Optional tier indicator (1-4 for tiered achievements)
  // Condition evaluated by logic, not stored as function
  conditionKey: string; // References evaluation function
  conditionValue?: number | string; // Value to check against
}

// ============================================================================
// PROGRESSION ACHIEVEMENTS (Story/Main Milestones)
// ============================================================================

export const PROGRESSION_ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "first_click",
    name: "First Click",
    description: "Click your first post",
    category: "progression",
    icon: "👆",
    hidden: false,
    tier: 1,
    conditionKey: "totalClicks",
    conditionValue: 1,
  },
  {
    id: "first_generator",
    name: "Content Creator",
    description: "Purchase your first generator",
    category: "progression",
    icon: "📸",
    hidden: false,
    tier: 1,
    conditionKey: "totalGeneratorsPurchased",
    conditionValue: 1,
  },
  {
    id: "first_upgrade",
    name: "Self Improvement",
    description: "Purchase your first upgrade",
    category: "progression",
    icon: "🔧",
    hidden: false,
    tier: 1,
    conditionKey: "totalUpgradesPurchased",
    conditionValue: 1,
  },
  {
    id: "first_prestige",
    name: "Fresh Start",
    description: "Perform your first prestige",
    category: "progression",
    icon: "🔄",
    hidden: false,
    tier: 1,
    conditionKey: "prestigeCount",
    conditionValue: 1,
  },
  {
    id: "unlock_all_generators",
    name: "Full Creator Suite",
    description: "Unlock all generator types",
    category: "progression",
    icon: "🎬",
    hidden: false,
    tier: 2,
    conditionKey: "allGeneratorsUnlocked",
  },
  {
    id: "first_theme",
    name: "Style Points",
    description: "Unlock your first premium theme",
    category: "progression",
    icon: "🎨",
    hidden: false,
    tier: 1,
    conditionKey: "themesUnlocked",
    conditionValue: 3, // Dark + Light + 1 premium
  },
  {
    id: "theme_master",
    name: "Fashion Icon",
    description: "Unlock all themes",
    category: "progression",
    icon: "👑",
    hidden: false,
    tier: 3,
    conditionKey: "allThemesUnlocked",
  },
  {
    id: "notorious",
    name: "Notorious",
    description: "Reach 100 Notoriety",
    category: "progression",
    icon: "😎",
    hidden: false,
    tier: 2,
    conditionKey: "notoriety",
    conditionValue: 100,
  },
];

// ============================================================================
// CURRENCY ACHIEVEMENTS (Creds, Awards, Prestige)
// ============================================================================

export const CURRENCY_ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "hundred_creds",
    name: "Rising Star",
    description: "Reach 100 creds",
    category: "currency",
    icon: "⭐",
    hidden: false,
    tier: 1,
    conditionKey: "totalCredsEarned",
    conditionValue: 100,
  },
  {
    id: "thousand_creds",
    name: "Trending Topic",
    description: "Reach 1,000 creds",
    category: "currency",
    icon: "📈",
    hidden: false,
    tier: 1,
    conditionKey: "totalCredsEarned",
    conditionValue: 1000,
  },
  {
    id: "million_creds",
    name: "Influencer Status",
    description: "Reach 1 million creds",
    category: "currency",
    icon: "💫",
    hidden: false,
    tier: 2,
    conditionKey: "totalCredsEarned",
    conditionValue: 1_000_000,
  },
  {
    id: "billion_creds",
    name: "Mega Influencer",
    description: "Reach 1 billion creds",
    category: "currency",
    icon: "🌟",
    hidden: false,
    tier: 3,
    conditionKey: "totalCredsEarned",
    conditionValue: 1_000_000_000,
  },
  {
    id: "trillion_creds",
    name: "Legendary Status",
    description: "Reach 1 trillion creds",
    category: "currency",
    icon: "✨",
    hidden: false,
    tier: 4,
    conditionKey: "totalCredsEarned",
    conditionValue: 1_000_000_000_000,
  },
  {
    id: "first_award",
    name: "Lucky Drop",
    description: "Collect your first Award",
    category: "currency",
    icon: "💎",
    hidden: false,
    tier: 1,
    conditionKey: "awardsEarned",
    conditionValue: 1,
  },
  {
    id: "collector",
    name: "Award Collector",
    description: "Collect 100 Awards",
    category: "currency",
    icon: "💰",
    hidden: false,
    tier: 2,
    conditionKey: "awardsEarned",
    conditionValue: 100,
  },
  {
    id: "award_hoarder",
    name: "Award Hoarder",
    description: "Collect 1,000 Awards",
    category: "currency",
    icon: "🏆",
    hidden: false,
    tier: 3,
    conditionKey: "awardsEarned",
    conditionValue: 1000,
  },
  {
    id: "prestige_unlocked",
    name: "Prestige Unlocked",
    description: "Gain your first prestige point",
    category: "currency",
    icon: "🔱",
    hidden: false,
    tier: 1,
    conditionKey: "prestigeCurrency",
    conditionValue: 1,
  },
  {
    id: "prestige_power",
    name: "Prestige Power",
    description: "Accumulate 10 prestige points",
    category: "currency",
    icon: "⚡",
    hidden: false,
    tier: 2,
    conditionKey: "prestigeCurrency",
    conditionValue: 10,
  },
  {
    id: "prestige_titan",
    name: "Prestige Titan",
    description: "Accumulate 100 prestige points",
    category: "currency",
    icon: "👹",
    hidden: false,
    tier: 3,
    conditionKey: "prestigeCurrency",
    conditionValue: 100,
  },
];

// ============================================================================
// GENERATOR/UPGRADE ACHIEVEMENTS
// ============================================================================

export const GENERATOR_ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "ten_generators",
    name: "Content Farm I",
    description: "Own 10 total generators",
    category: "generators",
    icon: "🏭",
    hidden: false,
    tier: 1,
    conditionKey: "totalGeneratorsPurchased",
    conditionValue: 10,
  },
  {
    id: "fifty_generators",
    name: "Content Farm II",
    description: "Own 50 total generators",
    category: "generators",
    icon: "🏗️",
    hidden: false,
    tier: 2,
    conditionKey: "totalGeneratorsPurchased",
    conditionValue: 50,
  },
  {
    id: "hundred_generators",
    name: "Content Farm III",
    description: "Own 100 total generators",
    category: "generators",
    icon: "🏢",
    hidden: false,
    tier: 3,
    conditionKey: "totalGeneratorsPurchased",
    conditionValue: 100,
  },
  {
    id: "twohundred_generators",
    name: "Content Farm IV",
    description: "Own 200 total generators",
    category: "generators",
    icon: "🏙️",
    hidden: false,
    tier: 4,
    conditionKey: "totalGeneratorsPurchased",
    conditionValue: 200,
  },
  {
    id: "ten_upgrades",
    name: "Optimizer I",
    description: "Purchase 10 upgrades",
    category: "generators",
    icon: "🔧",
    hidden: false,
    tier: 1,
    conditionKey: "totalUpgradesPurchased",
    conditionValue: 10,
  },
  {
    id: "twentyfive_upgrades",
    name: "Optimizer II",
    description: "Purchase 25 upgrades",
    category: "generators",
    icon: "⚙️",
    hidden: false,
    tier: 2,
    conditionKey: "totalUpgradesPurchased",
    conditionValue: 25,
  },
  {
    id: "fifty_upgrades",
    name: "Optimizer III",
    description: "Purchase 50 upgrades",
    category: "generators",
    icon: "🛠️",
    hidden: false,
    tier: 3,
    conditionKey: "totalUpgradesPurchased",
    conditionValue: 50,
  },
  {
    id: "hundred_upgrades",
    name: "Optimizer IV",
    description: "Purchase 100 upgrades",
    category: "generators",
    icon: "⚡",
    hidden: false,
    tier: 4,
    conditionKey: "totalUpgradesPurchased",
    conditionValue: 100,
  },
];

// ============================================================================
// CLICK/POST VALUE ACHIEVEMENTS
// ============================================================================

export const CLICK_ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "hundred_clicks",
    name: "Click Enthusiast I",
    description: "Click 100 times",
    category: "clicks",
    icon: "👆",
    hidden: false,
    tier: 1,
    conditionKey: "totalClicks",
    conditionValue: 100,
  },
  {
    id: "thousand_clicks",
    name: "Click Enthusiast II",
    description: "Click 1,000 times",
    category: "clicks",
    icon: "👆",
    hidden: false,
    tier: 2,
    conditionKey: "totalClicks",
    conditionValue: 1000,
  },
  {
    id: "tenthousand_clicks",
    name: "Click Enthusiast III",
    description: "Click 10,000 times",
    category: "clicks",
    icon: "👆",
    hidden: false,
    tier: 3,
    conditionKey: "totalClicks",
    conditionValue: 10_000,
  },
  {
    id: "hundredthousand_clicks",
    name: "Click Enthusiast IV",
    description: "Click 100,000 times",
    category: "clicks",
    icon: "👆",
    hidden: false,
    tier: 4,
    conditionKey: "totalClicks",
    conditionValue: 100_000,
  },
  {
    id: "click_power_10",
    name: "Click Master I",
    description: "Reach 10 click power",
    category: "clicks",
    icon: "💪",
    hidden: false,
    tier: 1,
    conditionKey: "clickPower",
    conditionValue: 10,
  },
  {
    id: "click_power_100",
    name: "Click Master II",
    description: "Reach 100 click power",
    category: "clicks",
    icon: "💪",
    hidden: false,
    tier: 2,
    conditionKey: "clickPower",
    conditionValue: 100,
  },
  {
    id: "click_power_1000",
    name: "Click Master III",
    description: "Reach 1,000 click power",
    category: "clicks",
    icon: "💪",
    hidden: false,
    tier: 3,
    conditionKey: "clickPower",
    conditionValue: 1000,
  },
  {
    id: "click_power_10000",
    name: "Click Master IV",
    description: "Reach 10,000 click power",
    category: "clicks",
    icon: "💪",
    hidden: false,
    tier: 4,
    conditionKey: "clickPower",
    conditionValue: 10_000,
  },
];

// ============================================================================
// PRESTIGE ACHIEVEMENTS
// ============================================================================

export const PRESTIGE_ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "prestige_5",
    name: "Prestige Novice",
    description: "Reach prestige level 5",
    category: "prestige",
    icon: "🔰",
    hidden: false,
    tier: 1,
    conditionKey: "prestigeCount",
    conditionValue: 5,
  },
  {
    id: "prestige_10",
    name: "Prestige Veteran",
    description: "Reach prestige level 10",
    category: "prestige",
    icon: "🎖️",
    hidden: false,
    tier: 2,
    conditionKey: "prestigeCount",
    conditionValue: 10,
  },
  {
    id: "prestige_25",
    name: "Prestige Master",
    description: "Reach prestige level 25",
    category: "prestige",
    icon: "🏅",
    hidden: false,
    tier: 3,
    conditionKey: "prestigeCount",
    conditionValue: 25,
  },
  {
    id: "prestige_50",
    name: "Prestige Legend",
    description: "Reach prestige level 50",
    category: "prestige",
    icon: "🥇",
    hidden: false,
    tier: 4,
    conditionKey: "prestigeCount",
    conditionValue: 50,
  },
];

// ============================================================================
// META/TIME PLAYED ACHIEVEMENTS
// ============================================================================

export const META_ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "playtime_1hour",
    name: "Getting Started",
    description: "Play for 1 hour",
    category: "meta",
    icon: "⏱️",
    hidden: false,
    tier: 1,
    conditionKey: "playTime",
    conditionValue: 60 * 60 * 1000, // 1 hour in milliseconds
  },
  {
    id: "playtime_10hours",
    name: "Dedicated Player",
    description: "Play for 10 hours",
    category: "meta",
    icon: "⌛",
    hidden: false,
    tier: 2,
    conditionKey: "playTime",
    conditionValue: 10 * 60 * 60 * 1000, // 10 hours
  },
  {
    id: "playtime_24hours",
    name: "Full Day Grind",
    description: "Play for 24 hours",
    category: "meta",
    icon: "📅",
    hidden: false,
    tier: 3,
    conditionKey: "playTime",
    conditionValue: 24 * 60 * 60 * 1000, // 24 hours
  },
  {
    id: "playtime_100hours",
    name: "Century Club",
    description: "Play for 100 hours",
    category: "meta",
    icon: "💯",
    hidden: false,
    tier: 4,
    conditionKey: "playTime",
    conditionValue: 100 * 60 * 60 * 1000, // 100 hours
  },
  {
    id: "sessions_10",
    name: "Regular Visitor",
    description: "Start 10 game sessions",
    category: "meta",
    icon: "🚪",
    hidden: false,
    tier: 1,
    conditionKey: "sessionCount",
    conditionValue: 10,
  },
  {
    id: "sessions_50",
    name: "Frequent Flyer",
    description: "Start 50 game sessions",
    category: "meta",
    icon: "🔄",
    hidden: false,
    tier: 2,
    conditionKey: "sessionCount",
    conditionValue: 50,
  },
  {
    id: "sessions_100",
    name: "Daily Ritual",
    description: "Start 100 game sessions",
    category: "meta",
    icon: "📆",
    hidden: false,
    tier: 3,
    conditionKey: "sessionCount",
    conditionValue: 100,
  },
];

// ============================================================================
// HIDDEN ACHIEVEMENTS (Special Conditions)
// ============================================================================

export const HIDDEN_ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "nice",
    name: "Nice.",
    description: "Reach 69 or higher click power",
    category: "hidden",
    icon: "😏",
    hidden: true,
    conditionKey: "clickPower",
    conditionValue: 69,
  },
  {
    id: "prestigious_fool",
    name: "Prestigious Fool",
    description: "Reach exactly prestige level 42",
    category: "hidden",
    icon: "🤪",
    hidden: true,
    conditionKey: "prestigeExact",
    conditionValue: 42,
  },
  {
    id: "welcome_back",
    name: "Welcome Back…?",
    description: "Return after being away for more than 24 hours",
    category: "hidden",
    icon: "🕰️",
    hidden: true,
    conditionKey: "returnAfter24h",
  },
];

// ============================================================================
// COMBINED EXPORT
// ============================================================================

export const ALL_ACHIEVEMENTS: AchievementDefinition[] = [
  ...PROGRESSION_ACHIEVEMENTS,
  ...CURRENCY_ACHIEVEMENTS,
  ...GENERATOR_ACHIEVEMENTS,
  ...CLICK_ACHIEVEMENTS,
  ...PRESTIGE_ACHIEVEMENTS,
  ...META_ACHIEVEMENTS,
  ...HIDDEN_ACHIEVEMENTS,
];

// Helper to get achievements by category
export function getAchievementsByCategory(
  category: AchievementCategory,
): AchievementDefinition[] {
  return ALL_ACHIEVEMENTS.filter((a) => a.category === category);
}

// Get count of achievements
export function getAchievementCounts() {
  return {
    total: ALL_ACHIEVEMENTS.length,
    progression: PROGRESSION_ACHIEVEMENTS.length,
    currency: CURRENCY_ACHIEVEMENTS.length,
    generators: GENERATOR_ACHIEVEMENTS.length,
    clicks: CLICK_ACHIEVEMENTS.length,
    prestige: PRESTIGE_ACHIEVEMENTS.length,
    meta: META_ACHIEVEMENTS.length,
    hidden: HIDDEN_ACHIEVEMENTS.length,
  };
}
