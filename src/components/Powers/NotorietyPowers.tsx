"use client";

/**
 * NotorietyPowers Component
 *
 * Displays placeholder Notoriety power unlocks.
 * Gated by notoriety thresholds.
 *
 * v1.0.0 - Placeholders only
 */

import { WHISPER_NETWORK_THRESHOLD, BLUE_CHECK_ENERGY_THRESHOLD } from "@/game/balance";

interface NotorietyPowersProps {
  notoriety: number;
}

export function NotorietyPowers({ notoriety }: NotorietyPowersProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Notoriety Powers</h2>
      <p className="text-sm text-muted mb-6">
        Unlock special powers with Notoriety. Coming soon!
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <PowerCard
          title="Whisper Network"
          description="Tap into the underground network of influencers. Gain access to exclusive collaboration opportunities."
          icon="🤫"
          threshold={WHISPER_NETWORK_THRESHOLD}
          currentNotoriety={notoriety}
          flavorText="They say knowledge is power. But connections? That's real influence."
        />

        <PowerCard
          title="Blue Check Energy"
          description="Harness the power of verified status. Your posts carry more weight and reach further."
          icon="✓"
          threshold={BLUE_CHECK_ENERGY_THRESHOLD}
          currentNotoriety={notoriety}
          flavorText="You don't need the checkmark when you've got the aura."
        />
      </div>
    </div>
  );
}

interface PowerCardProps {
  title: string;
  description: string;
  icon: string;
  threshold: number;
  currentNotoriety: number;
  flavorText: string;
}

function PowerCard({
  title,
  description,
  icon,
  threshold,
  currentNotoriety,
  flavorText,
}: PowerCardProps) {
  const unlocked = currentNotoriety >= threshold;
  const progress = Math.min(100, (currentNotoriety / threshold) * 100);

  return (
    <div
      className={`
        relative p-6 rounded-lg border
        ${unlocked
          ? "bg-surface border-accent"
          : "bg-surface/50 border-border"
        }
        transition-all
      `}
    >
      {/* Coming Soon Badge */}
      <div className="absolute top-2 right-2 px-2 py-1 rounded bg-warning/20 text-warning text-xs font-semibold">
        Coming Soon
      </div>

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 text-4xl opacity-50">{icon}</div>

        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-sm text-muted mb-3">{description}</p>
          <p className="text-xs italic text-muted/70 mb-4">&ldquo;{flavorText}&rdquo;</p>

          {/* Progress bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-mono">{currentNotoriety.toFixed(1)} / {threshold}</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${unlocked ? "bg-accent" : "bg-muted"}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {unlocked ? (
            <div className="text-sm text-accent font-semibold">Unlocked (Coming Soon)</div>
          ) : (
            <div className="text-sm text-muted">
              Need {(threshold - currentNotoriety).toFixed(1)} more Notoriety
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
