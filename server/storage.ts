import { db } from "./db";
import {
  users, departments, events, projects, transactions, notifications, attendance, userDepartments,
  utilities, projectBudgets, utilityBudgets, departmentBudgetRequests,
  eventRegistrations,
  type User, type InsertUser, type UpdateUserRequest,
  type Department, type InsertDepartment,
  type Event, type InsertEvent,
  type Project, type InsertProject,
  type Utility, type InsertUtility,
  type ProjectBudget,
  type UtilityBudget,
  type DepartmentBudgetRequest, type InsertDepartmentBudgetRequest,
  type Transaction, type InsertTransaction,
  type Notification,
  type InsertAttendance,
  type EventRegistration
} from "@shared/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { createUniqueMemberId } from "@/server/member-id";

export type PublicUser = Omit<User, "passwordHash" | "passwordSalt">;

export interface IStorage {
  // User
  getUser(id: string): Promise<PublicUser | undefined>;
  getUserByUsername(username: string): Promise<PublicUser | undefined>;
  createUser(user: InsertUser): Promise<PublicUser>;
  updateUser(id: string, user: UpdateUserRequest): Promise<PublicUser>;
  getAllUsers(): Promise<PublicUser[]>;

  // Departments
  getDepartments(): Promise<Department[]>;
  getUserDepartments(userId: string): Promise<number[]>;
  getUsersByDepartments(departmentIds: number[]): Promise<PublicUser[]>;
  createDepartment(dept: InsertDepartment): Promise<Department>;

