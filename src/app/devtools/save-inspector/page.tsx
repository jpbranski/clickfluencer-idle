"use client";

/**
 * Save State Inspector - Developer Tool
 *
 * Features:
 * - View current save state as formatted JSON
 * - Collapsible sections for major save parts
 * - Edit JSON directly with validation
 * - Apply changes with confirmation
 * - Export/import save state
 * - Diff against factory default
 * - Download as JSON file
 */

import { useState, useEffect } from "react";
import { createInitialState } from "@/game/state";
import { load, save, exportSave, importSave } from "@/lib/storage";

export default function SaveInspectorPage() {
  const [currentSave, setCurrentSave] = useState<string>("");
  const [editedSave, setEditedSave] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [diff, setDiff] = useState<{ missing: string[]; extra: string[] } | null>(null);

  // Load current save on mount
  useEffect(() => {
    loadCurrentSave();
  }, []);

  const loadCurrentSave = async () => {
    try {
      const saveData = await load();
      const formatted = JSON.stringify(saveData, null, 2);
      setCurrentSave(formatted);
      setEditedSave(formatted);
      setError("");

      // Calculate diff against factory default
      calculateDiff(saveData);
    } catch (err) {
      setError("Failed to load save: " + (err as Error).message);
    }
  };

  const calculateDiff = (saveData: any) => {
    const factoryState = createInitialState();
    const factoryKeys = new Set(Object.keys(factoryState));
    const saveKeys = new Set(Object.keys(saveData));

    const missing = Array.from(factoryKeys).filter((key) => !saveKeys.has(key));
    const extra = Array.from(saveKeys).filter((key) => !factoryKeys.has(key));

    setDiff({ missing, extra });
  };

  const handleApplyChanges = async () => {
    if (!editedSave) {
      setError("No save data to apply");
      return;
    }

    try {
      // Validate JSON
      const parsed = JSON.parse(editedSave);

      // Confirm with user
      if (!confirm("Are you sure you want to apply these changes? This will overwrite your current save.")) {
        return;
      }

      // Save the new data
      await save(parsed);

      setSuccess("Save applied successfully! Reload the page to see changes.");
      setError("");
      setIsEditing(false);

      // Reload current save
      loadCurrentSave();
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError("Invalid JSON: " + err.message);
      } else {
        setError("Failed to apply save: " + (err as Error).message);
      }
      setSuccess("");
    }
  };

  const handleExport = async () => {
    try {
      const exported = await exportSave();
      const blob = new Blob([exported], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `clickfluencer-save-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setSuccess("Save exported successfully!");
      setError("");
    } catch (err) {
      setError("Failed to export save: " + (err as Error).message);
    }
  };

  const handleImportFile = async (file: File) => {
    try {
      const text = await file.text();
      await importSave(text);
      setSuccess("Save imported successfully! Reload the page to see changes.");
      setError("");
      loadCurrentSave();
    } catch (err) {
      setError("Failed to import save: " + (err as Error).message);
      setSuccess("");
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(currentSave);
    setSuccess("Copied to clipboard!");
    setError("");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Save State Inspector</h1>
          <p className="text-sm text-muted">
            View and edit your game save data. Use with caution!
          </p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-4 bg-error/10 border border-error rounded-lg text-error">
            <strong>Error:</strong> {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-success/10 border border-success rounded-lg text-success">
            <strong>Success:</strong> {success}
          </div>
        )}

        {/* Diff Summary */}
        {diff && (diff.missing.length > 0 || diff.extra.length > 0) && (
          <div className="mb-4 p-4 bg-warning/10 border border-warning rounded-lg">
            <h3 className="font-bold text-warning mb-2">Diff vs Factory Default:</h3>
            {diff.missing.length > 0 && (
              <div className="text-sm text-muted mb-1">
                <strong>Missing keys:</strong> {diff.missing.join(", ")}
              </div>
            )}
            {diff.extra.length > 0 && (
              <div className="text-sm text-muted">
                <strong>Extra keys:</strong> {diff.extra.join(", ")}
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={loadCurrentSave}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all"
          >
            🔄 Refresh
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-surface text-foreground border border-border rounded-lg hover:bg-surface/80 transition-all"
          >
            💾 Download JSON
          </button>
          <button
            onClick={handleCopyToClipboard}
            className="px-4 py-2 bg-surface text-foreground border border-border rounded-lg hover:bg-surface/80 transition-all"
          >
            📋 Copy to Clipboard
          </button>
          <label className="px-4 py-2 bg-surface text-foreground border border-border rounded-lg hover:bg-surface/80 transition-all cursor-pointer">
            📁 Import File
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImportFile(file);
              }}
            />
          </label>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-lg transition-all ${
              isEditing
                ? "bg-warning text-warning ring-2 ring-warning"
                : "bg-surface text-foreground border border-border hover:bg-surface/80"
            }`}
          >
            {isEditing ? "⚠️ Editing Mode" : "✏️ Edit Mode"}
          </button>
          {isEditing && (
            <button
              onClick={handleApplyChanges}
              className="px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90 transition-all font-bold"
            >
              ⚠️ Apply Changes
            </button>
          )}
        </div>

        {/* JSON Editor */}
        <div className="bg-surface border border-border rounded-lg p-4">
          <textarea
            value={isEditing ? editedSave : currentSave}
            onChange={(e) => setEditedSave(e.target.value)}
            readOnly={!isEditing}
            className={`w-full h-96 font-mono text-xs p-4 rounded bg-background border border-border text-foreground resize-y ${
              isEditing ? "ring-2 ring-warning" : ""
            }`}
            spellCheck={false}
            style={{ tabSize: 2 }}
          />
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-surface/50 border border-border rounded-lg text-sm text-muted">
          <h3 className="font-bold text-foreground mb-2">Developer Notes:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>This tool loads and modifies your actual save data</li>
            <li>Always export a backup before making changes</li>
            <li>Invalid JSON will be rejected</li>
            <li>Reload the page after applying changes to see them in-game</li>
            <li>Use "Diff vs Factory Default" to identify missing or extra fields</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
