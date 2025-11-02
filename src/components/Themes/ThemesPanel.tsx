"use client";

/**
 * ThemesPanel - Themes Tab Content
 *
 * Displays theme cards with unlock/activate functionality.
 */

import { ThemeCard } from "@/components/ThemeCard";
import { canAffordShards } from "@/game/state";

interface ThemesPanelProps {
  themes: any[];
  shards: number;
  activeThemeId: string;
  onPurchaseTheme: (id: string) => void;
  onActivateTheme: (id: string) => void;
}

export function ThemesPanel({
  themes,
  shards,
  activeThemeId,
  onPurchaseTheme,
  onActivateTheme,
}: ThemesPanelProps) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2 text-foreground">Themes</h2>
      <p className="text-sm text-muted mb-6">
        Unlock cosmetic themes with awards. Bonuses apply{" "}
        <strong>permanently</strong> once unlocked!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {themes.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={{
              ...theme,
              displayName: theme.name,
            }}
            canAfford={canAffordShards(shards, theme.cost)}
            isActive={theme.id === activeThemeId}
            onPurchase={() => onPurchaseTheme(theme.id)}
            onActivate={() => onActivateTheme(theme.id)}
            currentShards={shards}
          />
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-surface border border-border">
        <div className="flex items-start gap-2 text-sm text-muted">
          <span className="text-accent">💡</span>
          <div>
            <div className="font-semibold text-foreground mb-1">
              How to earn Awards:
            </div>
            <p>
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
