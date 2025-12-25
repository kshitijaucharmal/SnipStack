import { SignedIn, SignedOut } from "@clerk/nextjs";
import { createSnippet } from "./actions";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { snippets } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { SnippetForm } from "./ClientForm";

async function SnippetList() {
    const {userId} = await auth();

    if(!userId){
        return null;
    }

    const rows = await db
        .select()
        .from(snippets)
        .where(eq(snippets.userId, userId))
        .orderBy(desc(snippets.createdAt))
        .limit(20);

    // Handle none found
    if(!rows.length){
        return (
            <p className="text-sm text-slate-400">
                No snippets yet. Create one above
            </p>
        )
    }

    return (
    <ul className="space-y-3">
      {rows.map((snip) => (
        <li
          key={snip.id}
          className="rounded-lg border border-slate-800 bg-slate-900/50 p-3"
        >
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
        </li>
      ))}
    </ul>
  );
}

export default function DashboardPage(){
    return (
        <section className="max-w-3xl mx-auto space-y-4">
            <SignedOut>
                <p className="text-slate-300">
                You must be signed in to view your dashboard.
                </p>
            </SignedOut>

            <SignedIn>
              <SnippetForm />
              <SnippetList />
            </SignedIn>
        </section>
    );
}