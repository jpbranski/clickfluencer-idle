"use client";

/**
 * AdSlot.tsx - Google AdSense Placeholder Component
 *
 * Styled placeholder for future AdSense integration
 * Currently displays a styled box with TODO comments for implementation
 */

interface AdSlotProps {
  slot?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

export function AdSlot({
  slot = "ad-slot-1",
  format = "auto",
  className = "",
}: AdSlotProps) {
  // TODO: Implement Google AdSense
  // 1. Add Google AdSense script to layout.tsx:
  //    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX" crossorigin="anonymous"></script>
  // 2. Replace ca-pub-XXXXXXXXXX with your AdSense publisher ID
  // 3. Create ad units in AdSense dashboard
  // 4. Replace data-ad-slot values below with actual slot IDs
  // 5. Initialize ads: (adsbygoogle = window.adsbygoogle || []).push({});

  const getDimensions = (format: string) => {
    switch (format) {
      case "rectangle":
        return "min-h-[250px]";
      case "horizontal":
        return "min-h-[90px]";
      case "vertical":
        return "min-h-[600px] max-w-[160px]";
      default:
        return "min-h-[200px]";
    }
  };

  return (
    <div
      className={`
        relative w-full ${getDimensions(format)}
        bg-gradient-to-br from-gray-100 to-gray-200 
        dark:from-gray-800 dark:to-gray-900
        rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700
        flex items-center justify-center
        overflow-hidden
        ${className}
      `}
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
        <div
          className="text-4xl mb-2 opacity-50"
          role="img"
          aria-label="advertisement"
        >
          📢
        </div>
        <div className="text-sm font-semibold text-gray-500 dark:text-gray-500 mb-1">
          Advertisement Space
        </div>
        <div className="text-xs text-gray-400 dark:text-gray-600">
          {format.toUpperCase()} • Slot: {slot}
        </div>

        {/* Development Info */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded text-xs text-left">
            <div className="font-semibold text-yellow-800 dark:text-yellow-400 mb-1">
              🚧 Development Mode
            </div>
            <div className="text-yellow-700 dark:text-yellow-500 space-y-1">
              <div>• Configure AdSense in layout.tsx</div>
              <div>• Add publisher ID</div>
              <div>• Create ad units</div>
              <div>• Update slot IDs</div>
            </div>
          </div>
        )}
      </div>

      {/* Corner Label */}
      <div className="absolute top-2 right-2 px-2 py-1 rounded bg-gray-300 dark:bg-gray-700 text-xs font-mono text-gray-600 dark:text-gray-400">
        AD
      </div>
    </div>
  );
}

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
