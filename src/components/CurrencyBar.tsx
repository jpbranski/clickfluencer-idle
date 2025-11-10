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
  creds: number;
  awards: number;
  credsPerSecond: number;
  awardDropRate?: number;
  prestige: number;
  notoriety?: number;
  notorietyPerSecond?: number;
  totalUpkeep?: number;
  netCredsPerSecond?: number;
  compact?: boolean;
}

export function CurrencyBar({
  creds,
  awards,
  credsPerSecond,
  awardDropRate,
  prestige,
  notoriety = 0,
  notorietyPerSecond = 0,
  totalUpkeep: _totalUpkeep = 0,
  netCredsPerSecond,
  compact = false,
}: CurrencyBarProps) {
  // Ensure numeric values with fallbacks for undefined/null
  const safeNotoriety = typeof notoriety === 'number' ? notoriety : 0;
  const safeNotorietyPerSecond = typeof notorietyPerSecond === 'number' ? notorietyPerSecond : 0;

  const displayCredsPerSecond = netCredsPerSecond !== undefined ? netCredsPerSecond : credsPerSecond;
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
              aria-label={`Prestige level ${prestige}`}
            >
              {prestige}
            </div>
          </div>
        </div>

        {/* Creds (Main Currency) */}
        <div className="flex items-center gap-2">
          <div
            className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center"
            aria-hidden="true"
          >
            <span className="text-2xl" role="img" aria-label="creds">
              👥
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted uppercase tracking-wide font-semibold">
              Creds
            </div>
            <div
              className="text-lg font-bold font-mono number-display truncate"
              aria-label={`${creds.toFixed(0)} creds`}
            >
              {compact
                ? formatNumberCompact(creds)
                : formatNumber(creds, 2)}
            </div>
            {displayCredsPerSecond !== 0 && (
              <div
                className={`text-xs font-mono ${displayCredsPerSecond >= 0 ? "text-success" : "text-warning"
                  }`}
              >
                {displayCredsPerSecond >= 0 ? "+" : ""}
                {formatNumber(displayCredsPerSecond, 1)}/s
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
              aria-label={`${awards} awards`}
            >
              {awards.toLocaleString()}
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
              aria-label={`${safeNotoriety.toFixed(3)} notoriety`}
            >
              {safeNotoriety.toFixed(2)}
            </div>
            {safeNotorietyPerSecond > 0 && (
              <div className="text-xs text-success font-mono">
                +{safeNotorietyPerSecond.toFixed(3)}/s
              </div>
            )}
            {safeNotorietyPerSecond === 0 && safeNotoriety > 0 && (
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
          <span>Prestige: {prestige}</span>
          <span className="mx-2">•</span>
          <span>Creds: {formatNumber(creds)}</span>
          <span className="mx-2">•</span>
          <span>Awards: {awards}</span>
          <span className="mx-2">•</span>
          <span>Notoriety: {safeNotoriety.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
}
