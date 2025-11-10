"use client";

/**
 * GeneratorCard.tsx - Content Generator Display Component
 *
 * Shows:
 * - Generator name and icon
 * - Owned count
 * - Production rate
 * - Cost to purchase
 * - Buy button (single or bulk)
 *
 * Optimized with React.memo to prevent unnecessary re-renders
 */

import { memo } from "react";
import {
  formatNumber,
  formatRate,
  formatTimeUntilAffordable,
} from "@/game/format";
import { Generator, getBulkGeneratorCost } from "@/game/state";

interface GeneratorCardProps {
  generator: Generator & {
    cost: number;
    totalProduction: number;
  };
  canAfford: boolean;
  onBuy: (count: number) => void;
  credsPerSecond: number;
  currentCreds: number;
}

export const GeneratorCard = memo(function GeneratorCard({
  generator,
  canAfford,
  onBuy,
  credsPerSecond,
  currentCreds,
}: GeneratorCardProps) {
  // Calculate bulk cost for ×10 purchase
  const bulkCost = getBulkGeneratorCost(generator, 10);
  const canAffordBulk = currentCreds >= bulkCost;

  const handleBuy = (count: number) => {
    if (!canAfford && count === 1) return;
    if (!canAffordBulk && count === 10) return;
    onBuy(count);
  };

  const timeUntilAffordable = !canAfford
    ? formatTimeUntilAffordable(
        generator.cost,
        currentCreds,
        credsPerSecond,
      )
    : null;

  return (
    <div
      className={`
        relative p-4 rounded-lg border-2 transition-all duration-200
        motion-reduce:transition-none
        ${
          generator.unlocked
            ? "bg-surface border-border"
            : "bg-card border-border opacity-60"
        }
        ${
          canAfford && generator.unlocked
            ? "shadow-lg hover:shadow-xl hover:border-[var(--accent)]"
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
                Owned: <span className="font-semibold font-mono">{generator.count}</span>
              </div>
            ) : (
              <div className="text-xs text-muted">
                Locked
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Production Stats */}
      {generator.unlocked && (
        <div className="mb-3 p-2 rounded bg-card">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted">Each:</span>
            <span className="font-semibold font-mono">
              {formatRate(generator.baseFollowersPerSecond)}
            </span>
          </div>
          {generator.count > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-muted">Total:</span>
              <span className="font-semibold font-mono" style={{ color: 'var(--success)' }}>
                {formatRate(generator.totalProduction)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Cost and Buy Button */}
      {generator.unlocked ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">
              Cost:
            </span>
            <span
              className="text-sm font-bold font-mono number-display"
              style={{ color: canAfford ? 'var(--success)' : 'var(--error)' }}
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

          {/* Buy Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleBuy(1)}
              disabled={!canAfford}
              className={`
                flex-1 px-3 py-2 rounded font-semibold text-sm
                transition-all duration-150
                focus-visible:outline-none focus-visible:ring-2 ring-accent
                motion-reduce:transition-none
                ${canAfford ? "active:scale-95" : "cursor-not-allowed"}
                ${canAfford ? "btn-accent" : "btn-muted"}
              `}
              aria-label={`Buy one ${generator.name} for ${formatNumber(generator.cost)} creds`}
            >
              Buy 1
            </button>

            {generator.count > 0 && (
              <button
                onClick={() => handleBuy(10)}
                disabled={!canAffordBulk}
                className={`
                  px-3 py-2 rounded font-semibold text-sm
                  transition-all duration-150
                  focus-visible:outline-none focus-visible:ring-2 ring-accent
                  motion-reduce:transition-none
                  ${canAffordBulk ? "active:scale-95" : "cursor-not-allowed"}
                  ${canAffordBulk ? "btn-accent" : "btn-muted"}
                `}
                aria-label={`Buy 10 ${generator.name}`}
                title={!canAffordBulk ? `Need ${formatNumber(bulkCost)} Creds for ×10` : `Buy 10 for ${formatNumber(bulkCost)} Creds`}
              >
                ×10
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-3">
          <div className="text-xs text-muted">
            Reach <span className="font-mono">{formatNumber(generator.baseCost)}</span> Creds to unlock
          </div>
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison - only re-render if relevant props actually changed
  return (
    prevProps.generator.count === nextProps.generator.count &&
    prevProps.generator.cost === nextProps.generator.cost &&
    prevProps.generator.unlocked === nextProps.generator.unlocked &&
    prevProps.canAfford === nextProps.canAfford &&
    prevProps.currentCreds === nextProps.currentCreds
  );
});
