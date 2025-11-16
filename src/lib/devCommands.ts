/**
 * Dev Commands - Development console command handlers
 * Phase 3: Only available in development mode
 */

import { GameState } from "@/game/state";
import { GameEngine } from "@/game/engine";

export function executeDevCommand(
  engine: GameEngine,
  command: string,
  params?: any
): void {
  if (process.env.NODE_ENV === "production") {
    console.warn("Dev commands disabled in production");
    return;
  }

  const state = engine.getState();

  switch (command) {
    case "add_creds":
      engine.setState({
        ...state,
        creds: state.creds + (params.amount || 0),
      });
      break;

    case "add_awards":
      engine.setState({
        ...state,
        awards: state.awards + (params.amount || 0),
      });
      break;

    case "add_prestige":
      engine.setState({
        ...state,
        prestige: state.prestige + (params.amount || 0),
      });
      break;

    case "unlock_achievement":
      if (params.id && state.achievements) {
        engine.setState({
          ...state,
          achievements: {
            ...state.achievements,
            [params.id]: {
              ...state.achievements[params.id],
              unlocked: true,
              unlockedAt: Date.now(),
            },
          },
        });
      }
      break;

    case "reset_ftue":
      engine.setState({
        ...state,
        settings: {
          ...state.settings,
          ftueCompleted: false,
        },
      });
      break;

    case "simulate_ticks":
      // Not implemented - would need engine.tick() method
      console.log("Simulate ticks not implemented yet");
      break;

    case "reset_offline_timer":
      // Not implemented - would need lastSeen field
      console.log("Reset offline timer not implemented yet");
      break;

    default:
      console.warn(`Unknown dev command: ${command}`);
  }
}
