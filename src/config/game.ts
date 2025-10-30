/**
 * game.ts - Game Configuration & Balance
 * 
 * Defines all game content:
 * - Generators (content creation systems)
 * - Upgrades (permanent improvements)
 * - Themes (cosmetic + bonus)
 * - Random events
 * - Balance constants for week-long progression
 */

import { Generator, Upgrade, Theme } from '@/game/state';
import { RandomEventDefinition } from '@/game/engine';

// ============================================================================
// BALANCE CONSTANTS
// ============================================================================

/**
 * Week-long progression curve
 * Designed for ~7 days to reach first prestige with moderate play
 */
export const BALANCE = {
  // Tick rate
  TICK_INTERVAL: 250, // 4 ticks per second
  
  // Progression targets
  FIRST_PRESTIGE_TARGET: 1e9, // 1 Billion followers
  WEEK_IN_HOURS: 168,
  DAILY_PLAY_HOURS: 2, // Assumed active play per day
  
  // Click scaling
  BASE_CLICK_POWER: 1,
  CLICK_UPGRADE_MULTIPLIER: 2, // Each upgrade doubles
  
  // Generator scaling
  GENERATOR_COST_BASE: [
    10,        // Photo Post
    100,       // Video Content
    1100,      // Live Stream
    12000,     // Collaboration
    130000,    // Brand Deal
    1400000,   // Talent Agency
  ],
  GENERATOR_COST_MULTIPLIER: [
    1.15,      // Photo Post (cheap, scales fast)
    1.14,      // Video Content
    1.13,      // Live Stream
    1.12,      // Collaboration
    1.11,      // Brand Deal
    1.10,      // Talent Agency (expensive, scales slow)
  ],
  GENERATOR_BASE_PRODUCTION: [
    0.1,       // Photo Post
    1.0,       // Video Content
    8.0,       // Live Stream
    47.0,      // Collaboration
    260.0,     // Brand Deal
    1400.0,    // Talent Agency
  ],
  
  // Unlock thresholds (50% of first purchase cost)
  GENERATOR_UNLOCK_THRESHOLD: [
    0,         // Photo Post (always unlocked)
    50,        // Video Content
    550,       // Live Stream
    6000,      // Collaboration
    65000,     // Brand Deal
    700000,    // Talent Agency
  ],
  
  // Prestige
  PRESTIGE_EXPONENT: 0.4,
  REPUTATION_BONUS: 0.10, // 10% per point
  
  // Shards (premium currency)
  SHARD_DROP_CHANCE: .0003, // 0.03% per click
  SHARD_DROP_AVERAGE: 333, // ~1 shard per 333 clicks
  
  // Events
  EVENT_CHANCE: 0.05, // 5% every 30 seconds
  EVENT_DURATION_MIN: 30000, // 30 seconds
  EVENT_DURATION_MAX: 120000, // 2 minutes
  
  // Offline
  OFFLINE_CAP_HOURS: 8,
  OFFLINE_CAP_MS: 8 * 60 * 60 * 1000,
};

// ============================================================================
// GENERATORS
// ============================================================================

export const GENERATOR_DEFINITIONS: Omit<Generator, 'count'>[] = [
  {
    id: 'photo',
    name: '📸 Photo Post',
    baseFollowersPerSecond: 0.1,
    baseCost: 10,
    costMultiplier: 1.15,
    unlocked: true,
  },
  {
    id: 'video',
    name: '🎥 Video Content',
    baseFollowersPerSecond: 1.0,
    baseCost: 100,
    costMultiplier: 1.14,
    unlocked: false,
  },
  {
    id: 'stream',
    name: '📹 Live Stream',
    baseFollowersPerSecond: 8.0,
    baseCost: 1100,
    costMultiplier: 1.13,
    unlocked: false,
  },
  {
    id: 'collab',
    name: '🤝 Collaboration',
    baseFollowersPerSecond: 47.0,
    baseCost: 12000,
    costMultiplier: 1.12,
    unlocked: false,
  },
  {
    id: 'brand',
    name: '💼 Brand Deal',
    baseFollowersPerSecond: 260.0,
    baseCost: 130000,
    costMultiplier: 1.11,
    unlocked: false,
  },
  {
    id: 'agency',
    name: '🏢 Talent Agency',
    baseFollowersPerSecond: 1400.0,
    baseCost: 1400000,
    costMultiplier: 1.10,
    unlocked: false,
  },
];

