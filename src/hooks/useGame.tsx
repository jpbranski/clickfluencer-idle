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
  ActionResult,
} from "@/game/actions";
import {
  getClickPower,
  getFollowersPerSecond,
  getGeneratorCost,
  canAfford,
  canAffordShards,
} from "@/game/state";
import { canPrestige, calculateReputationGain } from "@/game/prestige";
import {
  saveGame,
  loadGame,
  autoSaveGame,
  exportSave,
  importSave,
} from "@/lib/storage";
import { GAMEPLAY } from "@/app-config";

// ============================================================================
// TYPES
// ============================================================================

interface GameContextValue {
  state: GameState | null;
  isLoading: boolean;
  error: string | null;

  clickPower: number;
  followersPerSecond: number;
  canPrestige: boolean;
  reputationGain: number;

  handleClick: () => void;
  handleBuyGenerator: (generatorId: string, count?: number) => void;
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
  const [currentTheme, setCurrentTheme] = useState("default");

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

        let initialState: GameState;
        if (result.success && result.data) {
          initialState = result.data;
          if (result.restoredFromBackup) {
            console.warn("Restored from backup due to corrupted save");
          }
        } else {
          const { createInitialState } = await import("@/game/state");
          initialState = createInitialState();
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
            err instanceof Error ? err.message : "Failed to initialize game",
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
  // THEME MANAGEMENT
  // ============================================================================

  useEffect(() => {
    // Apply saved theme or default to 'default' (dark theme)
    const savedTheme = localStorage.getItem("game_theme") || "default";
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = useCallback((themeId: string) => {
    if (typeof document === "undefined") return;

    const html = document.documentElement;
    const body = document.body;

    // Clean up old theme classes
    html.className = html.className
      .split(" ")
      .filter((cls) => !cls.startsWith("theme-") && cls !== "dark")
      .join(" ");

    // Apply dark mode for all except light
    if (themeId !== "light") {
      html.classList.add("dark");
    }

    // Add theme-* class
    html.classList.add(`theme-${themeId}`);

    // 🔹 NEW: update data attribute for CSS theme system
    body.dataset.theme = themeId;

    // 🔹 NEW: update meta theme-color for browser UI
    const themeColors: Record<string, string> = {
      light: "#ffffff",
      default: "#0a0a0a",
      neon: "#ff00ff",
      nature: "#059669",
      terminal: "#001900",
      cherry: "#db2777",
      gold: "#facc15",
    };
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", themeColors[themeId] || "#0a0a0a");

    // Persist theme
    localStorage.setItem("game_theme", themeId);
  }, []);

  const setTheme = useCallback(
    (themeId: string) => {
      setCurrentTheme(themeId);
      applyTheme(themeId);
    },
    [applyTheme],
  );

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const clickPower = state ? getClickPower(state) : 0;
  const followersPerSecond = state ? getFollowersPerSecond(state) : 0;
  const canPrestigeNow = state ? canPrestige(state.followers) : false;
  const reputationGain = state ? calculateReputationGain(state.followers) : 0;

  // ============================================================================
  // ACTIONS
  // ============================================================================

  const handleClick = useCallback(() => {
    if (!engineRef.current || !state) return;
    console.log("Click registered!");
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
    [state],
  );

  const handleBuyUpgrade = useCallback(
    (upgradeId: string) => {
      if (!engineRef.current || !state) return;
      engineRef.current.executeAction((currentState) =>
        buyUpgrade(currentState, upgradeId),
      );
    },
    [state],
  );

  const handlePurchaseTheme = useCallback(
    (themeId: string) => {
      if (!engineRef.current || !state) return;
      engineRef.current.executeAction((currentState) =>
        purchaseTheme(currentState, themeId),
      );
    },
    [state],
  );

  const handleActivateTheme = useCallback(
    (themeId: string) => {
      if (!engineRef.current || !state) return;
      engineRef.current.executeAction((currentState) => {
        const result = activateTheme(currentState, themeId);
        if (result.success) setTheme(themeId);
        return result;
      });
    },
    [state, setTheme],
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
          value,
        ),
      }));
    },
    [state],
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
    canPrestige: canPrestigeNow,
    reputationGain,
    handleClick,
    handleBuyGenerator,
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
