'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const { data: session } = useSession();
  const [showLogin, setShowLogin] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const mainLinks = [
    { label: 'Home', href: '/' },
    { label: 'News', href: '/news' },
    { label: 'Guide', href: '/guide' },
    { label: 'Accessibility', href: '/accessibility' },
    { label: 'Contact', href: '/contact' },
  ];

  const secondaryLinks = [
    { label: 'About', href: '/about' },
    { label: 'Acknowledgements', href: '/acknowledgements' },
    { label: 'Privacy', href: '/privacy-policy' },
    { label: 'Terms', href: '/terms-of-service' },
  ];

  return (
    <header className="w-full bg-surface border-b border-border text-foreground transition-colors">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* === Left: Title / Logo === */}
          <Link href="/" className="font-bold text-lg text-accent hover:underline shrink-0">
            Clickfluencer Idle
          </Link>

          {/* === Desktop Navigation === */}
          <nav className="hidden lg:flex gap-6 text-sm text-muted mx-6">
            {mainLinks.map(link => (
              <Link key={link.href} href={link.href} className="hover:text-accent whitespace-nowrap">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* === Right: Auth + Mobile Menu Button === */}
          <div className="flex items-center gap-3">
            {session ? (
              <div className="hidden sm:flex items-center gap-2">
                <img
                  src={session.user?.image ?? '/default-avatar.png'}
                  alt={session.user?.name ?? 'User avatar'}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-xs text-muted hidden md:inline">{session.user?.name}</span>
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
                className="btn-accent text-xs hidden sm:inline-block"
              >
                Login
              </button>
            )}

            {/* === Mobile Menu Button === */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-foreground hover:text-accent transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* === Mobile Menu === */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="pt-4 pb-2 space-y-2">
                <div className="space-y-2">
                  {mainLinks.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-3 py-2 text-sm hover:bg-background rounded transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="border-t border-border pt-2 mt-2 space-y-2">
                  {secondaryLinks.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-3 py-2 text-xs text-muted hover:bg-background rounded transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  {session ? (
                    <div className="px-3 py-2">
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={session.user?.image ?? '/default-avatar.png'}
                          alt={session.user?.name ?? 'User avatar'}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-xs text-muted">{session.user?.name}</span>
                      </div>
                      <button
                        onClick={() => {
                          signOut();
                          setShowMobileMenu(false);
                        }}
                        className="btn-muted text-xs w-full"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setShowLogin(true);
                        setShowMobileMenu(false);
                      }}
                      className="btn-accent text-xs mx-3 w-[calc(100%-1.5rem)]"
                    >
                      Login
                    </button>
                  )}
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
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
