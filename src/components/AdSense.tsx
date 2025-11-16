"use client";

/**
 * AdSense - Google AdSense Auto-Placement Script Loader
 *
 * Loads Google AdSense auto-placement script client-side only.
 * Does not run on the server (no SSR).
 *
 * Configuration:
 * - Set NEXT_PUBLIC_ADS_CLIENT in .env.local
 * - Ensure /public/ads.txt exists with proper publisher ID
 */

import { useEffect } from "react";

export function AdSense() {
  useEffect(() => {
    const adsClient = process.env.NEXT_PUBLIC_ADS_CLIENT;

    // Only load if ADS_CLIENT is configured
    if (!adsClient) {
      console.log("[AdSense] NEXT_PUBLIC_ADS_CLIENT not configured, skipping AdSense");
      return;
    }

    // Check if script is already loaded
    const existingScript = document.querySelector(
      `script[src*="pagead2.googlesyndication.com"]`
    );
    if (existingScript) {
      console.log("[AdSense] Script already loaded");
      return;
    }

    // Create and append AdSense script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsClient}`;
    script.crossOrigin = "anonymous";

    script.onload = () => {
      console.log("[AdSense] Auto-placement script loaded successfully");
    };

    script.onerror = () => {
      console.warn("[AdSense] Failed to load AdSense script");
    };

    document.head.appendChild(script);

    // Cleanup function
    return () => {
      // Optional: Remove script on unmount (uncomment if needed)
      // document.head.removeChild(script);
    };
  }, []);

  // This component doesn't render anything
  return null;
}
