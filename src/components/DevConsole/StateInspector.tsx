"use client";

/**
 * StateInspector - Read-only game state viewer
 */

import { memo } from "react";
import { GameState } from "@/game/state";
import { formatNumber } from "@/game/format";

interface StateInspectorProps {
  gameState: GameState;
}

export const StateInspector = memo(function StateInspector({
  gameState,
}: StateInspectorProps) {
  return (
    <div className="p-4 space-y-6">
      {/* Resources */}
      <Section title="💰 Resources">
        <DataRow label="Creds" value={formatNumber(gameState.creds)} />
        <DataRow label="Total Creds Earned" value={formatNumber(gameState.stats?.totalCredsEarned || 0)} />
        <DataRow label="Awards" value={formatNumber(gameState.awards)} />
        <DataRow label="Prestige" value={formatNumber(gameState.prestige)} />
        <DataRow label="Notoriety" value={formatNumber(gameState.notoriety || 0)} />
      </Section>

      {/* Generators */}
      <Section title="⚙️ Generators">
        {gameState.generators.map((gen) => (
          <DataRow
            key={gen.id}
            label={gen.name}
            value={`${gen.count} owned`}
            extra={`${formatNumber(gen.baseFollowersPerSecond)}/s base`}
          />
        ))}
      </Section>


      {/* Upgrades */}
      <Section title="⬆️ Upgrades">
        <DataRow
          label="Purchased Upgrades"
          value={gameState.upgrades?.filter(u => u.purchased).length.toString() || "0"}
        />
      </Section>

      {/* Achievements */}
      <Section title="🏆 Achievements">
        <DataRow
          label="Unlocked"
          value={`${gameState.achievements ? Object.values(gameState.achievements).filter((a: any) => a?.unlocked).length : 0} achievements`}
        />
      </Section>

      {/* Settings & FTUE */}
      <Section title="⚙️ Settings">
        <DataRow
          label="FTUE Completed"
          value={gameState.settings?.ftueCompleted ? "✅ Yes" : "❌ No"}
        />
        <DataRow
          label="Auto-save"
          value={gameState.settings?.autoSave !== false ? "✅ On" : "❌ Off"}
        />
      </Section>


      {/* Debug Info */}
      <Section title="🔧 Debug">
        <DataRow label="Game Version" value={gameState.version || "Unknown"} />
        <DataRow label="Environment" value={process.env.NODE_ENV || "unknown"} />
        <DataRow
          label="State Size"
          value={`${Math.round(JSON.stringify(gameState).length / 1024)} KB`}
        />
      </Section>
    </div>
  );
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border p-3 bg-surface/30">
      <h3 className="font-bold text-sm mb-2 text-accent">{title}</h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function DataRow({
  label,
  value,
  extra,
}: {
  label: string;
  value: string;
  extra?: string;
}) {
  return (
    <div className="flex justify-between items-start gap-2 text-sm">
      <span className="text-muted">{label}:</span>
      <div className="text-right flex-1">
        <div className="font-mono font-semibold">{value}</div>
        {extra && <div className="text-xs text-muted mt-0.5">{extra}</div>}
      </div>
    </div>
  );
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}
