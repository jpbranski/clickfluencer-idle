"use client";

/**
 * ShareButtons.tsx - Social Media Share Component
 *
 * Provides share buttons for X (Twitter) and Facebook
 * Generates a dynamic image with game stats
 */

import { useCallback, useRef } from "react";
import { formatNumber } from "@/game/format";

interface ShareButtonsProps {
  creds: number;
  score: number;
  prestige?: number;
  achievementsUnlocked?: number;
}

export function ShareButtons({ creds, score, prestige = 0, achievementsUnlocked = 0 }: ShareButtonsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * Generate an image with game stats on a theme-based gradient background
   */
  const generateShareImage = useCallback(async (): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 630; // Optimal for social media (OG image size)
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve("");
        return;
      }

      // Get theme colors from CSS variables
      const accentColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent').trim() || '#5865f2';
      const surfaceColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--surface').trim() || '#161b22';

      // Create theme-based gradient background
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height,
      );
      gradient.addColorStop(0, accentColor);
      gradient.addColorStop(0.7, surfaceColor);
      gradient.addColorStop(1, accentColor);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add semi-transparent overlay for better text readability
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Title - larger and centered
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 80px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Clickfluencer Idle", canvas.width / 2, 150);

      // Subtitle
      ctx.font = "32px sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.fillText("My Progress", canvas.width / 2, 210);

      // Row 1: Score + Prestige
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 48px sans-serif";
      ctx.textAlign = "center";

      // Score (left side of center)
      ctx.fillText(`📊 Score`, canvas.width / 2 - 220, 340);
      ctx.font = "bold 56px sans-serif";
      ctx.fillText(formatNumber(score), canvas.width / 2 - 220, 400);

      // Prestige (right side of center)
      ctx.font = "bold 48px sans-serif";
      ctx.fillText(`🔱 Prestige`, canvas.width / 2 + 220, 340);
      ctx.font = "bold 56px sans-serif";
      ctx.fillText(formatNumber(prestige), canvas.width / 2 + 220, 400);

      // Row 2: Achievements (centered)
      ctx.font = "bold 48px sans-serif";
      ctx.fillText(`🏆 Achievements`, canvas.width / 2, 500);
      ctx.font = "bold 56px sans-serif";
      ctx.fillText(`${achievementsUnlocked} Unlocked`, canvas.width / 2, 560);

      // Convert to data URL
      resolve(canvas.toDataURL("image/png"));
    });
  }, [creds, score, prestige, achievementsUnlocked]);

  /**
   * Share on X (Twitter)
   */
  const handleShareX = useCallback(async () => {
    const text = `I'm building my social media empire in Clickfluencer Idle! 🚀\n\n📊 Score: ${formatNumber(score)}\n🔱 Prestige: ${formatNumber(prestige)}\n🏆 Achievements: ${achievementsUnlocked}\n\nCan you beat my progress?`;
    const url = window.location.href;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;

    window.open(twitterUrl, "_blank", "width=550,height=420");
  }, [score, prestige, achievementsUnlocked]);

  /**
   * Share on Facebook
   */
  const handleShareFacebook = useCallback(async () => {
    const url = window.location.href;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

    window.open(facebookUrl, "_blank", "width=550,height=420");
  }, []);

  /**
   * Download share image
   */
  const handleDownloadImage = useCallback(async () => {
    const imageData = await generateShareImage();
    if (!imageData) return;

    const link = document.createElement("a");
    link.download = `clickfluencer-${Date.now()}.png`;
    link.href = imageData;
    link.click();
  }, [generateShareImage]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center mb-1">
        <h3 className="text-lg font-bold text-foreground mb-1">Your Progress</h3>
        <p className="text-xs text-muted">Share your achievements with the world</p>
      </div>

      {/* Stats Display - Option C Enhanced Layout */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Score */}
        <div
          className="text-center p-5 rounded-2xl bg-gradient-to-br from-surface/60 to-surface/30 border border-border/50 shadow-lg hover:shadow-xl transition-all"
          style={{
            background: "linear-gradient(135deg, rgb(from var(--surface) r g b / 0.6), rgb(from var(--surface) r g b / 0.3))"
          }}
        >
          <div className="text-3xl mb-2">📊</div>
          <div className="text-[10px] uppercase tracking-wider text-muted font-bold mb-2">Score</div>
          <div className="text-2xl font-black text-accent number-display" style={{ textShadow: "0 2px 8px rgb(from var(--accent) r g b / 0.3)" }}>
            {formatNumber(score)}
          </div>
        </div>

        {/* Prestige */}
        <div
          className="text-center p-5 rounded-2xl bg-gradient-to-br from-surface/60 to-surface/30 border border-border/50 shadow-lg hover:shadow-xl transition-all"
          style={{
            background: "linear-gradient(135deg, rgb(from var(--surface) r g b / 0.6), rgb(from var(--surface) r g b / 0.3))"
          }}
        >
          <div className="text-3xl mb-2">⭐</div>
          <div className="text-[10px] uppercase tracking-wider text-muted font-bold mb-2">Prestige</div>
          <div className="text-2xl font-black text-accent number-display" style={{ textShadow: "0 2px 8px rgb(from var(--accent) r g b / 0.3)" }}>
            {formatNumber(prestige)}
          </div>
        </div>
      </div>

      {/* Total Achievements - Centered below */}
      <div
        className="text-center p-5 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/30 shadow-lg lg:bg-gradient-to-br"
        style={{
          background: "linear-gradient(to bottom, rgb(from var(--accent) r g b / 0.12), rgb(from var(--accent) r g b / 0.04))"
        }}
      >
        <div className="text-4xl mb-2">🏆</div>
        <div className="text-[10px] uppercase tracking-wider text-muted font-bold mb-2">Total Achievements</div>
        <div className="text-3xl font-black text-accent" style={{ textShadow: "0 2px 10px rgb(from var(--accent) r g b / 0.4)" }}>
          {achievementsUnlocked}
        </div>
        <div className="text-xs text-muted mt-1">Unlocked</div>
      </div>

      {/* Divider */}
      <div className="border-t border-border/50 my-4" />

      {/* Share Icons - Arranged cleanly */}
      <div className="flex items-center justify-center gap-3 pt-1">
        <span className="text-sm font-semibold text-muted">Share:</span>

        {/* X (Twitter) Button */}
        <button
          onClick={handleShareX}
          className="p-3 rounded-xl bg-surface/70 hover:bg-accent/20 border border-border/50 hover:border-accent/50 transition-all shadow-md hover:shadow-lg hover:scale-105"
          aria-label="Share on X"
          title="Share on X"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>

        {/* Facebook Button */}
        <button
          onClick={handleShareFacebook}
          className="p-3 rounded-xl bg-surface/70 hover:bg-accent/20 border border-border/50 hover:border-accent/50 transition-all shadow-md hover:shadow-lg hover:scale-105"
          aria-label="Share on Facebook"
          title="Share on Facebook"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>

        {/* Download Image Button */}
        <button
          onClick={handleDownloadImage}
          className="p-3 rounded-xl bg-surface/70 hover:bg-accent/20 border border-border/50 hover:border-accent/50 transition-all shadow-md hover:shadow-lg hover:scale-105"
          aria-label="Download Progress"
          title="Download Progress Image"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </button>
      </div>

      {/* Hidden canvas for image generation */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
