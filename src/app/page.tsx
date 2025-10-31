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
import { formatNumber } from "@/game/format";
import { getGeneratorCost, canAfford, canAffordShards } from "@/game/state";
import { getAwardDropRate, getUpgradeCost } from "@/game/actions";
import { themes } from '@/data/themes';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "generators" | "upgrades" | "themes"
  >("generators");
  const [showSettings, setShowSettings] = useState(false);

  const {
    state,
    isLoading,
    clickPower,
    followersPerSecond,
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
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                Clickfluencer Idle
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Build Your Social Media Empire
              </p>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
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

          {/* Banner Ad Space - Under Title */}
          <div className="mb-4 flex justify-center">
            <div
              id="banner-ad-top"
              className="w-full max-w-3xl h-24 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm"
            >
              Ad Space (728x90 or responsive)
            </div>
          </div>

          {/* Currency Bar - removed reputation */}
          <CurrencyBar
            followers={state.followers}
            shards={state.shards}
            awardDropRate={state ? getAwardDropRate(state) : 0.003}
            followersPerSecond={followersPerSecond}
          />
        </header>

        {/* Main Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Clicker & Quick Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Clicker Panel */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">
                Tap to Grow
              </h2>
              <PostButton />
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Quick Stats
              </h2>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Total Clicks
                  </div>
                  <div className="text-lg font-bold number-display text-gray-900 dark:text-white">
                    {state.stats.totalClicks.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Score
                  </div>
                  <div className="text-lg font-bold number-display text-gray-900 dark:text-white">
                    {formatNumber(state.stats.totalFollowersEarned)}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Prestiges
                  </div>
                  <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                    {state.stats.prestigeCount}
                  </div>
                </div>
              </div>
            </div>

            {/* Share Buttons */}
            <ShareButtons
              creds={state.followers}
              score={state.stats.totalFollowersEarned}
            />
          </div>

          {/* Middle & Right Columns - Tabbed Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex gap-2">
              <button
                onClick={() => setActiveTab("generators")}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === "generators"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                📈 Generators
              </button>
              <button
                onClick={() => setActiveTab("upgrades")}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === "upgrades"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                ⚡ Upgrades
              </button>
              <button
                onClick={() => setActiveTab("themes")}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === "themes"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                🎨 Themes
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              {/* Generators Tab */}
              {activeTab === "generators" && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    Content Generators
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
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
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    Upgrades
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    Purchase permanent improvements to boost your production
                  </p>

                  {/* Prestige Section */}
                  {canPrestige && (
                    <div className="mb-6 p-6 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-center sm:text-left">
                          <div className="text-2xl font-bold flex items-center justify-center sm:justify-start gap-2 mb-2">
                            ⭐ Prestige Available!
                          </div>
                          <div className="text-sm opacity-90">
                            Reset your progress to gain{" "}
                            <span className="font-bold">
                              {reputationGain} Reputation
                            </span>
                          </div>
                          <div className="text-xs opacity-75 mt-1">
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
                          className="px-6 py-3 bg-white text-orange-600 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-md"
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
                      }))
                      .sort((a, b) => Number(a.isPurchased) - Number(b.isPurchased))
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
                    <div className="mt-6 text-center p-8 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-4xl mb-2">🎉</div>
                      <div className="text-lg font-bold text-green-700 dark:text-green-400">
                        All Upgrades Purchased!
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        You've unlocked all available upgrades
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Themes Tab */}
              {activeTab === "themes" && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    Themes
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
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
                  <div className="mt-6 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="text-purple-600 dark:text-purple-400">
                        💡
                      </span>
                      <div>
                        <div className="font-semibold text-purple-700 dark:text-purple-300 mb-1">
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

        {/* Banner Ad Space - Below Game */}
        <div className="mt-8 flex justify-center">
          <div
            id="banner-ad-bottom"
            className="w-full max-w-3xl h-24 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm"
          >
            Ad Space (728x90 or responsive)
          </div>
        </div>
      </div>
    </main>
  );
}
