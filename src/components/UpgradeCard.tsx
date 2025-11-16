"use client";

/**
 * UpgradeCard.tsx - Upgrade Display Component
 *
 * Shows:
 * - Upgrade name and description
 * - Effect preview
 * - Cost
 * - Purchase button
 * - Purchased state
 *
 * Optimized with React.memo to prevent unnecessary re-renders
 */

import { memo } from "react";
import { formatNumber, formatMultiplier } from "@/game/format";
import { Upgrade } from "@/game/state";

interface UpgradeCardProps {
  upgrade: Upgrade;
  currentCost: number;
  canAfford: boolean;
  onPurchase: () => void;
}

export const UpgradeCard = memo(function UpgradeCard({
  upgrade,
  currentCost,
  canAfford,
  onPurchase,
}: UpgradeCardProps) {
  const isInfinite = upgrade.currentLevel !== undefined;
  const level = upgrade.currentLevel || 0;

  const isTiered = upgrade.tier !== undefined && upgrade.maxTier !== undefined;
  const tier = upgrade.tier || 0;
  const maxTier = upgrade.maxTier || 0;

  const isPurchased =
    upgrade.purchased ||
    (isTiered && tier >= maxTier);

  const getEffectIcon = (type: string): string => {
    switch (type) {
      case "clickMultiplier":
        return "👆";
      case "generatorMultiplier":
        return "⚡";
      case "globalMultiplier":
        return "🌟";
      default:
        return "✨";
    }
  };

  const getEffectText = (): string => {
    const { effect } = upgrade;
    switch (effect.type) {
      case "clickMultiplier":
        return `${formatMultiplier(effect.value)} Click Power`;
      case "generatorMultiplier":
        return `${formatMultiplier(effect.value)} Generator`;
      case "globalMultiplier":
        return `${formatMultiplier(effect.value)} All Production`;
      default:
        return "Special Effect";
    }
  };

  return (
    <div
      className={`
        relative p-4 rounded-xl transition-all duration-200
        motion-reduce:transition-none
        ${
          isPurchased && !isInfinite
            ? "card opacity-40 grayscale"
            : "card-premium"
        }
      `}
    >
      {/* Purchased Badge */}
      {isPurchased && !isInfinite && !isTiered && (
        <div className="absolute top-2 right-2">
          <span
            className="badge-accent"
            role="status"
            aria-label="Purchased"
          >
            ✓ Owned
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent flex items-center justify-center text-2xl text-accent-foreground"
          aria-hidden="true"
        >
          {upgrade.name.split(" ")[0]}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold mb-1 truncate">
            {upgrade.name.substring(2)}
            {isInfinite && level > 0 && (
              <span className="ml-2 text-xs font-normal font-mono" style={{ color: 'var(--accent)' }}>
                Lv.{level}
              </span>
            )}
            {isTiered && (
              <span className="ml-2 text-xs font-normal font-mono" style={{ color: 'var(--accent)' }}>
                Tier {tier}/{maxTier}
              </span>
            )}
          </h3>
          <p className="text-xs text-muted line-clamp-2">
            {upgrade.description}
          </p>
        </div>
      </div>

      {/* Effect Display */}
      <div className="mb-3 p-2 rounded bg-card border border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">
            Effect:
          </span>
          <span className="text-sm font-semibold font-mono" style={{ color: 'var(--accent)' }}>
            <span className="mr-1" role="img" aria-label="effect">
              {getEffectIcon(upgrade.effect.type)}
            </span>
            {getEffectText()}
          </span>
        </div>
      </div>

      {/* Cost and Purchase */}
      {!isPurchased || isInfinite || (isTiered && tier < maxTier) ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">
              Cost:
            </span>
            <span
              className="text-sm font-bold font-mono number-display"
              style={{ color: canAfford ? 'var(--success)' : 'var(--error)' }}
            >
              {formatNumber(currentCost)}
            </span>
          </div>

          <button
            onClick={onPurchase}
            disabled={!canAfford || isPurchased}
            className={`
              w-full px-4 py-2.5 rounded-lg font-semibold text-sm
              transition-all duration-150
              focus-visible:outline-none focus-visible:ring-2 ring-accent
              motion-reduce:transition-none
              ${canAfford && !isPurchased ? "btn-primary" : "btn-muted"}
              ${isPurchased ? "opacity-60" : ""}
            `}
            aria-label={`Purchase ${upgrade.name} for ${formatNumber(currentCost)} followers`}
          >
            {isPurchased ? "Maxed Out" : (isInfinite || isTiered) ? "Upgrade" : "Purchase"}
          </button>
        </div>
      ) : (
        <div className="text-center py-2 text-sm font-semibold" style={{ color: 'var(--success)' }}>
          <span role="img" aria-label="check">
            ✓
          </span>{" "}
          Active
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison - only re-render if relevant props changed
  return (
    prevProps.upgrade.purchased === nextProps.upgrade.purchased &&
    prevProps.upgrade.currentLevel === nextProps.upgrade.currentLevel &&
    prevProps.upgrade.tier === nextProps.upgrade.tier &&
    prevProps.currentCost === nextProps.currentCost &&
    prevProps.canAfford === nextProps.canAfford
  );
});
