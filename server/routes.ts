import type { Express } from "express";
import type { Server } from "http";
import { setupAuth } from "./replit_integrations/auth"; 
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth first
  await setupAuth(app);

  app.get("/api/auth/me", (req, res) => {
    if (req.isAuthenticated()) {
      return res.json(req.user);
    }
    res.status(401).json({ message: "Not authenticated" });
  });

  // Users
  app.get(api.users.list.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = req.user as any;
    const userId = user.claims.sub;
    
    // Fetch user from DB to check role
    const dbUser = await storage.getUser(userId);
    if (!dbUser) return res.status(404).json({ message: "User not found" });

    if (dbUser.role === 'admin') {
      const users = await storage.getAllUsers();
      return res.json(users);
    }

    // Normal user: only see members of their own departments
    const userDeptIds = await storage.getUserDepartments(userId);
    const users = await storage.getUsersByDepartments(userDeptIds);
    res.json(users);
  });

  app.get(api.users.get.path, async (req, res) => {
      const user = await storage.getUser(req.params.id);
      if (!user) return res.sendStatus(404);
      res.json(user);
  });
  
  app.patch(api.users.update.path, async (req, res) => {
      const updated = await storage.updateUser(req.params.id, req.body);
      res.json(updated);
  });

  app.post(api.users.register.path, async (req, res) => {
      try {
          const newUser = await storage.createUser(req.body);
          // Send notification
          await storage.createNotification({
              userId: newUser.id,
              type: "Registration",
              message: "Welcome to the Church Management System! Please complete your profile."
          });
          res.status(201).json(newUser);
      } catch (e) {
          console.error("Registration error:", e);
          res.status(400).json({ message: "Registration failed" });
      }
  });

  // Departments
  app.get(api.departments.list.path, async (req, res) => {
    const depts = await storage.getDepartments();
    res.json(depts);
  });

  // Events
  app.get(api.events.list.path, async (req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  app.post(api.events.create.path, async (req, res) => {
      const event = await storage.createEvent(req.body);
      res.status(201).json(event);
  });

  app.get(api.events.get.path, async (req, res) => {
      const event = await storage.getEvent(Number(req.params.id));
      if (!event) return res.sendStatus(404);
      res.json(event);
  });

  // Projects
  app.get(api.projects.list.path, async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.post(api.projects.create.path, async (req, res) => {
      const project = await storage.createProject(req.body);
      res.status(201).json(project);
  });
  
  app.patch(api.projects.update.path, async (req, res) => {
      const project = await storage.updateProject(Number(req.params.id), req.body);
      res.json(project);
  });

  // Transactions
  app.get(api.transactions.list.path, async (req, res) => {
    // If user is admin, show all? If member, show own?
    // For now, return all (demo) or filter by query param if provided
    const transactions = await storage.getTransactions(); // Add filter logic later
    res.json(transactions);
  });

  app.post(api.transactions.create.path, async (req, res) => {
    const tx = await storage.createTransaction(req.body);
    // Notify
    await storage.createNotification({
        userId: tx.userId,
        type: "Payment",
        message: `Received ${tx.amount} for ${tx.category}. Thank you!`
    });
    // Update project collected amount if linked
    if (tx.projectId) {
        const project = await storage.getProject(tx.projectId);
        if (project) {
            const newAmount = Number(project.collectedAmount) + Number(tx.amount);
            await storage.updateProject(tx.projectId, { collectedAmount: newAmount.toString() });
        }
    }
    res.status(201).json(tx);
  });

  // Notifications
  app.get(api.notifications.list.path, async (req, res) => {
    // Check if user is authenticated
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = (req.user as any).claims.sub;
    const notes = await storage.getNotifications(userId);
    res.json(notes);
  });

  app.patch(api.notifications.markRead.path, async (req, res) => {
      await storage.markNotificationRead(Number(req.params.id));
      res.sendStatus(200);
  });
  
  // Attendance
  app.post(api.attendance.mark.path, async (req, res) => {
      await storage.markAttendance(req.body);
      res.sendStatus(201);
  });

  app.get(api.attendance.list.path, async (req, res) => {
      const list = await storage.getEventAttendance(Number(req.params.eventId));
      res.json(list);
  });

  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
    const users = await storage.getAllUsers();
    if (users.length === 0) {
        // Create Admin (Manually seeded with UUID)
        // Since ID is UUID default, we let DB generate or provide one.
        // But createUser generates randomUUID in DB default.
        // We'll just create a user.
        await storage.createUser({
            role: "admin",
            firstName: "System",
            lastName: "Admin",
            email: "admin@church.com",
            phoneNumber: "1234567890",
            childrenCount: 0,
            username: "admin"
        });

        // Departments
        await storage.createDepartment({ name: "Disciples", description: "Discipleship ministry" });
        await storage.createDepartment({ name: "Media", description: "Media and tech team" });
        await storage.createDepartment({ name: "Choir", description: "Praise and Worship" });

        // Projects
        await storage.createProject({
            name: "New Sanctuary Building",
            description: "Building a new 500-seater sanctuary.",
            targetAmount: "5000000",
            status: "Active",
            startDate: new Date(),
        });

        // Events
        await storage.createEvent({
            title: "Sunday Service",
            description: "Main Sunday Service",
            date: new Date(),
            type: "Service",
            location: "Main Hall"
        });
    }
}
