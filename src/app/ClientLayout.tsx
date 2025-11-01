"use client";

import { SessionProvider } from "next-auth/react";
import { GameProvider } from "@/hooks/useGame";
import { CookieConsent } from "@/components/CookieConsent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <GameProvider>
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <CookieConsent />
      </GameProvider>
    </SessionProvider>
  );
}
