"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useState, useEffect } from "react";

export function SnippetSearchBox({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialQuery);

  useEffect(() => {
    setValue(initialQuery);
  }, [initialQuery]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    setValue(next);

    const params = new URLSearchParams(searchParams.toString());
    if (next) {
      params.set("q", next);
    } else {
      params.delete("q");
    }

    router.replace(`/dashboard?${params.toString()}`);
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-slate-100">
        Your recent snippets
      </h3>

      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search by title or tags..."
        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-500"
      />
    </div>
  );
}
