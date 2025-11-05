"use client";

/**
 * BottomNav.tsx - Fixed Bottom Navigation for Mobile Game Tabs
 *
 * Features:
 * - Fixed bottom navigation on mobile
 * - Shows: Generators (hidden) | Upgrades | Themes | Achievements
 * - Always visible on mobile, hidden on desktop (lg+)
 */

interface BottomNavProps {
  activeTab: "generators" | "upgrades" | "themes" | "achievements";
  onTabChange: (tab: "generators" | "upgrades" | "themes" | "achievements") => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    {
      id: "generators" as const,
      label: "Generators",
      icon: "📈",
      hidden: true // Hidden for now, but present in DOM
    },
    {
      id: "upgrades" as const,
      label: "Upgrades",
      icon: "⚡",
      hidden: false
    },
    {
      id: "themes" as const,
      label: "Themes",
      icon: "🎨",
      hidden: false
    },
    {
      id: "achievements" as const,
      label: "Achievements",
      icon: "🏆",
      hidden: false
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border shadow-lg lg:hidden"
      role="navigation"
      aria-label="Game navigation"
    >
      <div className="grid grid-cols-3 gap-1 px-2 py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg
              font-semibold text-xs transition-colors
              ${activeTab === tab.id
                ? "bg-accent text-accent-foreground"
                : "hover:bg-muted text-muted-foreground"
              }
              ${tab.hidden ? "hidden" : ""}
            `}
            aria-label={tab.label}
            aria-current={activeTab === tab.id ? "page" : undefined}
          >
            <span className="text-xl" aria-hidden="true">{tab.icon}</span>
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
