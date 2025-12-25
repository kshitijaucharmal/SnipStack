import { SignedIn, SignedOut } from "@clerk/nextjs";
import { createSnippet } from "./actions";

export default function DashboardPage(){
    return (
        <section className="max-w-3xl mx-auto space-y-4">
            <SignedOut>
                <p className="text-slate-300">
                You must be signed in to view your dashboard.
                </p>
            </SignedOut>

            <SignedIn>
                <h2 className="text-3xl font-bold tracking-tight mb-2">
                Dashboard
                </h2>
                <p className="text-slate-300">
                This is where your snippets and analytics will live.
                </p>

                <form
                    action={createSnippet}
                    className="space-y-4 rounded-lg border border-slate-800 bg-slate-900/40 p-4"
                >
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-200">
                    Title
                    </label>
                    <input
                    name="title"
                    required
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-500"
                    placeholder="e.g. useDebounce hook"
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-200">
                    Language
                    </label>
                    <select
                    name="language"
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-500"
                    defaultValue="typescript"
                    >
                    <option value="typescript">TypeScript</option>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="rust">Rust</option>
                    <option value="go">Go</option>
                    <option value="java">Java</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-200">
                    Code
                    </label>
                    <textarea
                    name="code"
                    required
                    rows={6}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-mono text-slate-50 outline-none focus:border-emerald-500"
                    placeholder={`// Paste your snippet here`}
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-200">
                    Tags (comma separated)
                    </label>
                    <input
                    name="tags"
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-500"
                    placeholder="react,nextjs,hooks"
                    />
                </div>

                <button
                    type="submit"
                    className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 transition-colors"
                >
                    Save snippet
                </button>
                </form>
            </SignedIn>
        </section>
    );
}