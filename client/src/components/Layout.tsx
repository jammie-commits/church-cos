import { Sidebar } from "./Sidebar";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { useNotifications } from "@/hooks/use-notifications";
import { Bell } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const isAuthPage = location === "/" || location === "/login" || location === "/register";
  const { data: notifications } = useNotifications();
  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  if (isAuthPage) return <>{children}</>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="pl-64">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center">
          <h2 className="text-xl font-display font-semibold text-slate-800 capitalize">
            {location.split('/')[1] || "Dashboard"}
          </h2>
          
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 mr-4 p-0 shadow-xl border-slate-200">
                <div className="p-4 border-b border-slate-100">
                  <h4 className="font-semibold text-slate-800">Notifications</h4>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications?.length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-500">No notifications</div>
                  ) : (
                    notifications?.map((notif) => (
                      <div key={notif.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-blue-50/50' : ''}`}>
                        <p className="text-sm text-slate-700">{notif.message}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(notif.createdAt || "").toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </header>

        <main className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </main>
      </div>
    </div>
  );
}
