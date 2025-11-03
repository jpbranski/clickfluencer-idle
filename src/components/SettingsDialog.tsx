"use client";

/**
 * SettingsDialog.tsx - Game Settings Component
 *
 * Features:
 * - Autosave interval setting
 * - Reduced motion preference
 * - Sound/notification toggles
 * - Export/Import save data
 * - Reset game (with confirmation)
 */

import { useState } from "react";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    autoSave: boolean;
    showNotifications: boolean;
    soundEnabled: boolean;
    offlineProgressEnabled: boolean;
  };
  onSettingChange: (key: string, value: boolean) => void;
  onExport: () => void;
  onImport: (data: string) => void;
  onReset: () => void;
}

export function SettingsDialog({
  isOpen,
  onClose,
  settings,
  onSettingChange,
  onExport,
  onImport,
  onReset,
}: SettingsDialogProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = event.target?.result as string;
            onImport(data);
            setImportError(null);
          } catch (error) {
            setImportError("Invalid save file");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleReset = () => {
    if (showResetConfirm) {
      onReset();
      setShowResetConfirm(false);
      onClose();
    } else {
      setShowResetConfirm(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div
        className="
          relative w-full max-w-lg
          bg-surface
          rounded-xl shadow-2xl
          max-h-[90vh] overflow-y-auto
          motion-reduce:transition-none animate-scale-in
        "
      >
        {/* Header */}
        <div className="sticky top-0 bg-surface border-b border-border px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <h2 id="settings-title" className="text-2xl font-bold">
              ⚙️ Settings
            </h2>
            <button
              onClick={onClose}
              className="
                p-2 rounded-lg
                hover:bg-muted
                transition-colors duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
                motion-reduce:transition-none
              "
              aria-label="Close settings"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Game Settings */}
          <section>
            <h3 className="text-lg font-bold mb-4">Game Settings</h3>
            <div className="space-y-3">
              <SettingToggle
                label="Auto-Save"
                description="Automatically save progress every 5 seconds"
                checked={settings.autoSave}
                onChange={(checked) => onSettingChange("autoSave", checked)}
              />
              <SettingToggle
                label="Offline Progress"
                description="Stores progress for up to 72 hours while you're away"
                checked={settings.offlineProgressEnabled}
                onChange={(checked) =>
                  onSettingChange("offlineProgressEnabled", checked)
                }
              />
            </div>
          </section>

          {/* Display Settings */}
          <section>
            <h3 className="text-lg font-bold mb-4">Display & Notifications</h3>
            <div className="space-y-3">
              <SettingToggle
                label="Show Notifications"
                description="Display toast notifications for events"
                checked={settings.showNotifications}
                onChange={(checked) =>
                  onSettingChange("showNotifications", checked)
                }
              />
              {/* TODO: Sound Effects - Commented out (no audio planned)
              <SettingToggle
                label="Sound Effects"
                description="Play audio feedback for actions"
                checked={settings.soundEnabled}
                onChange={(checked) => onSettingChange("soundEnabled", checked)}
              />
              */}
              <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                <div className="flex items-start gap-2 text-xs text-muted">
                  <span className="text-accent">ℹ️</span>
                  <p>
                    Animations automatically reduce when "Reduce motion" is
                    enabled in your system preferences.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Data Management */}
          <section>
            <h3 className="text-lg font-bold mb-4">Data Management</h3>
            <div className="space-y-3">
              {/* Export */}
              <button
                onClick={onExport}
                className="btn-accent w-full"
              >
                📤 Export Save Data
              </button>

              {/* Import */}
              <button
                onClick={handleImport}
                className="btn-accent w-full"
              >
                📥 Import Save Data
              </button>

              {importError && (
                <div className="text-xs text-error text-center">
                  {importError}
                </div>
              )}

              {/* Reset */}
              <div className="pt-3 border-t border-border">
                {!showResetConfirm ? (
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="
                      w-full px-4 py-3 rounded-lg
                      bg-error hover:bg-error/90 text-foreground
                      font-semibold text-sm
                      transition-colors duration-150 active:scale-95
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error
                      motion-reduce:transition-none
                    "
                  >
                    🗑️ Reset Game
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-error/10 border border-error/20">
                      <p className="text-sm font-semibold text-error mb-1">
                        ⚠️ Are you sure?
                      </p>
                      <p className="text-xs text-muted">
                        This will permanently delete all your progress. This
                        action cannot be undone!
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowResetConfirm(false)}
                        className="btn-muted flex-1"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleReset}
                        className="
                          flex-1 px-4 py-2 rounded-lg
                          bg-error hover:bg-error/90 text-foreground
                          font-semibold text-sm
                          transition-colors duration-150
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error
                          motion-reduce:transition-none
                        "
                      >
                        Yes, Reset
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// Toggle Component
interface SettingToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function SettingToggle({
  label,
  description,
  checked,
  onChange,
}: SettingToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 p-3 rounded-lg hover:bg-surface transition-colors">
      <div className="flex-1">
        <div className="text-sm font-semibold mb-1">{label}</div>
        <div className="text-xs text-muted">
          {description}
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full
          transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
          motion-reduce:transition-none
          ${checked ? "bg-accent" : "bg-muted"}
        `}
        role="switch"
        aria-checked={checked}
        aria-label={label}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full shadow-lg transition-transform duration-200
            motion-reduce:transition-none
            ${checked ? "translate-x-6 bg-background" : "translate-x-1 bg-foreground"}
          `}
        />
      </button>
    </div>
  );
}