  // Events
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;

  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<Project>): Promise<Project>;

  // Utilities
  getUtilities(): Promise<Utility[]>;
  createUtility(utility: InsertUtility): Promise<Utility>;
  updateUtility(id: number, updates: Partial<Utility>): Promise<Utility>;

  // Budgets
  getProjectBudgets(year: number): Promise<ProjectBudget[]>;
  upsertProjectBudget(input: { projectId: number; year: number; amount: string }): Promise<ProjectBudget>;
  getUtilityBudgets(year: number): Promise<UtilityBudget[]>;
  upsertUtilityBudget(input: { utilityId: number; year: number; amount: string }): Promise<UtilityBudget>;

  // Department budget workflow
  getDepartmentBudgetRequests(filter?: { year?: number; departmentIds?: number[] }): Promise<DepartmentBudgetRequest[]>;
  createDepartmentBudgetRequest(req: InsertDepartmentBudgetRequest & { requesterUserId: string }): Promise<DepartmentBudgetRequest>;
  decideDepartmentBudgetRequest(input: {
    id: number;
    status: "Approved" | "Rejected";
    reviewerUserId: string;
    decisionNote?: string | null;
  }): Promise<DepartmentBudgetRequest>;

  // Transactions
  getTransactions(userId?: string): Promise<Transaction[]>;
  createTransaction(tx: InsertTransaction): Promise<Transaction>;

  // Notifications
  getNotifications(userId: string): Promise<Notification[]>;
  createNotification(notif: { userId: string; type: string; message: string }): Promise<Notification>;
  markNotificationRead(id: number): Promise<void>;

  // Attendance
  markAttendance(att: InsertAttendance): Promise<void>;
  getEventAttendance(eventId: number): Promise<any[]>;
  getUserAttendance(userId: string): Promise<
    Array<{
      attendanceId: number;
      eventId: number;
      status: "Present" | "Absent" | "Excused" | null;
      checkInTime: Date | null;
      eventTitle: string;
      eventType: "Service" | "Event";
      eventDate: Date;
      eventLocation: string | null;
    }>
  >;

  // Event registrations
  getEventRegistration(eventId: number, userId: string): Promise<EventRegistration | undefined>;
  setEventRegistrationStatus(input: {
    eventId: number;
    userId: string;
    status: "Registered" | "Cancelled";
  }): Promise<EventRegistration>;
  getUserRegistrations(userId: string): Promise<
    Array<{
      registrationId: number;
      eventId: number;
      status: "Registered" | "Cancelled";
      createdAt: Date | null;
      updatedAt: Date | null;
      eventTitle: string;
      eventType: "Service" | "Event";
      eventDate: Date;
      eventLocation: string | null;
    }>
  >;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<PublicUser | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) return undefined;
    const { passwordHash: _passwordHash, passwordSalt: _passwordSalt, ...publicUser } = user as any;
    return publicUser as PublicUser;
  }

  async getUserByUsername(username: string): Promise<PublicUser | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    if (!user) return undefined;
    const { passwordHash: _passwordHash, passwordSalt: _passwordSalt, ...publicUser } = user as any;
    return publicUser as PublicUser;
  }

  async createUser(insertUser: InsertUser): Promise<PublicUser> {
    const memberId = await createUniqueMemberId("JTW");
    const [user] = await db.insert(users).values({ ...insertUser, memberId }).returning();
    const { passwordHash: _passwordHash, passwordSalt: _passwordSalt, ...publicUser } = user as any;
    return publicUser as PublicUser;
  }

  async updateUser(id: string, updates: UpdateUserRequest): Promise<PublicUser> {
    const [updated] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    const { passwordHash: _passwordHash, passwordSalt: _passwordSalt, ...publicUser } = updated as any;
    return publicUser as PublicUser;
  }

  async getAllUsers(): Promise<PublicUser[]> {
    const results = await db.select().from(users);
    return results.map((user) => {
      const { passwordHash: _passwordHash, passwordSalt: _passwordSalt, ...publicUser } = user as any;
      return publicUser as PublicUser;
    });
  }

  async getDepartments(): Promise<Department[]> {
    return db.select().from(departments);
  }

  async getUserDepartments(userId: string): Promise<number[]> {
    const results = await db.select({ departmentId: userDepartments.departmentId })
      .from(userDepartments)
      .where(eq(userDepartments.userId, userId));
    return results.map(r => r.departmentId);
  }

  async getUsersByDepartments(departmentIds: number[]): Promise<PublicUser[]> {
    if (departmentIds.length === 0) return [];

    const results = await db.select({ user: users })
      .from(users)
      .innerJoin(userDepartments, eq(users.id, userDepartments.userId))
      .where(sql`${userDepartments.departmentId} IN ${departmentIds}`);

    // De-duplicate users who might be in multiple departments
    const uniqueUsers = new Map<string, PublicUser>();
    results.forEach((r) => {
      const { passwordHash: _passwordHash, passwordSalt: _passwordSalt, ...publicUser } = (r.user as any) ?? {};
      uniqueUsers.set(r.user.id, publicUser as PublicUser);
    });
    return Array.from(uniqueUsers.values()) as any;
  }

  async createDepartment(dept: InsertDepartment): Promise<Department> {
    const [d] = await db.insert(departments).values(dept).returning();
    return d;
  }

  async getEvents(): Promise<Event[]> {
    return db.select().from(events).orderBy(desc(events.date));
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [e] = await db.select().from(events).where(eq(events.id, id));
    return e;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [e] = await db.insert(events).values(event).returning();
    return e;
  }

  async getProjects(): Promise<Project[]> {
    return db.select().from(projects);
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [p] = await db.select().from(projects).where(eq(projects.id, id));
    return p;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [p] = await db.insert(projects).values(project).returning();
    return p;
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project> {
    const [p] = await db.update(projects).set(updates).where(eq(projects.id, id)).returning();
    return p;
  }

  async getUtilities(): Promise<Utility[]> {
    return db.select().from(utilities).orderBy(desc(utilities.id));
  }

  async createUtility(insertUtility: InsertUtility): Promise<Utility> {
    const [u] = await db.insert(utilities).values(insertUtility).returning();
    return u;
  }

  async updateUtility(id: number, updates: Partial<Utility>): Promise<Utility> {
    const [u] = await db
      .update(utilities)
      .set({ ...updates, updatedAt: new Date() } as any)
      .where(eq(utilities.id, id))
      .returning();
    return u;
  }

  async getProjectBudgets(year: number): Promise<ProjectBudget[]> {
    return db.select().from(projectBudgets).where(eq(projectBudgets.year, year));
  }

  async upsertProjectBudget(input: { projectId: number; year: number; amount: string }): Promise<ProjectBudget> {
    const [existing] = await db
      .select()
      .from(projectBudgets)
      .where(and(eq(projectBudgets.projectId, input.projectId), eq(projectBudgets.year, input.year)))
      .limit(1);

    if (existing) {
      const [updated] = await db
        .update(projectBudgets)
        .set({ amount: input.amount, updatedAt: new Date() } as any)
        .where(eq(projectBudgets.id, existing.id))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(projectBudgets)
      .values({ projectId: input.projectId, year: input.year, amount: input.amount } as any)
      .returning();
    return created;
  }

  async getUtilityBudgets(year: number): Promise<UtilityBudget[]> {
    return db.select().from(utilityBudgets).where(eq(utilityBudgets.year, year));
  }

  async upsertUtilityBudget(input: { utilityId: number; year: number; amount: string }): Promise<UtilityBudget> {
    const [existing] = await db
      .select()
      .from(utilityBudgets)
      .where(and(eq(utilityBudgets.utilityId, input.utilityId), eq(utilityBudgets.year, input.year)))
      .limit(1);

    if (existing) {
      const [updated] = await db
        .update(utilityBudgets)
        .set({ amount: input.amount, updatedAt: new Date() } as any)
        .where(eq(utilityBudgets.id, existing.id))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(utilityBudgets)
      .values({ utilityId: input.utilityId, year: input.year, amount: input.amount } as any)
      .returning();
    return created;
  }

  async getDepartmentBudgetRequests(filter?: { year?: number; departmentIds?: number[] }): Promise<DepartmentBudgetRequest[]> {
    const whereParts: any[] = [];
    if (typeof filter?.year === "number") whereParts.push(eq(departmentBudgetRequests.year, filter.year));
    if (filter?.departmentIds?.length) whereParts.push(sql`${departmentBudgetRequests.departmentId} IN ${filter.departmentIds}`);

    if (whereParts.length === 0) {
      return db.select().from(departmentBudgetRequests).orderBy(desc(departmentBudgetRequests.createdAt));
    }
    return db
      .select()
      .from(departmentBudgetRequests)
      .where(and(...whereParts))
      .orderBy(desc(departmentBudgetRequests.createdAt));
  }

  async createDepartmentBudgetRequest(
    req: InsertDepartmentBudgetRequest & { requesterUserId: string }
  ): Promise<DepartmentBudgetRequest> {
    const [created] = await db
      .insert(departmentBudgetRequests)
      .values({ ...req, status: "Pending" } as any)
      .returning();
    return created;
  }

  async decideDepartmentBudgetRequest(input: {
    id: number;
    status: "Approved" | "Rejected";
    reviewerUserId: string;
    decisionNote?: string | null;
  }): Promise<DepartmentBudgetRequest> {
    const [updated] = await db
      .update(departmentBudgetRequests)
      .set({
        status: input.status,
        reviewedByUserId: input.reviewerUserId,
        reviewedAt: new Date(),
        decisionNote: input.decisionNote ?? null,
        updatedAt: new Date(),
      } as any)
      .where(eq(departmentBudgetRequests.id, input.id))
      .returning();
    return updated;
  }

  async getTransactions(userId?: string): Promise<Transaction[]> {
    if (userId) {
      return db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(desc(transactions.date));
    }
    return db.select().from(transactions).orderBy(desc(transactions.date));
  }

  async createTransaction(tx: InsertTransaction): Promise<Transaction> {
    const [t] = await db.insert(transactions).values(tx).returning();
    return t;
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    return db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
  }

  async createNotification(notif: { userId: string; type: string; message: string }): Promise<Notification> {
    // Cast type to match enum if needed, or rely on TS
    const [n] = await db.insert(notifications).values({
      userId: notif.userId,
      type: notif.type as any,
      message: notif.message,
    }).returning();
    return n;
  }

  async markNotificationRead(id: number): Promise<void> {
    await db.update(notifications).set({ read: true }).where(eq(notifications.id, id));
  }

  async markAttendance(att: InsertAttendance): Promise<void> {
    await db.insert(attendance).values(att);
  }

  async getEventAttendance(eventId: number): Promise<any[]> {
    return db.select().from(attendance).where(eq(attendance.eventId, eventId));
  }

  async getUserAttendance(userId: string): Promise<
    Array<{
      attendanceId: number;
      eventId: number;
      status: "Present" | "Absent" | "Excused" | null;
      checkInTime: Date | null;
      eventTitle: string;
      eventType: "Service" | "Event";
      eventDate: Date;
      eventLocation: string | null;
    }>
  > {
    const rows = await db
      .select({
        attendanceId: attendance.id,
        eventId: attendance.eventId,
        status: attendance.status,
        checkInTime: attendance.checkInTime,
        eventTitle: events.title,
        eventType: events.type,
        eventDate: events.date,
        eventLocation: events.location,
      })
      .from(attendance)
      .innerJoin(events, eq(attendance.eventId, events.id))
      .where(eq(attendance.userId, userId))
      .orderBy(desc(events.date));

    return rows as any;
  }

  async getEventRegistration(eventId: number, userId: string): Promise<EventRegistration | undefined> {
    const [row] = await db
      .select()
      .from(eventRegistrations)
      .where(and(eq(eventRegistrations.eventId, eventId), eq(eventRegistrations.userId, userId)))
      .orderBy(desc(eventRegistrations.updatedAt))
      .limit(1);
    return row;
  }

  async setEventRegistrationStatus(input: {
    eventId: number;
    userId: string;
    status: "Registered" | "Cancelled";
  }): Promise<EventRegistration> {
    const existing = await this.getEventRegistration(input.eventId, input.userId);
    if (existing) {
      const [updated] = await db
        .update(eventRegistrations)
        .set({ status: input.status, updatedAt: new Date() } as any)
        .where(eq(eventRegistrations.id, existing.id))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(eventRegistrations)
      .values({ eventId: input.eventId, userId: input.userId, status: input.status } as any)
      .returning();
    return created;
  }

  async getUserRegistrations(userId: string): Promise<
    Array<{
      registrationId: number;
      eventId: number;
      status: "Registered" | "Cancelled";
      createdAt: Date | null;
      updatedAt: Date | null;
      eventTitle: string;
      eventType: "Service" | "Event";
      eventDate: Date;
      eventLocation: string | null;
    }>
  > {
    const rows = await db
      .select({
        registrationId: eventRegistrations.id,
        eventId: eventRegistrations.eventId,
        status: eventRegistrations.status,
        createdAt: eventRegistrations.createdAt,
        updatedAt: eventRegistrations.updatedAt,
        eventTitle: events.title,
        eventType: events.type,
        eventDate: events.date,
        eventLocation: events.location,
      })
      .from(eventRegistrations)
      .innerJoin(events, eq(eventRegistrations.eventId, events.id))
      .where(eq(eventRegistrations.userId, userId))
      .orderBy(desc(events.date));

    return rows as any;
  }
}

export const storage = new DatabaseStorage();
