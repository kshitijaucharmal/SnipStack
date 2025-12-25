import { SignedIn, SignedOut } from "@clerk/nextjs";
import { SnippetForm } from "./ClientForm";
import { SnippetSearchBox } from "./SnippetSearchBox";
import { SnippetList } from "./SnippetList";

type SearchParams = { q?: string };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q } = await searchParams; // unwrap Promise
  const query = q ?? "";

  return (
    <section className="max-w-3xl mx-auto space-y-4">
      <SignedOut>
        <p className="text-slate-300">
          You must be signed in to view your dashboard.
        </p>
      </SignedOut>

      <SignedIn>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-slate-300">
            Create a new snippet and search your existing snippets below.
          </p>
        </div>

        <SnippetForm />

        <SnippetSearchBox initialQuery={query} />

        <SnippetList query={query} />
      </SignedIn>
    </section>
  );
}