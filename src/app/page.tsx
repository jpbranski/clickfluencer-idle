"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/hooks/useGame";
import PostButton from "@/components/PostButton";
import { CurrencyBar } from "@/components/CurrencyBar";
import { GeneratorsPanel } from "@/components/panels/GeneratorsPanel";
import { SettingsDialog } from "@/components/SettingsDialog";
import { EventToasts } from "@/components/EventToasts";
import { OfflineEarningsModal } from "@/components/OfflineEarningsModal";
import { ShareButtons } from "@/components/ShareButtons";
import { GameShell } from "@/components/layout/GameShell";
import { UpgradesPanel } from "@/components/Upgrades/UpgradesPanel";
import { ThemesPanel } from "@/components/Themes/ThemesPanel";
import { AchievementsPanel } from "@/components/Achievements/AchievementsPanel";
import { formatNumber } from "@/game/format";
import { getAwardDropRate } from "@/game/actions";
import Head from "next/head";
import Link from "next/link";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);

  const {
    state,
    isLoading,
    credsPerSecond,
    notorietyPerSecond,
    totalUpkeep,
    netCredsPerSecond,
    canPrestige,
    prestigeGain,
    handleBuyGenerator,
    handleBuyNotorietyGenerator,
    handleBuyUpgrade,
    handleBuyNotorietyUpgrade,
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

  const scrollToGame = () => {
    if (gameRef.current) gameRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Head>
        <Link rel="canonical" href="https://www.clickfluenceridle.com/" />
      </Head>

      {/* Hero Section - Premium Landing */}
      <section className="relative flex flex-col items-center justify-center text-center min-h-screen px-6 overflow-hidden">
        {/* Animated Background Mesh Gradient */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-60" />
        <motion.div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgb(from var(--accent) r g b / 0.15), transparent 70%)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Main Content */}
        <div className="relative z-10 max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-premium"
              style={{
                backgroundColor: "rgb(from var(--accent) r g b / 0.1)",
                color: "var(--accent)",
                border: "1px solid rgb(from var(--accent) r g b / 0.2)",
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: "var(--accent)" }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: "var(--accent)" }} />
              </span>
              Free to Play • No Ads • Privacy First
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-display-1 sm:text-display-2 mb-6"
            style={{
              background: "linear-gradient(135deg, var(--foreground) 0%, var(--accent) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Clickfluencer Idle
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-body-lg text-muted mb-10 leading-relaxed max-w-2xl mx-auto"
          >
            Build your influence, balance your strategy, and master the algorithmic grind.
            A <span className="text-foreground font-semibold">cozy-chaotic idle game</span> about
            progress, patience, and creativity in a world that never stops refreshing.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center gap-4 flex-wrap mb-8"
          >
            <button
              onClick={scrollToGame}
              className="btn-primary group"
            >
              <span className="mr-2">Start Playing</span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </button>
            <Link
              href="/guide"
              className="btn-secondary"
            >
              Read the Guide
            </Link>
          </motion.div>

          {/* Trust Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center gap-3 text-xs text-muted"
          >
            <Link href="/privacy-policy" className="hover:text-accent transition">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/terms-of-service" className="hover:text-accent transition">
              Terms
            </Link>
            <span>•</span>
            <Link href="/news" className="hover:text-accent transition">
              Updates
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.button
          onClick={scrollToGame}
          className="absolute bottom-12 flex flex-col items-center text-sm text-muted hover:text-accent transition cursor-pointer group"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <span className="mb-2 font-medium">Play Now</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg
              className="w-6 h-6 group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.button>
      </section>



      {/* Game Section */}
      <section ref={gameRef} className="mt-12 mb-16 pb-20 sm:pb-0">
        <EventToasts events={state.activeEvents} />

        {offlineProgress && (
          <OfflineEarningsModal
            isOpen={true}
            onClose={dismissOfflineProgress}
            timeAway={offlineProgress.timeAway}
            timeProcessed={offlineProgress.timeProcessed}
            credsGained={offlineProgress.credsGained}
            wasCapped={offlineProgress.wasCapped}
          />
        )}

        <SettingsDialog
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          settings={state.settings}
          onSettingChange={handleUpdateSetting}
          onExport={handleExportSave}
          onImport={handleImportSave}
          onReset={handleResetGame}
        />

        <GameShell
          currencyBar={
            <CurrencyBar
              creds={state.creds}
              awards={state.awards}
              awardDropRate={state ? getAwardDropRate(state) : 0.003}
              credsPerSecond={credsPerSecond}
              prestige={state.prestige}
              notoriety={state.notoriety ?? 0}
              notorietyPerSecond={notorietyPerSecond}
              totalUpkeep={totalUpkeep}
              netCredsPerSecond={netCredsPerSecond}
            />
          }
          quickStats={
            <div className="bg-card rounded-lg shadow-lg p-4">
              <h2 className="text-lg font-bold mb-3 text-foreground">Quick Stats</h2>
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-surface">
                  <div className="text-xs text-muted mb-1">Total Clicks</div>
                  <div className="text-base font-bold font-mono number-display text-foreground">
                    {state.stats.totalClicks.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-surface">
                  <div className="text-xs text-muted mb-1">Score</div>
                  <div className="text-base font-bold font-mono number-display text-foreground">
                    {formatNumber(state.stats.totalCredsEarned)}
                  </div>
                </div>
              </div>
            </div>
          }
          shareButtons={
            <ShareButtons
              creds={state.creds}
              score={state.stats.totalCredsEarned}
            />
          }
          generatorsTab={
            <GeneratorsPanel
              generators={state.generators}
              creds={state.creds}
              credsPerSecond={credsPerSecond}
              onBuyGenerator={handleBuyGenerator}
              state={state}
              onBuyNotorietyGenerator={handleBuyNotorietyGenerator}
            />
          }
          upgradesTab={
            <UpgradesPanel
              upgrades={state.upgrades}
              creds={state.creds}
              canPrestige={canPrestige}
              prestigeGain={prestigeGain}
              prestige={state.prestige}
              onBuyUpgrade={handleBuyUpgrade}
              onPrestige={handlePrestige}
              notoriety={state.notoriety || 0}
              state={state}
              onBuyNotorietyUpgrade={handleBuyNotorietyUpgrade}
            />
          }
          themesTab={
            <ThemesPanel
              themes={state.themes}
              awards={state.awards}
              activeThemeId={state.themes.find((t) => t.active)?.id || "dark"}
              onPurchaseTheme={handlePurchaseTheme}
              onActivateTheme={handleActivateTheme}
            />
          }
          achievementsTab={
            <AchievementsPanel achievements={state.achievements || []} />
          }
          settingsButton={
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
          }
          onShowSettings={() => setShowSettings(true)}
        >
          <div className="w-full max-w-md">
            <PostButton />
          </div>
        </GameShell>
      </section>
    </main>
  );
}
