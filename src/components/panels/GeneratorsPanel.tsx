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
    <div className="space-y-6">
      {/* Header - No heavy padding */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 text-foreground">
          Generators
        </h2>
        <p className="text-sm text-muted">
          Purchase automated systems to generate resources passively
        </p>
      </div>

      {/* Sub-Tabs - Centered pill style */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setActiveSubTab("content")}
          className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
            activeSubTab === "content"
              ? "bg-accent text-accent-foreground shadow-md"
              : "bg-surface/50 text-muted hover:text-foreground hover:bg-surface"
          }`}
        >
          📈 Content
        </button>
        <button
          onClick={() => setActiveSubTab("notoriety")}
          className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
            activeSubTab === "notoriety"
              ? "bg-accent text-accent-foreground shadow-md"
              : "bg-surface/50 text-muted hover:text-foreground hover:bg-surface"
          }`}
        >
          😎 Notoriety
        </button>
      </div>

      {/* Content Tab - Feed of Cards */}
      {activeSubTab === "content" && (
        <div className="space-y-4 max-w-3xl mx-auto">
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

      {/* Notoriety Tab - Feed of Cards */}
      {activeSubTab === "notoriety" && (
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-sm text-muted">
              Generate Notoriety/second but consume Creds/second as upkeep
            </p>
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
