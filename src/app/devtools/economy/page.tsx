"use client";

import { useState, useMemo } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import economyData from "@/data/economy-data.json";

interface EconomyConfig {
  generatorMultiplier: number;
  costScaling: number;
  upgradeMultiplier: number;
  prestigeThreshold: number;
  clickPower: number;
  globalProduction: number;
}

interface SimulationDataPoint {
  time: number;
  production: number;
  totalCreds: number;
  prestigeGain: number;
  cost: number;
}

const DEFAULT_CONFIG: EconomyConfig = {
  generatorMultiplier: 1.0,
  costScaling: 1.0,
  upgradeMultiplier: 1.0,
  prestigeThreshold: 1e7,
  clickPower: 1,
  globalProduction: 1.0,
};

const PRESET_CONFIGS: Record<string, EconomyConfig> = {
  default: DEFAULT_CONFIG,
  fast: {
    ...DEFAULT_CONFIG,
    generatorMultiplier: 2.0,
    prestigeThreshold: 1e6,
  },
  slow: {
    ...DEFAULT_CONFIG,
    generatorMultiplier: 0.5,
    costScaling: 1.5,
  },
  balanced: {
    ...DEFAULT_CONFIG,
    generatorMultiplier: 1.2,
    upgradeMultiplier: 1.1,
  },
};

