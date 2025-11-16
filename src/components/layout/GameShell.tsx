"use client";

/**
 * GameShell - Cardless Feed Layout (Option A)
 *
 * Desktop: Centered vertical feed with floating tabs
 * Mobile: Single column with horizontal scrolling tabs + bottom nav
 */

import { ReactNode, useState } from "react";
import { BottomNav } from "./BottomNav";

interface GameShellProps {
  children: ReactNode;
  currencyBar: ReactNode;
  quickStats: ReactNode;
  shareButtons: ReactNode;
  generatorsTab: ReactNode;
  upgradesTab: ReactNode;
  themesTab: ReactNode;
  achievementsTab: ReactNode;
  settingsButton: ReactNode;
  onShowSettings: () => void;
}

export function GameShell({
  children,
  currencyBar,
  quickStats,
  shareButtons,
  generatorsTab,
  upgradesTab,
  themesTab,
  achievementsTab,
  settingsButton,
  onShowSettings,
}: GameShellProps) {
  const [activeTab, setActiveTab] = useState<"generators" | "upgrades" | "themes" | "achievements" | "settings">("generators");

  return (
    <div className="min-h-screen">
      {/* Desktop Layout - Centered Feed */}
      <div className="hidden lg:block">
        {/* Sticky HUD at top */}
        <div className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border shadow-lg">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-accent">Clickfluencer</h1>
              {settingsButton}
            </div>
            {currencyBar}
          </div>
        </div>

        {/* Main Content - Centered */}
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Floating Centered Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex gap-3 p-2 rounded-2xl bg-surface/50 backdrop-blur-sm border border-border shadow-lg">
              <button
                onClick={() => setActiveTab("generators")}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === "generators"
                    ? "bg-accent text-accent-foreground shadow-md"
                    : "hover:bg-surface text-foreground"
                }`}
              >
                📈 Generators
              </button>
              <button
                onClick={() => setActiveTab("upgrades")}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === "upgrades"
                    ? "bg-accent text-accent-foreground shadow-md"
                    : "hover:bg-surface text-foreground"
                }`}
              >
                ⚡ Upgrades
              </button>
              <button
                onClick={() => setActiveTab("themes")}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === "themes"
                    ? "bg-accent text-accent-foreground shadow-md"
                    : "hover:bg-surface text-foreground"
                }`}
              >
                🎨 Themes
              </button>
              <button
                onClick={() => setActiveTab("achievements")}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === "achievements"
                    ? "bg-accent text-accent-foreground shadow-md"
                    : "hover:bg-surface text-foreground"
                }`}
              >
                🏆 Achievements
              </button>
            </div>
          </div>

          {/* Feed - Tab Content */}
          <div className="mb-12">
            {activeTab === "generators" && generatorsTab}
            {activeTab === "upgrades" && upgradesTab}
            {activeTab === "themes" && themesTab}
            {activeTab === "achievements" && achievementsTab}
            {activeTab === "settings" && (
              <div className="text-center p-8">
                <button
                  onClick={onShowSettings}
                  className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Open Settings
                </button>
              </div>
            )}
          </div>

          {/* POST Button - Center-aligned under feed */}
          <div className="flex justify-center mb-12">
            {children}
          </div>

          {/* Quick Stats Panel */}
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-md">
              {quickStats}
            </div>
          </div>

          {/* Share Panel */}
          <div className="flex justify-center mb-8">
            <div className="p-6 bg-card rounded-lg border border-border shadow-lg">
              {shareButtons}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Vertical Stack + Bottom Nav */}
      <div className="lg:hidden min-h-screen flex flex-col pb-20">
        {/* Sticky Mobile HUD */}
        <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-lg border-b border-border shadow-lg">
          <div className="px-4 py-3 flex items-center justify-between">
            <h1 className="text-xl font-bold text-accent">Clickfluencer</h1>
            {settingsButton}
          </div>
          <div className="px-4 pb-3">
            {currencyBar}
          </div>
        </header>

        {/* Horizontal Scrolling Tabs for Mobile */}
        <div className="sticky top-[120px] z-30 bg-card/80 backdrop-blur-sm border-b border-border px-2 py-2 overflow-x-auto mobile-tabs-scroll">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setActiveTab("generators")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === "generators"
                  ? "bg-accent text-accent-foreground shadow-md"
                  : "bg-surface text-foreground"
              }`}
            >
              📈 Generators
            </button>
            <button
              onClick={() => setActiveTab("upgrades")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === "upgrades"
                  ? "bg-accent text-accent-foreground shadow-md"
                  : "bg-surface text-foreground"
              }`}
            >
              ⚡ Upgrades
            </button>
            <button
              onClick={() => setActiveTab("themes")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === "themes"
                  ? "bg-accent text-accent-foreground shadow-md"
                  : "bg-surface text-foreground"
              }`}
            >
              🎨 Themes
            </button>
            <button
              onClick={() => setActiveTab("achievements")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === "achievements"
                  ? "bg-accent text-accent-foreground shadow-md"
                  : "bg-surface text-foreground"
              }`}
            >
              🏆 Achievements
            </button>
          </div>
        </div>

        {/* Main Content Area - Feed */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {activeTab === "generators" && generatorsTab}
          {activeTab === "upgrades" && upgradesTab}
          {activeTab === "themes" && themesTab}
          {activeTab === "achievements" && achievementsTab}
        </div>

        {/* POST Button - Mobile (65-75% width, centered) */}
        <div className="flex justify-center px-4 mb-6">
          <div className="w-3/4">
            {children}
          </div>
        </div>

        {/* Quick Stats - Stacked */}
        <div className="px-4 mb-6">
          {quickStats}
        </div>

        {/* Share Panel - Stacked */}
        <div className="px-4 mb-6">
          <div className="p-4 bg-card rounded-lg border border-border shadow-lg">
            {shareButtons}
          </div>
        </div>

        {/* Bottom Navigation - Always Visible */}
        <BottomNav
          activeTab={activeTab}
          onTabClick={setActiveTab}
        />
      </div>
    </div>
  );
}
