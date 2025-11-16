"use client";

import { GameProvider } from "@/hooks/useGame";
import { CookieConsent } from "@/components/CookieConsent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { AdSense } from "@/components/AdSense";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <GameProvider>
      <AdSense />
      <Header />
      <div className="flex-1 pt-16">{children}</div>
      <Footer />
      <CookieConsent />
    </GameProvider>
  );
}
