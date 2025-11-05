"use client";

import { useState, useEffect } from "react";
import { useGame } from "@/hooks/useGame";
import PostButton from "@/components/PostButton";
import { CurrencyBar } from "@/components/CurrencyBar";
import { GeneratorCard } from "@/components/GeneratorCard";
import { UpgradeCard } from "@/components/UpgradeCard";
import { ThemeCard } from "@/components/ThemeCard";
import { SettingsDialog } from "@/components/SettingsDialog";
import { EventToasts } from "@/components/EventToasts";
import { OfflineEarningsModal } from "@/components/OfflineEarningsModal";
import { ShareButtons } from "@/components/ShareButtons";
import { NotorietyGeneratorCard } from "@/components/NotorietyGeneratorCard";
import { NotorietyUpgradeCard } from "@/components/NotorietyUpgradeCard";
import { formatNumber } from "@/game/format";
import { getGeneratorCost, canAfford, canAffordShards } from "@/game/state";
import { getAwardDropRate, getUpgradeCost } from "@/game/actions";
import { themes } from '@/data/themes';
import {
  getNotorietyGeneratorsWithStatus,
  getNotorietyUpgradesWithStatus,
} from "@/game/logic/notorietyLogic";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "generators" | "upgrades" | "notoriety" | "themes"
  >("generators");
  const [showSettings, setShowSettings] = useState(false);

  const {
    state,
    isLoading,
    clickPower,
    followersPerSecond,
    notorietyPerSecond,
    upkeep,
    canPrestige,
    reputationGain,
    handleBuyGenerator,
    handleBuyUpgrade,
    handlePurchaseTheme,
    handleActivateTheme,
    handlePrestige,
    handleUpdateSetting,
    handleExportSave,
    handleImportSave,
    handleResetGame,
    handleBuyNotorietyGenerator,
    handleBuyNotorietyUpgrade,
    offlineProgress,
    dismissOfflineProgress,
  } = useGame();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading || !state) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">📱</div>
          <div className="text-xl font-semibold">Loading Clickfluencer...</div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Event Toasts */}
      <EventToasts events={state.activeEvents} />

      {/* Offline Earnings Modal */}
      {offlineProgress && (
        <OfflineEarningsModal
          isOpen={true}
          onClose={dismissOfflineProgress}
          timeAway={offlineProgress.timeAway}
          timeProcessed={offlineProgress.timeProcessed}
          followersGained={offlineProgress.followersGained}
          wasCapped={offlineProgress.wasCapped}
        />
      )}

      {/* Settings Dialog */}
      <SettingsDialog
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={state.settings}
        onSettingChange={handleUpdateSetting}
        onExport={handleExportSave}
        onImport={handleImportSave}
        onReset={handleResetGame}
      />

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="mb-6 text-center">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10" /> {/* Spacer */}
            <div>
              <h1 className="text-4xl font-bold text-accent">
                Clickfluencer Idle
              </h1>
              <p className="text-muted">
                Build Your Social Media Empire
              </p>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg hover:bg-surface transition-colors"
              aria-label="Settings"
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>

          {/* Currency Bar */}
          <CurrencyBar
            followers={state.followers}
            shards={state.shards}
            awardDropRate={state ? getAwardDropRate(state) : 0.003}
            followersPerSecond={followersPerSecond}
            reputation={state.reputation}
            notoriety={state.notoriety}
            notorietyPerSecond={notorietyPerSecond}
          />
        </header>

        {/* Main Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Clicker & Quick Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Clicker Panel */}
            <div className="bg-card rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-center text-foreground">
                Tap to Grow
              </h2>
              <PostButton />
            </div>

            {/* Quick Stats */}
            <div className="bg-card rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-foreground">
                Quick Stats
              </h2>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-surface">
                  <div className="text-xs text-muted mb-1">
                    Total Clicks
                  </div>
                  <div className="text-lg font-bold number-display text-foreground">
                    {state.stats.totalClicks.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-surface">
                  <div className="text-xs text-muted mb-1">
                    Score
                  </div>
                  <div className="text-lg font-bold number-display text-foreground">
                    {formatNumber(state.stats.totalFollowersEarned)}
                  </div>
                </div>
              </div>
            </div>

            {/* Share Buttons - Hidden on mobile, shown on large screens */}
            <div className="hidden lg:block">
              <ShareButtons
                creds={state.followers}
                score={state.stats.totalFollowersEarned}
              />
            </div>
          </div>

          {/* Middle & Right Columns - Tabbed Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <div className="bg-card rounded-lg shadow-lg p-2 flex gap-2">
              <button
                onClick={() => setActiveTab("generators")}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === "generators"
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-surface text-foreground"
                }`}
              >
                📈 Generators
              </button>
              <button
                onClick={() => setActiveTab("upgrades")}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === "upgrades"
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-surface text-foreground"
                }`}
              >
                ⚡ Upgrades
              </button>
              <button
                onClick={() => setActiveTab("notoriety")}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === "notoriety"
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-surface text-foreground"
                }`}
              >
                🔥 Notoriety
              </button>
              <button
                onClick={() => setActiveTab("themes")}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === "themes"
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-surface text-foreground"
                }`}
              >
                🎨 Themes
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-card rounded-lg shadow-lg p-6">
              {/* Generators Tab */}
              {activeTab === "generators" && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">
                    Content Generators
                  </h2>
                  <p className="text-sm text-muted mb-6">
                    Purchase automated content systems to generate followers
                    passively
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {state.generators.map((generator) => {
                      const cost = getGeneratorCost(generator);
                      const totalProduction =
                        generator.baseFollowersPerSecond * generator.count;
                      return (
                        <GeneratorCard
                          key={generator.id}
                          generator={{ ...generator, cost, totalProduction }}
                          canAfford={canAfford(state.followers, cost)}
                          onBuy={(count) =>
                            handleBuyGenerator(generator.id, count)
                          }
                          followersPerSecond={followersPerSecond}
                          currentFollowers={state.followers}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Upgrades Tab */}
              {activeTab === "upgrades" && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">
                    Upgrades
                  </h2>
                  <p className="text-sm text-muted mb-6">
                    Purchase permanent improvements to boost your production
                  </p>

                  {/* Prestige Section */}
                  {canPrestige && (
                    <div className="mb-6 p-6 rounded-lg bg-gradient-to-r from-orange-700 to-orange-600 text-white shadow-lg">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-center sm:text-left">
                          <div className="text-2xl font-bold flex items-center justify-center sm:justify-start gap-2 mb-2">
                            <span className="text-yellow-300">⭐</span> Prestige Available!
                          </div>
                          <div className="text-sm mt-1">
                            Reset your progress to gain{" "}
                            <span className="font-bold">
                              {reputationGain} Reputation
                            </span>
                          </div>
                          <div className="text-xs opacity-90 mt-1">
                            New bonus: ×
                            {(
                              (1 + (state.reputation + reputationGain) * 0.1) *
                              100
                            ).toFixed(0)}
                            % production
                          </div>
                        </div>
                        <button
                          onClick={handlePrestige}
                          className="px-6 py-3 bg-white text-orange-700 rounded-lg font-bold hover:bg-gray-50 transition-colors shadow-md"
                        >
                          Prestige Now
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {state.upgrades
                      .map((u) => ({
                        ...u,
                        isPurchased:
                          u.purchased ||
                          (u.maxTier && u.tier && u.tier >= u.maxTier),
                        isInfinite: u.maxLevel === undefined && u.currentLevel !== undefined,
                      }))
                      .sort((a, b) => {
                        // First sort: infinite upgrades come first
                        if (a.isInfinite && !b.isInfinite) return -1;
                        if (!a.isInfinite && b.isInfinite) return 1;
                        // Second sort: unpurchased before purchased
                        return Number(a.isPurchased) - Number(b.isPurchased);
                      })
                      .map((upgrade) => {
                        const upgradeCost = getUpgradeCost(upgrade);
                        return (
                          <UpgradeCard
                            key={upgrade.id}
                            upgrade={upgrade}
                            currentCost={upgradeCost}
                            canAfford={canAfford(state.followers, upgradeCost)}
                            onPurchase={() => handleBuyUpgrade(upgrade.id)}
                          />
                        );
                      })}
                  </div>
                  {state.upgrades.every((u) => u.purchased) && (
                    <div className="mt-6 text-center p-8 bg-surface rounded-lg border border-border">
                      <div className="text-4xl mb-2">🎉</div>
                      <div className="text-lg font-bold text-accent">
                        All Upgrades Purchased!
                      </div>
                      <div className="text-sm text-muted mt-2">
                        You've unlocked all available upgrades
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Notoriety Tab */}
              {activeTab === "notoriety" && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">
                    Notoriety System
                  </h2>
                  <p className="text-sm text-muted mb-6">
                    Build notoriety to unlock powerful permanent upgrades. Notoriety and infinite upgrades persist through prestige!
                  </p>

                  {/* Upkeep Warning */}
                  {upkeep > 0 && (
                    <div className="mb-6 p-4 rounded-lg bg-orange-500/20 border border-orange-500/50">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-xl">⚠️</span>
                        <div>
                          <div className="font-semibold text-orange-200">
                            Total Upkeep: {formatNumber(upkeep)} Creds/s
                          </div>
                          <div className="text-xs text-orange-300 mt-1">
                            Your notoriety generators consume Creds, reducing your production (never below 1 Cred/s)
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notoriety Generators */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-3 text-foreground">
                      Notoriety Generators
                    </h3>
                    <p className="text-xs text-muted mb-4">
                      Generate Notoriety/second but consume Creds/second as upkeep
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getNotorietyGeneratorsWithStatus(state).map((generator) => (
                        <NotorietyGeneratorCard
                          key={generator.id}
                          generator={generator}
                          canAfford={canAfford(state.followers, generator.cost)}
                          onBuy={() => handleBuyNotorietyGenerator(generator.id)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Notoriety Upgrades */}
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">
                      Notoriety Upgrades
                    </h3>
                    <p className="text-xs text-muted mb-4">
                      Spend Notoriety on upgrades. Infinite upgrades (∞) persist through prestige!
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getNotorietyUpgradesWithStatus(state)
                        .sort((a, b) => {
                          // Infinite upgrades first
                          if (a.isInfinite && !b.isInfinite) return -1;
                          if (!a.isInfinite && b.isInfinite) return 1;
                          // Unpurchased before maxed
                          return Number(a.isMaxed) - Number(b.isMaxed);
                        })
                        .map((upgrade) => (
                          <NotorietyUpgradeCard
                            key={upgrade.id}
                            upgrade={upgrade}
                            onPurchase={() => handleBuyNotorietyUpgrade(upgrade.id)}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Themes Tab */}
              {activeTab === "themes" && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">
                    Themes
                  </h2>
                  <p className="text-sm text-muted mb-6">
                    Unlock cosmetic themes with awards. Bonuses apply{" "}
                    <strong>permanently</strong> once unlocked!
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {state.themes.map((theme) => {
                      const activeTheme = state.themes.find((t) => t.active);
                      return (
                        <ThemeCard
                          key={theme.id}
                            theme={{
                              ...theme,
                              displayName: theme.name,
                            }}
                          canAfford={canAffordShards(state.shards, theme.cost)}
                          isActive={theme.id === activeTheme?.id}
                          onPurchase={() => handlePurchaseTheme(theme.id)}
                          onActivate={() => handleActivateTheme(theme.id)}
                          currentShards={state.shards}
                        />
                      );
                    })}
                  </div>
                  <div className="mt-6 p-4 rounded-lg bg-surface border border-border">
                    <div className="flex items-start gap-2 text-sm text-muted">
                      <span className="text-accent">
                        💡
                      </span>
                      <div>
                        <div className="font-semibold text-foreground mb-1">
                          How to earn Awards:
                        </div>
                        <p>
                          Awards have a 1% chance to drop from each click. Keep
                          clicking to collect them!
                          <br />
                          <strong>Bonuses are permanent</strong> - once you
                          unlock a theme, its bonus applies forever, even when
                          not active!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Share Buttons - Shown on mobile at bottom, hidden on large screens */}
        <div className="lg:hidden mt-6">
          <ShareButtons
            creds={state.followers}
            score={state.stats.totalFollowersEarned}
          />
        </div>
      </div>
    </main>
  );
}
