import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { snippets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { deleteSnippet } from "@/app/dashboard/actions"; // NEW
import Link from "next/link";

type Params = { id: string };

type Props = {
  params: Promise<Params>;
};

export default async function SnippetPage({ params }: Props) {
  const { userId } = await auth();
  const { id: idParam } = await params;
  const id = Number(idParam);

  if (Number.isNaN(id)) {
    notFound();
  }

  const [snippet] = await db.select().from(snippets).where(eq(snippets.id, id));

  if (!snippet) {
    notFound();
  }

  // NEW: Public snippets OK, private only for owner
  const isOwner = snippet.userId === userId;
  const isPublic = snippet.visibility === "public";

  if (!isPublic && !isOwner) {
    notFound();
  }

  // Increment views (everyone except owner)
  if (isPublic || !isOwner) {
    await db
      .update(snippets)
      .set({ views: (snippet.views ?? 0) + 1 })
      .where(eq(snippets.id, id));
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      {/* NEW: Header with visibility badge */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">
            {snippet.title}
          </h1>

          {/* NEW: Visibility badge */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              isPublic
                ? "glass-card border-emerald-500/30 text-emerald-400"
                : "bg-slate-800 border border-slate-700 text-slate-300"
            }`}
          >
            {snippet.visibility?.toUpperCase()}
          </span>
        </div>

        <p className="text-sm text-slate-400">
          {snippet.language} • {snippet.tags || "no tags"} •{" "}
          {snippet.views ?? 0} views
        </p>
      </div>

      {/* Code */}
      <div className="glass-card rounded-2xl p-6">
        <SyntaxHighlighter
          language={(snippet.language ?? "plaintext") as string}
          style={oneDark}
          customStyle={{
            borderRadius: "0.5rem",
            padding: "1.5rem",
            fontSize: "0.875rem",
          }}
          showLineNumbers
        >
          {snippet.code}
        </SyntaxHighlighter>
      </div>

      {/* NEW: Owner controls */}
      {isOwner && (
        <div className="glass-card rounded-2xl p-4 flex gap-4">
          <Link
            href={`/dashboard?q=${encodeURIComponent(snippet.title)}`}
            className="px-6 py-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-all border border-emerald-500/30 rounded-xl hover:bg-emerald-500/10"
          >
            Edit in Dashboard
          </Link>
          <form action={deleteSnippet} className="inline">
            <input type="hidden" name="id" value={id.toString()} />
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-all border border-red-500/30 rounded-xl hover:bg-red-500/10"
              formAction={deleteSnippet} // Works in server components
            >
              Delete
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
