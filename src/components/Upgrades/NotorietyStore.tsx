"use client";

/**
 * NotorietyStore - Notoriety-based Upgrades
 *
 * Displays notoriety upgrades that can be purchased with Notoriety currency.
 * Includes both infinite (persisting) and capped (resetting) upgrades.
 */

import { NotorietyUpgradeCard } from "@/components/NotorietyUpgradeCard";
import { getNotorietyUpgradesWithStatus } from "@/game/logic/notorietyLogic";
import { GameState } from "@/game/state";

interface NotorietyStoreProps {
  notoriety: number;
  state: GameState;
  onBuyUpgrade: (upgradeId: string) => void;
}

export function NotorietyStore({ notoriety, state, onBuyUpgrade }: NotorietyStoreProps) {
  const upgrades = getNotorietyUpgradesWithStatus(state);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-foreground">Notoriety Store</h2>
      <p className="text-sm text-muted mb-6">
        Spend Notoriety to unlock powerful upgrades. Infinite upgrades (∞) persist through prestige!
      </p>

      {/* Upgrades Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {upgrades
          .sort((a, b) => {
            // Infinite upgrades first
            if (a.isInfinite && !b.isInfinite) return -1;
            if (!a.isInfinite && b.isInfinite) return 1;
            // Unpurchased before maxed
            return Number(a.isMaxed) - Number(b.isMaxed);
          })
          .map((upgrade) => (
            <NotorietyUpgradeCard
              key={upgrade.id}
              upgrade={upgrade}
              onPurchase={() => onBuyUpgrade(upgrade.id)}
            />
          ))}
      </div>
    </div>
  );
}
