"use client";

/**
 * ThemeCard.tsx - Theme Display Component
 *
 * Shows cosmetic themes that can be unlocked with awards
 * Displays bonus multiplier and active state
 * Bonuses are permanent once unlocked!
 */

import { Theme } from "@/game/state";
import { formatPercent } from "@/game/format";

interface ThemeCardProps {
  theme: Theme;
  canAfford: boolean;
  isActive: boolean;
  onPurchase: () => void;
  onActivate: () => void;
  currentShards: number;
}

export function ThemeCard({
  theme,
  canAfford,
  isActive,
  onPurchase,
  onActivate,
  currentShards,
}: ThemeCardProps) {
  const getThemeGradient = (themeId: string): string => {
    switch (themeId) {
      case "light":
        return "from-blue-100 to-blue-300";
      case "default":
        return "from-gray-700 to-gray-900";
      case "neon":
        return "from-pink-400 via-purple-500 to-cyan-500";
      case "nature":
        return "from-green-400 to-emerald-600";
      case "terminal":
        return "from-green-900 to-black";
      case "cherry":
        return "from-pink-300 to-rose-500";
      case "gold":
        return "from-yellow-400 to-amber-600";
      default:
        return "from-purple-400 to-pink-500";
    }
  };

  const bonusPercent = (theme.bonusMultiplier - 1) * 100;

  return (
    <div
      className={`
        relative p-4 rounded-lg border-2 transition-all duration-200
        ${
          isActive
            ? "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-400 dark:border-purple-500 shadow-lg"
            : theme.unlocked
              ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 shadow hover:shadow-lg"
              : "bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-800 opacity-75 shadow"
        }
        motion-reduce:transition-none
      `}
    >
      {/* Active Badge */}
      {isActive && (
        <div className="absolute top-2 right-2">
          <span
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-purple-500 text-white"
            role="status"
            aria-label="Active theme"
          >
            ✓ Active
          </span>
        </div>
      )}

      {/* Unlocked Badge */}
      {theme.unlocked && !isActive && (
        <div className="absolute top-2 right-2">
          <span
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-500 text-white"
            role="status"
            aria-label="Unlocked theme"
          >
            ✓ Owned
          </span>
        </div>
      )}

      {/* Theme Preview */}
      <div
        className={`
          w-full h-24 rounded-lg mb-3 shadow-inner
          bg-gradient-to-br ${getThemeGradient(theme.id)}
          flex items-center justify-center
        `}
        aria-hidden="true"
      >
        <span className="text-4xl">{theme.name.split(" ")[0]}</span>
      </div>

      {/* Theme Info */}
      <div className="mb-3">
        <h3 className="text-sm font-bold mb-1 text-gray-900 dark:text-white">
          {theme.name.substring(2)}
        </h3>
        {bonusPercent > 0 && (
          <div className="text-xs font-semibold mb-1">
            <span className="text-purple-600 dark:text-purple-400">
              +{formatPercent(bonusPercent / 100)} Production
            </span>
          </div>
        )}
        {theme.unlocked && bonusPercent > 0 && (
          <div className="text-xs text-green-600 dark:text-green-400 font-medium">
            🎉 Bonus Active!
          </div>
        )}
      </div>

      {/* Actions */}
      {!theme.unlocked ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">Cost:</span>
            <span
              className={`font-bold ${
                canAfford
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              💎 {theme.cost}
            </span>
          </div>

          {!canAfford && theme.cost > 0 && (
            <div className="text-xs text-center text-gray-500 dark:text-gray-500">
              Need {theme.cost - currentShards} more awards
            </div>
          )}

          <button
            onClick={onPurchase}
            disabled={!canAfford}
            className={`
              w-full px-3 py-2 rounded font-semibold text-sm
              transition-all duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400
              motion-reduce:transition-none
              ${
                canAfford
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white active:scale-95"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"
              }
            `}
            aria-label={`Unlock ${theme.name} for ${theme.cost} awards`}
          >
            Unlock
          </button>
        </div>
      ) : isActive ? (
        <div className="text-center py-2 text-sm font-semibold text-purple-600 dark:text-purple-400">
          Currently Active
        </div>
      ) : (
        <button
          onClick={onActivate}
          className="
            w-full px-3 py-2 rounded font-semibold text-sm
            bg-purple-600 hover:bg-purple-700 text-white
            transition-all duration-150 active:scale-95
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400
            motion-reduce:transition-none
          "
          aria-label={`Activate ${theme.name}`}
        >
          Activate
        </button>
      )}
    </div>
  );
}
