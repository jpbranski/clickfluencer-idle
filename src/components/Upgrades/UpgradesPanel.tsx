"use client";

/**
 * UpgradesPanel - Split Upgrades Tab
 *
 * Sub-tabs:
 * 1. Cred Store - Upgrades purchasable with Creds
 * 2. Notoriety Store - Upgrades purchasable with Notoriety (placeholder)
 */

import { useState } from "react";
import { CredStore } from "./CredStore";
import { NotorietyStore } from "./NotorietyStore";
import { Upgrade, GameState } from "@/game/state";

interface UpgradesPanelProps {
  // Cred Store props
  upgrades: Upgrade[];
  creds: number;
  canPrestige: boolean;
  prestigeGain: number;
  prestige: number;
  onBuyUpgrade: (id: string) => void;
  onPrestige: () => void;

  // Notoriety Store props
  notoriety: number;
  state: GameState;
  onBuyNotorietyUpgrade: (id: string) => void;
}

export function UpgradesPanel({
  upgrades,
  creds,
  canPrestige,
  prestigeGain,
  prestige,
  onBuyUpgrade,
  onPrestige,
  notoriety,
  state,
  onBuyNotorietyUpgrade,
}: UpgradesPanelProps) {
  const [subTab, setSubTab] = useState<"creds" | "notoriety">("creds");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 text-foreground">
          Upgrades
        </h2>
        <p className="text-sm text-muted">
          Permanent improvements to boost your progress
        </p>
      </div>

      {/* Sub-Tab Navigation - Centered pills */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setSubTab("creds")}
          className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
            subTab === "creds"
              ? "bg-accent text-accent-foreground shadow-md"
              : "bg-surface/50 text-foreground hover:bg-surface"
          }`}
        >
          💰 Cred Store
        </button>
        <button
          onClick={() => setSubTab("notoriety")}
          className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
            subTab === "notoriety"
              ? "bg-accent text-accent-foreground shadow-md"
              : "bg-surface/50 text-foreground hover:bg-surface"
          }`}
        >
          😎 Notoriety Store
        </button>
      </div>

      {/* Sub-Tab Content */}
      {subTab === "creds" && (
        <CredStore
          upgrades={upgrades}
          creds={creds}
          canPrestige={canPrestige}
          prestigeGain={prestigeGain}
          prestige={prestige}
          onBuyUpgrade={onBuyUpgrade}
          onPrestige={onPrestige}
        />
      )}

      {subTab === "notoriety" && (
        <NotorietyStore
          notoriety={notoriety}
          state={state}
          onBuyUpgrade={onBuyNotorietyUpgrade}
        />
      )}
    </div>
  );
}
