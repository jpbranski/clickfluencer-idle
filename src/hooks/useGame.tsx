/**
 * useGame.tsx - Game State Management Hook
 *
 * Provides React context and custom hook for game state management.
 * Connects UI components to game engine and storage.
 *
 * Features:
 * - Game engine integration
 * - State subscription and updates
 * - Action dispatching
 * - Auto-save management
 * - Theme switching with persistence
 * - Offline progress detection
 * - Theme merge and active theme persistence
 */

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { GameEngine, createGameEngine, OfflineProgress } from "@/game/engine";
import { GameState } from "@/game/state";
import {
  clickPost,
  buyGenerator,
  buyUpgrade,
  purchaseTheme,
  activateTheme,
  prestige,
  updateSetting,
  buyNotorietyGenerator,
  ActionResult,
} from "@/game/actions";
import {
  getClickPower,
  getFollowersPerSecond,
  getGeneratorCost,
  canAfford,
  canAffordShards,
  getNotorietyPerSecond,
  getTotalUpkeep,
  getNetFollowersPerSecond,
} from "@/game/state";
import { canPrestige, prestigeCost } from "@/game/prestige";
import {
  saveGame,
  loadGame,
  autoSaveGame,
  exportSave,
  importSave,
} from "@/lib/storage";
import { GAMEPLAY } from "@/app-config";
import { themes as baseThemes } from "@/data/themes";

// ============================================================================
// UTILITIES
// ============================================================================

// Merge saved theme data with base theme definitions.
// Ensures new themes appear even if not in the player's save file.
function mergeThemes<T extends { id: string }>(savedThemes?: T[]): T[] {
  const savedMap = new Map(savedThemes?.map((t) => [t.id, t]) || []);

  return baseThemes.map((base) => {
    const saved = savedMap.get(base.id);
    return {
      ...base,
      ...saved,
    } as unknown as T;
  });
}

// Merge saved upgrade data with base upgrade definitions.
// Ensures new upgrades appear even if not in the player's save file.
function mergeUpgrades<T extends { id: string }>(savedUpgrades?: T[]): T[] {
  const { INITIAL_UPGRADES } = require("@/game/state");
  const savedMap = new Map(savedUpgrades?.map((u) => [u.id, u]) || []);

  return INITIAL_UPGRADES.map((base: T) => {
    const saved = savedMap.get(base.id);
    return {
      ...base,
      ...saved,
    } as T;
  });
}
// ============================================================================
// TYPES
// ============================================================================

interface GameContextValue {
  state: GameState | null;
  isLoading: boolean;
  error: string | null;

  clickPower: number;
  followersPerSecond: number;
  notorietyPerSecond: number;
  totalUpkeep: number;
  netFollowersPerSecond: number;
  canPrestige: boolean;
  reputationGain: number;
  prestigeCost: number;

  handleClick: () => void;
  handleBuyGenerator: (generatorId: string, count?: number) => void;
  handleBuyNotorietyGenerator: (generatorId: string) => void;
  handleBuyUpgrade: (upgradeId: string) => void;
  handlePurchaseTheme: (themeId: string) => void;
  handleActivateTheme: (themeId: string) => void;
  handlePrestige: () => void;
  handleUpdateSetting: (key: string, value: boolean) => void;
  handleExportSave: () => void;
  handleImportSave: (data: string) => void;
  handleResetGame: () => void;

  currentTheme: string;
  setTheme: (themeId: string) => void;

  offlineProgress: OfflineProgress | null;
  dismissOfflineProgress: () => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

const GameContext = createContext<GameContextValue | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [state, setState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offlineProgress, setOfflineProgress] =
    useState<OfflineProgress | null>(null);
  const [currentTheme, setCurrentTheme] = useState("dark");

