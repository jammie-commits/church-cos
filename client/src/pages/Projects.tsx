import { useProjects, useCreateProject } from "@/hooks/use-projects";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function Projects() {
  const { user } = useAuth();
  // @ts-ignore
  const isAdmin = user?.role === "admin";
  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", targetAmount: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProject.mutate({
      ...formData,
      status: "Upcoming",
    }, {
      onSuccess: () => {
        toast({ title: "Project Created" });
        setOpen(false);
        setFormData({ name: "", description: "", targetAmount: "" });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900">Church Projects</h1>
          <p className="text-slate-500">Ongoing building and community initiatives.</p>
        </div>
        {isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary gap-2"><Plus className="w-4 h-4" /> New Project</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create New Project</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Project Name</Label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Target Amount ($)</Label>
                  <Input type="number" value={formData.targetAmount} onChange={e => setFormData({...formData, targetAmount: e.target.value})} required />
                </div>
                <Button type="submit" className="w-full" disabled={createProject.isPending}>Create Project</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p>Loading projects...</p>
        ) : projects?.map((project) => {
          const progress = (Number(project.collectedAmount) / Number(project.targetAmount)) * 100;
          return (
            <div key={project.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  project.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                  project.status === 'Completed' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {project.status}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2">{project.name}</h3>
              <p className="text-slate-500 text-sm mb-6 flex-1">{project.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-700">${Number(project.collectedAmount).toLocaleString()} raised</span>
                  <span className="text-slate-400">of ${Number(project.targetAmount).toLocaleString()}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              
              <Button variant="outline" className="w-full mt-6 border-primary text-primary hover:bg-primary/5">
                Support Project
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
