/**
 * synergies.ts - Generator Synergy System
 *
 * Implements combinatorial bonuses between generators to reward strategic purchasing.
 * Synergies provide multiplicative bonuses to total production based on generator counts.
 */

import { GameState } from "./state";
import {
  SYNERGY_STREAM_COLLAB_BONUS,
  SYNERGY_EDITOR_BULK_BONUS,
  SYNERGY_VIRAL_TRIANGLE_T1,
  SYNERGY_VIRAL_TRIANGLE_T2,
  SYNERGY_VIRAL_TRIANGLE_T3,
} from "./balance";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get count of a specific generator by ID
 */
export function getGeneratorCount(state: GameState, id: string): number {
  const generator = state.generators.find((g) => g.id === id);
  return generator?.count || 0;
}

// ============================================================================
// SYNERGY CALCULATION
// ============================================================================

/**
 * Calculate total synergy multiplier for all production
 *
 * Synergies:
 * 1. Streamer + Collab Synergy: +10% per matching pair
 *    - For every 1 stream and 1 collab, gain +10%
 *    - Example: 5 streams + 3 collabs = 3 pairs = +30%
 *
 * 2. Editor Bulk Synergy: +5% per 10 editors
 *    - Example: 25 editors = 2 chunks = +10%
 *
 * 3. Viral Triangle Synergy: Tiered bonus for having streams, editors, and ads
 *    - Tier 1 (1+ of each): +5%
 *    - Tier 2 (10+ of each): +15%
 *    - Tier 3 (25+ of each): +25%
 *    - Bonuses stack (you get the highest tier you qualify for)
 *
 * @param state - Current game state
 * @param basePower - Base production power before synergies
 * @returns Total power after applying all synergies
 */
export function applySynergies(state: GameState, basePower: number): number {
  let power = basePower;

  // Synergy 1: Streamer + Collab pairs
  const streams = getGeneratorCount(state, "stream");
  const collabs = getGeneratorCount(state, "collab");
  const pairs = Math.min(streams, collabs);

  if (pairs > 0) {
    power *= 1 + pairs * SYNERGY_STREAM_COLLAB_BONUS;
  }

  // Synergy 2: Editor bulk bonus (per 10 editors)
  const editors = getGeneratorCount(state, "video"); // Assuming "video" is editors
  if (editors >= 10) {
    const chunks = Math.floor(editors / 10);
    power *= 1 + chunks * SYNERGY_EDITOR_BULK_BONUS;
  }

  // Synergy 3: Viral triangle (streams + editors + ads)
  const ads = getGeneratorCount(state, "brand"); // Assuming "brand" is ads

  // Determine highest tier achieved
  if (streams >= 25 && editors >= 25 && ads >= 25) {
    // Tier 3: 25+ of each
    power *= 1 + SYNERGY_VIRAL_TRIANGLE_T3;
  } else if (streams >= 10 && editors >= 10 && ads >= 10) {
    // Tier 2: 10+ of each
    power *= 1 + SYNERGY_VIRAL_TRIANGLE_T2;
  } else if (streams >= 1 && editors >= 1 && ads >= 1) {
    // Tier 1: 1+ of each
    power *= 1 + SYNERGY_VIRAL_TRIANGLE_T1;
  }

  return power;
}

// ============================================================================
// SYNERGY INFO (For UI Display)
// ============================================================================

export interface SynergyInfo {
  name: string;
  description: string;
  active: boolean;
  bonus: string;
  progress?: string;
}

/**
 * Get list of all synergies and their current status
 * Useful for displaying synergy info in the UI
 */
export function getSynergyInfo(state: GameState): SynergyInfo[] {
  const streams = getGeneratorCount(state, "stream");
  const collabs = getGeneratorCount(state, "collab");
  const editors = getGeneratorCount(state, "video");
  const ads = getGeneratorCount(state, "brand");

  const synergies: SynergyInfo[] = [];

  // Streamer + Collab Synergy
  const pairs = Math.min(streams, collabs);
  synergies.push({
    name: "📹🤝 Stream & Collab Synergy",
    description: "+10% per matching pair of streams and collabs",
    active: pairs > 0,
    bonus: pairs > 0 ? `+${(pairs * SYNERGY_STREAM_COLLAB_BONUS * 100).toFixed(0)}%` : "Inactive",
    progress: `${streams} streams, ${collabs} collabs = ${pairs} pairs`,
  });

  // Editor Bulk Synergy
  const editorChunks = Math.floor(editors / 10);
  synergies.push({
    name: "🎥 Editor Efficiency",
    description: "+5% per 10 video content generators",
    active: editorChunks > 0,
    bonus: editorChunks > 0 ? `+${(editorChunks * SYNERGY_EDITOR_BULK_BONUS * 100).toFixed(0)}%` : "Inactive",
    progress: `${editors} videos (${editorChunks} × 10)`,
  });

  // Viral Triangle Synergy
  let viralTier = 0;
  let viralBonus = 0;
  let viralDescription = "Have 1+ streams, videos, and brand deals";

  if (streams >= 25 && editors >= 25 && ads >= 25) {
    viralTier = 3;
    viralBonus = SYNERGY_VIRAL_TRIANGLE_T3;
    viralDescription = "Have 25+ streams, videos, and brand deals";
  } else if (streams >= 10 && editors >= 10 && ads >= 10) {
    viralTier = 2;
    viralBonus = SYNERGY_VIRAL_TRIANGLE_T2;
    viralDescription = "Have 10+ streams, videos, and brand deals";
  } else if (streams >= 1 && editors >= 1 && ads >= 1) {
    viralTier = 1;
    viralBonus = SYNERGY_VIRAL_TRIANGLE_T1;
    viralDescription = "Have 1+ streams, videos, and brand deals";
  }

  synergies.push({
    name: "🔥 Viral Triangle",
    description: viralDescription,
    active: viralTier > 0,
    bonus: viralTier > 0 ? `+${(viralBonus * 100).toFixed(0)}% (Tier ${viralTier})` : "Inactive",
    progress: `${streams} streams, ${editors} videos, ${ads} brands`,
  });

  return synergies;
}

/**
 * Get total synergy multiplier as a percentage
 * Example: 1.35 → "+35%"
 */
export function getTotalSynergyBonus(state: GameState): string {
  const baseMultiplier = applySynergies(state, 1);
  const bonusPercent = (baseMultiplier - 1) * 100;

  if (bonusPercent === 0) {
    return "No synergies active";
  }

  return `+${bonusPercent.toFixed(1)}%`;
}
