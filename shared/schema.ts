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

export const utilities = pgTable("utilities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projectBudgets = pgTable("project_budgets", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  year: integer("year").notNull(),
  amount: numeric("amount").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const utilityBudgets = pgTable("utility_budgets", {
  id: serial("id").primaryKey(),
  utilityId: integer("utility_id").notNull(),
  year: integer("year").notNull(),
  amount: numeric("amount").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const departmentBudgetRequests = pgTable("department_budget_requests", {
  id: serial("id").primaryKey(),
  departmentId: integer("department_id").notNull(),
  requesterUserId: varchar("requester_user_id").notNull(),
  year: integer("year").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  amount: numeric("amount").notNull(),
  status: text("status", { enum: ["Pending", "Approved", "Rejected"] }).default("Pending").notNull(),
  reviewedByUserId: varchar("reviewed_by_user_id"),
  reviewedAt: timestamp("reviewed_at"),
  decisionNote: text("decision_note"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  departmentBudgetRequests: many(departmentBudgetRequests),
}));

export const departmentsRelations = relations(departments, ({ many }) => ({
  members: many(userDepartments),
  budgetRequests: many(departmentBudgetRequests),
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
  budgets: many(projectBudgets),
}));

export const utilitiesRelations = relations(utilities, ({ many }) => ({
  budgets: many(utilityBudgets),
}));

export const projectBudgetsRelations = relations(projectBudgets, ({ one }) => ({
  project: one(projects, { fields: [projectBudgets.projectId], references: [projects.id] }),
}));

export const utilityBudgetsRelations = relations(utilityBudgets, ({ one }) => ({
  utility: one(utilities, { fields: [utilityBudgets.utilityId], references: [utilities.id] }),
}));

export const departmentBudgetRequestsRelations = relations(departmentBudgetRequests, ({ one }) => ({
  department: one(departments, { fields: [departmentBudgetRequests.departmentId], references: [departments.id] }),
  requester: one(users, { fields: [departmentBudgetRequests.requesterUserId], references: [users.id] }),
  reviewer: one(users, { fields: [departmentBudgetRequests.reviewedByUserId], references: [users.id] }),
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
export const insertUtilitySchema = createInsertSchema(utilities).omit({ id: true, createdAt: true, updatedAt: true });
export const insertProjectBudgetSchema = createInsertSchema(projectBudgets).omit({ id: true, createdAt: true, updatedAt: true });
export const insertUtilityBudgetSchema = createInsertSchema(utilityBudgets).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDepartmentBudgetRequestSchema = createInsertSchema(departmentBudgetRequests).omit({
  id: true,
  status: true,
  reviewedByUserId: true,
  reviewedAt: true,
  decisionNote: true,
  createdAt: true,
  updatedAt: true,
});
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
export type Utility = typeof utilities.$inferSelect;
export type InsertUtility = z.infer<typeof insertUtilitySchema>;
export type ProjectBudget = typeof projectBudgets.$inferSelect;
export type InsertProjectBudget = z.infer<typeof insertProjectBudgetSchema>;
export type UtilityBudget = typeof utilityBudgets.$inferSelect;
export type InsertUtilityBudget = z.infer<typeof insertUtilityBudgetSchema>;
export type DepartmentBudgetRequest = typeof departmentBudgetRequests.$inferSelect;
export type InsertDepartmentBudgetRequest = z.infer<typeof insertDepartmentBudgetRequestSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;

// Request/Response Types
export type CreateUserRequest = InsertUser;
export type UpdateUserRequest = Partial<InsertUser>;
