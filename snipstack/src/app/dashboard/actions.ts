"use server";

import { db } from "@/db";
import { snippets, visibility } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function createSnippet(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    return { ok : false, error: "Not authenticated"}
  }

  const title = String(formData.get("title") || "").trim();
  const code = String(formData.get("code") || "").trim();
  const rawTags = String(formData.get("tags") || "").trim();
  const tags = rawTags.split(",").filter(Boolean);
  const vis = String(formData.get('visibility') || "private").trim();

  const language = detectLanguage(code, title);

  if (!title || !code) {
    return { ok: false, error: "Title and code are required"}
  }

  try{
    await db.insert(snippets).values({
      userId,
      title,
      code,
      language: language as any, // later we can tighten this type
      tags : tags.join(','),
      visibility: vis as any,
    });

    redirect('/dashboard');

    return { ok:true };
  } catch(e){
    console.error("Failed to create snippet", e);
    return { ok:false, error: "Failed to create snippet"};
  }
}

function detectLanguage(content: string, title: string): string {
  const text = content.toLowerCase().slice(0, 500); // First 500 chars
  const ext = title.split(".").pop()?.toLowerCase();

  // Extension first (most reliable)
  const extMap: Record<string, string> = {
    js: "javascript",
    ts: "typescript", 
    py: "python",
    java: "java",
    cpp: "cpp",
    c: "cpp",
    h: "cpp",
    cs: "csharp",
    rs: "rust",
    go: "go",
    rb: "ruby",
    php: "php",
    html: "html",
    css: "css",
    json: "json",
  };
  
  if (ext && extMap[ext]) return extMap[ext];

  // Keywords (fallback)
  if (text.includes("def ") || text.includes("import ")) return "python";
  if (text.includes("function") || text.includes("=>")) return "javascript";
  if (text.includes("const ") || text.includes("let ") || text.includes("interface ")) return "typescript";
  if (text.includes("#include")) return "cpp";
  if (text.includes("public class") || text.includes("public static")) return "java";
  if (text.includes("fn main") || text.includes("fn ")) return "rust";
  if (text.includes("func ") && text.includes("{")) return "go";
  
  return "plaintext";
}

export async function deleteSnippet(formData: FormData) {
  const { userId } = await auth();
  const id = formData.get("id") as string;
  
  await db.delete(snippets).where(and(
    eq(snippets.id, Number(id)),
    eq(snippets.userId, userId as string))
  );
  
  redirect("/dashboard");
}