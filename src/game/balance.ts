/**
 * Game Balance Constants for Zustand Migration & Rebalance
 *
 * Centralized configuration for all game balance settings.
 * Updated for comprehensive rebalance with notoriety scaling, synergies, and improved progression.
 */

// ============================================================================
// CRED CACHE (Bonus Click Drops)
// ============================================================================

/**
 * Minimum percentage of total creds awarded on Cred Cache drop
 * 0.001 = 0.1% of current creds
 */
export const CRED_CACHE_MIN_PERCENT = 0.001; // 0.1%

/**
 * Maximum percentage of total creds awarded on Cred Cache drop
 * 0.01 = 1.0% of current creds
 */
export const CRED_CACHE_MAX_PERCENT = 0.01; // 1.0%

// ============================================================================
// THEMES (Passive Bonuses)
// ============================================================================

/**
 * Passive power bonus per unlocked theme
 * 0.02 = +2% to all production per theme
 * Themes are now purely cosmetic when active, but provide passive bonuses when unlocked
 */
export const PASSIVE_THEME_BONUS = 0.02; // +2% per unlocked theme

// ============================================================================
// PRESTIGE SYSTEM (Light/Casual Progression)
// ============================================================================

/**
 * Power bonus per prestige point
 * 0.20 = +20% to all production per prestige level
 */
export const PRESTIGE_BONUS_PER_POINT = 0.20; // +20% per prestige

/**
 * Base cost for first prestige point (in Creds)
 * 10,000,000 Creds required for first prestige
 */
export const PRESTIGE_BASE_COST = 10_000_000; // 10M Creds

/**
 * Cost growth exponent for prestige
 * cost = BASE_COST * (level + 1)^2
 * Quadratic scaling: 10M, 40M, 90M, 160M, 250M...
 */
export const PRESTIGE_COST_EXPONENT = 2;

/**
 * Minimum creds threshold to unlock prestige UI
 */
export const PRESTIGE_THRESHOLD = 10_000_000; // 10M

// ============================================================================
// NOTORIETY SYSTEM (Major Progression Layer)
// ============================================================================

/**
 * Power bonus per notoriety level
 * 0.003 = +0.3% to all production per notoriety level
 */
export const NOTORIETY_POWER_PER_LEVEL = 0.003; // +0.3% per level

/**
 * Notoriety milestone interval (for bonus multiplier)
 * Every 25 levels grants a milestone bonus
 */
export const NOTORIETY_MILESTONE_STEP = 25;

/**
 * Bonus multiplier per notoriety milestone
 * 0.05 = +5% to all production per milestone (every 25 levels)
 */
export const NOTORIETY_MILESTONE_BONUS = 0.05; // +5% per milestone

/**
 * Award drop chance increase per milestone (every 25 notoriety)
 * 0.01 = +1% to award drop chance per milestone
 */
export const NOTORIETY_AWARD_DROP_BONUS = 0.01; // +1% per 25 levels

/**
 * Generator cost discount per milestone (every 50 notoriety)
 * 0.02 = -2% to generator costs per milestone, capped at 20% total
 */
export const NOTORIETY_COST_DISCOUNT_PER_MILESTONE = 0.02; // -2% per 50 levels

/**
 * Maximum cost discount from notoriety
 * 0.20 = max -20% cost reduction
 */
export const NOTORIETY_MAX_COST_DISCOUNT = 0.20; // max -20%

/**
 * Notoriety cost discount milestone interval
 * Every 50 levels grants a cost discount
 */
export const NOTORIETY_COST_DISCOUNT_STEP = 50;

/**
 * Minimum notoriety threshold to unlock notoriety upgrades UI
 */
export const NOTORIETY_UNLOCK_THRESHOLD = 10;

/**
 * Base notoriety gain per second (disabled in v1.0.0)
 */
export const NOTORIETY_BASE_PER_SEC = 0.0;

/**
 * Cred upkeep cost per notoriety owned per second
 */
export const NOTORIETY_UPKEEP_PER_SEC = 0.02;

// ============================================================================
// NOTORIETY GENERATORS (Rebalanced for Viability)
// ============================================================================

/**
 * Social Media Manager (SMM) - Tier 1 Notoriety Generator
 * Buffed production and reduced upkeep for early-game viability
 */
export const SMM_NOTORIETY_PER_HOUR = 2; // +2 notoriety/hour (was 1)
export const SMM_BASE_COST = 100_000; // 100k Creds
export const SMM_COST_MULTIPLIER = 1.8;
export const SMM_UPKEEP_PER_SEC = 2000; // 2k/s upkeep (was 5k)
export const SMM_MAX_LEVEL = 10;

/**
 * PR Team - Tier 2 Notoriety Generator
 * Buffed production and reduced upkeep for mid-game viability
 */
