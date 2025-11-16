"use client";

/**
 * AdSlot.tsx - Google AdSense Placeholder Component
 *
 * Premium-styled placeholder for future AdSense integration.
 * Tastefully integrated with the game's design system.
 * Uses theme-aware styling that works across all 10 themes.
 */

import { memo } from "react";

interface AdSlotProps {
  slot?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical" | "leaderboard";
  className?: string;
}

export const AdSlot = memo(function AdSlot({
  slot = "ad-slot-1",
  format = "auto",
  className = "",
}: AdSlotProps) {
  // TODO: Implement Google AdSense
  // 1. Add Google AdSense script to layout.tsx
  // 2. Replace ca-pub-XXXXXXXXXX with your AdSense publisher ID
  // 3. Create ad units in AdSense dashboard
  // 4. Replace data-ad-slot values below with actual slot IDs
  // 5. Initialize ads: (adsbygoogle = window.adsbygoogle || []).push({});

  const getDimensions = (format: string) => {
    switch (format) {
      case "rectangle":
        return "min-h-[250px] max-w-[300px]";
      case "horizontal":
        return "min-h-[90px] w-full";
      case "vertical":
        return "min-h-[600px] max-w-[160px]";
      case "leaderboard":
        return "min-h-[90px] w-full max-w-[728px]";
      default:
        return "min-h-[200px]";
    }
  };

  return (
    <div
      className={`
        relative ${getDimensions(format)}
        rounded-xl border-2 border-dashed
        flex items-center justify-center
        overflow-hidden transition-all duration-200
        ${className}
      `}
      style={{
        borderColor: "rgb(from var(--border) r g b / 0.3)",
        backgroundColor: "rgb(from var(--surface) r g b / 0.2)",
      }}
      aria-label="Advertisement placeholder"
    >
      {/* TODO: Uncomment when AdSense is configured */}
      {/* <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      /> */}

      {/* Placeholder Content - Remove when ads are live */}
      <div className="text-center p-6">
        <div className="text-xs uppercase tracking-wider text-muted opacity-40 mb-1">
          Ad Space
        </div>
        <div className="text-xs font-mono text-muted opacity-25">
          {format} • {slot}
        </div>

        {/* Development Info */}
        {process.env.NODE_ENV === "development" && (
          <div
            className="mt-3 p-3 rounded-lg text-xs text-left max-w-xs"
            style={{
              backgroundColor: "rgb(from var(--warning) r g b / 0.1)",
              border: "1px solid rgb(from var(--warning) r g b / 0.3)",
            }}
          >
            <div className="font-semibold mb-1.5" style={{ color: "var(--warning)" }}>
              Development Mode
            </div>
            <div className="space-y-1 text-muted text-xs">
              <div>• Configure AdSense</div>
              <div>• Add publisher ID</div>
              <div>• Create ad units</div>
            </div>
          </div>
        )}
      </div>

      {/* Corner Label */}
      <div
        className="absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-mono"
        style={{
          backgroundColor: "rgb(from var(--border) r g b / 0.5)",
          color: "var(--muted)",
        }}
      >
        AD
      </div>
    </div>
  );
});

/**
 * AdSense Integration Checklist:
 *
 * [ ] 1. Sign up for Google AdSense: https://www.google.com/adsense
 * [ ] 2. Get approved and obtain publisher ID (ca-pub-XXXXXXXXXX)
 * [ ] 3. Add AdSense script to app/layout.tsx <head> section
 * [ ] 4. Create ad units in AdSense dashboard for different formats
 * [ ] 5. Copy ad unit slot IDs (e.g., "1234567890")
 * [ ] 6. Replace placeholder values in this component
 * [ ] 7. Uncomment the <ins> element above
 * [ ] 8. Remove placeholder content div
 * [ ] 9. Test ads in production environment
 * [ ] 10. Monitor ad performance in AdSense dashboard
 *
 * Important Notes:
 * - Ads won't show in development (localhost)
 * - Allow 24-48 hours after going live for ads to appear
 * - Follow AdSense policies: https://support.google.com/adsense/answer/48182
 * - Don't click your own ads
 * - Ensure proper ad placement (not obscured, appropriate spacing)
 */
