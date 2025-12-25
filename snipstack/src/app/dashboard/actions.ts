"use server";

import { db } from "@/db";
import { snippets } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

export async function createSnippet(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    return { ok : false, error: "Not authenticated"}
  }

  const title = String(formData.get("title") || "").trim();
  const language = String(formData.get("language") || "typescript");
  const code = String(formData.get("code") || "").trim();
  const tags = String(formData.get("tags") || "").trim();

  if (!title || !code) {
    return { ok: false, error: "Title and code are required"}
  }

  try{
    await db.insert(snippets).values({
      userId,
      title,
      code,
      language: language as any, // later we can tighten this type
      tags,
      visibility: "private",
    });

    return { ok:true };
  } catch(e){
    console.error("Failed to create snippet", e);
    return { ok:false, error: "Failed to create snippet"};
  }
}