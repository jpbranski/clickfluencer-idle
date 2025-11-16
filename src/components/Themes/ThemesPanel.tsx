"use client";

/**
 * ThemesPanel - Themes Tab Content
 *
 * Displays theme cards with unlock/activate functionality.
 */

import { ThemeCard } from "@/components/ThemeCard";
import { canAffordAwards, Theme } from "@/game/state";

interface ThemesPanelProps {
  themes: Theme[];
  awards: number;
  activeThemeId: string;
  onPurchaseTheme: (id: string) => void;
  onActivateTheme: (id: string) => void;
}

export function ThemesPanel({
  themes,
  awards,
  activeThemeId,
  onPurchaseTheme,
  onActivateTheme,
}: ThemesPanelProps) {
  return (
    <div className="space-y-4">
      {/* Theme Grid */}
      <div className="grid grid-cols-1 gap-4">
        {themes.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={{
              ...theme,
              displayName: theme.name,
            }}
            canAfford={canAffordAwards(awards, theme.cost)}
            isActive={theme.id === activeThemeId}
            onPurchase={() => onPurchaseTheme(theme.id)}
            onActivate={() => onActivateTheme(theme.id)}
            currentShards={awards}
          />
        ))}
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-lg bg-surface/50 border border-border text-sm">
        <div className="flex items-start gap-3 text-sm text-muted">
          <span className="text-2xl">💡</span>
          <div>
            <div className="font-semibold text-foreground mb-2 text-base">
              How to earn Awards:
            </div>
            <p className="leading-relaxed">
              Awards have a small chance to drop from each click. Keep
              clicking to collect them!
              <br />
              <strong>Bonuses are permanent</strong> - once you
              unlock a theme, its bonus applies forever, even when
              not active!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
