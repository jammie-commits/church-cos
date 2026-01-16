import { db } from "./db";
import {
  users, departments, events, projects, transactions, notifications, attendance, userDepartments,
  type User, type InsertUser, type UpdateUserRequest,
  type Department, type InsertDepartment,
  type Event, type InsertEvent,
  type Project, type InsertProject,
  type Transaction, type InsertTransaction,
  type Notification,
  type InsertAttendance
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
}

export const storage = new DatabaseStorage();
