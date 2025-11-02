"use client";

/**
 * BottomNav.tsx - Mobile Bottom Navigation
 *
 * Fixed bottom navigation for mobile devices
 * Shows tabs: Generators, Upgrades, Themes
 */

interface BottomNavProps {
  activeTab: "generators" | "upgrades" | "themes";
  onTabChange: (tab: "generators" | "upgrades" | "themes") => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-md border-t border-border flex justify-around py-2 z-50 lg:hidden">
      <button
        onClick={() => onTabChange("generators")}
        className={`flex flex-col items-center justify-center px-4 py-2 transition-colors ${
          activeTab === "generators"
            ? "text-accent"
            : "text-muted hover:text-foreground"
        }`}
        aria-label="Generators"
      >
        <span className="text-xl mb-1">📈</span>
        <span className="text-xs font-medium">Generators</span>
      </button>

      <button
        onClick={() => onTabChange("upgrades")}
        className={`flex flex-col items-center justify-center px-4 py-2 transition-colors ${
          activeTab === "upgrades"
            ? "text-accent"
            : "text-muted hover:text-foreground"
        }`}
        aria-label="Upgrades"
      >
        <span className="text-xl mb-1">⚡</span>
        <span className="text-xs font-medium">Upgrades</span>
      </button>

      <button
        onClick={() => onTabChange("themes")}
        className={`flex flex-col items-center justify-center px-4 py-2 transition-colors ${
          activeTab === "themes"
            ? "text-accent"
            : "text-muted hover:text-foreground"
        }`}
        aria-label="Themes"
      >
        <span className="text-xl mb-1">🎨</span>
        <span className="text-xs font-medium">Themes</span>
      </button>
    </nav>
  );
}
