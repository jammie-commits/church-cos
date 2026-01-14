import { useEvents, useCreateEvent } from "@/hooks/use-events";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Events() {
  const { data: events, isLoading } = useEvents();
  const { user } = useAuth();
  // @ts-ignore
  const isAdmin = user?.role === "admin";
  const [open, setOpen] = useState(false);
  const createEvent = useCreateEvent();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    type: "Service"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dateTime = new Date(`${formData.date}T${formData.time}`);
    createEvent.mutate({
      title: formData.title,
      description: formData.description,
      date: dateTime,
      location: formData.location,
      type: formData.type as any
    }, {
      onSuccess: () => {
        toast({ title: "Event Created" });
        setOpen(false);
        setFormData({ title: "", description: "", date: "", time: "", location: "", type: "Service" });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900">Church Calendar</h1>
          <p className="text-slate-500">Upcoming services and events.</p>
        </div>
        {isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary">Add Event</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Schedule Event</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Event Title</Label>
                  <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <Button type="submit" className="w-full" disabled={createEvent.isPending}>Schedule Event</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <p>Loading events...</p>
        ) : events?.map((event) => (
          <div key={event.id} className="flex flex-col md:flex-row bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="md:w-48 bg-slate-50 flex flex-col items-center justify-center p-6 border-r border-slate-100">
              <span className="text-3xl font-bold text-slate-900">{format(new Date(event.date), "d")}</span>
              <span className="text-red-500 font-bold uppercase tracking-wide text-sm">{format(new Date(event.date), "MMMM")}</span>
              <span className="text-slate-400 text-sm mt-1">{format(new Date(event.date), "yyyy")}</span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase">{event.type}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{event.title}</h3>
              <p className="text-slate-500 mb-4 text-sm">{event.description}</p>
              <div className="flex items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {format(new Date(event.date), "h:mm a")}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {event.location}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
