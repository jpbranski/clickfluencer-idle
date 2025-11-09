"use client";

import { memo } from "react";
import { formatNumber } from "@/game/format";
import { NotorietyUpgrade } from "@/data/notoriety";

interface NotorietyUpgradeCardProps {
  upgrade: NotorietyUpgrade & {
    level: number;
    cost: number;
    canPurchase: boolean;
    isMaxed: boolean;
    isInfinite: boolean;
  };
  onPurchase: () => void;
}

export const NotorietyUpgradeCard = memo(function NotorietyUpgradeCard({
  upgrade,
  onPurchase,
}: NotorietyUpgradeCardProps) {
  const getEffectIcon = (type: string) => {
    switch (type) {
      case "credBoost":
        return "💰";
      case "notorietyBoost":
        return "🌟";
      case "cacheValue":
        return "💎";
      case "dramaBoost":
        return "🎭";
      case "influencerEndorsement":
        return "🤝";
      default:
        return "⚡";
    }
  };

  const getEffectDescription = () => {
    const { effect, level } = upgrade;
    const totalBonus = effect.value * level;

    switch (effect.type) {
      case "credBoost":
        return `+${(totalBonus * 100).toFixed(0)}% Creds production`;
      case "notorietyBoost":
        return `+${(totalBonus * 100).toFixed(0)}% Notoriety production`;
      case "cacheValue":
        return `+${(totalBonus * 100).toFixed(0)}% Cred Cache value`;
      case "dramaBoost":
        return `+${(totalBonus * 100).toFixed(1)}% global bonus`;
      case "influencerEndorsement":
        return `+${(totalBonus * 100).toFixed(0)}% prestige gain`;
      default:
        return "Unknown effect";
    }
  };

  return (
    <div
      className={`p-4 rounded-lg border transition-all ${
        upgrade.isMaxed
          ? "bg-surface border-border opacity-60"
          : upgrade.canPurchase
          ? "bg-card border-accent hover:border-accent/80 shadow-md"
          : "bg-surface border-border opacity-75"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getEffectIcon(upgrade.effect.type)}</span>
          <h3 className="font-semibold text-foreground">{upgrade.name}</h3>
        </div>
        {upgrade.isInfinite && (
          <div className="px-2 py-1 rounded bg-accent/20 text-accent text-xs font-bold">
            ∞
          </div>
        )}
        {!upgrade.isInfinite && (
          <div className="text-sm font-bold text-accent">
            {upgrade.level}/{upgrade.cap}
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-muted mb-2">{upgrade.description}</p>

      {/* Current Effect */}
      {upgrade.level > 0 && (
        <div className="mb-3 p-2 rounded bg-accent/10 border border-accent/30">
          <div className="text-xs text-muted mb-1">Current Effect:</div>
          <div className="text-sm font-semibold text-accent">
            {getEffectDescription()}
          </div>
        </div>
      )}

      {/* Purchase Button or Maxed Status */}
      {upgrade.isMaxed ? (
        <div className="w-full py-2 px-4 rounded-lg bg-surface text-muted text-center font-semibold">
          Maxed Out
        </div>
      ) : (
        <button
          onClick={onPurchase}
          disabled={!upgrade.canPurchase}
          className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
            upgrade.canPurchase
              ? "bg-accent text-accent-foreground hover:bg-accent/90"
              : "bg-surface text-muted cursor-not-allowed"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span>
              {upgrade.level > 0
                ? upgrade.isInfinite
                  ? `Level ${upgrade.level + 1}`
                  : `Tier ${upgrade.level + 1}`
                : "Buy"}
            </span>
            <span className="font-bold">
              {formatNumber(upgrade.cost)} 🔥
            </span>
          </div>
        </button>
      )}
    </div>
  );
});
