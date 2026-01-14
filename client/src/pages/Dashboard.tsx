import { StatCard } from "@/components/StatCard";
import { Users, Coins, Calendar, Target } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useEvents } from "@/hooks/use-events";
import { useProjects } from "@/hooks/use-projects";
import { useUsers } from "@/hooks/use-users";
import { format } from "date-fns";

export default function Dashboard() {
  const { user } = useAuth();
  // @ts-ignore
  const isAdmin = user?.role === "admin";
  const { data: events } = useEvents();
  const { data: projects } = useProjects();
  const { data: users } = useUsers();

  const activeProjects = projects?.filter(p => p.status === "Active") || [];
  const upcomingEvents = events?.filter(e => new Date(e.date) > new Date()).slice(0, 3) || [];
  
  // Calculate stats
  const totalMembers = users?.length || 0;
  const totalCollected = projects?.reduce((acc, p) => acc + Number(p.collectedAmount || 0), 0) || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-display">
          Welcome back, {user?.firstName}
        </h1>
        <p className="text-slate-500 mt-1">Here's what's happening in the ministry today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Members" 
          value={totalMembers} 
          icon={<Users className="w-5 h-5" />} 
          trend="+12% this month" 
          trendUp={true} 
          color="blue"
        />
        <StatCard 
          title="Total Giving" 
          value={`$${totalCollected.toLocaleString()}`} 
          icon={<Coins className="w-5 h-5" />} 
          trend="+5% vs last month" 
          trendUp={true} 
          color="amber"
        />
        <StatCard 
          title="Upcoming Events" 
          value={upcomingEvents.length} 
          icon={<Calendar className="w-5 h-5" />} 
          color="emerald"
        />
        <StatCard 
          title="Active Projects" 
          value={activeProjects.length} 
          icon={<Target className="w-5 h-5" />} 
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Events Column */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Upcoming Events</h3>
            <button className="text-sm text-primary hover:underline">View Calendar</button>
          </div>
          
          <div className="space-y-4">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/80 transition-colors">
                  <div className="flex flex-col items-center justify-center w-14 h-14 bg-white rounded-lg border border-slate-200 shadow-sm text-center">
                    <span className="text-xs font-bold text-red-500 uppercase">{format(new Date(event.date), "MMM")}</span>
                    <span className="text-xl font-bold text-slate-900">{format(new Date(event.date), "d")}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{event.title}</h4>
                    <p className="text-sm text-slate-500">{event.location} • {format(new Date(event.date), "h:mm a")}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {event.type}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-500">No upcoming events scheduled.</div>
            )}
          </div>
        </div>

        {/* Recent Projects Column */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Active Projects</h3>
          <div className="space-y-6">
            {activeProjects.slice(0, 3).map((project) => {
              const progress = (Number(project.collectedAmount) / Number(project.targetAmount)) * 100;
              return (
                <div key={project.id}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-700">{project.name}</span>
                    <span className="text-slate-500">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full transition-all duration-1000" 
                      style={{ width: `${Math.min(progress, 100)}%` }} 
                    />
                  </div>
                  <div className="mt-2 text-xs text-slate-400">
                    Target: ${Number(project.targetAmount).toLocaleString()}
                  </div>
                </div>
              );
            })}
            {activeProjects.length === 0 && (
              <div className="text-center py-8 text-slate-500">No active projects.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
