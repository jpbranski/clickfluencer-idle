"use client";

/**
 * GeneratorsPanel - Content Generators Management
 *
 * Displays available content generators for purchase
 * Has sub-tabs for "Content" and "Notoriety"
 */

import { useState } from "react";
import { Generator } from "@/game/state";
import { GeneratorCard } from "@/components/GeneratorCard";
import { NotorietyGeneratorCard } from "@/components/NotorietyGeneratorCard";
import { getGeneratorCost, canAfford } from "@/game/state";
import { getNotorietyGeneratorsWithStatus } from "@/game/logic/notorietyLogic";
import { GameState } from "@/game/state";

interface GeneratorsPanelProps {
  generators: Generator[];
  creds: number;
  credsPerSecond: number;
  onBuyGenerator: (generatorId: string, count?: number) => void;
  state: GameState;
  onBuyNotorietyGenerator: (generatorId: string) => void;
}

export function GeneratorsPanel({
  generators,
  creds,
  credsPerSecond,
  onBuyGenerator,
  state,
  onBuyNotorietyGenerator,
}: GeneratorsPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<"content" | "notoriety">("content");

  return (
    <div className="space-y-4">
      {/* Sub-Tabs - Compact for sidebar */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveSubTab("content")}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeSubTab === "content"
              ? "bg-accent text-accent-foreground"
              : "bg-surface/50 text-muted hover:bg-surface"
          }`}
        >
          📈 Content
        </button>
        <button
          onClick={() => setActiveSubTab("notoriety")}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeSubTab === "notoriety"
              ? "bg-accent text-accent-foreground"
              : "bg-surface/50 text-muted hover:bg-surface"
          }`}
        >
          😎 Notoriety
        </button>
      </div>

      {/* Content Tab */}
      {activeSubTab === "content" && (
        <div className="space-y-3">
          {generators.map((generator) => {
            const cost = getGeneratorCost(generator);
            const totalProduction =
              generator.baseFollowersPerSecond * generator.count;
            const canAffordGen = creds >= cost;

            return (
              <GeneratorCard
                key={generator.id}
                generator={{ ...generator, cost, totalProduction }}
                canAfford={canAffordGen}
                onBuy={(count) => onBuyGenerator(generator.id, count)}
                credsPerSecond={credsPerSecond}
                currentCreds={creds}
              />
            );
          })}
        </div>
      )}

      {/* Notoriety Tab */}
      {activeSubTab === "notoriety" && (
        <div className="space-y-3">
          <div className="text-sm text-muted mb-3">
            Generate Notoriety/second but consume Creds/second as upkeep
          </div>
          {getNotorietyGeneratorsWithStatus(state).map((generator) => (
            <NotorietyGeneratorCard
              key={generator.id}
              generator={generator}
              canAfford={canAfford(creds, generator.cost)}
              onBuy={() => onBuyNotorietyGenerator(generator.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
