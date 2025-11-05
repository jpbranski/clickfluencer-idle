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
  bonusClickPower?: number; // Optional additive bonus to base click power
  // v1.0.0 additions
  fontFamily?: string; // Optional custom font family
  backgroundImage?: string; // Path to background image (e.g., "/themes/default-bg.webp")
  iconImage?: string; // Path to icon/logo image (e.g., "/themes/default-icon.webp")
}
