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
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 text-foreground">Themes</h2>
        <p className="text-sm text-muted">
          Unlock cosmetic themes with awards. Bonuses apply{" "}
          <strong>permanently</strong> once unlocked!
        </p>
      </div>

      {/* Theme Grid - 2 columns desktop, 1 mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
      <div className="max-w-2xl mx-auto p-5 rounded-xl bg-surface/50 border border-border">
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
