"use client";

import { formatNumber } from "@/game/format";
import { NotorietyGenerator } from "@/data/notoriety";

interface NotorietyGeneratorCardProps {
  generator: NotorietyGenerator & { count: number; cost: number };
  canAfford: boolean;
  onBuy: () => void;
}

export function NotorietyGeneratorCard({
  generator,
  canAfford,
  onBuy,
}: NotorietyGeneratorCardProps) {
  if (!generator.unlocked) {
    return (
      <div className="p-4 rounded-lg bg-surface border border-border opacity-50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-muted">???</h3>
          <div className="text-2xl">🔒</div>
        </div>
        <p className="text-xs text-muted">Locked</p>
      </div>
    );
  }

  const totalProduction = generator.baseNotorietyPerSecond * generator.count;
  const totalUpkeep = generator.baseUpkeep * generator.count;

  return (
    <div
      className={`p-4 rounded-lg border transition-all ${
        canAfford
          ? "bg-card border-accent hover:border-accent/80 shadow-md"
          : "bg-surface border-border opacity-75"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-foreground">{generator.name}</h3>
        <div className="text-xl font-bold text-accent">
          {generator.count}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-muted mb-3">{generator.description}</p>

      {/* Stats */}
      <div className="space-y-1 mb-3">
        <div className="flex justify-between text-xs">
          <span className="text-muted">Produces:</span>
          <span className="text-success font-semibold">
            +{formatNumber(generator.baseNotorietyPerSecond, 1)} Notoriety/s
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted">Upkeep:</span>
          <span className="text-red-500 font-semibold">
            -{formatNumber(generator.baseUpkeep, 1)} Creds/s
          </span>
        </div>
        {generator.count > 0 && (
          <>
            <div className="flex justify-between text-xs">
              <span className="text-muted">Total Output:</span>
              <span className="text-success font-semibold">
                +{formatNumber(totalProduction, 1)}/s
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted">Total Upkeep:</span>
              <span className="text-red-500 font-semibold">
                -{formatNumber(totalUpkeep, 1)}/s
              </span>
            </div>
          </>
        )}
      </div>

      {/* Purchase Button */}
      <button
        onClick={onBuy}
        disabled={!canAfford}
        className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
          canAfford
            ? "bg-accent text-accent-foreground hover:bg-accent/90"
            : "bg-surface text-muted cursor-not-allowed"
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <span>Buy</span>
          <span className="font-bold">
            {formatNumber(generator.cost)} Creds
          </span>
        </div>
      </button>
    </div>
  );
}
