/**
 * exportEconomyData.ts - Economy Data Export Script
 *
 * Generates comprehensive economy data export files (JSON and CSV)
 * containing all game balance data for generators, notoriety generators,
 * upgrades, themes, and prestige levels.
 *
 * Run with: pnpm run export-economy
 */

import * as fs from "fs";
import * as path from "path";
import {
  INITIAL_GENERATORS,
  INITIAL_NOTORIETY_GENERATORS,
  INITIAL_UPGRADES,
} from "../game/state";
import { themes } from "../data/themes";

// ============================================================================
// TYPES
// ============================================================================

interface GeneratorLevel {
  level: number;
  cost: number;
  totalCost: number;
}

interface Generator {
  id: string;
  name: string;
  baseCost: number;
  growthRate: number;
  baseFollowersPerSecond: number;
  levels: GeneratorLevel[];
  totalCostToMax: number;
}

interface NotorietyGeneratorLevel {
  level: number;
  cost: number;
  totalCost: number;
}

interface NotorietyGenerator {
  id: string;
  name: string;
  baseCost: number;
  growthRate: number;
  upkeep: number;
  notorietyPerHour: number;
  maxLevel: number;
  levels: NotorietyGeneratorLevel[];
  totalCostToMax: number;
}

interface Upgrade {
  id: string;
  name: string;
  cap: number | "infinite";
  effect: string;
  costPerLevel: number[];
  totalCost: number;
}

interface Theme {
  id: string;
  name: string;
  cost: number;
  perk: string;
}

interface PrestigeLevel {
  level: number;
  cost: number;
  prestigePoints: number;
}

interface EconomyData {
  generators: Generator[];
  notorietyGenerators: NotorietyGenerator[];
  upgrades: Upgrade[];
  themes: Theme[];
  prestige: PrestigeLevel[];
}

interface CSVRow {
  Type: string;
  Name: string;
  ID: string;
  Level: string;
  Cost: string;
  TotalCost: string;
  GrowthRate: string;
  Effect: string;
  Upkeep: string;
  "Notoriety/hr": string;
  PrestigePoints: string;
  Notes: string;
}

// ============================================================================
// CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate cost for a generator at a specific level
 */
function calculateGeneratorCost(baseCost: number, growthRate: number, level: number): number {
  return Math.floor(baseCost * Math.pow(growthRate, level));
}

/**
 * Calculate total cost to reach a specific level
 */
function calculateTotalCost(
  baseCost: number,
  growthRate: number,
  maxLevel: number
): { levels: { level: number; cost: number; totalCost: number }[]; total: number } {
  const levels: { level: number; cost: number; totalCost: number }[] = [];
  let total = 0;

  for (let i = 0; i < maxLevel; i++) {
    const cost = calculateGeneratorCost(baseCost, growthRate, i);
    total += cost;
    levels.push({
      level: i + 1,
      cost,
      totalCost: total,
    });
  }

  return { levels, total };
}

/**
 * Calculate upgrade costs for tiered or infinite upgrades
 */
function calculateUpgradeCosts(upgrade: any): number[] {
  const costs: number[] = [];

  // Handle tiered upgrades (with maxTier)
  if (upgrade.maxTier !== undefined && upgrade.tier !== undefined) {
    const maxTiers = upgrade.maxTier;
    for (let i = 0; i < maxTiers; i++) {
      costs.push(Math.floor(upgrade.cost * Math.pow(upgrade.costMultiplier, i)));
    }
  }
  // Handle infinite upgrades (maxLevel undefined, has costMultiplier)
  else if (upgrade.maxLevel === undefined && upgrade.costMultiplier) {
    // For infinite upgrades, show first 10 levels as examples
    for (let i = 0; i < 10; i++) {
      costs.push(Math.floor(upgrade.cost * Math.pow(upgrade.costMultiplier, i)));
    }
  }
  // Handle one-time upgrades
  else if (!upgrade.tier && !upgrade.maxLevel) {
    costs.push(upgrade.cost);
  }

  return costs;
}

/**
 * Calculate prestige cost using the exponential formula
 * Formula: 1e7 * (p + 1)^2.5
 */
function calculatePrestigeCost(prestigeLevel: number): number {
  return Math.floor(1e7 * Math.pow(prestigeLevel + 1, 2.5));
}

// ============================================================================
// DATA GENERATION FUNCTIONS
// ============================================================================