  const engineRef = useRef<GameEngine | null>(null);
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  useEffect(() => {
    let mounted = true;
    let cleanup: (() => void) | undefined;

    async function initialize() {
      try {
        const result = await loadGame();
        console.log("[useGame] loadGame result ->", result);

        let initialState: GameState;
        if (result.success && result.data) {
          console.log("[useGame] Loading saved state");
          initialState = result.data;
          if (result.restoredFromBackup) {
            console.warn("Restored from backup due to corrupted save");
          }
        } else {
          console.log("[useGame] No save found, creating initial state");
          const { createInitialState } = await import("@/game/state");
          initialState = createInitialState();
        }

        // ✅ Merge theme data (adds new themes automatically)
        if (initialState?.themes) {
          initialState.themes = mergeThemes(initialState.themes);
        } else {
          initialState.themes = mergeThemes();
        }

        // ✅ Merge upgrade data (adds new upgrades automatically)
        if (initialState?.upgrades) {
          initialState.upgrades = mergeUpgrades(initialState.upgrades);
        } else {
          initialState.upgrades = mergeUpgrades();
        }

        // ✅ Initialize notoriety and notoriety generators if missing (for backward compatibility)
        if (!initialState.notoriety) {
          initialState.notoriety = 0;
        }
        if (!initialState.notorietyGenerators) {
          const { INITIAL_NOTORIETY_GENERATORS } = await import("@/game/state");
          initialState.notorietyGenerators = INITIAL_NOTORIETY_GENERATORS.map((ng) => ({ ...ng }));
        }

        if (!mounted) return;

        // ✅ Create engine only once
        if (!engineRef.current) {
          engineRef.current = createGameEngine(initialState);
        }

        const engine = engineRef.current;

        // Subscribe to state changes
        const unsubscribe = engine.subscribe((newState) => {
          if (mounted) setState(newState);
        });

        // Listen for offline progress
        engine.on("offline:progress", (_, data) => {
          if (mounted) setOfflineProgress(data as OfflineProgress);
        });

        engine.start();
        setIsLoading(false);

        // Setup auto-save
        if (GAMEPLAY.autoSaveEnabled) {
          autoSaveIntervalRef.current = setInterval(() => {
            const currentState = engine.getState();
            autoSaveGame(currentState);
          }, GAMEPLAY.autoSaveInterval);
        }

        // Also save immediately on state changes (debounced)
        const saveOnChange = () => {
          const currentState = engine.getState();
          autoSaveGame(currentState);
        };
        engine.subscribe(saveOnChange);

        // Store cleanup function
        cleanup = () => {
          unsubscribe();
          engine.stop();
          if (autoSaveIntervalRef.current)
            clearInterval(autoSaveIntervalRef.current);
          saveGame(engine.getState());
        };
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Failed to initialize game"
          );
          setIsLoading(false);
        }
      }
    }

    initialize();

