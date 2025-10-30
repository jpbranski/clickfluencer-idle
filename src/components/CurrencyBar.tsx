'use client';

/**
 * CurrencyBar.tsx - Currency Display Component
 * 
 * Displays game currencies with icons and formatted numbers:
 * - Followers (Reach)
 * - Awards (Premium currency from drops)
 */

import { formatNumber, formatNumberCompact } from '@/game/format';

interface CurrencyBarProps {
  followers: number;
  shards: number;
  followersPerSecond: number;
  awardDropRate?: number;
  compact?: boolean;
}

export function CurrencyBar({
  followers,
  shards,
  followersPerSecond,
  awardDropRate,
  compact = false,
}: CurrencyBarProps) {
  return (
    <div className="w-full">
      <div className={`
        flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8
        px-4 py-3 rounded-lg
        bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
        border border-gray-200 dark:border-gray-700
        shadow-lg
      `}>
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
            <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide font-semibold">
              Reach
            </div>
            <div 
              className="text-lg font-bold number-display truncate"
              aria-label={`${followers.toFixed(0)} followers`}
            >
              {compact ? formatNumberCompact(followers) : formatNumber(followers, 2)}
            </div>
            {followersPerSecond > 0 && (
              <div className="text-xs text-green-600 dark:text-green-400">
                +{formatNumber(followersPerSecond, 1)}/s
              </div>
            )}
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="hidden sm:block w-px h-12 bg-gray-300 dark:bg-gray-600" aria-hidden="true" />

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
            <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide font-semibold">
              Awards
            </div>
            <div 
              className="text-lg font-bold number-display truncate text-purple-600 dark:text-purple-400"
              aria-label={`${shards} awards`}
            >
              {shards.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              {(awardDropRate * 100).toFixed(1)}% drop rate
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Compact View Alternative */}
      {compact && (
        <div className="sm:hidden mt-2 text-center text-xs text-gray-600 dark:text-gray-400">
          <span>Reach: {formatNumber(followers)}</span>
          <span className="mx-2">•</span>
          <span>Awards: {shards}</span>
        </div>
      )}
    </div>
  );
}