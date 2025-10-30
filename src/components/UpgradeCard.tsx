'use client';

/**
 * UpgradeCard.tsx - Upgrade Display Component
 * 
 * Shows:
 * - Upgrade name and description
 * - Effect preview
 * - Cost
 * - Purchase button
 * - Purchased state
 */

import { formatNumber, formatMultiplier } from '@/game/format';
import { Upgrade } from '@/game/state';

interface UpgradeCardProps {
  upgrade: Upgrade;
  canAfford: boolean;
  onPurchase: () => void;
}

export function UpgradeCard({ upgrade, canAfford, onPurchase }: UpgradeCardProps) {
  const getEffectIcon = (type: string): string => {
    switch (type) {
      case 'clickMultiplier':
        return '👆';
      case 'generatorMultiplier':
        return '⚡';
      case 'globalMultiplier':
        return '🌟';
      default:
        return '✨';
    }
  };

  const getEffectText = (): string => {
    const { effect } = upgrade;
    switch (effect.type) {
      case 'clickMultiplier':
        return `${formatMultiplier(effect.value)} Click Power`;
      case 'generatorMultiplier':
        return `${formatMultiplier(effect.value)} Generator`;
      case 'globalMultiplier':
        return `${formatMultiplier(effect.value)} All Production`;
      default:
        return 'Special Effect';
    }
  };

  return (
    <div
      className={`
        relative p-4 rounded-lg border-2 transition-all duration-200
        ${upgrade.purchased
          ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
          : canAfford
          ? 'bg-white dark:bg-gray-800 border-purple-300 dark:border-purple-600 shadow-lg hover:shadow-xl'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow'
        }
        motion-reduce:transition-none
      `}
    >
      {/* Purchased Badge */}
      {upgrade.purchased && (
        <div className="absolute top-2 right-2">
          <span
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-500 text-white"
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
          className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-2xl"
          aria-hidden="true"
        >
          {upgrade.name.split(' ')[0]}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold mb-1 truncate">
            {upgrade.name.substring(2)}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
            {upgrade.description}
          </p>
        </div>
      </div>

      {/* Effect Display */}
      <div className="mb-3 p-2 rounded bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600 dark:text-gray-400">Effect:</span>
          <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
            <span className="mr-1" role="img" aria-label="effect">
              {getEffectIcon(upgrade.effect.type)}
            </span>
            {getEffectText()}
          </span>
        </div>
      </div>

      {/* Cost and Purchase */}
      {!upgrade.purchased ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600 dark:text-gray-400">Cost:</span>
            <span
              className={`text-sm font-bold number-display ${
                canAfford
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {formatNumber(upgrade.cost)}
            </span>
          </div>

          <button
            onClick={onPurchase}
            disabled={!canAfford || upgrade.purchased}
            className={`
              w-full px-4 py-2 rounded-lg font-semibold text-sm
              transition-all duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400
              motion-reduce:transition-none
              ${canAfford && !upgrade.purchased
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white active:scale-95'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
              }
            `}
            aria-label={`Purchase ${upgrade.name} for ${formatNumber(upgrade.cost)} followers`}
          >
            {upgrade.purchased ? 'Purchased' : 'Purchase'}
          </button>
        </div>
      ) : (
        <div className="text-center py-2 text-sm font-semibold text-green-600 dark:text-green-400">
          <span role="img" aria-label="check">✓</span> Active
        </div>
      )}
    </div>
  );
}