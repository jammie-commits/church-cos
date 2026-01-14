## Packages
recharts | For visualizing financial data and attendance trends on the dashboard
date-fns | For beautiful date formatting (e.g., "Sunday, October 15th")
framer-motion | For smooth page transitions and micro-interactions
react-day-picker | For the event calendar view
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility for merging Tailwind CSS classes without conflicts

## Notes
- Authentication is handled via Replit Auth; /api/auth/user returns current user or 401.
- Dashboard views differ based on user.role ("admin" vs "member").
- Transaction creation uses the shared schema; "amount" needs to be handled as a string/decimal.
- Events and Projects have status indicators that need specific color coding.
