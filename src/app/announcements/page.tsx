"use client";

/**
 * Announcements Page
 * Phase 3: Important updates and news (distinct from patch notes)
 */

import { motion } from "framer-motion";
import Link from "next/link";
import announcements from "@/data/announcements.json";

interface Announcement {
  id: string;
  title: string;
  date: string;
  body: string;
  link?: {
    text: string;
    url: string;
  };
  priority?: number;
}

export default function AnnouncementsPage() {
  // Sort announcements: priority (descending), then date (newest first)
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    // First by priority (higher priority first)
    const priorityDiff = (b.priority || 0) - (a.priority || 0);
    if (priorityDiff !== 0) return priorityDiff;

    // Then by date (newer first)
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="min-h-screen text-foreground">
      {/* Header */}
      <section className="relative py-20 px-6 text-center border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-5xl mb-4">📢</div>
          <h1 className="text-5xl font-bold mb-4">Announcements</h1>
          <p className="text-xl text-muted">
            Important updates, news, and community messages from the Clickfluencer team
          </p>
        </motion.div>
      </section>

      {/* Announcements List */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {sortedAnnouncements.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔔</div>
              <h2 className="text-2xl font-bold mb-2">No Announcements</h2>
              <p className="text-muted">Check back later for updates!</p>
            </div>
          ) : (
            sortedAnnouncements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <AnnouncementCard announcement={announcement} />
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Footer Navigation */}
      <section className="py-12 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn-secondary">
            Back to Game
          </Link>
          <Link href="/news" className="btn-secondary">
            View Patch Notes
          </Link>
          <Link href="/guide" className="btn-secondary">
            Game Guide
          </Link>
        </div>
      </section>
    </div>
  );
}

function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const isHighPriority = (announcement.priority || 0) > 0;

  return (
    <div
      className="card-premium p-8 transition-smooth hover:shadow-premium-lg"
      style={
        isHighPriority
          ? {
              borderLeft: "4px solid var(--accent)",
              backgroundColor: "rgb(from var(--accent) r g b / 0.05)",
            }
          : undefined
      }
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {isHighPriority && (
              <span
                className="px-2 py-1 rounded text-xs font-bold uppercase"
                style={{
                  backgroundColor: "rgb(from var(--accent) r g b / 0.2)",
                  color: "var(--accent)",
                }}
              >
                Important
              </span>
            )}
            <span className="text-sm text-muted font-mono">
              {new Date(announcement.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <h2 className="text-2xl font-bold mb-3">{announcement.title}</h2>
        </div>
      </div>

      {/* Body */}
      <div className="prose prose-sm max-w-none mb-6">
        <p className="text-muted leading-relaxed whitespace-pre-line">
          {announcement.body}
        </p>
      </div>

      {/* Link */}
      {announcement.link && (
        <div>
          <Link
            href={announcement.link.url}
            className="inline-flex items-center gap-2 text-accent hover:underline font-semibold"
          >
            {announcement.link.text}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
