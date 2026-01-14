import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Landing() {
  const { user, isLoading } = useAuth();
  const [_, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-100 rounded-full blur-3xl opacity-40 translate-y-1/3 -translate-x-1/4" />

      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">
          Ecclesia<span className="text-amber-500">.</span>CMS
        </h1>
        <Button onClick={handleLogin} variant="outline" className="border-primary text-primary hover:bg-primary/5">
          Login
        </Button>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center max-w-4xl mx-auto">
        <span className="px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold mb-6 tracking-wide uppercase shadow-sm">
          Church Management Simplified
        </span>
        <h2 className="text-5xl md:text-7xl font-bold font-display text-slate-900 tracking-tight leading-[1.1] mb-6">
          Manage your ministry with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Excellence & Grace</span>
        </h2>
        <p className="text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
          A comprehensive platform for modern churches to manage members, events, givings, and projects. 
          Focus on your calling, let us handle the administration.
        </p>
        
        <div className="flex gap-4">
          <Button onClick={handleLogin} size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 h-14 text-lg rounded-xl shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-1">
            Get Started
          </Button>
          <Button variant="ghost" size="lg" className="h-14 text-lg rounded-xl text-slate-600 hover:text-slate-900">
            Learn More
          </Button>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 w-full text-left">
          <div className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Member Database</h3>
            <p className="text-slate-600">Securely store and manage detailed member profiles and families.</p>
          </div>
          <div className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Giving & Finance</h3>
            <p className="text-slate-600">Track tithes, offerings, and project contributions transparently.</p>
          </div>
          <div className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Event Management</h3>
            <p className="text-slate-600">Plan services, track attendance, and manage church calendars.</p>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-6 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} Ecclesia CMS. All rights reserved.
      </footer>
    </div>
  );
}
