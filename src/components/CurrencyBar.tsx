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
      {/* Desktop: Single-line HUD */}
      <div className="hidden lg:flex items-center gap-4">
        {/* Prestige */}
        <div className="flex items-center gap-2 min-w-[140px]" title={`Prestige Level: ${prestige}`}>
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center">
            <span className="text-lg">⭐</span>
          </div>
          <div className="flex-1">
            <div className="text-[10px] text-muted uppercase tracking-wide font-semibold">Prestige</div>
            <div className="text-sm font-bold font-mono text-accent">{prestige}</div>
          </div>
        </div>

        {/* Creds */}
        <div className="flex items-center gap-2 min-w-[180px]" title={`Creds: ${formatNumber(creds)}\nPer Second: ${displayCredsPerSecond >= 0 ? "+" : ""}${formatNumber(displayCredsPerSecond)}/s`}>
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <span className="text-lg">👥</span>
          </div>
          <div className="flex-1">
            <div className="text-[10px] text-muted uppercase tracking-wide font-semibold">Creds</div>
            <div className="text-sm font-bold font-mono truncate">{formatNumberCompact(creds)}</div>
            {displayCredsPerSecond !== 0 && (
              <div className={`text-[10px] font-mono ${displayCredsPerSecond >= 0 ? "text-success" : "text-warning"}`}>
                {displayCredsPerSecond >= 0 ? "+" : ""}{formatNumberCompact(displayCredsPerSecond)}/s
              </div>
            )}
          </div>
        </div>

        {/* Awards */}
        <div className="flex items-center gap-2 min-w-[140px]" title={`Awards: ${awards}\nDrop Rate: ${((awardDropRate || 0) * 100).toFixed(1)}%`}>
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
            <span className="text-lg">💎</span>
          </div>
          <div className="flex-1">
            <div className="text-[10px] text-muted uppercase tracking-wide font-semibold">Awards</div>
            <div className="text-sm font-bold font-mono text-accent">{awards}</div>
          </div>
        </div>

        {/* Notoriety */}
        <div className="flex items-center gap-2 min-w-[160px]" title={`Notoriety: ${safeNotoriety.toFixed(2)}\nPer Second: +${safeNotorietyPerSecond.toFixed(3)}/s`}>
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
            <span className="text-lg">😎</span>
          </div>
          <div className="flex-1">
            <div className="text-[10px] text-muted uppercase tracking-wide font-semibold">Notoriety</div>
            <div className="text-sm font-bold font-mono text-accent">{safeNotoriety.toFixed(2)}</div>
            {safeNotorietyPerSecond > 0 && (
              <div className="text-[10px] text-success font-mono">+{safeNotorietyPerSecond.toFixed(2)}/s</div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile/Tablet: Grid Layout */}
      <div className="lg:hidden grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Prestige */}
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center">
            <span className="text-2xl">⭐</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted uppercase tracking-wide font-semibold">Prestige</div>
            <div className="text-lg font-bold font-mono number-display truncate text-accent">{prestige}</div>
          </div>
        </div>

        {/* Creds */}
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <span className="text-2xl">👥</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted uppercase tracking-wide font-semibold">Creds</div>
            <div className="text-lg font-bold font-mono number-display truncate">{formatNumberCompact(creds)}</div>
            {displayCredsPerSecond !== 0 && (
              <div className={`text-xs font-mono ${displayCredsPerSecond >= 0 ? "text-success" : "text-warning"}`}>
                {displayCredsPerSecond >= 0 ? "+" : ""}{formatNumberCompact(displayCredsPerSecond)}/s
              </div>
            )}
          </div>
        </div>

        {/* Awards */}
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
            <span className="text-2xl">💎</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted uppercase tracking-wide font-semibold">Awards</div>
            <div className="text-lg font-bold font-mono number-display truncate text-accent">{awards}</div>
          </div>
        </div>

        {/* Notoriety */}
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
            <span className="text-2xl">😎</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted uppercase tracking-wide font-semibold">Notoriety</div>
            <div className="text-lg font-bold font-mono number-display truncate text-accent">{safeNotoriety.toFixed(2)}</div>
            {safeNotorietyPerSecond > 0 && (
              <div className="text-xs text-success font-mono">+{safeNotorietyPerSecond.toFixed(2)}/s</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
