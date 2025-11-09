import { notFound } from "next/navigation";
import changelog from "@/data/changelog.json";
import Link from "next/link";

type ChangelogEntry = {
  version: string;
  slug: string;
  date: string;
  title: string;
  description?: string;
  changes: string[];
};

export async function generateStaticParams() {
  return changelog.map((entry) => ({ slug: entry.slug }));
}

export default async function ChangelogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entries = changelog as ChangelogEntry[];
  const index = entries.findIndex((item) => item.slug === slug);

  if (index === -1) return notFound();

  const entry = entries[index];
  const previous = index < entries.length - 1 ? entries[index + 1] : null; // older
  const next = index > 0 ? entries[index - 1] : null; // newer

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Link
          href="/news"
          className="text-sm text-accent hover:underline inline-block mb-4"
        >
          ← Back to News
        </Link>

        <h1 className="text-4xl font-bold text-accent mb-2">{entry.title}</h1>
        <p className="text-muted mb-6">
          Version {entry.version} •{" "}
          {new Date(entry.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        {entry.description && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Dev Notes
            </h2>
            <p className="text-muted leading-relaxed">{entry.description}</p>
          </section>
        )}

        <ul className="list-disc pl-6 space-y-2">
          {entry.changes.map((change, idx) => (
            <li key={idx} className="text-foreground">
              {change}
            </li>
          ))}
        </ul>

        {/* 🧭 Prev / Next Navigation */}
        <div className="flex justify-between mt-12 border-t border-border pt-6 text-sm">
          {previous ? (
            <Link
              href={`/news/${previous.slug}`}
              className="text-accent hover:underline"
            >
              ← {previous.title}
            </Link>
          ) : (
            <span />
          )}

          {next ? (
            <Link
              href={`/news/${next.slug}`}
              className="text-accent hover:underline"
            >
              {next.title} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>
    </main>
  );
}
