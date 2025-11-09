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

interface UpgradesPanelProps {
  // Cred Store props
  upgrades: any[];
  followers: number;
  canPrestige: boolean;
  reputationGain: number;
  reputation: number;
  onBuyUpgrade: (id: string) => void;
  onPrestige: () => void;

  // Notoriety Store props
  notoriety: number;
  state: any;
  onBuyNotorietyUpgrade: (id: string) => void;
}

export function UpgradesPanel({
  upgrades,
  followers,
  canPrestige,
  reputationGain,
  reputation,
  onBuyUpgrade,
  onPrestige,
  notoriety,
  state,
  onBuyNotorietyUpgrade,
}: UpgradesPanelProps) {
  const [subTab, setSubTab] = useState<"creds" | "notoriety">("creds");

  return (
    <div className="p-6">
      {/* Sub-Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSubTab("creds")}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
            subTab === "creds"
              ? "bg-accent text-accent-foreground"
              : "bg-surface hover:bg-surface/80 text-foreground"
          }`}
        >
          💰 Cred Store
        </button>
        <button
          onClick={() => setSubTab("notoriety")}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
            subTab === "notoriety"
              ? "bg-accent text-accent-foreground"
              : "bg-surface hover:bg-surface/80 text-foreground"
          }`}
        >
          😎 Notoriety Store
        </button>
      </div>

      {/* Sub-Tab Content */}
      {subTab === "creds" && (
        <CredStore
          upgrades={upgrades}
          followers={followers}
          canPrestige={canPrestige}
          reputationGain={reputationGain}
          reputation={reputation}
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
