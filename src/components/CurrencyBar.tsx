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
      {/* Single-Line Currency HUD - Option C Game Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 px-4 py-3 bg-surface backdrop-blur-sm border border-border rounded-lg shadow-lg transition-colors">

        {/* Prestige */}
        <div
          className="flex items-center gap-2 min-w-0 cursor-help group"
          title="Prestige level"
        >
          <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center">
            <span className="text-xl md:text-2xl">⭐</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] md:text-xs text-muted uppercase tracking-wide font-semibold">
              Prestige
            </div>
            <div className="text-base md:text-lg font-bold font-mono truncate text-accent">
              {prestige}
            </div>
          </div>
        </div>

        {/* Creds */}
        <div
          className="flex items-center gap-2 min-w-0 cursor-help group"
          title={`${formatNumber(creds)} creds\n${displayCredsPerSecond >= 0 ? '+' : ''}${formatNumber(displayCredsPerSecond, 1)}/s`}
        >
          <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <span className="text-xl md:text-2xl">👥</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] md:text-xs text-muted uppercase tracking-wide font-semibold">
              Creds
            </div>
            <div className="text-base md:text-lg font-bold font-mono truncate">
              {compact ? formatNumberCompact(creds) : formatNumber(creds, 2)}
            </div>
            <div className={`text-[10px] md:text-xs font-mono leading-none ${displayCredsPerSecond >= 0 ? "text-success" : "text-warning"}`}>
              {displayCredsPerSecond >= 0 ? "+" : ""}{formatNumberCompact(displayCredsPerSecond)}/s
            </div>
          </div>
        </div>

        {/* Awards */}
        <div
          className="flex items-center gap-2 min-w-0 cursor-help group"
          title={`${awards} awards\n${((awardDropRate || 0) * 100).toFixed(1)}% drop rate`}
        >
          <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
            <span className="text-xl md:text-2xl">💎</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] md:text-xs text-muted uppercase tracking-wide font-semibold">
              Awards
            </div>
            <div className="text-base md:text-lg font-bold font-mono truncate text-accent">
              {awards.toLocaleString()}
            </div>
            <div className="text-[10px] md:text-xs text-muted font-mono leading-none">
              {((awardDropRate || 0) * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Notoriety */}
        <div
          className="flex items-center gap-2 min-w-0 cursor-help group"
          title={`${safeNotoriety.toFixed(2)} notoriety\n${safeNotorietyPerSecond > 0 ? `+${safeNotorietyPerSecond.toFixed(3)}/s` : safeNotoriety > 0 ? 'Paused (no creds)' : 'Inactive'}`}
        >
          <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
            <span className="text-xl md:text-2xl">😎</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] md:text-xs text-muted uppercase tracking-wide font-semibold">
              Notoriety
            </div>
            <div className="text-base md:text-lg font-bold font-mono truncate text-accent">
              {safeNotoriety.toFixed(2)}
            </div>
            {safeNotorietyPerSecond > 0 && (
              <div className="text-[10px] md:text-xs text-success font-mono leading-none">
                +{safeNotorietyPerSecond.toFixed(2)}/s
              </div>
            )}
            {safeNotorietyPerSecond === 0 && safeNotoriety > 0 && (
              <div className="text-[10px] md:text-xs text-warning font-mono leading-none">
                Paused
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
