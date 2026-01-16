import { pgTable, text, serial, integer, boolean, timestamp, numeric, date, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export * from "./models/auth";

// === TABLE DEFINITIONS ===

export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // Disciples, Ushers, etc.
  description: text("description"),
});

export const userDepartments = pgTable("user_departments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(), // Changed to match users.id type
  departmentId: integer("department_id").notNull(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  location: text("location"),
  type: text("type", { enum: ["Service", "Event"] }).notNull(),
});

export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  userId: varchar("user_id").notNull(), // Changed to match users.id type
  status: text("status", { enum: ["Present", "Absent", "Excused"] }).default("Present"),
  checkInTime: timestamp("check_in_time").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status", { enum: ["Active", "Upcoming", "Completed"] }).default("Upcoming"),
  targetAmount: numeric("target_amount").notNull(),
  collectedAmount: numeric("collected_amount").default("0"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(), // Changed to match users.id type
  amount: numeric("amount").notNull(),
  category: text("category", { enum: ["Tithe", "Offering", "Project", "Seed", "Thanksgiving"] }).notNull(),
  type: text("type", { enum: ["MPESA", "Bank"] }).notNull(),
  transactionCode: text("transaction_code"), // MPESA code or Bank ref
  purpose: text("purpose"),
  projectId: integer("project_id"), // Optional linking to project
  date: timestamp("date").defaultNow(),
  status: text("status", { enum: ["Pending", "Completed", "Failed"] }).default("Completed"),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(), // Changed to match users.id type
  type: text("type", { enum: ["Registration", "Payment", "Event", "System"] }).notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===

export const usersRelations = relations(users, ({ many }) => ({
  departments: many(userDepartments),
  attendance: many(attendance),
  transactions: many(transactions),
  notifications: many(notifications),
}));

export const departmentsRelations = relations(departments, ({ many }) => ({
  members: many(userDepartments),
}));

export const userDepartmentsRelations = relations(userDepartments, ({ one }) => ({
  user: one(users, { fields: [userDepartments.userId], references: [users.id] }),
  department: one(departments, { fields: [userDepartments.departmentId], references: [departments.id] }),
}));

export const eventsRelations = relations(events, ({ many }) => ({
  attendance: many(attendance),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  event: one(events, { fields: [attendance.eventId], references: [events.id] }),
  user: one(users, { fields: [attendance.userId], references: [users.id] }),
}));

export const projectsRelations = relations(projects, ({ many }) => ({
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, { fields: [transactions.userId], references: [users.id] }),
  project: one(projects, { fields: [transactions.projectId], references: [projects.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

// === BASE SCHEMAS ===

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  memberId: true,
  passwordHash: true,
  passwordSalt: true,
  createdAt: true,
  updatedAt: true,
});
export const insertDepartmentSchema = createInsertSchema(departments).omit({ id: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true });
export const insertAttendanceSchema = createInsertSchema(attendance).omit({ id: true, checkInTime: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, collectedAmount: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, date: true, status: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, read: true, createdAt: true });

// === EXPLICIT API TYPES ===

export type InsertUser = z.infer<typeof insertUserSchema>;
export type Department = typeof departments.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;

// Request/Response Types
export type CreateUserRequest = InsertUser;
export type UpdateUserRequest = Partial<InsertUser>;
