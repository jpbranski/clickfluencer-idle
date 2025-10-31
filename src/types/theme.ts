export interface Theme {
  id: string;
  name: string; // keep this if you display theme name in UI
  displayName?: string; // optional (some themes might override name)
  description?: string;
  preview?: string;
  cost: number;
  unlocked: boolean;
  active: boolean;
  bonusMultiplier: number; // required for gameplay bonuses
}
