/**
 * notorietyUpgrades.ts - Notoriety Upgrade Definitions
 *
 * Defines all upgrades purchasable with Notoriety currency
 */

export interface NotorietyUpgrade {
  id: string;
  name: string;
  cap: number; // Infinity for unlimited
  effect: string;
  costFormula: (level: number) => number;
}

export const NOTORIETY_UPGRADES: NotorietyUpgrade[] = [
  {
    id: "cache_value",
    name: "Cache Value Increase",
    cap: 10,
    effect: "+5% to Cred Cache payout per level",
    costFormula: (level: number) => 10 * level,
  },
  {
    id: "drama_boost",
    name: "Drama Multiplier Boost",
    cap: 5,
    effect: "+0.2% to global Prestige bonus per level",
    costFormula: (level: number) => Math.floor(25 * Math.pow(2.5, level)),
  },
  {
    id: "buy_creds",
    name: "Buy Creds",
    cap: Infinity,
    effect: "Instantly grants 30 minutes of current Creds/s",
    costFormula: () => 10,
  },
  {
    id: "cred_boost",
    name: "Cred Boost",
    cap: Infinity,
    effect: "+1% to all passive Creds/s",
    costFormula: (level: number) => Math.floor(50 * Math.pow(1.4, level)),
  },
  {
    id: "notoriety_boost",
    name: "Notoriety Boost",
    cap: Infinity,
    effect: "+1% to total Notoriety/hr",
    costFormula: (level: number) => Math.floor(100 * Math.pow(1.55, level)),
  },
  {
    id: "influencer_endorsement",
    name: "Influencer Endorsement",
    cap: 3,
    effect: "+10%, +25%, +50% Prestige gain bonuses",
    costFormula: (level: number) => Math.floor(1000 * Math.pow(3, level)),
  },
];
