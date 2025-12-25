import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { snippets } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";

export async function SnippetList({ query = "" }: { query?: string }) {
  const { userId } = await auth();
  if (!userId) return null;

  const rows = await db
    .select()
    .from(snippets)
    .where(eq(snippets.userId, userId))
    .orderBy(desc(snippets.createdAt))
    .limit(50);

  const normalized = query.trim().toLowerCase();

  const filtered = normalized
    ? rows.filter((s) =>
        (s.title + " " + (s.tags || "")).toLowerCase().includes(normalized)
      )
    : rows;

  if (!filtered.length) {
    return (
      <p className="text-sm text-slate-400">
        No snippets match your search.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {filtered.map((snip) => (
        <li
          key={snip.id}
          className="rounded-lg border border-slate-800 bg-slate-900/50 p-3"
        >
          <Link href={`/snippets/${snip.id}`} className="block">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-100">
                  {snip.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {snip.language} • {snip.tags || "no tags"}
                </p>
              </div>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
                {snip.visibility}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
