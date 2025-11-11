"use client";

/**
 * Save Editor Page - Developer Tool for Save File Manipulation
 *
 * Allows viewing, modifying, and exporting/importing game saves.
 * WARNING: Custom saves are experimental and may cause instability.
 */

import { useState, useEffect } from "react";
import { useGame } from "@/hooks/useGame";
import { useRouter } from "next/navigation";
import { GameState } from "@/game/state";
import { themes as allThemes } from "@/data/themes";
import { exportSave, importSave as importSaveData } from "@/lib/storage";

export default function SaveEditorPage() {
  const { state, handleImportSave } = useGame();
  const router = useRouter();

  // Form state for all editable fields
  const [formData, setFormData] = useState({
    // Core currencies
    creds: 0,
    awards: 0,
    prestige: 0,
    notoriety: 0,

    // Generators (6 types)
    gen_photo: 0,
    gen_video: 0,
    gen_stream: 0,
    gen_collab: 0,
    gen_brand: 0,
    gen_agency: 0,

    // Notoriety Generators
    notgen_smm: 0,
    notgen_pr_team: 0,
    notgen_key_client: 0,

    // Infinite Upgrades
    upgrade_ai_enhancements: 0,
    upgrade_better_filters: 0,

    // Tiered Upgrades
    upgrade_better_camera: 0,
    upgrade_lucky_charm: 0,
    upgrade_overnight_success: 0,
    upgrade_cred_cache: 0,

    // Other Upgrades (boolean purchased state)
    upgrade_editing_software: false,
    upgrade_viral_strategy: false,

    // Notoriety Upgrades
    notupgrade_cache_value: 0,
    notupgrade_drama_boost: 0,
    notupgrade_buy_creds: 0,
    notupgrade_cred_boost: 0,
    notupgrade_notoriety_boost: 0,
    notupgrade_influencer_endorsement: 0,

    // Themes (multi-select)
    unlockedThemes: [] as string[],
    activeTheme: "dark",
  });

  const [importError, setImportError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load current save data into form
  useEffect(() => {
    if (state) {
      setFormData({
        // Core currencies
        creds: state.creds || 0,
        awards: state.awards || 0,
        prestige: state.prestige || 0,
        notoriety: state.notoriety || 0,

        // Generators
        gen_photo: state.generators.find((g) => g.id === "photo")?.count || 0,
        gen_video: state.generators.find((g) => g.id === "video")?.count || 0,
        gen_stream: state.generators.find((g) => g.id === "stream")?.count || 0,
        gen_collab: state.generators.find((g) => g.id === "collab")?.count || 0,
        gen_brand: state.generators.find((g) => g.id === "brand")?.count || 0,
        gen_agency: state.generators.find((g) => g.id === "agency")?.count || 0,

        // Notoriety Generators
        notgen_smm: state.notorietyGenerators?.smm || 0,
        notgen_pr_team: state.notorietyGenerators?.pr_team || 0,
        notgen_key_client: state.notorietyGenerators?.key_client || 0,

        // Infinite Upgrades
        upgrade_ai_enhancements: state.upgrades.find((u) => u.id === "ai_enhancements")?.currentLevel || 0,
        upgrade_better_filters: state.upgrades.find((u) => u.id === "better_filters")?.currentLevel || 0,

        // Tiered Upgrades
        upgrade_better_camera: state.upgrades.find((u) => u.id === "better_camera")?.tier || 0,
        upgrade_lucky_charm: state.upgrades.find((u) => u.id === "lucky_charm")?.tier || 0,
        upgrade_overnight_success: state.upgrades.find((u) => u.id === "overnight_success")?.tier || 0,
        upgrade_cred_cache: state.upgrades.find((u) => u.id === "cred_cache")?.tier || 0,

        // Other Upgrades
        upgrade_editing_software: state.upgrades.find((u) => u.id === "editing_software")?.purchased || false,
        upgrade_viral_strategy: state.upgrades.find((u) => u.id === "viral_strategy")?.purchased || false,

        // Notoriety Upgrades
        notupgrade_cache_value: state.notorietyUpgrades?.cache_value || 0,
        notupgrade_drama_boost: state.notorietyUpgrades?.drama_boost || 0,
        notupgrade_buy_creds: state.notorietyUpgrades?.buy_creds || 0,
        notupgrade_cred_boost: state.notorietyUpgrades?.cred_boost || 0,
        notupgrade_notoriety_boost: state.notorietyUpgrades?.notoriety_boost || 0,
        notupgrade_influencer_endorsement: state.notorietyUpgrades?.influencer_endorsement || 0,

        // Themes
        unlockedThemes: state.themes?.filter((t) => t.unlocked).map((t) => t.id) || ["dark", "light"],
        activeTheme: state.themes?.find((t) => t.active)?.id || "dark",
      });
    }
  }, [state]);

  const handleNumberChange = (field: string, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setFormData((prev) => ({ ...prev, [field]: Math.max(0, numValue) }));
    }
  };

  const handleBooleanChange = (field: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: checked }));
  };

  const handleThemeToggle = (themeId: string) => {
    setFormData((prev) => {
      const unlocked = prev.unlockedThemes.includes(themeId);
      if (unlocked) {
        return {
          ...prev,
          unlockedThemes: prev.unlockedThemes.filter((id) => id !== themeId),
        };
      } else {
        return {
          ...prev,
          unlockedThemes: [...prev.unlockedThemes, themeId],
        };
      }
    });
  };

  const handleDownload = async () => {
    try {
      const saveData = await exportSave();
      if (!saveData) {
        setImportError("Failed to export save data");
        return;
      }

      // Parse and modify with form data
      const parsed = JSON.parse(saveData);
      const modifiedState = applyFormDataToState(parsed.data);
      parsed.data = modifiedState;

      const blob = new Blob([JSON.stringify(parsed, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `clickfluencer-save-${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);

      setSuccessMessage("Save file downloaded successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setImportError("Failed to download save file");
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,.txt";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const data = event.target?.result as string;
            const confirmed = window.confirm(
              "Are you sure you want to import this save? This will overwrite your current progress."
            );
            if (confirmed) {
              const doubleConfirm = window.confirm(
                "FINAL WARNING: This action cannot be undone. Proceed with import?"
              );
              if (doubleConfirm) {
                handleImportSave(data);
                setSuccessMessage("Save imported successfully! Reloading...");
                setTimeout(() => window.location.reload(), 1500);
              }
            }
            setImportError(null);
          } catch (error) {
            setImportError("Invalid save file format");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleReset = () => {
    if (state) {
      // Reset form to current state
      const confirmed = window.confirm("Reset form to current save state?");
      if (confirmed) {
        window.location.reload();
      }
    }
  };

  const applyFormDataToState = (currentState: GameState): GameState => {
    // Create a deep copy and apply form modifications
    const newState = { ...currentState };

    // Core currencies
    newState.creds = formData.creds;
    newState.awards = formData.awards;
    newState.prestige = formData.prestige;
    newState.notoriety = formData.notoriety;

    // Generators
    newState.generators = newState.generators.map((g) => {
      const formKey = `gen_${g.id}` as keyof typeof formData;
      if (formKey in formData) {
        return { ...g, count: formData[formKey] as number };
      }
      return g;
    });

    // Notoriety Generators
    newState.notorietyGenerators = {
      smm: formData.notgen_smm,
      pr_team: formData.notgen_pr_team,
      key_client: formData.notgen_key_client,
    };

    // Upgrades
    newState.upgrades = newState.upgrades.map((u) => {
      // Infinite upgrades
      if (u.id === "ai_enhancements") {
        return { ...u, currentLevel: formData.upgrade_ai_enhancements, purchased: formData.upgrade_ai_enhancements > 0 };
      }
      if (u.id === "better_filters") {
        return { ...u, currentLevel: formData.upgrade_better_filters, purchased: formData.upgrade_better_filters > 0 };
      }

      // Tiered upgrades
      if (u.id === "better_camera") {
        return { ...u, tier: formData.upgrade_better_camera, purchased: formData.upgrade_better_camera >= (u.maxTier || 7) };
      }
      if (u.id === "lucky_charm") {
        return { ...u, tier: formData.upgrade_lucky_charm, purchased: formData.upgrade_lucky_charm >= (u.maxTier || 4) };
      }
      if (u.id === "overnight_success") {
        return { ...u, tier: formData.upgrade_overnight_success, purchased: formData.upgrade_overnight_success >= (u.maxTier || 4) };
      }
      if (u.id === "cred_cache") {
        return { ...u, tier: formData.upgrade_cred_cache, purchased: formData.upgrade_cred_cache >= (u.maxTier || 6) };
      }

      // Boolean upgrades
      if (u.id === "editing_software") {
        return { ...u, purchased: formData.upgrade_editing_software };
      }
      if (u.id === "viral_strategy") {
        return { ...u, purchased: formData.upgrade_viral_strategy };
      }

      return u;
    });

    // Notoriety Upgrades
    newState.notorietyUpgrades = {
      cache_value: formData.notupgrade_cache_value,
      drama_boost: formData.notupgrade_drama_boost,
      buy_creds: formData.notupgrade_buy_creds,
      cred_boost: formData.notupgrade_cred_boost,
      notoriety_boost: formData.notupgrade_notoriety_boost,
      influencer_endorsement: formData.notupgrade_influencer_endorsement,
    };

    // Themes
    newState.themes = newState.themes.map((t) => ({
      ...t,
      unlocked: formData.unlockedThemes.includes(t.id),
      active: t.id === formData.activeTheme,
    }));

    return newState;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Save Editor</h1>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-surface hover:bg-surface-hover rounded-lg transition-colors"
          >
            Back to Game
          </button>
        </div>

        {/* Warning Box (Static Red - Non-Themed) */}
        <div className="bg-red-900 border-2 border-red-700 text-red-100 p-4 rounded-lg">
          <p className="font-semibold flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            Custom saves are experimental
          </p>
          <p className="mt-1 text-sm">
            Excessively large numbers may cause instability. Use at your own risk.
          </p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="bg-green-900/50 border border-green-700 text-green-100 p-3 rounded-lg">
            {successMessage}
          </div>
        )}
        {importError && (
          <div className="bg-red-900/50 border border-red-700 text-red-100 p-3 rounded-lg">
            {importError}
          </div>
        )}

        {/* Core Currencies */}
        <div className="bg-surface p-4 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold text-primary">Core Currencies</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Creds</label>
              <input
                type="number"
                value={formData.creds}
                onChange={(e) => handleNumberChange("creds", e.target.value)}
                className="w-full px-3 py-2 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Awards</label>
              <input
                type="number"
                value={formData.awards}
                onChange={(e) => handleNumberChange("awards", e.target.value)}
                className="w-full px-3 py-2 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prestige</label>
              <input
                type="number"
                value={formData.prestige}
                onChange={(e) => handleNumberChange("prestige", e.target.value)}
                className="w-full px-3 py-2 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notoriety</label>
              <input
                type="number"
                value={formData.notoriety}
                onChange={(e) => handleNumberChange("notoriety", e.target.value)}
                className="w-full px-3 py-2 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Cred Generators */}
        <div className="bg-surface p-4 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold text-primary">Cred Generators</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">📸 Photo Post</label>
              <input
                type="number"
                value={formData.gen_photo}
                onChange={(e) => handleNumberChange("gen_photo", e.target.value)}
                className="w-full px-3 py-2 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">🎥 Video Content</label>
              <input
                type="number"
                value={formData.gen_video}
                onChange={(e) => handleNumberChange("gen_video", e.target.value)}
                className="w-full px-3 py-2 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">📹 Live Stream</label>
              <input
                type="number"
                value={formData.gen_stream}
                onChange={(e) => handleNumberChange("gen_stream", e.target.value)}
                className="w-full px-3 py-2 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">🤝 Collaboration</label>
              <input
                type="number"
                value={formData.gen_collab}
                onChange={(e) => handleNumberChange("gen_collab", e.target.value)}
                className="w-full px-3 py-2 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">💼 Brand Deal</label>
              <input
                type="number"
                value={formData.gen_brand}
                onChange={(e) => handleNumberChange("gen_brand", e.target.value)}
                className="w-full px-3 py-2 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">🏢 Talent Agency</label>
              <input
                type="number"
                value={formData.gen_agency}
                onChange={(e) => handleNumberChange("gen_agency", e.target.value)}
                className="w-full px-3 py-2 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Notoriety Generators */}
        <div className="bg-surface p-4 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold text-primary">Notoriety Generators</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">📱 Social Media Manager (max 10)</label>
              <input
                type="number"
                max="10"
                value={formData.notgen_smm}
                onChange={(e) => handleNumberChange("notgen_smm", e.target.value)}
                className="w-full px-3 py-2 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">📢 PR Team (max 10)</label>
              <input
                type="number"
                max="10"
                value={formData.notgen_pr_team}
                onChange={(e) => handleNumberChange("notgen_pr_team", e.target.value)}
                className="w-full px-3 py-2 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">🔑 Key Client (max 10)</label>
              <input
                type="number"
                max="10"
                value={formData.notgen_key_client}
                onChange={(e) => handleNumberChange("notgen_key_client", e.target.value)}
                className="w-full px-3 py-2 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Upgrades */}
        <div className="bg-surface p-4 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold text-primary">Upgrades</h2>

          {/* Infinite Upgrades */}
          <div>
            <h3 className="text-lg font-medium mb-2">Infinite Upgrades</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">🤖 AI Enhancements</label>
                <input
                  type="number"
                  value={formData.upgrade_ai_enhancements}
                  onChange={(e) => handleNumberChange("upgrade_ai_enhancements", e.target.value)}
                  className="w-full px-3 py-2 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">📸 Better Filters</label>
                <input
                  type="number"
                  value={formData.upgrade_better_filters}
                  onChange={(e) => handleNumberChange("upgrade_better_filters", e.target.value)}
                  className="w-full px-3 py-2 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Tiered Upgrades */}
          <div>
            <h3 className="text-lg font-medium mb-2">Tiered Upgrades</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">📸 Better Camera (max 7)</label>
                <input
                  type="number"
                  max="7"
                  value={formData.upgrade_better_camera}
                  onChange={(e) => handleNumberChange("upgrade_better_camera", e.target.value)}
                  className="w-full px-3 py-2 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">💎 Lucky Charm (max 4)</label>
                <input
                  type="number"
                  max="4"
                  value={formData.upgrade_lucky_charm}
                  onChange={(e) => handleNumberChange("upgrade_lucky_charm", e.target.value)}
                  className="w-full px-3 py-2 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">🌙 Overnight Success (max 4)</label>
                <input
                  type="number"
                  max="4"
                  value={formData.upgrade_overnight_success}
                  onChange={(e) => handleNumberChange("upgrade_overnight_success", e.target.value)}
                  className="w-full px-3 py-2 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">💰 Cred Cache (max 6)</label>
                <input
                  type="number"
                  max="6"
                  value={formData.upgrade_cred_cache}
                  onChange={(e) => handleNumberChange("upgrade_cred_cache", e.target.value)}
                  className="w-full px-3 py-2 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Boolean Upgrades */}
          <div>
            <h3 className="text-lg font-medium mb-2">One-Time Upgrades</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.upgrade_editing_software}
                  onChange={(e) => handleBooleanChange("upgrade_editing_software", e.target.checked)}
                  className="w-4 h-4"
                />
                <span>✂️ Editing Software</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.upgrade_viral_strategy}
                  onChange={(e) => handleBooleanChange("upgrade_viral_strategy", e.target.checked)}
                  className="w-4 h-4"
                />
                <span>🔥 Viral Strategy</span>
              </label>
            </div>
          </div>
        </div>

        {/* Notoriety Upgrades */}
        <div className="bg-surface p-4 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold text-primary">Notoriety Upgrades</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">💎 Cache Value</label>
              <input
                type="number"
                value={formData.notupgrade_cache_value}
                onChange={(e) => handleNumberChange("notupgrade_cache_value", e.target.value)}
                className="w-full px-3 py-2 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">📰 Drama Boost</label>
              <input
                type="number"
                value={formData.notupgrade_drama_boost}
                onChange={(e) => handleNumberChange("notupgrade_drama_boost", e.target.value)}
                className="w-full px-3 py-2 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">💵 Buy Creds</label>
              <input
                type="number"
                value={formData.notupgrade_buy_creds}
                onChange={(e) => handleNumberChange("notupgrade_buy_creds", e.target.value)}
                className="w-full px-3 py-2 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">📈 Cred Boost</label>
              <input
                type="number"
                value={formData.notupgrade_cred_boost}
                onChange={(e) => handleNumberChange("notupgrade_cred_boost", e.target.value)}
                className="w-full px-3 py-2 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">⚡ Notoriety Boost</label>
              <input
                type="number"
                value={formData.notupgrade_notoriety_boost}
                onChange={(e) => handleNumberChange("notupgrade_notoriety_boost", e.target.value)}
                className="w-full px-3 py-2 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">🌟 Influencer Endorsement</label>
              <input
                type="number"
                value={formData.notupgrade_influencer_endorsement}
                onChange={(e) => handleNumberChange("notupgrade_influencer_endorsement", e.target.value)}
                className="w-full px-3 py-2 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Themes */}
        <div className="bg-surface p-4 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold text-primary">Themes</h2>
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-2">Unlocked Themes (select multiple)</label>
            <div className="grid grid-cols-2 gap-2">
              {allThemes.map((theme) => (
                <label key={theme.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.unlockedThemes.includes(theme.id)}
                    onChange={() => handleThemeToggle(theme.id)}
                    className="w-4 h-4"
                  />
                  <span>{theme.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Active Theme</label>
            <select
              value={formData.activeTheme}
              onChange={(e) => setFormData((prev) => ({ ...prev, activeTheme: e.target.value }))}
              className="w-full px-3 py-2 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {formData.unlockedThemes.map((themeId) => {
                const theme = allThemes.find((t) => t.id === themeId);
                return (
                  <option key={themeId} value={themeId}>
                    {theme?.name || themeId}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleDownload}
            className="flex-1 px-6 py-3 bg-primary text-primary-foreground hover:bg-primary-hover rounded-lg font-semibold transition-colors"
          >
            Download Save File
          </button>
          <button
            onClick={handleImport}
            className="flex-1 px-6 py-3 bg-accent text-accent-foreground hover:bg-accent-hover rounded-lg font-semibold transition-colors"
          >
            Import Settings
          </button>
          <button
            onClick={handleReset}
            className="flex-1 px-6 py-3 bg-surface hover:bg-surface-hover rounded-lg font-semibold transition-colors"
          >
            Reset Form
          </button>
        </div>
      </div>
    </div>
  );
}
