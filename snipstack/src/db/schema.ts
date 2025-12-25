import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";

export const languages = pgEnum("language", [
  "javascript",
  "typescript",
  "python",
  "rust",
  "go",
  "java",
  "c",
  "cpp"
]);

export const visibility = pgEnum("visibility", ["private", "team", "public"]);

export const snippets = pgTable("snippets", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  teamId: varchar("team_id", { length: 256 }),
  title: varchar("title", { length: 256 }).notNull(),
  code: text("code").notNull(),
  language: languages("language").default("typescript"),
  tags: text("tags"), // comma-separated: "react,nextjs"
  visibility: visibility("visibility").default("private"),
  views: integer("views").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
