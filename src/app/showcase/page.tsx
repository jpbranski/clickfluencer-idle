"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import changelog from "@/data/changelog.json";

export default function ShowcasePage() {
  // Get latest update
  const latestUpdate = changelog[changelog.length - 1];

  return (
    <div className="min-h-screen bg-gradient-sophisticated text-foreground">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
        <motion.div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgb(from var(--accent) r g b / 0.2), transparent 60%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold shadow-premium"
              style={{
                backgroundColor: "rgb(from var(--accent) r g b / 0.15)",
                color: "var(--accent)",
                border: "2px solid rgb(from var(--accent) r g b / 0.3)",
              }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: "var(--accent)" }} />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: "var(--accent)" }} />
              </span>
              NOW AVAILABLE • FREE TO PLAY
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl sm:text-7xl lg:text-8xl font-black mb-6 leading-tight"
            style={{
              background: "linear-gradient(135deg, var(--foreground) 0%, var(--accent) 50%, var(--foreground) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Clickfluencer
            <br />
            Idle
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl text-muted mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Build your digital empire, one click at a time. Master the art of influence in this
            addictive idle game where strategy meets social media chaos.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-8"
          >
            <Link href="/" className="btn-primary text-lg px-8 py-4 glow-strong">
              Play Now - It's Free!
            </Link>
            <Link href="/guide" className="btn-secondary text-lg px-8 py-4">
              Learn How to Play
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 text-sm text-muted"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎮</span>
              <span>Incremental Gameplay</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌈</span>
              <span>9 Unique Themes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔄</span>
              <span>Prestige System</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔒</span>
              <span>Privacy First</span>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </section>

      {/* Top Ad Slot */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6 flex justify-center">
          <AdSlot format="leaderboard" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Why Players Love It</h2>
            <p className="text-xl text-muted max-w-2xl mx-auto">
              Discover the features that make Clickfluencer Idle the most addictive idle game
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="card-premium p-8 text-center transition-smooth"
            >
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold mb-3">Exponential Growth</h3>
              <p className="text-muted">
                Watch your numbers skyrocket as you unlock generators, upgrades, and prestige bonuses
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="card-premium p-8 text-center transition-smooth"
            >
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold mb-3">Beautiful Themes</h3>
              <p className="text-muted">
                Unlock 9 stunning themes, each with unique visuals and production bonuses
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="card-premium p-8 text-center transition-smooth"
            >
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-3">Strategic Depth</h3>
              <p className="text-muted">
                Balance generators, upgrades, and prestige timing for optimal progression
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="card-premium p-8 text-center transition-smooth"
            >
              <div className="text-6xl mb-4">💤</div>
              <h3 className="text-2xl font-bold mb-3">Offline Progress</h3>
              <p className="text-muted">
                Earn rewards even when you're away. Your empire never stops growing
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="card-premium p-8 text-center transition-smooth"
            >
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-3">Random Events</h3>
              <p className="text-muted">
                Encounter special events that boost your production or grant bonus rewards
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="card-premium p-8 text-center transition-smooth"
            >
              <div className="text-6xl mb-4">🔐</div>
              <h3 className="text-2xl font-bold mb-3">Your Data, Your Game</h3>
              <p className="text-muted">
                No login required. All progress saved locally with export/import support
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Screenshot Section */}
      <section className="py-20 px-6 bg-surface/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">See It In Action</h2>
            <p className="text-xl text-muted">
              Experience the premium design and smooth gameplay
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Screenshot Placeholder 1 */}
            <div className="card-premium p-8 aspect-video flex items-center justify-center bg-gradient-mesh">
              <div className="text-center">
                <div className="text-8xl mb-4">🎮</div>
                <div className="text-2xl font-bold mb-2">Main Game Screen</div>
                <div className="text-muted">Click, generate, and prestige your way to the top</div>
              </div>
            </div>

            {/* Screenshot Placeholder 2 */}
            <div className="card-premium p-8 aspect-video flex items-center justify-center bg-gradient-mesh">
              <div className="text-center">
                <div className="text-8xl mb-4">🎨</div>
                <div className="text-2xl font-bold mb-2">Theme Gallery</div>
                <div className="text-muted">Choose from 9 beautiful themes to customize your experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rectangle Ad Slots */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex justify-center">
            <AdSlot format="rectangle" />
          </div>
          <div className="hidden md:flex justify-center">
            <AdSlot format="rectangle" />
          </div>
        </div>
      </section>

      {/* What's New Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-4">Latest Update</h2>
            <p className="text-xl text-muted">
              We're constantly improving the game with new features and polish
            </p>
          </div>

          {latestUpdate && (
            <div className="card-premium p-8">
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="px-4 py-2 rounded-lg font-bold"
                  style={{
                    backgroundColor: "rgb(from var(--accent) r g b / 0.2)",
                    color: "var(--accent)",
                  }}
                >
                  {latestUpdate.version}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{latestUpdate.title}</h3>
                  <p className="text-sm text-muted">{latestUpdate.date}</p>
                </div>
              </div>

              <p className="text-muted mb-6">{latestUpdate.description}</p>

              <div className="space-y-3">
                <div className="font-bold text-sm uppercase tracking-wide text-accent">
                  Key Features:
                </div>
                <ul className="space-y-2">
                  {latestUpdate.changes.slice(0, 6).map((change, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-accent mt-1">✓</span>
                      <span className="text-muted flex-1">{change}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <Link href="/news" className="btn-secondary">
                  View Full Changelog
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-surface/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Player Reviews</h2>
            <p className="text-xl text-muted">
              See what players are saying about Clickfluencer Idle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="card-premium p-6">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-2xl">⭐</span>
                ))}
              </div>
              <p className="text-muted mb-4 italic">
                "Incredibly polished for an idle game. The theme system is brilliant and the progression feels perfectly balanced."
              </p>
              <div className="font-bold">— Alex K.</div>
              <div className="text-xs text-muted">Idle Game Enthusiast</div>
            </div>

            {/* Testimonial 2 */}
            <div className="card-premium p-6">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-2xl">⭐</span>
                ))}
              </div>
              <p className="text-muted mb-4 italic">
                "Love the clean UI and smooth animations. No ads, no login required – just pure gameplay. Exactly what I was looking for!"
              </p>
              <div className="font-bold">— Jordan M.</div>
              <div className="text-xs text-muted">Casual Player</div>
            </div>

            {/* Testimonial 3 */}
            <div className="card-premium p-6">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-2xl">⭐</span>
                ))}
              </div>
              <p className="text-muted mb-4 italic">
                "Best incremental game I've played this year. The prestige system keeps me coming back, and I'm always excited to unlock the next theme."
              </p>
              <div className="font-bold">— Sam T.</div>
              <div className="text-xs text-muted">Strategy Gamer</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-50" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl font-black mb-6">
              Ready to Build Your Empire?
            </h2>
            <p className="text-2xl text-muted mb-12">
              Join thousands of players growing their influence every day
            </p>
            <Link href="/" className="btn-primary text-xl px-12 py-5 glow-strong">
              Start Playing Now
            </Link>

            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted">
              <Link href="/privacy-policy" className="hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms-of-service" className="hover:text-accent transition-colors">
                Terms of Service
              </Link>
              <span>•</span>
              <Link href="/contact" className="hover:text-accent transition-colors">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Ad Slot */}
      <section className="py-8 bg-surface/50">
        <div className="max-w-7xl mx-auto px-6 flex justify-center">
          <AdSlot format="leaderboard" />
        </div>
      </section>
    </div>
  );
}
