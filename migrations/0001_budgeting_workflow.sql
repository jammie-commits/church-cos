CREATE TABLE "utilities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "utilities_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "project_budgets" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"year" integer NOT NULL,
	"amount" numeric NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "utility_budgets" (
	"id" serial PRIMARY KEY NOT NULL,
	"utility_id" integer NOT NULL,
	"year" integer NOT NULL,
	"amount" numeric NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "department_budget_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"department_id" integer NOT NULL,
	"requester_user_id" varchar NOT NULL,
	"year" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"amount" numeric NOT NULL,
	"status" text DEFAULT 'Pending' NOT NULL,
	"reviewed_by_user_id" varchar,
	"reviewed_at" timestamp,
	"decision_note" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
