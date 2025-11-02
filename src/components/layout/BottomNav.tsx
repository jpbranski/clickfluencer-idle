"use client";

/**
 * BottomNav - Mobile Bottom Navigation
 *
 * Fixed bottom icon navigation for mobile devices.
 * Opens slide-up sheet when tapped.
 */

interface BottomNavProps {
  activeTab: "upgrades" | "themes" | "achievements" | "settings";
  onTabClick: (tab: "upgrades" | "themes" | "achievements" | "settings") => void;
}

export function BottomNav({ activeTab, onTabClick }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-2xl">
      <div className="flex items-center justify-around h-16">
        <button
          onClick={() => onTabClick("upgrades")}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === "upgrades"
              ? "bg-accent/10 text-accent"
              : "text-muted hover:text-foreground"
          }`}
        >
          <span className="text-2xl mb-1">⚡</span>
          <span className="text-xs font-semibold">Upgrades</span>
        </button>
        <button
          onClick={() => onTabClick("themes")}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === "themes"
              ? "bg-accent/10 text-accent"
              : "text-muted hover:text-foreground"
          }`}
        >
          <span className="text-2xl mb-1">🎨</span>
          <span className="text-xs font-semibold">Themes</span>
        </button>
        <button
          onClick={() => onTabClick("achievements")}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === "achievements"
              ? "bg-accent/10 text-accent"
              : "text-muted hover:text-foreground"
          }`}
        >
          <span className="text-2xl mb-1">🏆</span>
          <span className="text-xs font-semibold">Achievements</span>
        </button>
        <button
          onClick={() => onTabClick("settings")}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === "settings"
              ? "bg-accent/10 text-accent"
              : "text-muted hover:text-foreground"
          }`}
        >
          <span className="text-2xl mb-1">⚙️</span>
          <span className="text-xs font-semibold">Settings</span>
        </button>
      </div>
    </nav>
  );
}
