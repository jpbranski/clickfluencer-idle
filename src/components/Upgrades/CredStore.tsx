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
import { prestigeCost } from "@/game/prestige";
import { formatNumber } from "@/game/format";

interface CredStoreProps {
  upgrades: any[];
  creds: number;
  canPrestige: boolean;
  prestigeGain: number;
  prestige: number;
  onBuyUpgrade: (id: string) => void;
  onPrestige: () => void;
}

export function CredStore({
  upgrades,
  creds,
  canPrestige,
  prestigeGain,
  prestige,
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
      {canPrestige ? (
        // ─────────────────────────────────────────────────────────
        // Prestige Available Banner (existing)
        // ─────────────────────────────────────────────────────────
        <div className="p-6 rounded-lg bg-gradient-to-r from-orange-700 to-orange-600 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="text-2xl font-bold flex items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="text-yellow-300">⭐</span> Prestige Available!
              </div>

              <div className="text-sm mt-1">
                Reset your progress to gain{" "}
                <span className="font-bold">{prestigeGain} Prestige</span>
              </div>

              <div className="text-xs opacity-90 mt-1">
                New bonus: ×{(1 + (prestige + prestigeGain) * 0.1).toFixed(1)} production
              </div>
            </div>

            <button
              onClick={onPrestige}
              className="px-6 py-2 rounded bg-white text-black font-bold shadow hover:bg-gray-200 transition"
            >
              Prestige Now
            </button>
          </div>
        </div>
      ) : (
        // ─────────────────────────────────────────────────────────
        // Next Prestige Banner (new)
        // ─────────────────────────────────────────────────────────
        <div className="p-4 rounded-lg bg-surface border border-border text-center text-muted mb-4">
          <div className="font-bold text-sm">
            Next Prestige: {formatNumber(prestigeCost(prestige))}
          </div>
          <div className="text-xs mt-1 opacity-80">
            Reach the next Cred threshold to prestige again
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
                canAfford={canAfford(creds, upgradeCost)}
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
