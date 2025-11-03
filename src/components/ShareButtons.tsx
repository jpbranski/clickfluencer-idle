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
}

export function ShareButtons({ creds, score }: ShareButtonsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * Generate an image with game stats on a gradient background
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

      // Create gradient background (purple to pink)
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height,
      );
      gradient.addColorStop(0, "#9333ea"); // purple-600
      gradient.addColorStop(0.5, "#db2777"); // pink-600
      gradient.addColorStop(1, "#ec4899"); // pink-500
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add semi-transparent overlay for better text readability
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Title
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 72px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Clickfluencer Idle", canvas.width / 2, 200);

      // Stats
      ctx.font = "bold 56px sans-serif";
      ctx.fillText(`Creds: ${formatNumber(creds)}`, canvas.width / 2, 350);

      ctx.font = "bold 48px sans-serif";
      ctx.fillText(`Score: ${formatNumber(score)}`, canvas.width / 2, 450);

      // Convert to data URL
      resolve(canvas.toDataURL("image/png"));
    });
  }, [creds, score]);

  /**
   * Share on X (Twitter)
   */
  const handleShareX = useCallback(async () => {
    const text = `I'm building my social media empire in Clickfluencer Idle! 🚀\n\nCreds: ${formatNumber(creds)}\nScore: ${formatNumber(score)}\n\nCan you beat my score?`;
    const url = window.location.href;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;

    window.open(twitterUrl, "_blank", "width=550,height=420");
  }, [creds, score]);

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
    <div className="flex items-center justify-center gap-4 text-sm opacity-80">
      <span>Share on:</span>

      {/* X (Twitter) Button */}
      <button
        onClick={handleShareX}
        className="hover:opacity-70 transition-opacity"
        aria-label="Share on X"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>

      {/* Facebook Button */}
      <button
        onClick={handleShareFacebook}
        className="hover:opacity-70 transition-opacity"
        aria-label="Share on Facebook"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </button>

      {/* Download Image Button */}
      <button
        onClick={handleDownloadImage}
        className="hover:opacity-70 transition-opacity"
        aria-label="Download Progress"
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

      {/* Hidden canvas for image generation */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
