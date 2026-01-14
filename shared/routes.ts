import { z } from 'zod';
import { 
  insertUserSchema, users, 
  insertDepartmentSchema, departments,
  insertEventSchema, events,
  insertProjectSchema, projects,
  insertTransactionSchema, transactions,
  insertNotificationSchema, notifications,
  insertAttendanceSchema, attendance
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  users: {
    list: {
      method: 'GET' as const,
      path: '/api/users',
      responses: {
        200: z.array(z.custom<typeof users.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/users/:id',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/users/:id',
      input: insertUserSchema.partial(),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    register: {
        method: 'POST' as const,
        path: '/api/register',
        input: insertUserSchema,
        responses: {
            201: z.custom<typeof users.$inferSelect>(),
            400: errorSchemas.validation
        }
    }
  },
  departments: {
    list: {
      method: 'GET' as const,
      path: '/api/departments',
      responses: {
        200: z.array(z.custom<typeof departments.$inferSelect>()),
      },
    },
  },
  events: {
    list: {
      method: 'GET' as const,
      path: '/api/events',
      responses: {
        200: z.array(z.custom<typeof events.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/events',
      input: insertEventSchema,
      responses: {
        201: z.custom<typeof events.$inferSelect>(),
      },
    },
    get: {
        method: 'GET' as const,
        path: '/api/events/:id',
        responses: {
            200: z.custom<typeof events.$inferSelect>(),
            404: errorSchemas.notFound
        }
    }
  },
  projects: {
    list: {
      method: 'GET' as const,
      path: '/api/projects',
      responses: {
        200: z.array(z.custom<typeof projects.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/projects',
      input: insertProjectSchema,
      responses: {
        201: z.custom<typeof projects.$inferSelect>(),
      },
    },
    update: {
        method: 'PATCH' as const,
        path: '/api/projects/:id',
        input: insertProjectSchema.partial(),
        responses: {
            200: z.custom<typeof projects.$inferSelect>(),
            404: errorSchemas.notFound
        }
    }
  },
  transactions: {
    list: {
      method: 'GET' as const,
      path: '/api/transactions', // Filter by user via session or query param
      responses: {
        200: z.array(z.custom<typeof transactions.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/transactions',
      input: insertTransactionSchema,
      responses: {
        201: z.custom<typeof transactions.$inferSelect>(),
      },
    },
  },
  notifications: {
    list: {
      method: 'GET' as const,
      path: '/api/notifications',
      responses: {
        200: z.array(z.custom<typeof notifications.$inferSelect>()),
      },
    },
    markRead: {
      method: 'PATCH' as const,
      path: '/api/notifications/:id/read',
      responses: {
        200: z.void(),
      },
    },
  },
  attendance: {
      mark: {
          method: 'POST' as const,
          path: '/api/attendance',
          input: insertAttendanceSchema,
          responses: {
              201: z.custom<typeof attendance.$inferSelect>()
          }
      },
      list: {
          method: 'GET' as const,
          path: '/api/attendance/:eventId',
          responses: {
              200: z.array(z.custom<typeof attendance.$inferSelect>())
          }
      }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