export const PR_TEAM_NOTORIETY_PER_HOUR = 10; // +10 notoriety/hour (was 5)
export const PR_TEAM_BASE_COST = 50_000_000; // 50M Creds (was 100M)
export const PR_TEAM_COST_MULTIPLIER = 2.2;
export const PR_TEAM_UPKEEP_PER_SEC = 10000; // 10k/s upkeep (was 25k)
export const PR_TEAM_MAX_LEVEL = 10;

/**
 * Key Client - Tier 3 Notoriety Generator
 * Significantly buffed for late-game impact
 */
export const KEY_CLIENT_NOTORIETY_PER_HOUR = 50; // +50 notoriety/hour (was 25)
export const KEY_CLIENT_BASE_COST = 5_000_000_000; // 5B Creds (was 10B)
export const KEY_CLIENT_COST_MULTIPLIER = 2.5;
export const KEY_CLIENT_UPKEEP_PER_SEC = 100000; // 100k/s upkeep (was 250k)
export const KEY_CLIENT_MAX_LEVEL = 10;

// ============================================================================
// INFINITE UPGRADES
// ============================================================================

/**
 * Cost growth multiplier for infinite upgrades
 * 1.18 = cost increases 18% per level
 * Balanced for late-game currency sinks
 */
export const INFINITE_UPGRADE_COST_GROWTH = 1.18;

/**
 * Power multiplier per level for infinite upgrades
 * 0.07 = +7% per level
 * Applied to specific subsystems (e.g., AI Enhancements for global, Better Filters for clicks)
 */
export const INFINITE_UPGRADE_MULTIPLIER = 0.07; // +7% per level

// ============================================================================
// GENERATOR SYNERGIES
// ============================================================================

/**
 * Streamer + Collab synergy bonus per pair
 * 0.10 = +10% production per matching pair
 */
export const SYNERGY_STREAM_COLLAB_BONUS = 0.10; // +10% per pair

/**
 * Editor bulk synergy bonus per 10 editors
 * 0.05 = +5% production per 10 editors
 */
export const SYNERGY_EDITOR_BULK_BONUS = 0.05; // +5% per 10 editors

/**
 * Viral triangle tier 1 bonus (1+ of each: streams, editors, ads)
 * 0.05 = +5% production
 */
export const SYNERGY_VIRAL_TRIANGLE_T1 = 0.05; // +5% at 1+

/**
 * Viral triangle tier 2 bonus (10+ of each)
 * 0.15 = +15% production
 */
export const SYNERGY_VIRAL_TRIANGLE_T2 = 0.15; // +15% at 10+

/**
 * Viral triangle tier 3 bonus (25+ of each)
 * 0.25 = +25% production
 */
export const SYNERGY_VIRAL_TRIANGLE_T3 = 0.25; // +25% at 25+

// ============================================================================
// TICK & PERFORMANCE
// ============================================================================

/**
 * Main game tick interval in milliseconds
 * 50ms = 20 ticks per second for smooth gameplay
 */
export const TICK_INTERVAL = 50; // 20 ticks/sec

/**
 * Autosave interval in milliseconds
 * Save every 15 seconds to prevent data loss
 */
export const AUTOSAVE_INTERVAL = 15000; // 15 seconds

/**
 * Debounced save delay after burst actions
 * 500ms delay after last action before saving
 */
export const DEBOUNCE_SAVE_DELAY = 500; // 0.5 seconds

/**
 * Offline progress cap in milliseconds
 * Maximum 72 hours of offline gains
 */
export const OFFLINE_PROGRESS_CAP = 72 * 60 * 60 * 1000; // 72 hours

// ============================================================================
// CLICK RATE LIMITING
// ============================================================================

/**
 * Minimum time between clicks in milliseconds
 * 16ms ≈ 60 clicks per second max (prevents spam)
 */
export const MIN_CLICK_INTERVAL = 16; // ~60 clicks/sec max

// ============================================================================
// AWARDS & DROPS
// ============================================================================

/**
 * Base award drop chance per click
 * 0.003 = 0.3% base chance
 */
export const SHARD_DROP_CHANCE = 0.003; // 0.3% base

/**
 * Random event mean interval in seconds
 * Events occur approximately every 10 minutes
 */
export const RANDOM_EVENT_INTERVAL_MEAN = 600; // 10 minutes

/**
 * Random event jitter in seconds (±2 minutes)
 */
export const RANDOM_EVENT_INTERVAL_JITTER = 120; // ±2 minutes

// ============================================================================
// NOTORIETY POWER THRESHOLDS (Placeholder for future features)
// ============================================================================

export const WHISPER_NETWORK_THRESHOLD = 50;
export const BLUE_CHECK_ENERGY_THRESHOLD = 100;

// ============================================================================
// SAVE VERSIONING
// ============================================================================

/**
 * Current save schema version
 * Increment this when making breaking changes to the save format
 */
export const CURRENT_SAVE_VERSION = 2;

/**
 * Save version mapping:
 * 0 or undefined = Legacy (pre-versioning)
 * 1 = Initial versioned save (v0.4.0)
 * 2 = Zustand migration + rebalance (current)
 */