// ============================================================================
// UPGRADES
// ============================================================================

export const UPGRADE_DEFINITIONS: Upgrade[] = [
  // Tier 1: Early game (0-1K followers)
  {
    id: 'better_camera',
    name: '📷 Better Camera',
    description: 'Double your click power with professional equipment',
    cost: 50,
    purchased: false,
    effect: { type: 'clickMultiplier', value: 2 },
  },
  {
    id: 'photo_boost',
    name: '✂️ Editing Software',
    description: 'Photo Posts produce 2x followers',
    cost: 500,
    purchased: false,
    effect: { type: 'generatorMultiplier', value: 2, targetGeneratorId: 'photo' },
  },
  
  // Tier 2: Mid-early (1K-10K followers)
  {
    id: 'viral_strategy',
    name: '🔥 Viral Strategy',
    description: 'All production increased by 50%',
    cost: 5000,
    purchased: false,
    effect: { type: 'globalMultiplier', value: 1.5 },
  },
  {
    id: 'video_boost',
    name: '🎬 Pro Video Editor',
    description: 'Video Content produces 2x followers',
    cost: 15000,
    purchased: false,
    effect: { type: 'generatorMultiplier', value: 2, targetGeneratorId: 'video' },
  },
  {
    id: 'golden_clicks',
    name: '✨ Golden Fingers',
    description: 'Triple your click power',
    cost: 25000,
    purchased: false,
    effect: { type: 'clickMultiplier', value: 3 },
  },
  
  // Tier 3: Mid-game (10K-100K followers)
  {
    id: 'stream_boost',
    name: '🎮 Streaming Setup',
    description: 'Live Streams produce 2x followers',
    cost: 75000,
    purchased: false,
    effect: { type: 'generatorMultiplier', value: 2, targetGeneratorId: 'stream' },
  },
  {
    id: 'algorithm_master',
    name: '🤖 Algorithm Master',
    description: 'All production increased by 100%',
    cost: 250000,
    purchased: false,
    effect: { type: 'globalMultiplier', value: 2 },
  },
  {
    id: 'collab_boost',
    name: '🤝 Network Effect',
    description: 'Collaborations produce 2x followers',
    cost: 500000,
    purchased: false,
    effect: { type: 'generatorMultiplier', value: 2, targetGeneratorId: 'collab' },
  },
  
  // Tier 4: Late game (100K-1M followers)
  {
    id: 'brand_boost',
    name: '💰 Marketing Genius',
    description: 'Brand Deals produce 2x followers',
    cost: 2000000,
    purchased: false,
    effect: { type: 'generatorMultiplier', value: 2, targetGeneratorId: 'brand' },
  },
  {
    id: 'super_clicks',
    name: '⚡ Super Clicks',
    description: 'Click power increased by 5x',
    cost: 5000000,
    purchased: false,
    effect: { type: 'clickMultiplier', value: 5 },
  },
  
  // Tier 5: End game (1M+ followers)
  {
    id: 'agency_boost',
    name: '🏢 Empire Builder',
    description: 'Talent Agencies produce 2x followers',
    cost: 25000000,
    purchased: false,
    effect: { type: 'generatorMultiplier', value: 2, targetGeneratorId: 'agency' },
  },
  {
    id: 'mega_multiplier',
    name: '🌟 Mega Influencer',
    description: 'All production increased by 200%',
    cost: 100000000,
    purchased: false,
    effect: { type: 'globalMultiplier', value: 3 },
  },
];

// ============================================================================
// THEMES
// ============================================================================

export const THEME_DEFINITIONS: Theme[] = [
  {
    id: 'default',
    name: '🌐 Default',
    cost: 0,
    unlocked: true,
    active: true,
    bonusMultiplier: 1.0,
  },
  {
    id: 'neon',
    name: '🌃 Neon Dreams',
    cost: 10,
    unlocked: false,
    active: false,
    bonusMultiplier: 1.05,
  },
  {
    id: 'nature',
    name: '🌿 Nature Vibes',
    cost: 25,
    unlocked: false,
    active: false,
    bonusMultiplier: 1.10,
  },
  {
    id: 'cherry',
    name: '🍒 Cherry Blossom',
    cost: 50,
    unlocked: false,
    active: false,
    bonusMultiplier: 1.15,
  },
  {
    id: 'midnight',
    name: '🌙 Midnight',
    cost: 75,
    unlocked: false,
    active: false,
    bonusMultiplier: 1.20,
  },
  {
    id: 'terminal',
    name: '💻 Terminal',
    cost: 100,
    unlocked: false,
    active: false,
    bonusMultiplier: 1.25,
  },
  {
    id: 'gold',
    name: '✨ Golden Hour',
    cost: 150,
    unlocked: false,
    active: false,
    bonusMultiplier: 1.30,
  },
  {
    id: 'monokai',
    name: '🎨 Monokai',
    cost: 200,
    unlocked: false,
    active: false,
    bonusMultiplier: 1.35,
  },
];

