
export default function Home() {
  return (
    <section className="max-w-3xl mx-auto space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">
        Welcome to SnipStack
      </h2>
      <p className="text-slate-300">
        SnipStack is a simple, focused place to store, search, and share your
        most important code snippets.
      </p>
      <button
        className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-300 transition-colors"
      >
        Create your first snippet
      </button>
    </section>
  );
}
