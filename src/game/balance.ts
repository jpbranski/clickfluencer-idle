/**
 * Game Balance Constants for v1.0.0
 *
 * Centralized configuration for game-wide balance settings.
 */

// ============================================================================
// Random Events
// ============================================================================

/**
 * Mean interval between random events (in seconds)
 * Events will occur approximately every 10 minutes with jitter
 */
export const RANDOM_EVENT_INTERVAL_MEAN = 600; // 10 minutes

/**
 * Jitter range for random events (±2 minutes)
 * Actual interval will be MEAN ± JITTER
 */
export const RANDOM_EVENT_INTERVAL_JITTER = 120; // ±2 minutes

// ============================================================================
// Prestige System
// ============================================================================

/**
 * Base cost for first prestige point
 * Cost formula: C_p = C_0 × (P+1)^2.5 where C_0 = 1e7
 */
export const PRESTIGE_BASE_COST = 1e7; // 10 million Creds

/**
 * Follower threshold required to unlock prestige
 * Lowered from 1e9 to 1e7 for v1.0.0
 */
export const PRESTIGE_THRESHOLD = 1e7; // 10 million

// ============================================================================
// Notoriety Currency
// ============================================================================

/**
 * Base notoriety gain per second
 * Approximately 2.52 per hour (0.0007 * 3600)
 */
export const NOTORIETY_BASE_PER_SEC = 0.0007;

/**
 * Credits drain per notoriety owned per second
 * Each notoriety costs 0.02 creds/sec to maintain
 */
export const NOTORIETY_UPKEEP_PER_SEC = 0.02;

/**
 * Minimum notoriety threshold to unlock notoriety powers
 */
export const NOTORIETY_UNLOCK_THRESHOLD = 10;

// ============================================================================
// Notoriety Power Thresholds
// ============================================================================

/**
 * Notoriety required to unlock "Whisper Network" power
 */
export const WHISPER_NETWORK_THRESHOLD = 50;

/**
 * Notoriety required to unlock "Blue Check Energy" power
 */
export const BLUE_CHECK_ENERGY_THRESHOLD = 100;
