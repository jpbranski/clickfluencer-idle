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
import { getGeneratorCost } from "@/game/state";

interface GeneratorsPanelProps {
  generators: Generator[];
  followers: number;
  followersPerSecond: number;
  onBuyGenerator: (generatorId: string, count?: number) => void;
}

export function GeneratorsPanel({
  generators,
  followers,
  followersPerSecond,
  onBuyGenerator,
}: GeneratorsPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<"content" | "notoriety">("content");

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-foreground">
          Generators
        </h2>
        <p className="text-sm text-muted mb-4">
          Purchase automated systems to generate resources passively
        </p>

        {/* Sub-Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveSubTab("content")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeSubTab === "content"
                ? "bg-accent text-accent-foreground"
                : "bg-surface text-muted hover:text-foreground"
            }`}
          >
            📈 Content
          </button>
          <button
            onClick={() => setActiveSubTab("notoriety")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeSubTab === "notoriety"
                ? "bg-accent text-accent-foreground"
                : "bg-surface text-muted hover:text-foreground"
            }`}
          >
            😎 Notoriety
          </button>
        </div>
      </div>

      {/* Content Tab */}
      {activeSubTab === "content" && (
        <div className="space-y-3">
          {generators.map((generator) => {
            const cost = getGeneratorCost(generator);
            const totalProduction =
              generator.baseFollowersPerSecond * generator.count;
            const canAfford = followers >= cost;

            return (
              <GeneratorCard
                key={generator.id}
                generator={{ ...generator, cost, totalProduction }}
                canAfford={canAfford}
                onBuy={(count) => onBuyGenerator(generator.id, count)}
                followersPerSecond={followersPerSecond}
                currentFollowers={followers}
              />
            );
          })}
        </div>
      )}

      {/* Notoriety Tab - Empty for now */}
      {activeSubTab === "notoriety" && (
        <div className="text-center p-12 bg-surface rounded-lg border border-border">
          <div className="text-4xl mb-3">😎</div>
          <div className="text-lg font-semibold text-muted-foreground">
            Coming Soon!
          </div>
          <div className="text-sm text-muted mt-2">
            Notoriety generators will be added in a future update
          </div>
        </div>
      )}
    </div>
  );
}
