"use server";

import { db } from "@/db";
import { snippets } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

export async function createSnippet(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const title = String(formData.get("title") || "").trim();
  const language = String(formData.get("language") || "typescript");
  const code = String(formData.get("code") || "").trim();
  const tags = String(formData.get("tags") || "").trim();

  if (!title || !code) {
    throw new Error("Title and code are required");
  }

  await db.insert(snippets).values({
    userId,
    title,
    code,
    language: language as any, // later we can tighten this type
    tags,
    visibility: "private",
  });
}

export async function createTestSnippet() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  await db.insert(snippets).values({
    userId,
    title: "Hello SnipStack",
    code: "// first snippet from dashboard",
    language: "typescript",
    tags: "test,hello",
    visibility: "private",
  });
}
