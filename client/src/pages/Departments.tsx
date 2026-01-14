import { useDepartments } from "@/hooks/use-departments";
import { Users2, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Departments() {
  const { data: departments, isLoading } = useDepartments();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display text-slate-900">Ministries & Departments</h1>
        <p className="text-slate-500">Connect with groups and serve.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p>Loading departments...</p>
        ) : departments?.length === 0 ? (
          <p className="text-slate-500 col-span-full py-10 text-center">No departments found.</p>
        ) : (
          departments?.map((dept) => (
            <div key={dept.id} className="group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Users2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{dept.name}</h3>
              <p className="text-slate-500 text-sm mb-6 line-clamp-2">{dept.description || "No description provided."}</p>
              
              <Link href={`/departments/${dept.id}`} className="inline-flex items-center text-sm font-semibold text-primary hover:text-blue-700 transition-colors">
                View Members <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
