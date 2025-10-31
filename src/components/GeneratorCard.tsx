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
 */

import {
  formatNumber,
  formatRate,
  formatTimeUntilAffordable,
} from "@/game/format";
import { Generator } from "@/game/state";

interface GeneratorCardProps {
  generator: Generator & {
    cost: number;
    totalProduction: number;
  };
  canAfford: boolean;
  onBuy: (count: number) => void;
  followersPerSecond: number;
  currentFollowers: number;
}

export function GeneratorCard({
  generator,
  canAfford,
  onBuy,
  followersPerSecond,
  currentFollowers,
}: GeneratorCardProps) {
  const handleBuy = (count: number) => {
    if (!canAfford && count === 1) return;
    onBuy(count);
  };

  const timeUntilAffordable = !canAfford
    ? formatTimeUntilAffordable(
        generator.cost,
        currentFollowers,
        followersPerSecond,
      )
    : null;

  return (
    <div
      className={`
        relative p-4 rounded-lg border-2 transition-all duration-200
        ${
          generator.unlocked
            ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            : "bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-800 opacity-60"
        }
        ${
          canAfford && generator.unlocked
            ? "shadow-lg hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-600"
            : "shadow"
        }
        motion-reduce:transition-none
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
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Owned: <span className="font-semibold">{generator.count}</span>
              </div>
            ) : (
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Locked
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Production Stats */}
      {generator.unlocked && (
        <div className="mb-3 p-2 rounded bg-gray-50 dark:bg-gray-900/50">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600 dark:text-gray-400">Each:</span>
            <span className="font-semibold">
              {formatRate(generator.baseFollowersPerSecond)}
            </span>
          </div>
          {generator.count > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Total:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
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
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Cost:
            </span>
            <span
              className={`text-sm font-bold number-display ${
                canAfford
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {formatNumber(generator.cost)}
            </span>
          </div>

          {!canAfford &&
            timeUntilAffordable &&
            timeUntilAffordable !== "Can afford now" && (
              <div className="text-xs text-center text-gray-500 dark:text-gray-500">
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
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400
                motion-reduce:transition-none
                ${
                  canAfford
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white active:scale-95"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"
                }
              `}
              aria-label={`Buy one ${generator.name} for ${formatNumber(generator.cost)} followers`}
            >
              Buy 1
            </button>

            {generator.count > 0 && (
              <button
                onClick={() => handleBuy(10)}
                disabled={!canAfford}
                className={`
                  px-3 py-2 rounded font-semibold text-sm
                  transition-all duration-150
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400
                  motion-reduce:transition-none
                  ${
                    canAfford
                      ? "bg-purple-600 hover:bg-purple-700 text-white active:scale-95"
                      : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"
                  }
                `}
                aria-label={`Buy 10 ${generator.name}`}
              >
                ×10
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-3">
          <div className="text-xs text-gray-500 dark:text-gray-500">
            Reach {formatNumber(generator.baseCost)} Creds to unlock
          </div>
        </div>
      )}
    </div>
  );
}
