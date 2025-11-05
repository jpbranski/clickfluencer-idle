/**
 * exportEconomyData.ts - Economy Balance Export Script
 *
 * Generates comprehensive economy data exports in JSON and CSV formats
 * for balance tuning and analysis.
 */

import * as fs from "fs";
import * as path from "path";
import { NOTORIETY_GENERATORS } from "../game/generators/notorietyGenerators.js";
import { NOTORIETY_UPGRADES } from "../game/upgrades/notorietyUpgrades.js";
import { INITIAL_GENERATORS, INITIAL_UPGRADES } from "../game/state.js";
import { PRESTIGE_THRESHOLD, PRESTIGE_EXPONENT } from "../game/prestige.js";

// ============================================================================
// JSON EXPORT
// ============================================================================

interface GeneratorExport {
  id: string;
  baseCost: number;
  growthRate: number;
  upkeep?: number;
  levels: Array<{
    level: number;
    cost: number;
  }>;
}

interface UpgradeExport {
  id: string;
  cap: number | string;
  costs: number[];
  effect: string;
}

interface PrestigeExport {
  level: number;
  cost: number;
  points: number;
}

interface EconomyDataJSON {
  generators: GeneratorExport[];
  notorietyGenerators: GeneratorExport[];
  upgrades: UpgradeExport[];
  notorietyUpgrades: UpgradeExport[];
  prestige: PrestigeExport[];
}

function generateJSON(): EconomyDataJSON {
  // Export regular generators
  const generators: GeneratorExport[] = INITIAL_GENERATORS.map((gen) => {
    const levels = [];
    for (let i = 0; i < 20; i++) {
      levels.push({
        level: i,
        cost: Math.floor(gen.baseCost * Math.pow(gen.costMultiplier, i)),
      });
    }

    return {
      id: gen.id,
      baseCost: gen.baseCost,
      growthRate: gen.costMultiplier,
      levels,
    };
  });

  // Export notoriety generators
  const notorietyGenerators: GeneratorExport[] = NOTORIETY_GENERATORS.map(
    (gen) => {
      const levels = [];
      for (let i = 0; i < gen.maxLevel; i++) {
        levels.push({
          level: i + 1,
          cost: Math.floor(gen.baseCost * Math.pow(gen.growthRate, i)),
        });
      }

      return {
        id: gen.id,
        baseCost: gen.baseCost,
        growthRate: gen.growthRate,
        upkeep: gen.upkeep,
        levels,
      };
    }
  );

  // Export regular upgrades
  const upgrades: UpgradeExport[] = INITIAL_UPGRADES.map((upg) => {
    const costs: number[] = [];

    if (upg.tier !== undefined && upg.maxTier !== undefined) {
      // Tiered upgrade
      for (let i = 1; i <= upg.maxTier; i++) {
        costs.push(
          Math.floor(upg.cost * Math.pow(upg.costMultiplier || 1, i - 1))
        );
      }
    } else if (upg.currentLevel !== undefined) {
      // Infinite upgrade - show first 10 levels
      for (let i = 0; i < 10; i++) {
        costs.push(
          Math.floor(upg.cost * Math.pow(upg.costMultiplier || 1, i))
        );
      }
    } else {
      // One-time upgrade
      costs.push(upg.cost);
    }

    return {
      id: upg.id,
      cap: upg.maxTier !== undefined ? upg.maxTier : "infinite",
      costs,
      effect: upg.description,
    };
  });

  // Export notoriety upgrades
  const notorietyUpgrades: UpgradeExport[] = NOTORIETY_UPGRADES.map((upg) => {
    const costs: number[] = [];

    if (upg.cap === Infinity) {
      // Infinite upgrade - show first 10 levels
      for (let i = 0; i < 10; i++) {
        costs.push(Math.floor(upg.costFormula(i)));
      }
    } else {
      // Capped upgrade
      for (let i = 0; i < upg.cap; i++) {
        costs.push(Math.floor(upg.costFormula(i)));
      }
    }

    return {
      id: upg.id,
      cap: upg.cap === Infinity ? "infinite" : upg.cap,
      costs,
      effect: upg.effect,
    };
  });

  // Export prestige data
  const prestige: PrestigeExport[] = [];
  for (let i = 1; i <= 10; i++) {
    const cost = Math.ceil(
      PRESTIGE_THRESHOLD * Math.pow(i, 1 / PRESTIGE_EXPONENT)
    );
    prestige.push({
      level: i,
      cost,
      points: i,
    });
  }

  return {
    generators,
    notorietyGenerators,
    upgrades,
    notorietyUpgrades,
    prestige,
  };
}

// ============================================================================
// CSV EXPORT
// ============================================================================

