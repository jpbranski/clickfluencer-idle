"use client";

/**
 * CredStore - Cred-based Upgrades
 *
 * Displays all upgrades purchasable with Creds (followers).
 * Includes prestige section.
 */

import { UpgradeCard } from "@/components/UpgradeCard";
import { canAfford } from "@/game/state";
import { getUpgradeCost } from "@/game/actions";

interface CredStoreProps {
  upgrades: any[];
  followers: number;
  canPrestige: boolean;
  reputationGain: number;
  reputation: number;
  onBuyUpgrade: (id: string) => void;
  onPrestige: () => void;
}

export function CredStore({
  upgrades,
  followers,
  canPrestige,
  reputationGain,
  reputation,
  onBuyUpgrade,
  onPrestige,
}: CredStoreProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-foreground">Cred Store</h2>
      <p className="text-sm text-muted mb-6">
        Purchase permanent improvements to boost your production
      </p>

      {/* Prestige Section */}
      {canPrestige && (
        <div className="mb-6 p-6 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="text-2xl font-bold flex items-center justify-center sm:justify-start gap-2 mb-2">
                ⭐ Prestige Available!
              </div>
              <div className="text-sm opacity-90">
                Reset your progress to gain{" "}
                <span className="font-bold">
                  {reputationGain} Reputation
                </span>
              </div>
              <div className="text-xs opacity-75 mt-1">
                New bonus: ×
                {(
                  (1 + (reputation + reputationGain) * 0.1) *
                  100
                ).toFixed(0)}
                % production
              </div>
            </div>
            <button
              onClick={onPrestige}
              className="px-6 py-3 bg-white text-orange-600 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-md"
            >
              Prestige Now
            </button>
          </div>
        </div>
      )}

      {/* Upgrades Grid */}
      <div className="grid grid-cols-1 gap-4">
        {upgrades
          .map((u) => ({
            ...u,
            isPurchased:
              u.purchased ||
              (u.maxTier && u.tier && u.tier >= u.maxTier),
            isInfinite: u.maxLevel === undefined && u.currentLevel !== undefined,
          }))
          .sort((a, b) => {
            // First sort: infinite upgrades come first
            if (a.isInfinite && !b.isInfinite) return -1;
            if (!a.isInfinite && b.isInfinite) return 1;
            // Second sort: unpurchased before purchased
            return Number(a.isPurchased) - Number(b.isPurchased);
          })
          .map((upgrade) => {
            const upgradeCost = getUpgradeCost(upgrade);
            return (
              <UpgradeCard
                key={upgrade.id}
                upgrade={upgrade}
                currentCost={upgradeCost}
                canAfford={canAfford(followers, upgradeCost)}
                onPurchase={() => onBuyUpgrade(upgrade.id)}
              />
            );
          })}
      </div>

      {/* All Purchased Message */}
      {upgrades.every((u) => u.purchased) && (
        <div className="mt-6 text-center p-8 bg-surface rounded-lg border border-border">
          <div className="text-4xl mb-2">🎉</div>
          <div className="text-lg font-bold text-accent">
            All Upgrades Purchased!
          </div>
          <div className="text-sm text-muted mt-2">
            You've unlocked all available upgrades
          </div>
        </div>
      )}
    </div>
  );
}
