import { sql } from "drizzle-orm";
import { index, jsonb, pgTable, timestamp, varchar, text, integer, numeric, date, boolean } from "drizzle-orm/pg-core";

// Session storage table.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// User storage table.
// Extended for Church Management System
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  
  // Custom CMS fields
  username: text("username").unique(), // Optional for Replit Auth users
  role: text("role", { enum: ["admin", "member"] }).default("member").notNull(),
  
  // A. Personal Information
  gender: text("gender", { enum: ["Male", "Female"] }),
  age: integer("age"),
  nationalId: text("national_id"),
  maritalStatus: text("marital_status"),
  childrenCount: integer("children_count").default(0),

  // B. Contact & Location
  phoneNumber: text("phone_number"),
  residenceAddress: text("residence_address"),

  // C. Professional & Education
  employmentStatus: text("employment_status"),
  occupation: text("occupation"),
  educationLevel: text("education_level"),

  // Member Identification
  memberId: text("member_id").unique(), // Auto-generated unique ID

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
