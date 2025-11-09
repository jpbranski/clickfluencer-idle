"use client";

/**
 * Start Page - Save Slot Management
 *
 * Allows players to manage 3 save slots:
 * - Continue existing games
 * - Create new games
 * - Delete saves
 *
 * v1.0.0 feature
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadSaveSystem, saveSaveSystem, createNewSlot, deleteSlot, switchActiveSlot, getSlotInfo } from "@/lib/storage/slotStorage";
import { SaveSystemState } from "@/game/types";
import { formatNumber } from "@/game/format";

export default function StartPage() {
  const router = useRouter();
  const [saveSystem, setSaveSystem] = useState<SaveSystemState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSaveSystem().then((system) => {
      setSaveSystem(system);
      setLoading(false);
    });
  }, []);

  const handleContinue = async (slotId: 1 | 2 | 3) => {
    if (!saveSystem) return;

    const updated = switchActiveSlot(saveSystem, slotId);
    await saveSaveSystem(updated);

    // Force full page reload to ensure correct slot loads
    window.location.href = "/";
  };

  const handleNewGame = async (slotId: 1 | 2 | 3) => {
    if (!saveSystem) return;

    const updated = createNewSlot(saveSystem, slotId);
    await saveSaveSystem(updated);

    // Force full page reload to ensure new slot loads
    window.location.href = "/";
  };

  const handleDelete = async (slotId: 1 | 2 | 3) => {
    if (!saveSystem) return;

    // Count existing slots
    const existingSlots = Object.keys(saveSystem.slots).length;

    // If only one slot remains, create a new game in Slot 1 instead of deleting
    if (existingSlots === 1) {
      if (!confirm("This is your last save. Delete and start a new game in Slot 1?")) return;
      const updated = createNewSlot(saveSystem, 1);
      setSaveSystem(updated);
      await saveSaveSystem(updated);
      return;
    }

    if (!confirm("Are you sure you want to delete this save? This cannot be undone.")) return;

    const updated = deleteSlot(saveSystem, slotId);
    setSaveSystem(updated);
    await saveSaveSystem(updated);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-4">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Clickfluencer Idle</h1>
        <p className="text-center text-muted mb-8">Select a save slot to continue</p>

        <div className="grid gap-6 md:grid-cols-3">
          {([1, 2, 3] as const).map((slotId) => {
            const slotInfo = saveSystem ? getSlotInfo(saveSystem, slotId) : null;

            return (
              <div
                key={slotId}
                className="bg-surface border border-border rounded-lg p-6 flex flex-col gap-4"
              >
                <h2 className="text-2xl font-bold">Slot {slotId}</h2>

                {slotInfo ? (
                  <>
                    <div className="flex-1 space-y-2 text-sm">
                      <p className="font-mono">
                        <span className="text-muted">Score:</span> {formatNumber(slotInfo.game.stats.totalFollowersEarned)}
                      </p>
                      <p className="font-mono">
                        <span className="text-muted">Prestige:</span> {slotInfo.reputation}
                      </p>
                      <p className="text-xs text-muted mt-4">
                        Created: {new Date(slotInfo.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted">
                        Updated: {new Date(slotInfo.updatedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleContinue(slotId)}
                        className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition"
                      >
                        Continue
                      </button>
                      <button
                        onClick={() => handleDelete(slotId)}
                        className="px-4 py-2 rounded border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition"
                        title="Delete save"
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-1 flex items-center justify-center text-muted">
                      Empty Slot
                    </div>
                    <button
                      onClick={() => handleNewGame(slotId)}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition"
                    >
                      New Game
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-accent hover:underline"
          >
            Back to Game
          </a>
        </div>
      </div>
    </div>
  );
}