/**
 * Generate generator data
 */
function generateGeneratorData(): Generator[] {
  return INITIAL_GENERATORS.map((gen) => {
    // Calculate costs for levels (assuming max 100 purchases for regular generators)
    const { levels, total } = calculateTotalCost(
      gen.baseCost,
      gen.costMultiplier,
      100
    );

    return {
      id: gen.id,
      name: gen.name,
      baseCost: gen.baseCost,
      growthRate: gen.costMultiplier,
      baseFollowersPerSecond: gen.baseFollowersPerSecond,
      levels,
      totalCostToMax: total,
    };
  });
}

/**
 * Generate notoriety generator data
 */
function generateNotorietyGeneratorData(): NotorietyGenerator[] {
  return INITIAL_NOTORIETY_GENERATORS.map((gen) => {
    // Calculate costs for all levels up to maxLevel
    const { levels, total } = calculateTotalCost(
      gen.baseCost,
      gen.costMultiplier,
      gen.maxLevel
    );

    return {
      id: gen.id,
      name: gen.name,
      baseCost: gen.baseCost,
      growthRate: gen.costMultiplier,
      upkeep: gen.upkeep,
      notorietyPerHour: gen.baseNotorietyPerSecond * 3600,
      maxLevel: gen.maxLevel,
      levels,
      totalCostToMax: total,
    };
  });
}

/**
 * Generate upgrade data
 */
function generateUpgradeData(): Upgrade[] {
  return INITIAL_UPGRADES.map((upgrade) => {
    const costs = calculateUpgradeCosts(upgrade);
    const totalCost = costs.reduce((sum, cost) => sum + cost, 0);

    // Determine cap
    let cap: number | "infinite";
    if (upgrade.maxLevel === undefined && upgrade.costMultiplier) {
      cap = "infinite";
    } else if (upgrade.maxTier) {
      cap = upgrade.maxTier;
    } else {
      cap = 1; // One-time purchase
    }

    return {
      id: upgrade.id,
      name: upgrade.name,
      cap,
      effect: upgrade.description,
      costPerLevel: costs,
      totalCost: cap === "infinite" ? costs[0] : totalCost,
    };
  });
}

/**
 * Generate theme data
 */
function generateThemeData(): Theme[] {
  return themes.map((theme) => ({
    id: theme.id,
    name: theme.name,
    cost: theme.cost,
    perk: theme.bonusMultiplier === 1
      ? "Cosmetic only"
      : `+${((theme.bonusMultiplier - 1) * 100).toFixed(0)}% production boost`,
  }));
}

/**
 * Generate prestige data (levels 1-10)
 */
