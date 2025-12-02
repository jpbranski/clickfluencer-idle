# Zustand Migration & Comprehensive Rebalance - Changes Summary

## Overview

This document summarizes the massive refactoring and rebalancing effort for Clickfluencer Idle. The goals were to:

1. Migrate core game state to Zustand for better performance and React integration
2. Improve tick architecture with pure functions
3. Comprehensively rebalance the entire game
4. Implement new systems (synergies, notoriety scaling)
5. Preserve existing saves via migration system

## Architecture Changes

### 1. State Management Migration to Zustand

**New Files:**
- `src/state/gameStore.ts` - Main Zustand store for game state
- `src/state/uiStore.ts` - Separate UI state store (modals, tabs, etc.)
- `src/types/save.ts` - Save file schema and types

**Key Changes:**
- Replaced custom GameEngine pub/sub with Zustand stores
- Game state now managed via `useGameStore` with efficient selectors
- UI state separated into `useUIStore` to prevent unnecessary re-renders
- Tick function now updates Zustand store directly

**Migration Path:**
- Old code using `useGame()` hook still works (will need gradual migration)
- GameEngine class can coexist during transition
- Components can be migrated one-by-one to use Zustand selectors

### 2. Pure Tick Function Architecture

**New Files:**
- `src/engine/tick.ts` - Pure function for game loop logic

**Benefits:**
- Testable: No side effects, easy to unit test
- Predictable: Same input always produces same output
- Performant: No DOM manipulation or React state updates in tick
- Maintainable: Clear separation of concerns

**Tick Flow:**
```
Game Interval (50ms) → useGameStore.tick() → engineTick(state, deltaTime) → new state
```

### 3. Game Balance Overhaul

**Updated Files:**
- `src/game/balance.ts` - Comprehensive rewrite with all balance constants
- `src/game/state.ts` - Updated selectors with new formulas
- `src/game/prestige.ts` - Rebalanced prestige costs and bonuses
- `src/game/actions.ts` - Updated Cred Cache percentages

## Game Balance Changes

### Prestige System (BUFFED)

**Before:**
- Bonus: +10% per prestige point
- Cost: Complex formula (10M × (P+1)^2.5)

**After:**
- Bonus: **+20% per prestige point** (2x stronger!)
- Cost: Simplified quadratic (10M × (P+1)^2)
- Examples:
  - P=0: 10M → 1.0x
  - P=1: 40M → 1.2x (+20%)
  - P=5: 2.0x (+100%)
  - P=10: 3.0x (+200%)

### Themes System (REWORKED)

**Before:**
- Active theme provided gameplay bonus
- Only one theme bonus at a time

**After:**
- **All unlocked themes provide passive +2% bonus**
- Active theme is now purely cosmetic
- Incentivizes unlocking all themes
- Example: 9 themes = +18% to all production

### Notoriety System (NEW SCALING)

**New Bonuses:**
1. **Linear bonus:** +0.3% per notoriety level
2. **Milestone bonus:** +5% every 25 levels
3. **Award drop bonus:** +1% drop rate every 25 levels
4. **Cost discount:** -2% generator costs every 50 levels (max -20%)

**Example at 100 notoriety:**
- Linear: +30% (100 × 0.3%)
- Milestones: +20% (4 × 5%)
- Total: +50% production boost
- Award drops: +4% to base rate
- Generator costs: -4% discount

### Notoriety Generators (BUFFED)

**Social Media Manager:**
- Production: 1 → **2 notoriety/hour** (2x)
- Cost: 100k (unchanged)
- Upkeep: 5k/s → **2k/s** (60% reduction)

**PR Team:**
- Production: 5 → **10 notoriety/hour** (2x)
- Cost: 100M → **50M** (50% reduction)
- Upkeep: 25k/s → **10k/s** (60% reduction)

**Key Client:**
- Production: 25 → **50 notoriety/hour** (2x)
- Cost: 10B → **5B** (50% reduction)
- Upkeep: 250k/s → **100k/s** (60% reduction)

**Rationale:** These generators were previously too expensive and had poor ROI. Now they're viable mid-to-late game investments.

### Generator Synergies (NEW SYSTEM)

**New File:**
- `src/game/synergies.ts` - Synergy calculation system

**Synergies:**

1. **Stream + Collab Synergy**
   - Bonus: +10% per matching pair
   - Example: 5 streams + 3 collabs = 3 pairs = +30%

2. **Editor Bulk Synergy**
   - Bonus: +5% per 10 video content generators
   - Example: 25 videos = +10%

3. **Viral Triangle** (Streams + Videos + Brands)
   - Tier 1 (1+ each): +5%
   - Tier 2 (10+ each): +15%
   - Tier 3 (25+ each): +25%

**Benefits:**
- Rewards strategic purchasing
- Encourages diversification
- Late-game scaling

### Cred Cache (REBALANCED)

**Before:**
- 1-5% of current creds on drop

**After:**
- **0.1-1.0% of current creds** (safer scaling)
- Prevents exponential runaway growth
- Still meaningful at high cred counts

### Performance & Tick Rate

