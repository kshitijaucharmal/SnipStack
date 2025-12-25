"use client";

export default function GlobalError({ error }: { error: Error }) {
  return (
    <html>
      <body className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-sm text-slate-400">
            {error.message || "An unexpected error occurred."}
          </p>
        </div>
      </body>
    </html>
  );
}
