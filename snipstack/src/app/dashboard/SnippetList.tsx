import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { snippets } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { ShimmerList } from "@/components/Shimmer";

export async function SnippetList({ query = "" }: { query?: string }) {
  const { userId } = await auth();
  if (!userId) return <ShimmerList />

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
    <ul className="space-y-4">
        {filtered.map((snip) => (
        <li 
            key={snip.id} 
            className="group hover:scale-[1.05] transition-all duration-50 
                    animate-in slide-in-from-bottom-2 fade-in duration-150"
        >
            <Link href={`/snippets/${snip.id}`} className="block">
            <div className="glass-card rounded-2xl p-5 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between gap-3">
                <div className="space-y-2">
                    <h3 className="text-base font-semibold text-slate-100 group-hover:text-white transition-colors">
                    {snip.title}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                    <span>{snip.language}</span>
                    <span>•</span>
                    <span>{snip.tags || "no tags"}</span>
                    </p>
                </div>
                
                <div className="flex items-center gap-2">
                    <span className="inline-flex bg-gradient-to-r from-emerald-500/20 to-blue-500/20 
                                    backdrop-blur-sm border border-emerald-500/30 text-emerald-400 
                                    px-3 py-1 rounded-full text-xs font-medium">
                    {snip.views} views
                    </span>
                    <span className="glass-card px-3 py-1 text-[10px] uppercase tracking-wide text-slate-300
                                    rounded-full border border-white/20">
                    {snip.visibility}
                    </span>
                </div>
                </div>
            </div>
            </Link>
        </li>
        ))}
    </ul>
    );

}