    return () => {
      mounted = false;
      if (cleanup) cleanup();
    };
  }, []);

  // ============================================================================
  // THEME MANAGEMENT (with persistence + visual sync)
  // ============================================================================

  const applyTheme = useCallback((themeId: string) => {
    if (typeof document === "undefined") return;

    const html = document.documentElement;
    const body = document.body;

    // Clear any previous theme-* and dark/light flags
    for (const el of [html, body]) {
      el.className = el.className
        .split(" ")
        .filter((cls) => !cls.startsWith("theme-") && cls !== "dark")
        .join(" ");
      el.removeAttribute("data-theme");
    }

    // Add new theme flags
    html.dataset.theme = themeId;
    body.dataset.theme = themeId;

    html.classList.add(`theme-${themeId}`);
    body.classList.add(`theme-${themeId}`);

    // Only light disables dark mode
    if (themeId !== "light") {
      html.classList.add("dark");
      body.classList.add("dark");
    }

    // Browser UI color
    const themeColors: Record<string, string> = {
      light: "#ffffff",
      dark: "#0d1117",
      "night-sky": "#1b1f3b",
      "touch-grass": "#95d5b2",
      terminal: "#272822",
      "cherry-blossom": "#ffd6de",
      nightshade: "#311b3a",
      "el-blue": "#0a192f",
      gold: "#d4af37",
    };
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", themeColors[themeId] || "#0d1117");

    // Persist + force refresh of CSS variables
    localStorage.setItem("active-theme", themeId);
    localStorage.setItem("game_theme", themeId);
    requestAnimationFrame(() => {
      document.body.offsetHeight; // force repaint
    });
  }, []);

  // Sync visual theme with game state's active theme
  useEffect(() => {
    if (!state?.themes) return;

    // Find the active theme in game state
    const activeTheme = state.themes.find((t) => t.active);

    if (activeTheme) {
      // Sync visual theme with game state's active theme
      setCurrentTheme(activeTheme.id);
      applyTheme(activeTheme.id);
    } else {
      // Fallback: load from localStorage or default to 'dark'
      const savedTheme =
        localStorage.getItem("active-theme") ||
        localStorage.getItem("game_theme") ||
        "dark";
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, [state?.themes, applyTheme]);

  const setTheme = useCallback(
    (themeId: string) => {
      setCurrentTheme(themeId);
      applyTheme(themeId);
    },
    [applyTheme]
  );

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const clickPower = state ? getClickPower(state) : 0;
  const followersPerSecond = state ? getFollowersPerSecond(state) : 0;
  const canPrestigeNow = state ? canPrestige(state.followers, state.reputation) : false;
  const reputationGain = 1; // Always gain 1 prestige point per purchase
  const prestigeCostValue = state ? prestigeCost(state.reputation) : 0;

  // ============================================================================
  // ACTIONS
  // ============================================================================

  const handleClick = useCallback(() => {
    if (!engineRef.current || !state) return;
    engineRef.current.executeAction((currentState) => clickPost(currentState));
  }, [state]);

  const handleBuyGenerator = useCallback(
    (generatorId: string, count = 1) => {
      if (!engineRef.current || !state) return;
      engineRef.current.executeAction((currentState) => {
        let result: ActionResult = { success: false, state: currentState };
        for (let i = 0; i < count; i++) {
          result = buyGenerator(result.state, generatorId);
          if (!result.success) break;
        }
        return result;
      });
    },
    [state]
  );

  const handleBuyNotorietyGenerator = useCallback(
    (generatorId: string) => {
      if (!engineRef.current || !state) return;
      engineRef.current.executeAction((currentState) =>
        buyNotorietyGenerator(currentState, generatorId)
      );
    },
    [state]
  );

  const handleBuyUpgrade = useCallback(
    (upgradeId: string) => {
      if (!engineRef.current || !state) return;
      engineRef.current.executeAction((currentState) =>
        buyUpgrade(currentState, upgradeId)
      );
    },
    [state]
  );

  const handlePurchaseTheme = useCallback(
    (themeId: string) => {
      if (!engineRef.current || !state) return;
      engineRef.current.executeAction((currentState) =>
        purchaseTheme(currentState, themeId)
      );
    },
    [state]
  );

  const handleActivateTheme = useCallback(
    (themeId: string) => {
      if (!engineRef.current || !state) return;
      engineRef.current.executeAction((currentState) => {
        const result = activateTheme(currentState, themeId);
        if (result.success) setTheme(themeId); // ✅ apply visual theme too
        return result;
      });
    },
    [state, setTheme]
  );

  const handlePrestige = useCallback(() => {
    if (!engineRef.current || !state) return;
    engineRef.current.executeAction((currentState) => prestige(currentState));
  }, [state]);

  const handleUpdateSetting = useCallback(
    (key: string, value: boolean) => {
      if (!engineRef.current || !state) return;
      engineRef.current.executeAction((currentState) => ({
        success: true,
        state: updateSetting(
          currentState,
          key as keyof GameState["settings"],
          value
        ),
      }));
    },
    [state]
  );

  const handleExportSave = useCallback(async () => {
    if (!state) return;
    try {
      const data = await exportSave();
      if (data) {
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `clickfluencer-save-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Failed to export save:", err);
    }
  }, [state]);

  const handleImportSave = useCallback(async (data: string) => {
    if (!engineRef.current) return;
    try {
      const result = await importSave(data);
      if (result.success) window.location.reload();
    } catch (err) {
      console.error("Failed to import save:", err);
    }
  }, []);

  const handleResetGame = useCallback(async () => {
    try {
      localStorage.clear();
      window.location.reload();
    } catch (err) {
      console.error("Failed to reset game:", err);
    }
  }, []);

  const dismissOfflineProgress = useCallback(() => {
    setOfflineProgress(null);
  }, []);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value: GameContextValue = {
    state,
    isLoading,
    error,
    clickPower,
    followersPerSecond,
    notorietyPerSecond,
    totalUpkeep,
    netFollowersPerSecond,
    canPrestige: canPrestigeNow,
    reputationGain,
    prestigeCost: prestigeCostValue,
    handleClick,
    handleBuyGenerator,
    handleBuyNotorietyGenerator,
    handleBuyUpgrade,
    handlePurchaseTheme,
    handleActivateTheme,
    handlePrestige,
    handleUpdateSetting,
    handleExportSave,
    handleImportSave,
    handleResetGame,
    currentTheme,
    setTheme,
    offlineProgress,
    dismissOfflineProgress,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// ============================================================================
// HOOK
// ============================================================================

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
}
