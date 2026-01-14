import { StatCard } from "@/components/StatCard";
import { CreditCard, History, Wallet, CheckCircle2 } from "lucide-react";
import { useTransactions, useCreateTransaction } from "@/hooks/use-transactions";
import { useAuth } from "@/hooks/use-auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Givings() {
  const { user } = useAuth();
  const { data: transactions } = useTransactions();
  const createTransaction = useCreateTransaction();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    amount: "",
    category: "Tithe",
    type: "MPESA",
    purpose: "",
    transactionCode: "",
  });

  const totalGiving = transactions?.reduce((acc, t) => acc + Number(t.amount), 0) || 0;
  const lastDonation = transactions?.[0]?.date;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    createTransaction.mutate({
      userId: user.id,
      amount: form.amount,
      category: form.category as any,
      type: form.type as any,
      purpose: form.purpose,
      transactionCode: form.transactionCode,
    }, {
      onSuccess: () => {
        toast({ title: "Donation Recorded", description: "Thank you for your giving." });
        setOpen(false);
        setForm({ amount: "", category: "Tithe", type: "MPESA", purpose: "", transactionCode: "" });
      }
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display text-slate-900">Givings & Tithes</h1>
        <p className="text-slate-500">Track your contributions and support the ministry.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Contribution" 
          value={`$${totalGiving.toLocaleString()}`} 
          icon={<Wallet className="w-5 h-5" />} 
          color="amber"
        />
        <StatCard 
          title="Last Contribution" 
          value={lastDonation ? new Date(lastDonation).toLocaleDateString() : "N/A"} 
          icon={<History className="w-5 h-5" />} 
          color="blue"
        />
        <div className="bg-gradient-to-br from-primary to-blue-800 rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold">Quick Give</h3>
            <p className="text-blue-200 text-sm mt-1">Make a new contribution securely.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-white text-primary hover:bg-blue-50 mt-4 font-semibold">
                Give Now
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Make a Contribution</DialogTitle>
                <DialogDescription>Record your giving. Payment integration coming soon.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input 
                      type="number" 
                      placeholder="1000" 
                      value={form.amount} 
                      onChange={e => setForm({...form, amount: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tithe">Tithe</SelectItem>
                        <SelectItem value="Offering">Offering</SelectItem>
                        <SelectItem value="Project">Project</SelectItem>
                        <SelectItem value="Seed">Seed</SelectItem>
                        <SelectItem value="Thanksgiving">Thanksgiving</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <Select value={form.type} onValueChange={v => setForm({...form, type: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MPESA">MPESA</SelectItem>
                        <SelectItem value="Bank">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Ref Code</Label>
                    <Input 
                      placeholder="QKD..." 
                      value={form.transactionCode} 
                      onChange={e => setForm({...form, transactionCode: e.target.value})} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Note / Purpose</Label>
                  <Input 
                    placeholder="Optional note..." 
                    value={form.purpose} 
                    onChange={e => setForm({...form, purpose: e.target.value})} 
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={createTransaction.isPending}>
                    {createTransaction.isPending ? "Processing..." : "Confirm Giving"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="font-bold text-slate-900">Transaction History</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">No transactions recorded yet.</TableCell>
              </TableRow>
            ) : (
              transactions?.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.date ? new Date(t.date).toLocaleDateString() : "-"}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-slate-100 rounded-md text-xs font-medium text-slate-700">{t.category}</span>
                  </TableCell>
                  <TableCell className="text-slate-500">{t.type} {t.transactionCode && `(${t.transactionCode})`}</TableCell>
                  <TableCell className="font-bold text-slate-900">${Number(t.amount).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Completed
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
