"use client";

/**
 * NotorietyGeneratorCard.tsx - Notoriety Generator Display Component
 *
 * Shows:
 * - Generator name and icon
 * - Owned count / max level
 * - Notoriety production rate per hour
 * - Upkeep cost (followers per second)
 * - Net followers/s impact
 * - Cost to hire
 * - Buy button with risk indicators
 */

import {
  formatNumber,
  formatRate,
  formatTimeUntilAffordable,
} from "@/game/format";
import { NotorietyGenerator } from "@/game/state";

interface NotorietyGeneratorCardProps {
  generator: NotorietyGenerator & {
    cost: number;
    totalNotorietyPerHour: number;
    totalUpkeep: number;
  };
  canAfford: boolean;
  riskLevel: "safe" | "risky" | "blocked";
  reason?: string;
  onBuy: () => void;
  followersPerSecond: number;
  netFollowersPerSecond: number;
  currentFollowers: number;
}

export function NotorietyGeneratorCard({
  generator,
  canAfford,
  riskLevel,
  reason,
  onBuy,
  followersPerSecond,
  netFollowersPerSecond,
  currentFollowers,
}: NotorietyGeneratorCardProps) {
  const isMaxLevel = generator.count >= generator.maxLevel;
  const canPurchase = canAfford && !isMaxLevel && riskLevel !== "blocked";

  const timeUntilAffordable = !canAfford && generator.unlocked
    ? formatTimeUntilAffordable(
        generator.cost,
        currentFollowers,
        followersPerSecond,
      )
    : null;

  // Calculate what net followers/s would be after purchase
  const futureNetFollowersPerSecond = netFollowersPerSecond - generator.upkeep;

  // Determine border color based on risk level
  const borderColorClass =
    riskLevel === "blocked"
      ? "border-[var(--error)]"
      : riskLevel === "risky"
        ? "border-[var(--warning)]"
        : canPurchase
          ? "border-border hover:border-[var(--accent)]"
          : "border-border";

  return (
    <div
      className={`
        relative p-4 rounded-lg border-2 transition-all duration-200
        motion-reduce:transition-none
        ${
          generator.unlocked
            ? "bg-surface"
            : "bg-card opacity-60"
        }
        ${borderColorClass}
        ${
          canPurchase
            ? "shadow-lg hover:shadow-xl"
            : "shadow"
        }
      `}
    >
      {/* Header: Name and Count */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-2xl" role="img" aria-label={generator.name}>
            {generator.name.split(" ")[0]}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold truncate">
              {generator.name.substring(2)}
            </h3>
            {generator.unlocked ? (
              <div className="text-xs text-muted">
                Level:{" "}
                <span className="font-semibold">
                  {generator.count}/{generator.maxLevel}
                </span>
              </div>
            ) : (
              <div className="text-xs text-muted">Locked</div>
            )}
          </div>
        </div>
      </div>

      {/* Production Stats */}
      {generator.unlocked && (
        <div className="mb-3 space-y-2">
          {/* Notoriety Production */}
          <div className="p-2 rounded bg-card">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted">Each:</span>
              <span className="font-semibold" style={{ color: "var(--accent)" }}>
                +{(generator.baseNotorietyPerSecond * 3600).toFixed(1)}/hr notoriety
              </span>
            </div>
            {generator.count > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-muted">Total:</span>
                <span className="font-semibold" style={{ color: "var(--accent)" }}>
                  +{generator.totalNotorietyPerHour.toFixed(1)}/hr notoriety
                </span>
              </div>
            )}
          </div>

          {/* Upkeep Cost */}
          <div className="p-2 rounded bg-card">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted">Upkeep each:</span>
              <span className="font-semibold" style={{ color: "var(--error)" }}>
                -{formatRate(generator.upkeep)}
              </span>
            </div>
            {generator.count > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-muted">Total upkeep:</span>
                <span className="font-semibold" style={{ color: "var(--error)" }}>
                  -{formatRate(generator.totalUpkeep)}
                </span>
              </div>
            )}
          </div>

          {/* Net Impact Indicator */}
          {riskLevel === "risky" && (
            <div className="p-2 rounded bg-warning/10 border border-warning/30">
              <div className="text-xs text-warning text-center font-semibold">
                ⚠️ After hiring: {formatRate(futureNetFollowersPerSecond)} net Clout/s
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cost and Buy Button */}
      {generator.unlocked ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">Cost:</span>
            <span
              className="text-sm font-bold number-display"
              style={{ color: canAfford ? "var(--success)" : "var(--error)" }}
            >
              {formatNumber(generator.cost)}
            </span>
          </div>

          {!canAfford &&
            timeUntilAffordable &&
            timeUntilAffordable !== "Can afford now" && (
              <div className="text-xs text-center text-muted">
                {timeUntilAffordable}
              </div>
            )}

          {/* Buy Button */}
          <button
            onClick={onBuy}
            disabled={!canPurchase}
            className={`
              w-full px-3 py-2 rounded font-semibold text-sm
              transition-all duration-150
              focus-visible:outline-none focus-visible:ring-2 ring-accent
              motion-reduce:transition-none
              ${canPurchase ? "active:scale-95" : "cursor-not-allowed"}
              ${
                isMaxLevel
                  ? "btn-muted"
                  : riskLevel === "blocked"
                    ? "btn-error"
                    : riskLevel === "risky"
                      ? "btn-warning"
                      : canPurchase
                        ? "btn-accent"
                        : "btn-muted"
              }
            `}
            aria-label={`Hire ${generator.name} for ${formatNumber(generator.cost)} followers`}
          >
            {isMaxLevel
              ? "Max Level"
              : riskLevel === "blocked"
                ? "Can't Hire (Low Clout/s)"
                : "Hire"}
          </button>

          {/* Blocked Warning */}
          {riskLevel === "blocked" && reason && (
            <div className="text-xs text-center text-error font-semibold">
              {reason}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-3">
          <div className="text-xs text-muted">
            Reach {formatNumber(generator.baseCost * 0.5)} Creds to unlock
          </div>
        </div>
      )}
    </div>
  );
}
