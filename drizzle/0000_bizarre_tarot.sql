CREATE TABLE "books" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"author" text NOT NULL,
	"status" text DEFAULT 'want_to_read' NOT NULL,
	"format" text DEFAULT 'physical',
	"total_pages" integer DEFAULT 0 NOT NULL,
	"current_page" integer DEFAULT 0 NOT NULL,
	"audio_duration_minutes" integer,
	"current_audio_minutes" integer,
	"rating" integer,
	"cover_url" text,
	"start_date" text,
	"finish_date" text,
	"favorite_quotes" jsonb,
	"notes" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "budget_transactions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"date" text NOT NULL,
	"type" text NOT NULL,
	"category" text NOT NULL,
	"amount" integer NOT NULL,
	"title" text NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "calendar_events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"date" text NOT NULL,
	"time" text,
	"end_time" text,
	"category" text NOT NULL,
	"color" text DEFAULT '#10b981' NOT NULL,
	"notes" text,
	"reminder" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "workout_plans" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"day_of_week" text,
	"duration_min" integer DEFAULT 0 NOT NULL,
	"exercises" jsonb DEFAULT '[]'::jsonb,
	"completed_history" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "hobbies" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"level" text DEFAULT 'Beginner' NOT NULL,
	"hours_spent" integer DEFAULT 0 NOT NULL,
	"target_weekly_hours" integer DEFAULT 0 NOT NULL,
	"current_project" text,
	"milestones" jsonb DEFAULT '[]'::jsonb,
	"notes" text,
	"icon" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "ideas" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"status" text DEFAULT 'spark' NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"target_date" text,
	"action_items" jsonb DEFAULT '[]'::jsonb,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "journal_cards" (
	"id" uuid PRIMARY KEY NOT NULL,
	"date" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"color_scheme" text DEFAULT 'emerald' NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"image_url" text,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"sticker" text,
	"song" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "meals" (
	"id" uuid PRIMARY KEY NOT NULL,
	"date" text NOT NULL,
	"meal_type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"calories" integer,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "mood_entries" (
	"id" uuid PRIMARY KEY NOT NULL,
	"date" text NOT NULL,
	"score" integer NOT NULL,
	"energy_level" integer NOT NULL,
	"label" text NOT NULL,
	"factors" jsonb DEFAULT '[]'::jsonb,
	"journal_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "routines" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"category" text DEFAULT 'daily' NOT NULL,
	"time" text,
	"completed_dates" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "water_logs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"date" text NOT NULL,
	"amount_ml" integer DEFAULT 0 NOT NULL,
	"target_ml" integer DEFAULT 2500 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