// ============================================================================
// RANDOM EVENTS
// ============================================================================

export const EVENT_DEFINITIONS: RandomEventDefinition[] = [
  {
    id: 'viral_post',
    name: '🔥 Viral Post',
    description: 'Your post went viral! 3x followers for 60 seconds',
    duration: 60000,
    weight: 10,
    effect: { type: 'followerMultiplier', multiplier: 3 },
  },
  {
    id: 'trending_topic',
    name: '📈 Trending Topic',
    description: 'You jumped on a trending topic! 2x production for 2 minutes',
    duration: 120000,
    weight: 15,
    effect: { type: 'generatorMultiplier', multiplier: 2 },
  },
  {
    id: 'celebrity_mention',
    name: '⭐ Celebrity Mention',
    description: 'A celebrity mentioned you! 5x click power for 30 seconds',
    duration: 30000,
    weight: 5,
    effect: { type: 'clickMultiplier', multiplier: 5 },
  },
  {
    id: 'algorithm_boost',
    name: '🚀 Algorithm Boost',
    description: 'The algorithm favors you! 2x all production for 90 seconds',
    duration: 90000,
    weight: 8,
    effect: { type: 'followerMultiplier', multiplier: 2 },
  },
  {
    id: 'sponsored_post',
    name: '💰 Sponsored Post',
    description: 'Sponsored content bonus! 4x followers for 45 seconds',
    duration: 45000,
    weight: 12,
    effect: { type: 'followerMultiplier', multiplier: 4 },
  },
  {
    id: 'collaboration_boom',
    name: '🤝 Collab Frenzy',
    description: 'Multiple collabs at once! 3x generators for 75 seconds',
    duration: 75000,
    weight: 10,
    effect: { type: 'generatorMultiplier', multiplier: 3 },
  },
  {
    id: 'golden_hour',
    name: '✨ Golden Hour',
    description: 'Perfect lighting for content! 2.5x all production for 60 seconds',
    duration: 60000,
    weight: 7,
    effect: { type: 'followerMultiplier', multiplier: 2.5 },
  },
];

// ============================================================================
// PROGRESSION MILESTONES
// ============================================================================

export const MILESTONES = [
  { followers: 100, name: 'Rising Star', icon: '⭐' },
  { followers: 1000, name: 'Local Celebrity', icon: '🌟' },
  { followers: 10000, name: 'Micro Influencer', icon: '✨' },
  { followers: 100000, name: 'Influencer', icon: '🚀' },
  { followers: 1000000, name: 'Mega Influencer', icon: '💫' },
  { followers: 10000000, name: 'Super Star', icon: '⭐' },
  { followers: 100000000, name: 'Global Icon', icon: '🌍' },
  { followers: 1000000000, name: 'Legendary', icon: '👑' },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate expected time to reach a follower count
 * Based on active play assumptions
 */
export function calculateExpectedPlayTime(
  targetFollowers: number,
  followersPerSecond: number,
  clicksPerMinute: number = 60
): number {
  const passivePerMinute = followersPerSecond * 60;
  const activePerMinute = clicksPerMinute * BALANCE.BASE_CLICK_POWER;
  const totalPerMinute = passivePerMinute + activePerMinute;
  
  if (totalPerMinute <= 0) return Infinity;
  
  return (targetFollowers / totalPerMinute) * 60 * 1000; // Convert to milliseconds
}

/**
 * Get the next milestone for current follower count
 */
export function getNextMilestone(currentFollowers: number) {
  return MILESTONES.find(m => m.followers > currentFollowers) || MILESTONES[MILESTONES.length - 1];
}

/**
 * Check if a follower count reached a milestone
 */
export function checkMilestone(oldFollowers: number, newFollowers: number) {
  return MILESTONES.find(
    m => oldFollowers < m.followers && newFollowers >= m.followers
  );
}