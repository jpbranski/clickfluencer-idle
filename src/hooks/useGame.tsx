/**
 * useGame.ts - Game State Management Hook
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

'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import { GameEngine, createGameEngine, OfflineProgress } from '@/game/engine';
import { GameState, Generator, Upgrade, Theme } from '@/game/state';
import {
  clickPost,
  buyGenerator,
  buyUpgrade,
  purchaseTheme,
  activateTheme,
  prestige,
  updateSetting,
  ClickResult,
  ActionResult,
} from '@/game/actions';
import {
  getClickPower,
  getFollowersPerSecond,
  getGeneratorCost,
  canAfford,
  canAffordShards,
} from '@/game/state';
import { canPrestige, calculateReputationGain } from '@/game/prestige';
import { saveGame, loadGame, autoSaveGame, exportSave, importSave } from '@/lib/storage';
import { GAMEPLAY } from '@/app-config';

// ============================================================================
// TYPES
// ============================================================================

interface GameContextValue {
  // State
  state: GameState | null;
  isLoading: boolean;
  error: string | null;
  
  // Computed values
  clickPower: number;
  followersPerSecond: number;
  canPrestige: boolean;
  reputationGain: number;
  
  // Actions
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
  
  // Theme management
  currentTheme: string;
  setTheme: (themeId: string) => void;
  
  // Offline progress
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
  const [offlineProgress, setOfflineProgress] = useState<OfflineProgress | null>(null);
  const [currentTheme, setCurrentTheme] = useState('default');
  
  const engineRef = useRef<GameEngine | null>(null);
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        // Load saved game
        const result = await loadGame();
        
        let initialState: GameState;
        
        if (result.success && result.data) {
          initialState = result.data;
          
          if (result.restoredFromBackup) {
            console.warn('Restored from backup due to corrupted save');
          }
        } else {
          // No save found, create new game
          const { createInitialState } = await import('@/game/state');
          initialState = createInitialState();
        }

        if (!mounted) return;

        // Create and start engine
        const engine = createGameEngine(initialState);
        engineRef.current = engine;

        // Subscribe to state changes
        const unsubscribe = engine.subscribe((newState) => {
          if (mounted) {
            setState(newState);
          }
        });

        // Listen for offline progress
        engine.on('offline:progress', (_, data) => {
          if (mounted) {
            setOfflineProgress(data as OfflineProgress);
          }
        });

        // Start engine
        engine.start();
        
        setIsLoading(false);

        // Setup auto-save
        if (GAMEPLAY.autoSaveEnabled) {
          autoSaveIntervalRef.current = setInterval(() => {
            const currentState = engine.getState();
            autoSaveGame(currentState);
          }, GAMEPLAY.autoSaveInterval);
        }

        return () => {
          mounted = false;
          unsubscribe();
          engine.stop();
          
          if (autoSaveIntervalRef.current) {
            clearInterval(autoSaveIntervalRef.current);
          }
          
          // Final save on unmount
          saveGame(engine.getState());
        };
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to initialize game');
          setIsLoading(false);
        }
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, []);

  // ============================================================================
  // THEME MANAGEMENT
  // ============================================================================

  useEffect(() => {
    // Load saved theme
    const savedTheme = localStorage.getItem('game_theme');
    if (savedTheme) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = useCallback((themeId: string) => {
    if (typeof document === 'undefined') return;
    
    const html = document.documentElement;
    
    // Remove all theme classes
    html.className = html.className
      .split(' ')
      .filter(cls => !cls.startsWith('theme-'))
      .join(' ');
    
    // Add new theme class
    html.classList.add(`theme-${themeId}`);
    
    // Save to storage
    localStorage.setItem('game_theme', themeId);
  }, []);

  const setTheme = useCallback((themeId: string) => {
    setCurrentTheme(themeId);
    applyTheme(themeId);
  }, [applyTheme]);

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
    
    engineRef.current.executeAction((currentState) => {
      return clickPost(currentState);
    });
  }, [state]);

  const handleBuyGenerator = useCallback((generatorId: string, count = 1) => {
    if (!engineRef.current || !state) return;
    
    engineRef.current.executeAction((currentState) => {
      if (count === 1) {
        return buyGenerator(currentState, generatorId);
      } else {
        // Buy multiple
        let result: ActionResult = { success: false, state: currentState };
        let purchased = 0;
        
        for (let i = 0; i < count; i++) {
          result = buyGenerator(result.state, generatorId);
          if (!result.success) break;
          purchased++;
        }
        
        return {
          ...result,
          success: purchased > 0,
          message: purchased > 0 ? `Purchased ${purchased} generators` : result.message,
        };
      }
    });
  }, [state]);

  const handleBuyUpgrade = useCallback((upgradeId: string) => {
    if (!engineRef.current || !state) return;
    
    engineRef.current.executeAction((currentState) => {
      return buyUpgrade(currentState, upgradeId);
    });
  }, [state]);

  const handlePurchaseTheme = useCallback((themeId: string) => {
    if (!engineRef.current || !state) return;
    
    engineRef.current.executeAction((currentState) => {
      return purchaseTheme(currentState, themeId);
    });
  }, [state]);

  const handleActivateTheme = useCallback((themeId: string) => {
    if (!engineRef.current || !state) return;
    
    engineRef.current.executeAction((currentState) => {
      const result = activateTheme(currentState, themeId);
      if (result.success) {
        setTheme(themeId);
      }
      return result;
    });
  }, [state, setTheme]);

  const handlePrestige = useCallback(() => {
    if (!engineRef.current || !state) return;
    
    engineRef.current.executeAction((currentState) => {
      return prestige(currentState);
    });
  }, [state]);

  const handleUpdateSetting = useCallback((key: string, value: boolean) => {
    if (!engineRef.current || !state) return;
    
    engineRef.current.executeAction((currentState) => {
      return {
        success: true,
        state: updateSetting(currentState, key as keyof GameState['settings'], value),
      };
    });
  }, [state]);

  const handleExportSave = useCallback(async () => {
    if (!state) return;
    
    try {
      const data = await exportSave();
      if (data) {
        // Create download
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `clickfluencer-save-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Failed to export save:', err);
    }
  }, [state]);

  const handleImportSave = useCallback(async (data: string) => {
    if (!engineRef.current) return;
    
    try {
      const result = await importSave(data);
      if (result.success) {
        // Reload the game with imported data
        window.location.reload();
      }
    } catch (err) {
      console.error('Failed to import save:', err);
    }
  }, []);

  const handleResetGame = useCallback(async () => {
    if (!engineRef.current) return;
    
    try {
      // Clear storage
      localStorage.clear();
      
      // Reload page
      window.location.reload();
    } catch (err) {
      console.error('Failed to reset game:', err);
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
    throw new Error('useGame must be used within GameProvider');
  }
  
  return context;
}

// ============================================================================
// HELPER HOOKS
// ============================================================================

/**
 * Hook for generator-specific data
 */
