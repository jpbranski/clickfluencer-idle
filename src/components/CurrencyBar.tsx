"use client";

/**
 * CurrencyBar.tsx - Currency Display Component
 *
 * Displays game currencies with icons and formatted numbers:
 * - Followers (Creds)
 * - Awards (Premium currency from drops)
 */

import { formatNumber, formatNumberCompact } from "@/game/format";

interface CurrencyBarProps {
  followers: number;
  shards: number;
  followersPerSecond: number;
  awardDropRate?: number;
  reputation: number;
  notoriety?: number; // v1.0.0
  notorietyPerSecond?: number; // v1.0.0
  compact?: boolean;
}

export function CurrencyBar({
  followers,
  shards,
  followersPerSecond,
  awardDropRate,
  reputation,
  notoriety = 0,
  notorietyPerSecond = 0,
  compact = false,
}: CurrencyBarProps) {
  return (
    <div className="w-full">
      <div
        className={`
        grid grid-cols-3 gap-4 sm:gap-6
        px-4 py-3 rounded-lg
        bg-surface backdrop-blur-sm
        border border-border
        shadow-lg
        transition-colors
      `}
      >
        {/* Prestige Level */}
        <div className="flex items-center gap-2">
          <div
            className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center"
            aria-hidden="true"
          >
            <span className="text-2xl" role="img" aria-label="prestige">
              ⭐
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted uppercase tracking-wide font-semibold">
              Prestige
            </div>
            <div
              className="text-lg font-bold font-mono number-display truncate text-accent"
              aria-label={`Prestige level ${reputation}`}
            >
              {reputation}
            </div>
          </div>
        </div>

        {/* Followers (Main Currency) */}
        <div className="flex items-center gap-2">
          <div
            className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center"
            aria-hidden="true"
          >
            <span className="text-2xl" role="img" aria-label="followers">
              👥
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted uppercase tracking-wide font-semibold">
              Creds
            </div>
            <div
              className="text-lg font-bold font-mono number-display truncate"
              aria-label={`${followers.toFixed(0)} followers`}
            >
              {compact
                ? formatNumberCompact(followers)
                : formatNumber(followers, 2)}
            </div>
            {followersPerSecond > 0 && (
              <div className="text-xs text-success font-mono">
                +{formatNumber(followersPerSecond, 1)}/s
              </div>
            )}
          </div>
        </div>

        {/* Awards (Premium Currency) */}
        <div className="flex items-center gap-2">
          <div
            className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center"
            aria-hidden="true"
          >
            <span className="text-2xl" role="img" aria-label="awards">
              💎
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted uppercase tracking-wide font-semibold">
              Awards
            </div>
            <div
              className="text-lg font-bold font-mono number-display truncate text-accent"
              aria-label={`${shards} awards`}
            >
              {shards.toLocaleString()}
            </div>
            <div className="text-xs text-muted font-mono">
              {((awardDropRate || 0) * 100).toFixed(1)}% drop rate
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div
          className="hidden sm:block w-px h-12 bg-border"
          aria-hidden="true"
        />

        {/* Notoriety (Third Currency - v1.0.0) */}
        <div className="flex items-center gap-2 min-w-[140px]">
          <div
            className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center"
            aria-hidden="true"
          >
            <span className="text-2xl" role="img" aria-label="notoriety">
              😎
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted uppercase tracking-wide font-semibold">
              Notoriety
            </div>
            <div
              className="text-lg font-bold font-mono number-display truncate text-accent"
              aria-label={`${notoriety.toFixed(3)} notoriety`}
            >
              {notoriety.toFixed(2)}
            </div>
            {notorietyPerSecond > 0 && (
              <div className="text-xs text-success font-mono">
                +{notorietyPerSecond.toFixed(3)}/s
              </div>
            )}
            {notorietyPerSecond === 0 && notoriety > 0 && (
              <div className="text-xs text-warning font-mono">
                Paused (no creds)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Compact View Alternative */}
      {compact && (
        <div className="sm:hidden mt-2 text-center text-xs text-muted font-mono">
          <span>Prestige: {reputation}</span>
          <span className="mx-2">•</span>
          <span>Creds: {formatNumber(followers)}</span>
          <span className="mx-2">•</span>
          <span>Awards: {shards}</span>
          <span className="mx-2">•</span>
          <span>Notoriety: {notoriety.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
}
