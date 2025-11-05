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
  notoriety?: number;
  notorietyPerSecond?: number;
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
        flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8
        px-4 py-3 rounded-lg
        bg-surface backdrop-blur-sm
        border border-border
        shadow-lg
        transition-colors
      `}
      >
        {/* Prestige Level */}
        <div className="flex items-center gap-2 min-w-[100px]">
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
              className="text-lg font-bold number-display truncate text-accent"
              aria-label={`Prestige level ${reputation}`}
            >
              {reputation}
            </div>
          </div>
        </div>
        {/* Vertical Divider */}
        <div
          className="hidden sm:block w-px h-12 bg-border"
          aria-hidden="true"
        />

        {/* Followers (Main Currency) */}
        <div className="flex items-center gap-2 min-w-[140px]">
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
              className="text-lg font-bold number-display truncate"
              aria-label={`${followers.toFixed(0)} followers`}
            >
              {compact
                ? formatNumberCompact(followers)
                : formatNumber(followers, 2)}
            </div>
            {followersPerSecond > 0 && (
              <div className="text-xs text-success">
                +{formatNumber(followersPerSecond, 1)}/s
              </div>
            )}
          </div>
        </div>

        {/* Vertical Divider */}
        <div
          className="hidden sm:block w-px h-12 bg-border"
          aria-hidden="true"
        />

        {/* Awards (Premium Currency) */}
        <div className="flex items-center gap-2 min-w-[120px]">
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
              className="text-lg font-bold number-display truncate text-accent"
              aria-label={`${shards} awards`}
            >
              {shards.toLocaleString()}
            </div>
            <div className="text-xs text-muted">
              {((awardDropRate || 0) * 100).toFixed(1)}% drop rate
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div
          className="hidden sm:block w-px h-12 bg-border"
          aria-hidden="true"
        />

        {/* Notoriety (Secondary Currency) */}
        <div className="flex items-center gap-2 min-w-[120px]">
          <div
            className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center"
            aria-hidden="true"
          >
            <span className="text-2xl" role="img" aria-label="notoriety">
              🔥
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted uppercase tracking-wide font-semibold">
              Notoriety
            </div>
            <div
              className="text-lg font-bold number-display truncate text-accent"
              aria-label={`${notoriety.toFixed(1)} notoriety`}
            >
              {formatNumber(notoriety, 1)}
            </div>
            {notorietyPerSecond > 0 && (
              <div className="text-xs text-success">
                +{formatNumber(notorietyPerSecond, 2)}/s
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Compact View Alternative */}
      {compact && (
        <div className="sm:hidden mt-2 text-center text-xs text-muted">
          <span>Prestige: {reputation}</span>
          <span className="mx-2">•</span>
          <span>Creds: {formatNumber(followers)}</span>
          <span className="mx-2">•</span>
          <span>Awards: {shards}</span>
          <span className="mx-2">•</span>
          <span>Notoriety: {formatNumber(notoriety)}</span>
        </div>
      )}
    </div>
  );
}
