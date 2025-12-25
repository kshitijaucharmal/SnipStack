import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { snippets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

type Params = {id:string};

type Props = {
  params: Promise<Params>;
};

export default async function SnippetPage({ params }: Props) {
  const { userId } = await auth();
  if (!userId) {
    notFound();
  }

  const {id: idParam } = await params;
  const id = Number(idParam);
  if (Number.isNaN(id)) {
    notFound();
  }

  const [snippet] = await db
    .select()
    .from(snippets)
    .where(eq(snippets.id, id));

  if (!snippet || snippet.userId !== userId) {
    notFound();
  }

    // TODO: Don't log own views
    await db
        .update(snippets)
        .set({ views: (snippet.views ?? 0) + 1 })
        .where(eq(snippets.id, snippet.id));
    
    return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">
        {snippet.title}
      </h1>
      <p className="text-sm text-slate-400">
        {snippet.language} • {snippet.tags || "no tags"} • {snippet.views} views
      </p>

      <SyntaxHighlighter
        language={(snippet.language ?? "plaintext") as string}
        style={oneDark}
        customStyle={{
          borderRadius: "0.5rem",
          padding: "1rem",
          fontSize: "0.875rem",
        }}
        showLineNumbers
      >
        {snippet.code}
      </SyntaxHighlighter>
    </div>
  );
}
