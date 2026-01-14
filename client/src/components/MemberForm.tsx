import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRegisterUser } from "@/hooks/use-users";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { z } from "zod";

// Extend the schema for the form
const formSchema = insertUserSchema.extend({
  age: z.coerce.number().optional(),
  childrenCount: z.coerce.number().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function MemberForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const register = useRegisterUser();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "member",
      childrenCount: 0,
    }
  });

  const onSubmit = (data: FormData) => {
    register.mutate(data, {
      onSuccess: () => {
        toast({ title: "Success", description: "Member registered successfully." });
        onSuccess();
      },
      onError: (err) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="personal" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Personal</TabsTrigger>
          <TabsTrigger value="contact" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Contact</TabsTrigger>
          <TabsTrigger value="professional" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Professional</TabsTrigger>
        </TabsList>

        <div className="mt-6 space-y-4 h-[300px] overflow-y-auto px-1">
          <TabsContent value="personal" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input {...form.register("fullName")} placeholder="John Doe" />
                {form.formState.errors.fullName && <p className="text-red-500 text-xs">{form.formState.errors.fullName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Username (Login)</Label>
                <Input {...form.register("username")} placeholder="johndoe" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Password</Label>
                <Input {...form.register("password")} type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select onValueChange={(val) => form.setValue("gender", val as any)}>
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Age</Label>
                <Input {...form.register("age")} type="number" placeholder="30" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Marital Status</Label>
                <Select onValueChange={(val) => form.setValue("maritalStatus", val)}>
                  <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input {...form.register("email")} type="email" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input {...form.register("phoneNumber")} placeholder="+254..." />
            </div>
            <div className="space-y-2">
              <Label>Residence Address</Label>
              <Input {...form.register("residenceAddress")} placeholder="House, Street, City" />
            </div>
            <div className="space-y-2">
              <Label>National ID</Label>
              <Input {...form.register("nationalId")} placeholder="12345678" />
            </div>
          </TabsContent>

          <TabsContent value="professional" className="space-y-4">
            <div className="space-y-2">
              <Label>Occupation</Label>
              <Input {...form.register("occupation")} placeholder="Software Engineer" />
            </div>
            <div className="space-y-2">
              <Label>Employment Status</Label>
              <Select onValueChange={(val) => form.setValue("employmentStatus", val)}>
                <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Employed">Employed</SelectItem>
                  <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                  <SelectItem value="Unemployed">Unemployed</SelectItem>
                  <SelectItem value="Student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Education Level</Label>
              <Input {...form.register("educationLevel")} placeholder="Degree, Masters..." />
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <DialogFooter>
        <Button type="submit" disabled={register.isPending} className="w-full bg-primary hover:bg-primary/90">
          {register.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Register Member
        </Button>
      </DialogFooter>
    </form>
  );
}
