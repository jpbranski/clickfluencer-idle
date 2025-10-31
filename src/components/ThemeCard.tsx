'use client';

import { useThemeManager } from '@/hooks/useThemeManager';
import { Theme } from '@/types/theme';

interface ThemeCardProps {
  theme: Theme;
  canAfford: boolean;
  isActive: boolean;
  onPurchase: () => void;
  onActivate: () => void;
  currentShards: number;
}

export function ThemeCard({
  theme,
  canAfford,
  isActive,
  onPurchase,
  onActivate,
  currentShards,
}: ThemeCardProps) {
  const { changeTheme } = useThemeManager();

  const handleActivate = () => {
    // run your game logic
    onActivate();
    // apply the visual theme
    changeTheme(theme.id || theme.displayName);
  };

  const handlePurchase = () => {
    onPurchase();
  };

  const locked = !theme.unlocked;
  const affordable = canAfford && !locked;

  return (
    <div
      className={`
        relative flex flex-col items-start justify-between
        w-full sm:w-60 rounded-xl border-2 p-4
        transition-all duration-200
        bg-[var(--card)] text-[var(--foreground)]
        ${isActive ? 'border-[var(--accent)] shadow-[0_0_12px_var(--accent)]' : 'border-[var(--border)]'}
      `}
    >
      {/* Status Badges */}
      {isActive && (
        <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full bg-[var(--accent)] text-[var(--accent-foreground)]">
          Active
        </span>
      )}
      {theme.unlocked && !isActive && (
        <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full bg-[var(--border)] text-[var(--foreground)]/70">
          Owned
        </span>
      )}

      {/* Theme Preview */}
      <div
        className={`
          h-24 w-full rounded-lg mb-3 border border-[var(--border)]
          bg-gradient-to-br ${theme.preview || 'from-[var(--accent)]/50 to-[var(--card)]'}
        `}
      />

      {/* Title + Description */}
      <h3 className="text-lg font-semibold mb-1">{theme.displayName}</h3>
      <p className="text-sm text-[var(--muted)] leading-snug mb-4">
        {theme.description || ''}
      </p>

      {/* Action Buttons */}
      {theme.unlocked ? (
        <button
          onClick={handleActivate}
          disabled={isActive}
          className={`
            w-full text-sm font-medium rounded-md px-3 py-2 transition
            ${isActive
              ? 'bg-[var(--border)] text-[var(--muted)] cursor-default'
              : 'bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90'}
          `}
        >
          {isActive ? 'Currently Active' : 'Activate'}
        </button>
      ) : (
        <button
          onClick={handlePurchase}
          disabled={!affordable}
          className={`
            w-full text-sm font-medium rounded-md px-3 py-2 transition
            ${affordable
              ? 'bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90'
              : 'bg-[var(--border)] text-[var(--muted)] cursor-not-allowed'}
          `}
        >
          {affordable ? `Unlock (${theme.cost} 💎)` : `Need ${theme.cost - currentShards} more 💎`}
        </button>
      )}
    </div>
  );
}
