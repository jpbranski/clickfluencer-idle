/**
 * notorietyGenerators.ts - Notoriety Generator Definitions
 *
 * Defines the three notoriety generators that produce Notoriety/hour
 * and consume Creds/s as upkeep.
 */

export interface NotorietyGenerator {
  id: string;
  name: string;
  baseFollowersPerSecond: number;
  baseNotorietyPerHour: number;
  baseCost: number;
  costMultiplier: number;
  upkeep: number;
  unlocked: boolean;
  maxLevel: number;
}

export const NOTORIETY_GENERATORS: NotorietyGenerator[] = [
  {
    id: "smm",
    name: "💼 Social Media Manager",
    baseFollowersPerSecond: 0,
    baseNotorietyPerHour: 1,
    baseCost: 100000,
    costMultiplier: 1.8,
    upkeep: 5000,
    unlocked: false,
    maxLevel: 10,
  },
  {
    id: "pr_team",
    name: "📣 PR Team",
    baseFollowersPerSecond: 0,
    baseNotorietyPerHour: 5,
    baseCost: 100000000,
    costMultiplier: 2.2,
    upkeep: 25000,
    unlocked: false,
    maxLevel: 10,
  },
  {
    id: "key_client",
    name: "🤝 Key Client",
    baseFollowersPerSecond: 0,
    baseNotorietyPerHour: 25,
    baseCost: 10000000000,
    costMultiplier: 2.5,
    upkeep: 250000,
    unlocked: false,
    maxLevel: 10,
  },
];