function generateCSV(): string {
  const rows: string[][] = [
    [
      "Type",
      "Name",
      "ID",
      "Level",
      "Cost",
      "GrowthRate",
      "Effect",
      "Upkeep",
      "Notoriety/hr",
      "Notes",
    ],
  ];

  // Regular generators
  INITIAL_GENERATORS.forEach((gen) => {
    for (let i = 0; i < 10; i++) {
      const cost = Math.floor(gen.baseCost * Math.pow(gen.costMultiplier, i));
      rows.push([
        "Generator",
        gen.name,
        gen.id,
        String(i + 1),
        String(cost),
        String(gen.costMultiplier),
        `+${gen.baseFollowersPerSecond}/s`,
        "-",
        "-",
        "",
      ]);
    }
  });

  // Notoriety generators
  NOTORIETY_GENERATORS.forEach((gen) => {
    for (let i = 0; i < gen.maxLevel; i++) {
      const cost = Math.floor(gen.baseCost * Math.pow(gen.growthRate, i));
      rows.push([
        "Notoriety Generator",
        gen.name,
        gen.id,
        String(i + 1),
        String(cost),
        String(gen.growthRate),
        `+${gen.notorietyPerHour}/hr`,
        String(gen.upkeep),
        String(gen.notorietyPerHour),
        `Max Level: ${gen.maxLevel}`,
      ]);
    }
  });

  // Regular upgrades
  INITIAL_UPGRADES.forEach((upg) => {
    if (upg.tier !== undefined && upg.maxTier !== undefined) {
      // Tiered upgrade
      for (let i = 1; i <= upg.maxTier; i++) {
        const cost = Math.floor(
          upg.cost * Math.pow(upg.costMultiplier || 1, i - 1)
        );
        rows.push([
          "Upgrade",
          upg.name,
          upg.id,
          String(i),
          String(cost),
          String(upg.costMultiplier || "-"),
          upg.description,
          "-",
          "-",
          `Tier ${i}/${upg.maxTier}`,
        ]);
      }
    } else if (upg.currentLevel !== undefined) {
      // Infinite upgrade - show first 5 levels
      for (let i = 0; i < 5; i++) {
        const cost = Math.floor(
          upg.cost * Math.pow(upg.costMultiplier || 1, i)
        );
        rows.push([
          "Upgrade",
          upg.name,
          upg.id,
          String(i + 1),
          String(cost),
          String(upg.costMultiplier || "-"),
          upg.description,
          "-",
          "-",
          "Infinite",
        ]);
      }
    } else {
      // One-time upgrade
      rows.push([
        "Upgrade",
        upg.name,
        upg.id,
        "1",
        String(upg.cost),
        "-",
        upg.description,
        "-",
        "-",
        "One-time",
      ]);
    }
  });

  // Notoriety upgrades
  NOTORIETY_UPGRADES.forEach((upg) => {
    const maxLevels = upg.cap === Infinity ? 5 : upg.cap;
    for (let i = 0; i < maxLevels; i++) {
      const cost = Math.floor(upg.costFormula(i));
      rows.push([
        "Notoriety Upgrade",
        upg.name,
        upg.id,
        String(i + 1),
        String(cost),
        "-",
        upg.effect,
        "-",
        "-",
        upg.cap === Infinity ? "Infinite" : `Cap: ${upg.cap}`,
      ]);
    }
  });

  // Prestige levels
  for (let i = 1; i <= 10; i++) {
    const cost = Math.ceil(
      PRESTIGE_THRESHOLD * Math.pow(i, 1 / PRESTIGE_EXPONENT)
    );
    rows.push([
      "Prestige",
      `Prestige Level ${i}`,
      "prestige",
      String(i),
      String(cost),
      String(PRESTIGE_EXPONENT),
      `+${i} Reputation`,
      "-",
      "-",
      "+10% production per point",
    ]);
  }

  return rows.map((row) => row.join(",")).join("\n");
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main() {
  const dataDir = path.join(process.cwd(), "src", "data");

  // Ensure data directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Generate and write JSON
  const jsonData = generateJSON();
  const jsonPath = path.join(dataDir, "economy-data.json");
  fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
  console.log(`✅ JSON exported to ${jsonPath}`);

  // Generate and write CSV
  const csvData = generateCSV();
  const csvPath = path.join(dataDir, "economy-data.csv");
  fs.writeFileSync(csvPath, csvData);
  console.log(`✅ CSV exported to ${csvPath}`);

  console.log("\n📊 Economy data export complete!");
  console.log(
    `   - ${jsonData.generators.length} regular generators exported`
  );
  console.log(
    `   - ${jsonData.notorietyGenerators.length} notoriety generators exported`
  );
  console.log(`   - ${jsonData.upgrades.length} regular upgrades exported`);
  console.log(
    `   - ${jsonData.notorietyUpgrades.length} notoriety upgrades exported`
  );
  console.log(`   - ${jsonData.prestige.length} prestige levels exported`);
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { generateJSON, generateCSV, main as exportEconomyData };
