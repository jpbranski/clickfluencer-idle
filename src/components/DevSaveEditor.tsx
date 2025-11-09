"use client";

/**
 * DevSaveEditor Component
 *
 * Developer utility for editing save JSON directly.
 * Accessible from Settings → Advanced.
 *
 * v1.0.0 feature
 */

import { useState } from "react";
import { GameState } from "@/game/state";

interface DevSaveEditorProps {
  currentState: GameState;
  onApply: (newState: GameState) => void;
  onClose: () => void;
}

export function DevSaveEditor({ currentState, onApply, onClose }: DevSaveEditorProps) {
  const [jsonText, setJsonText] = useState(() => JSON.stringify(currentState, null, 2));
  const [error, setError] = useState<string | null>(null);

  const handleValidateAndApply = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setError(null);
      onApply(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
    }
  };

  const handleExport = () => {
    const blob = new Blob([jsonText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clickfluencer-save-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface border border-border rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold">Save Editor</h2>
            <p className="text-sm text-muted">Edit game state JSON directly</p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl hover:text-destructive transition"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Warning */}
        <div className="p-4 bg-warning/10 border-b border-warning/20">
          <p className="text-sm text-warning">
            ⚠️ <strong>Advanced Tool:</strong> Editing save data directly can break your game.
            Make sure to export a backup before making changes!
          </p>
        </div>

        {/* Editor */}
        <div className="flex-1 p-4 overflow-hidden flex flex-col">
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="flex-1 w-full p-4 bg-background border border-border rounded font-mono text-sm resize-none"
            spellCheck={false}
          />

          {error && (
            <div className="mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-border flex gap-3 justify-end">
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded border border-border hover:bg-accent/10 transition"
          >
            Export JSON
          </button>
          <button
            onClick={handleValidateAndApply}
            className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition"
          >
            Validate & Apply
          </button>
        </div>
      </div>
    </div>
  );
}
