"use client";

/**
 * NotorietyStore - Notoriety-based Powers
 *
 * Displays placeholder Notoriety powers/upgrades.
 * v1.0.0 - Coming Soon implementation.
 */

import { NotorietyPowers } from "@/components/Powers/NotorietyPowers";

interface NotorietyStoreProps {
  notoriety: number;
}

export function NotorietyStore({ notoriety }: NotorietyStoreProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-foreground">Notoriety Store</h2>
      <p className="text-sm text-muted mb-6">
        Spend Notoriety to unlock special powers and bonuses
      </p>

      {/* Notoriety Powers Component */}
      <NotorietyPowers notoriety={notoriety} />

      {/* Additional Placeholder Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PlaceholderCard
          title="Shadow Boost"
          description="Mysterious power that amplifies your influence in unexpected ways."
          icon="🌑"
          cost={200}
          currentNotoriety={notoriety}
        />
        <PlaceholderCard
          title="Viral Catalyst"
          description="Turn ordinary content into viral sensations with a single touch."
          icon="🧪"
          cost={500}
          currentNotoriety={notoriety}
        />
      </div>
    </div>
  );
}

interface PlaceholderCardProps {
  title: string;
  description: string;
  icon: string;
  cost: number;
  currentNotoriety: number;
}

function PlaceholderCard({
  title,
  description,
  icon,
  cost,
  currentNotoriety,
}: PlaceholderCardProps) {
  const canAfford = currentNotoriety >= cost;
  const progress = Math.min(100, (currentNotoriety / cost) * 100);

  return (
    <div className="relative p-4 rounded-lg border bg-surface/50 border-border">
      {/* Coming Soon Badge */}
      <div className="absolute top-2 right-2 px-2 py-1 rounded bg-warning/20 text-warning text-xs font-semibold">
        Coming Soon
      </div>

      <div className="flex gap-3">
        <div className="flex-shrink-0 text-3xl opacity-50">{icon}</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-1">{title}</h3>
          <p className="text-xs text-muted mb-3">{description}</p>

          {/* Progress */}
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-mono">{currentNotoriety.toFixed(1)} / {cost}</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${canAfford ? "bg-accent" : "bg-muted"}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {canAfford ? (
            <div className="text-xs text-accent font-semibold">Available (Coming Soon)</div>
          ) : (
            <div className="text-xs text-muted">
              Need {(cost - currentNotoriety).toFixed(1)} more
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