export function useGenerator(generatorId: string) {
  const { state, followersPerSecond } = useGame();
  
  if (!state) {
    return null;
  }
  
  const generator = state.generators.find(g => g.id === generatorId);
  if (!generator) return null;
  
  const cost = getGeneratorCost(generator);
  const canAffordIt = canAfford(state.followers, cost);
  const totalProduction = generator.baseFollowersPerSecond * generator.count;
  
  return {
    ...generator,
    cost,
    canAfford: canAffordIt,
    totalProduction,
  };
}

/**
 * Hook for upgrade-specific data
 */
export function useUpgrade(upgradeId: string) {
  const { state } = useGame();
  
  if (!state) {
    return null;
  }
  
  const upgrade = state.upgrades.find(u => u.id === upgradeId);
  if (!upgrade) return null;
  
  const canAffordIt = canAfford(state.followers, upgrade.cost);
  
  return {
    ...upgrade,
    canAfford: canAffordIt,
  };
}

/**
 * Hook for theme-specific data
 */
export function useTheme(themeId: string) {
  const { state, currentTheme } = useGame();
  
  if (!state) {
    return null;
  }
  
  const theme = state.themes.find(t => t.id === themeId);
  if (!theme) return null;
  
  const canAffordIt = canAffordShards(state.shards, theme.cost);
  const isActive = theme.id === currentTheme;
  
  return {
    ...theme,
    canAfford: canAffordIt,
    isActive,
  };
}