function generatePrestigeData(): PrestigeLevel[] {
  const prestigeLevels: PrestigeLevel[] = [];

  for (let i = 1; i <= 10; i++) {
    prestigeLevels.push({
      level: i,
      cost: calculatePrestigeCost(i),
      prestigePoints: i,
    });
  }

  return prestigeLevels;
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

/**
 * Generate JSON export
 */
function generateJSON(data: EconomyData): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Generate CSV export
 */
function generateCSV(data: EconomyData): string {
  const rows: CSVRow[] = [];

  // Add generators
  data.generators.forEach((gen) => {
    gen.levels.slice(0, 10).forEach((level) => {
      rows.push({
        Type: "Generator",
        Name: gen.name,
        ID: gen.id,
        Level: level.level.toString(),
        Cost: level.cost.toExponential(2),
        TotalCost: level.totalCost.toExponential(2),
        GrowthRate: gen.growthRate.toString(),
        Effect: `+${gen.baseFollowersPerSecond}/s`,
        Upkeep: "—",
        "Notoriety/hr": "—",
        PrestigePoints: "—",
        Notes: "",
      });
    });
  });

  // Add notoriety generators
  data.notorietyGenerators.forEach((gen) => {
    gen.levels.forEach((level) => {
      rows.push({
        Type: "Notoriety Generator",
        Name: gen.name,
        ID: gen.id,
        Level: level.level.toString(),
        Cost: level.cost.toExponential(2),
        TotalCost: level.totalCost.toExponential(2),
        GrowthRate: gen.growthRate.toString(),
        Effect: `+${gen.notorietyPerHour}/hr notoriety`,
        Upkeep: gen.upkeep.toString(),
        "Notoriety/hr": gen.notorietyPerHour.toString(),
        PrestigePoints: "—",
        Notes: `Max level ${gen.maxLevel}`,
      });
    });
  });

  // Add upgrades
  data.upgrades.forEach((upgrade) => {
    if (upgrade.cap === "infinite") {
      // Show first level for infinite upgrades
      rows.push({
        Type: "Upgrade",
        Name: upgrade.name,
        ID: upgrade.id,
        Level: "1",
        Cost: upgrade.costPerLevel[0].toExponential(2),
        TotalCost: upgrade.costPerLevel[0].toExponential(2),
        GrowthRate: "—",
        Effect: upgrade.effect,
        Upkeep: "—",
        "Notoriety/hr": "—",
        PrestigePoints: "—",
        Notes: "Infinite",
      });
    } else {
      upgrade.costPerLevel.forEach((cost, index) => {
        rows.push({
          Type: "Upgrade",
          Name: upgrade.name,
          ID: upgrade.id,
          Level: (index + 1).toString(),
          Cost: cost.toExponential(2),
          TotalCost: upgrade.costPerLevel
            .slice(0, index + 1)
            .reduce((sum, c) => sum + c, 0)
            .toExponential(2),
          GrowthRate: "—",
          Effect: upgrade.effect,
          Upkeep: "—",
          "Notoriety/hr": "—",
          PrestigePoints: "—",
          Notes: upgrade.cap === 1 ? "One-time" : "",
        });
      });
    }
  });

  // Add themes
  data.themes.forEach((theme) => {
    rows.push({
      Type: "Theme",
      Name: theme.name,
      ID: theme.id,
      Level: "—",
      Cost: theme.cost.toString(),
      TotalCost: "—",
      GrowthRate: "—",
      Effect: theme.perk,
      Upkeep: "—",
      "Notoriety/hr": "—",
      PrestigePoints: "—",
      Notes: "",
    });
  });

  // Add prestige levels
  data.prestige.forEach((prestige) => {
    rows.push({
      Type: "Prestige",
      Name: "Prestige",
      ID: "prestige",
      Level: prestige.level.toString(),
      Cost: prestige.cost.toExponential(2),
      TotalCost: "—",
      GrowthRate: "—",
      Effect: "Reset progress",
      Upkeep: "—",
      "Notoriety/hr": "—",
      PrestigePoints: prestige.prestigePoints.toString(),
      Notes: `Requires ${prestige.cost.toExponential(2)} Followers`,
    });
  });

  // Generate CSV header
  const header = Object.keys(rows[0]).join(",");

  // Generate CSV rows
  const csvRows = rows.map((row) =>
    Object.values(row)
      .map((val) => `"${val}"`)
      .join(",")
  );

  return [header, ...csvRows].join("\n");
}

// ============================================================================
// MAIN EXPORT FUNCTION
// ============================================================================

function exportEconomyData() {
  console.log("🎮 Generating economy data export...\n");

  // Generate all data
  const data: EconomyData = {
    generators: generateGeneratorData(),
    notorietyGenerators: generateNotorietyGeneratorData(),
    upgrades: generateUpgradeData(),
    themes: generateThemeData(),
    prestige: generatePrestigeData(),
  };

  // Create output directory
  const dataDir = path.join(process.cwd(), "src", "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Export JSON
  const jsonPath = path.join(dataDir, "economy-data.json");
  const jsonContent = generateJSON(data);
  fs.writeFileSync(jsonPath, jsonContent, "utf-8");
  console.log(`✅ JSON export complete: ${jsonPath}`);
  console.log(`   - ${data.generators.length} generators`);
  console.log(`   - ${data.notorietyGenerators.length} notoriety generators`);
  console.log(`   - ${data.upgrades.length} upgrades`);
  console.log(`   - ${data.themes.length} themes`);
  console.log(`   - ${data.prestige.length} prestige levels\n`);

  // Export CSV
  const csvPath = path.join(dataDir, "economy-data.csv");
  const csvContent = generateCSV(data);
  fs.writeFileSync(csvPath, csvContent, "utf-8");
  console.log(`✅ CSV export complete: ${csvPath}`);
  console.log(`   - ${csvContent.split("\n").length - 1} total rows\n`);

  console.log("🎉 Economy data export complete!");
}

// Run if called directly
if (require.main === module) {
  exportEconomyData();
}

export { exportEconomyData };
