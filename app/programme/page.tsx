import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { TopBar } from "@/components/top-bar";
import { getServerSession } from "@/server/session";

export default async function ProgrammePage() {
  const session = await getServerSession();
  if (!session) redirect("/auth/login");

  const year = new Date().getFullYear();

  const cards: Array<{ title: string; subtitle: string; details: string[]; icon: string }> = [
    {
      title: "Sunday Services (Weekly)",
      subtitle: "Two services every week",
      icon: "church",
      details: ["First service: 6:30 AM", "Second service: 9:00 AM"],
    },
    {
      title: "Youth & Teens (Monthly)",
      subtitle: "One service every month",
      icon: "diversity_3",
      details: ["Monthly youth/teens service (date set by ministry calendar)"],
    },
    {
      title: "Easter Weekend", 
      subtitle: "3-day service ending Easter Monday",
      icon: "emoji_events",
      details: ["Good Friday service", "Easter Sunday service", "Easter Monday service"],
    },
    {
      title: "Disciples Service (Weekly)",
      subtitle: "Every Friday night",
      icon: "night_shelter",
      details: ["Fridays: 10:00 PM until dawn"],
    },
    {
      title: "End-of-Year Programmes",
      subtitle: "December programme highlights",
      icon: "celebration",
      details: [
        "Last Sunday service of the year: second Sunday of December",
        "Disciples Service Dinner",
        "Crossover Service",
      ],
    },
  ];

  return (
    <AppShell role={session.role as any}>
      <TopBar title="Annual Church Programme" showBack={false} showSearch={false} showNotifications={true} showProfile={true} />

      <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
        <div className="px-4 py-4 md:px-6 md:py-6 max-w-7xl mx-auto w-full space-y-6">
          <div className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">Programme</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight">{year}</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-gray-400">
              The schedule below reflects the recurring church services and special programmes for the year.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cards.map((c) => (
              <div key={c.title} className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 p-6">
                <div className="flex items-start gap-3">
                  <div className="size-11 rounded-xl bg-brand-purple/10 border border-brand-purple/15 flex items-center justify-center">
                    <span className="material-symbols-outlined text-brand-purple">{c.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white">{c.title}</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">{c.subtitle}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {c.details.map((d) => (
                    <div key={d} className="flex items-start gap-2 text-sm text-slate-700 dark:text-gray-300">
                      <span className="material-symbols-outlined text-[18px] text-brand-lime">check_circle</span>
                      <span className="leading-snug">{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 p-6">
            <p className="text-sm font-extrabold">Note</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">
              This page defines the recurring programme. Individual events/services can still be created in Events for specific dates.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
