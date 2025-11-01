'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const { data: session } = useSession();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <header className="w-full bg-surface border-b border-border text-foreground transition-colors">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* === Left: Title / Logo === */}
        <Link href="/" className="font-bold text-lg text-accent hover:underline">
          Clickfluencer Idle
        </Link>

        {/* === Center: Secondary Menu === */}
        <nav className="hidden md:flex gap-4 text-sm text-muted">
          <Link href="/about" className="hover:text-accent">About</Link>
          <Link href="/acknowledgements" className="hover:text-accent">Acknowledgements</Link>
          <Link href="/privacy-policy" className="hover:text-accent">Privacy</Link>
          <Link href="/terms-of-service" className="hover:text-accent">Terms</Link>
        </nav>

        {/* === Right: Auth === */}
        {session ? (
          <div className="flex items-center gap-2">
            <img
              src={session.user?.image ?? '/default-avatar.png'}
              alt={session.user?.name ?? 'User avatar'}
              className="w-6 h-6 rounded-full"
            />
            <button
              onClick={() => signOut()}
              className="btn-muted text-xs"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="btn-accent text-xs"
          >
            Login
          </button>
        )}
      </div>

      {/* === Login Modal === */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/70 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setShowLogin(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-surface border border-border rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4 text-accent">Sign In</h2>
              <p className="text-muted mb-6">Choose a provider to sync your saves:</p>

              <div className="flex flex-col gap-3">
                <button onClick={() => signIn('google')} className="btn-accent">Sign in with Google</button>
                <button onClick={() => signIn('discord')} className="btn-accent">Sign in with Discord</button>
                <button onClick={() => signIn('steam')} className="btn-accent">Sign in with Steam</button>
              </div>

              <button
                onClick={() => setShowLogin(false)}
                className="btn-muted mt-6 w-full"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
