CREATE TYPE "public"."language" AS ENUM('javascript', 'typescript', 'python', 'rust', 'go', 'java', 'c', 'cpp');--> statement-breakpoint
CREATE TYPE "public"."visibility" AS ENUM('private', 'team', 'public');--> statement-breakpoint
CREATE TABLE "snippets" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"team_id" varchar(256),
	"title" varchar(256) NOT NULL,
	"code" text NOT NULL,
	"language" "language" DEFAULT 'typescript',
	"tags" text,
	"visibility" "visibility" DEFAULT 'private',
	"views" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
