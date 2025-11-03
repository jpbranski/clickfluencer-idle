"use client";

/**
 * GeneratorsPanel - Content Generators Management
 *
 * Displays available content generators for purchase
 */

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
  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-foreground">
          Content Generators
        </h2>
        <p className="text-sm text-muted mb-6">
          Purchase automated content systems to generate followers passively
        </p>
      </div>

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
    </div>
  );
}
