import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  FolderKanban, 
  CreditCard, 
  Building2, 
  UserCircle,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  
  // @ts-ignore - assuming role exists on user object from backend
  const isAdmin = user?.role === "admin";

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ...(isAdmin ? [{ name: "Members", href: "/members", icon: Users }] : []),
    { name: "Events", href: "/events", icon: CalendarDays },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "Givings", href: "/givings", icon: CreditCard },
    { name: "Departments", href: "/departments", icon: Building2 },
    { name: "Profile", href: "/profile", icon: UserCircle },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white w-64 fixed left-0 top-0 border-r border-slate-800 shadow-2xl">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold font-display tracking-tight text-white">
          Ecclesia<span className="text-amber-500">.</span>CMS
        </h1>
        <p className="text-xs text-slate-400 mt-1">Church Management System</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href} className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              isActive 
                ? "bg-primary text-white shadow-lg shadow-primary/25 translate-x-1" 
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}>
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-amber-400" : "text-slate-500 group-hover:text-slate-300"
              )} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          {user?.profileImageUrl ? (
            <img src={user.profileImageUrl} alt="Profile" className="w-8 h-8 rounded-full border border-slate-700" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
              <UserCircle className="w-5 h-5" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {/* @ts-ignore */}
              {user?.fullName || user?.firstName || "User"}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {/* @ts-ignore */}
              {user?.role === "admin" ? "Administrator" : "Member"}
            </p>
          </div>
        </div>
        <button 
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 hover:text-red-300 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