export default function EconomyBalancerPage() {
  const [config, setConfig] = useState<EconomyConfig>(DEFAULT_CONFIG);
  const [simulationDuration, setSimulationDuration] = useState(60); // minutes
  const [activeTab, setActiveTab] = useState<"simulation" | "generators" | "upgrades">("simulation");

  // Calculate simulation data
  const simulationData = useMemo(() => {
    const data: SimulationDataPoint[] = [];
    const steps = Math.min(simulationDuration, 100); // Limit data points for performance

    for (let i = 0; i <= steps; i++) {
      const timeMinutes = (simulationDuration / steps) * i;
      const timeSeconds = timeMinutes * 60;

      // Simplified production calculation
      const baseProduction = economyData.generators.reduce((sum, gen) => {
        return sum + (gen.baseFollowersPerSecond * config.generatorMultiplier);
      }, 0);

      const production = baseProduction * config.globalProduction * timeSeconds;
      const totalCreds = production;
      const prestigeGain = totalCreds >= config.prestigeThreshold ? Math.floor(Math.log10(totalCreds / config.prestigeThreshold)) + 1 : 0;

      // Average cost across generators (scaled)
      const avgCost = economyData.generators.reduce((sum, gen) => sum + gen.baseCost, 0) / economyData.generators.length * config.costScaling;

      data.push({
        time: timeMinutes,
        production: baseProduction * config.globalProduction,
        totalCreds,
        prestigeGain,
        cost: avgCost * Math.pow(1.15, i / 10), // Exponential growth
      });
    }

    return data;
  }, [config, simulationDuration]);

  const updateConfig = (key: keyof EconomyConfig, value: number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const loadPreset = (presetName: string) => {
    const preset = PRESET_CONFIGS[presetName];
    if (preset) {
      setConfig(preset);
    }
  };

  const saveProfile = () => {
    const profileName = prompt("Enter profile name:");
    if (profileName) {
      localStorage.setItem(`economy-profile-${profileName}`, JSON.stringify(config));
      alert(`Profile "${profileName}" saved!`);
    }
  };

  const loadProfile = () => {
    const profileName = prompt("Enter profile name to load:");
    if (profileName) {
      const saved = localStorage.getItem(`economy-profile-${profileName}`);
      if (saved) {
        setConfig(JSON.parse(saved));
        alert(`Profile "${profileName}" loaded!`);
      } else {
        alert("Profile not found!");
      }
    }
  };

  const exportConfig = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "economy-config.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold mb-2 gradient-text">Economy Balancer DevTool</h1>
        <p className="text-muted">Interactive game economy simulation and testing environment</p>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex gap-2 border-b border-border">
          {["simulation", "generators", "upgrades"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-accent text-accent"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Simulation Controls */}
          <div className="card-premium p-6">
            <h2 className="text-xl font-bold mb-4">Simulation Controls</h2>

            <div className="space-y-4">
              <div>
                <label className="stat-label">Duration (minutes)</label>
                <input
                  type="range"
                  min="1"
                  max="180"
                  value={simulationDuration}
                  onChange={(e) => setSimulationDuration(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-muted mt-1">{simulationDuration} min</div>
              </div>
            </div>
          </div>

          {/* Economy Parameters */}
          <div className="card-premium p-6">
            <h2 className="text-xl font-bold mb-4">Economy Parameters</h2>

            <div className="space-y-4">
              <div>
                <label className="stat-label">Generator Multiplier</label>
                <input
                  type="number"
                  step="0.1"
                  value={config.generatorMultiplier}
                  onChange={(e) => updateConfig("generatorMultiplier", parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg"
                />
              </div>

              <div>
                <label className="stat-label">Cost Scaling</label>
                <input
                  type="number"
                  step="0.1"
                  value={config.costScaling}
                  onChange={(e) => updateConfig("costScaling", parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg"
                />
              </div>

              <div>
                <label className="stat-label">Upgrade Multiplier</label>
                <input
                  type="number"
                  step="0.1"
                  value={config.upgradeMultiplier}
                  onChange={(e) => updateConfig("upgradeMultiplier", parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg"
                />
              </div>

              <div>
                <label className="stat-label">Prestige Threshold</label>
                <input
                  type="number"
                  step="1000000"
                  value={config.prestigeThreshold}
                  onChange={(e) => updateConfig("prestigeThreshold", parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg"
                />
              </div>

              <div>
                <label className="stat-label">Global Production</label>
                <input
                  type="number"
                  step="0.1"
                  value={config.globalProduction}
                  onChange={(e) => updateConfig("globalProduction", parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Presets */}
          <div className="card-premium p-6">
            <h2 className="text-xl font-bold mb-4">Presets</h2>

            <div className="grid grid-cols-2 gap-2">
              {Object.keys(PRESET_CONFIGS).map((preset) => (
                <button
                  key={preset}
                  onClick={() => loadPreset(preset)}
                  className="btn-secondary text-sm"
                >
                  {preset}
                </button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border space-y-2">
              <button onClick={saveProfile} className="btn-primary w-full">
                Save Profile
              </button>
              <button onClick={loadProfile} className="btn-secondary w-full">
                Load Profile
              </button>
              <button onClick={exportConfig} className="btn-muted w-full">
                Export Config
              </button>
            </div>
          </div>
        </div>

        {/* Visualization Panel */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "simulation" && (
            <>
              {/* Production Over Time */}
              <div className="card-premium p-6">
                <h3 className="text-lg font-bold mb-4">Production per Second</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={simulationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="time" stroke="var(--muted)" label={{ value: "Time (min)", position: "insideBottom", offset: -5 }} />
                    <YAxis stroke="var(--muted)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="production" stroke="var(--accent)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Total Creds Over Time */}
              <div className="card-premium p-6">
                <h3 className="text-lg font-bold mb-4">Total Creds Accumulated</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={simulationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="time" stroke="var(--muted)" label={{ value: "Time (min)", position: "insideBottom", offset: -5 }} />
                    <YAxis stroke="var(--muted)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="totalCreds" stroke="#10b981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Prestige Gains */}
              <div className="card-premium p-6">
                <h3 className="text-lg font-bold mb-4">Prestige Points Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={simulationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="time" stroke="var(--muted)" label={{ value: "Time (min)", position: "insideBottom", offset: -5 }} />
                    <YAxis stroke="var(--muted)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="prestigeGain" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {activeTab === "generators" && (
            <div className="card-premium p-6">
              <h3 className="text-lg font-bold mb-4">Generator Cost Comparison</h3>
              <ResponsiveContainer width="100%" height={500}>
                <BarChart data={economyData.generators.map(g => ({
                  name: g.name,
                  baseCost: g.baseCost * config.costScaling,
                  production: g.baseFollowersPerSecond * config.generatorMultiplier,
                  maxCost: g.totalCostToMax * config.costScaling,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted)" />
                  <YAxis stroke="var(--muted)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="baseCost" fill="var(--accent)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeTab === "upgrades" && (
            <div className="card-premium p-6">
              <h3 className="text-lg font-bold mb-4">Upgrade Costs</h3>
              <ResponsiveContainer width="100%" height={500}>
                <BarChart data={economyData.upgrades.map(u => ({
                  name: u.name,
                  cost: u.totalCost * config.upgradeMultiplier,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted)" angle={-45} textAnchor="end" height={100} />
                  <YAxis stroke="var(--muted)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="cost" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Stats Summary */}
          <div className="card-premium p-6">
            <h3 className="text-lg font-bold mb-4">Simulation Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="stat-label">Final Production/sec</div>
                <div className="stat-value text-lg">
                  {simulationData[simulationData.length - 1]?.production.toFixed(2) || 0}
                </div>
              </div>
              <div>
                <div className="stat-label">Total Creds</div>
                <div className="stat-value text-lg">
                  {simulationData[simulationData.length - 1]?.totalCreds.toExponential(2) || 0}
                </div>
              </div>
              <div>
                <div className="stat-label">Prestige Points</div>
                <div className="stat-value text-lg">
                  {simulationData[simulationData.length - 1]?.prestigeGain || 0}
                </div>
              </div>
              <div>
                <div className="stat-label">Avg Cost Growth</div>
                <div className="stat-value text-lg">
                  {config.costScaling}x
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
