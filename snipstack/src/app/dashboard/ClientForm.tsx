"use client";

import { useRef, useState, useTransition } from "react";
import { useToast } from "@/components/toast";
import { createSnippet } from "./actions";

export function SnippetForm() {
  // Tag state
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = () => {
    const trimmed = tagInput.trim();
    // TODO: Change limit
    if (trimmed && !tags.includes(trimmed) && tags.length <= 5) {
      setTags([...tags, trimmed]);
      setTagInput("");
      inputRef.current?.focus();
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const { show } = useToast();
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    const result = await createSnippet(formData);
    if (result.ok) {
      show("Snippet saved!", "success");
    } else {
      show(result.error || "Something went wrong.", "error");
    }
  }

  return (
    <form
      action={(formData) => {
        startTransition(() => handleSubmit(formData));
      }}
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
        <label className="block text-sm font-medium text-slate-200">Code</label>
        <textarea
          name="code"
          required
          rows={8}
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-mono text-slate-50 outline-none focus:border-emerald-500"
          placeholder={`// Paste your snippet here`}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Tags (press Enter, max 5)
        </label>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addTag())
            }
            className="glass-input flex-1 rounded-xl px-4 py-2 text-sm"
            placeholder="react, hooks, api..."
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="glass-card px-3 py-1 rounded-full text-xs cursor-pointer hover:bg-white/20"
              onClick={() => removeTag(tag)}
            >
              {tag} ✕
            </span>
          ))}
        </div>
      </div>
      {/* HIDDEN: sends tags as comma string */}
      <input type="hidden" name="tags" value={tags.join(",")} />
      
      {/* Visibility */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Visibility
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="visibility"
              value="private"
              defaultChecked
              className="w-4 h-4 text-emerald-500"
            />
            <span className="text-sm text-slate-400">Private (just me)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="visibility"
              value="public"
              className="w-4 h-4 text-emerald-500"
            />
            <span className="text-sm text-slate-400">Public (anyone)</span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-60 transition-colors"
      >
        {isPending ? "Saving..." : "Save snippet"}
      </button>
    </form>
  );
}