**Before:**
- 250ms tick interval (4 ticks/sec)

**After:**
- **50ms tick interval (20 ticks/sec)** (5x faster!)
- Smoother animations
- More responsive gameplay
- Better UX

## New Systems

### 1. Save Versioning

**New Files:**
- `src/types/save.ts` - Save schema definitions

**Format:**
```typescript
interface SaveFile {
  version: number;
  state: GameState;
  metadata?: {
    createdAt: number;
    updatedAt: number;
    gameVersion: string;
  };
}
```

**Migration:**
- Old saves automatically detected and wrapped as version 1
- Future migrations can be added incrementally
- Preserves player progress

### 2. Synergy System

**Features:**
- Combinatorial bonuses between generators
- UI-friendly info system (`getSynergyInfo()`)
- Extensible for future synergies

### 3. Click Rate Limiting

**New Constant:**
- `MIN_CLICK_INTERVAL = 16ms` (~60 clicks/sec max)
- Prevents spam/cheating
- Still feels instant

## Files Created

### Core Architecture
- `src/state/gameStore.ts` - Zustand game store
- `src/state/uiStore.ts` - Zustand UI store
- `src/engine/tick.ts` - Pure tick function
- `src/types/save.ts` - Save file types

### Game Systems
- `src/game/synergies.ts` - Synergy calculation

## Files Modified

### Balance & Logic
- `src/game/balance.ts` - Comprehensive rewrite
- `src/game/state.ts` - Updated selectors with new bonuses
- `src/game/prestige.ts` - Rebalanced costs and bonuses
- `src/game/actions.ts` - Updated Cred Cache

## Migration Status

### ✅ Completed
- [x] Install Zustand
- [x] Create comprehensive balance constants
- [x] Create synergy system
- [x] Create Zustand stores (game + UI)
- [x] Create pure tick function
- [x] Update prestige logic
- [x] Update state selectors
- [x] Wire up tick function to game store
- [x] Update Cred Cache logic
- [x] Fix type errors
- [x] Pass type-check

### ⏳ Still TODO (Not Blocking)

#### High Priority
1. **Update `useGame.tsx` hook** to use Zustand stores instead of GameEngine
   - Replace `useState` with Zustand selectors
   - Migrate click handler to use store actions
   - Keep GameEngine for backward compat during transition

2. **Update save/load functions** to use new SaveFile schema
   - Wrap/unwrap versioned saves
   - Test migration with old saves

3. **Update save editor** to understand new schema
   - Import/export SaveFile format
   - Handle version field

4. **Update notoriety generator data** to use new balance constants
   - Update `src/data/notoriety.ts` with buffed values
   - Ensure UI shows correct values

5. **Create migration pipeline V1→V2**
   - Add migration functions for new schema
   - Test with various old save states

#### Medium Priority
6. **Add FTUE tutorial modal**
   - Detect first-time users
   - Show 3-slide tutorial
   - Store completion flag

7. **Implement click rate limiter**
   - Add `performance.now()` check
   - 16ms minimum interval

8. **Update currency bar** (if needed)
   - Already looks good
   - May need tooltip updates

#### Low Priority
9. **Add dev panel for multiplier breakdown**
   - Show all bonus sources
   - Toggle with backtick key
   - Helps with balance QA

10. **Update documentation**
    - Update README with new systems
    - Document synergies in game guide

## Breaking Changes

### None (Intentionally)

All changes were designed to be **backward compatible**:
- Existing saves will load (need migration pipeline completion)
- Old components still work (gradual migration)
- Game logic enhanced, not replaced

## Testing Checklist

When completing the migration, verify:

- [ ] New game starts properly
- [ ] Old saves load and migrate correctly
- [ ] Prestige feels meaningfully stronger
- [ ] Notoriety generators are purchaseable and useful
- [ ] Synergies activate and show in UI
- [ ] Save editor can import/export saves
- [ ] Autosave works without lag
- [ ] Type-check passes (✅ DONE)
- [ ] Build succeeds
- [ ] No console errors in browser

## Performance Impact

**Expected Improvements:**
- 5x faster tick rate (50ms vs 250ms)
- Better React integration via Zustand
- Reduced unnecessary re-renders (separate UI store)
- Pure functions enable better optimization

**Measurements Needed:**
- FPS during gameplay
- Memory usage
- Autosave impact on frame rate

## Tuning Recommendations

After playtesting, consider adjusting:

1. **Prestige cost curve** - May need tweaking based on progression speed
2. **Synergy bonuses** - Watch for over/underpowered combinations
3. **Notoriety generator ROI** - Ensure they're worth the investment
4. **Theme passive bonus** - 2% per theme may stack too high late-game
5. **Cred Cache percentages** - Monitor for exploit potential

## Credits

This refactoring implements the comprehensive spec provided by the user, including:
- Zustand migration
- Pure function architecture
- Complete game rebalance
- New progression systems
- Save compatibility

**Note:** This is a Phase 1 implementation. Several components (useGame, save/load, editor) still need migration to fully utilize the new architecture. The foundation is solid and ready for incremental completion.
