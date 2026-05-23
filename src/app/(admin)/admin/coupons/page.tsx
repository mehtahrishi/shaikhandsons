"use client"

import React from 'react';
import { motion } from 'framer-motion';
import {
  Tag, Plus, Trash2, Edit2, RefreshCw, Percent, IndianRupee, Search,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { fetchAdminCoupons, createCouponAPI, updateCouponAPI, deleteCouponAPI } from '@/lib/inventory-client';

type Coupon = {
  id: number; code: string; description?: string;
  discountType: string; discountValue: string;
  maxDiscountAmount?: string | null; minOrderValue?: string | null;
  usageLimit?: number | null; usedCount: number; perUserLimit: number;
  validFrom?: string; validUntil?: string | null; isActive: boolean;
  createdAt: string;
};

const EMPTY_FORM = {
  code: '', description: '',
  discountType: 'percentage' as 'percentage' | 'flat',
  discountValue: '',
  maxDiscountAmount: '',
  minOrderValue: '',
  usageLimit: '',
  perUserLimit: '1',
  validFrom: '',
  validUntil: '',
  isActive: true,
};

const fmt = (p: string | number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(Number(p));

export default function AdminCouponsPage() {
  const { toast } = useToast();
  const [coupons, setCoupons] = React.useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingCoupon, setEditingCoupon] = React.useState<Coupon | null>(null);
  const [form, setForm] = React.useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = React.useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = React.useState<Coupon | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const load = async () => {
    setIsLoading(true);
    try { setCoupons(await fetchAdminCoupons()); }
    catch (err: any) { toast({ title: 'Error', description: err.message, variant: 'destructive' }); }
    finally { setIsLoading(false); }
  };

  React.useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditingCoupon(null);
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (c: Coupon) => {
    setEditingCoupon(c);
    setForm({
      code: c.code,
      description: c.description || '',
      discountType: c.discountType as 'percentage' | 'flat',
      discountValue: String(c.discountValue),
      maxDiscountAmount: c.maxDiscountAmount || '',
      minOrderValue: c.minOrderValue || '',
      usageLimit: c.usageLimit != null ? String(c.usageLimit) : '',
      perUserLimit: String(c.perUserLimit),
      validFrom: c.validFrom ? c.validFrom.split('T')[0] : '',
      validUntil: c.validUntil ? c.validUntil.split('T')[0] : '',
      isActive: c.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.code || !form.discountValue) {
      toast({ title: 'Missing Fields', description: 'Code and discount value are required.', variant: 'destructive' });
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        code: form.code.toUpperCase().trim(),
        description: form.description || undefined,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : null,
        minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : null,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        perUserLimit: Number(form.perUserLimit) || 1,
        validFrom: form.validFrom || undefined,
        validUntil: form.validUntil || null,
        isActive: form.isActive,
      };

      if (editingCoupon) {
        await updateCouponAPI({ id: editingCoupon.id, ...payload });
        toast({ title: 'Updated', description: `Coupon ${payload.code} updated.` });
      } else {
        await createCouponAPI(payload);
        toast({ title: 'Created', description: `Coupon ${payload.code} created successfully.` });
      }
      setIsModalOpen(false);
      load();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally { setIsSaving(false); }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteCouponAPI(deleteTarget.id);
      setCoupons(prev => prev.filter(c => c.id !== deleteTarget.id));
      toast({ title: 'Deleted', description: `Coupon "${deleteTarget.code}" removed.` });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const setField = (k: keyof typeof EMPTY_FORM, v: any) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const filtered = coupons.filter(c =>
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="font-headline text-4xl md:text-6xl font-black mb-2 text-primary">Coupons</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Manage discount codes</p>
        </motion.div>
        <div className="flex gap-2 self-start md:self-auto">
          <Button variant="outline" size="sm" onClick={load} disabled={isLoading}
            className="h-9 text-[10px] uppercase font-black tracking-widest">
            <RefreshCw className={`h-3 w-3 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button size="sm" onClick={openCreate}
            className="h-9 text-[10px] uppercase font-black tracking-widest bg-primary text-white hover:bg-primary/90">
            <Plus className="h-3 w-3 mr-2" /> New Coupon
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Coupons', value: coupons.length },
          { label: 'Active', value: coupons.filter(c => c.isActive).length },
          { label: 'Total Uses', value: coupons.reduce((s, c) => s + (c.usedCount || 0), 0) },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="bg-card/40 backdrop-blur-xl border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">{s.label}</CardTitle>
                <Tag className="h-3.5 w-3.5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-headline font-black text-primary">{s.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <Card className="border-border/50 bg-card/40 backdrop-blur-xl">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="font-headline text-xl font-bold">All Coupons</CardTitle>
            <CardDescription className="text-[10px] uppercase tracking-widest">
              Click edit to modify any coupon
            </CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input placeholder="Search code or description..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)} className="pl-9 h-9 text-xs w-full bg-muted/20" />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <RefreshCw className="h-5 w-5 animate-spin mr-3" />
              <span className="text-sm font-bold uppercase tracking-widest">Loading...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
              <Tag className="h-10 w-10 opacity-20" />
              <p className="text-sm font-bold uppercase tracking-widest">No coupons yet</p>
              <Button size="sm" onClick={openCreate} className="mt-2 text-[10px] font-black uppercase tracking-widest">
                <Plus className="h-3 w-3 mr-2" /> Create First Coupon
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  {['Code', 'Discount', 'Used / Limit', 'Min Order', 'Valid Until', 'Status', 'Actions'].map(h => (
                    <TableHead key={h} className="text-[9px] font-black uppercase tracking-widest">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(c => (
                  <TableRow key={c.id} className="border-border/50 hover:bg-primary/5 transition-colors">
                    <TableCell className="py-4">
                      <p className="font-mono font-black text-sm text-primary tracking-widest">{c.code}</p>
                      {c.description && <p className="text-[9px] text-muted-foreground mt-0.5">{c.description}</p>}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1.5">
                        {c.discountType === 'percentage'
                          ? <Percent className="h-3 w-3 text-primary" />
                          : <IndianRupee className="h-3 w-3 text-primary" />}
                        <span className="font-black text-sm">
                          {c.discountType === 'percentage' ? `${c.discountValue}%` : fmt(c.discountValue)}
                        </span>
                      </div>
                      {c.maxDiscountAmount && (
                        <p className="text-[9px] text-muted-foreground">Max {fmt(c.maxDiscountAmount)}</p>
                      )}
                    </TableCell>
                    <TableCell className="py-4 text-xs font-bold">
                      {c.usedCount}{c.usageLimit != null ? `/${c.usageLimit}` : ''}
                    </TableCell>
                    <TableCell className="py-4 text-xs font-bold">
                      {c.minOrderValue ? fmt(c.minOrderValue) : '—'}
                    </TableCell>
                    <TableCell className="py-4 text-xs font-bold">
                      {c.validUntil ? new Date(c.validUntil).toLocaleDateString('en-IN') : 'No expiry'}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge variant="outline"
                        className={`text-[8px] font-black uppercase tracking-widest border ${c.isActive ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(c)}
                          className="h-7 w-7 p-0 hover:bg-primary/10 hover:text-primary">
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(c)}
                          className="h-7 w-7 p-0 hover:bg-red-500/10 hover:text-red-500">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* ─── Create / Edit Dialog (matches inventory modal style) ────────────── */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card/95 backdrop-blur-xl border-border/50 sm:max-w-[550px] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="font-headline text-2xl font-black uppercase">
              {editingCoupon ? `Edit — ${editingCoupon.code}` : 'New Coupon'}
            </DialogTitle>
            <DialogDescription className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {editingCoupon ? 'Update coupon details below.' : 'Fill in the details to create a new discount code.'}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-6 py-6 px-6">
              {/* Code */}
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Coupon Code *
                </Label>
                <Input 
                  value={form.code} 
                  onChange={e => setField('code', e.target.value.toUpperCase())}
                  placeholder="e.g. LAUNCH20" 
                  className="font-mono font-black uppercase bg-muted/20 h-10 text-xs border-border/50 rounded-lg" 
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Description (Internal Note)
                </Label>
                <Input 
                  value={form.description} 
                  onChange={e => setField('description', e.target.value)}
                  placeholder="e.g. Launch offer — 20% off all EVs" 
                  className="bg-muted/20 h-10 text-xs border-border/50 font-medium rounded-lg" 
                />
              </div>

              <Separator className="bg-border/30" />

              {/* Discount Type + Value */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Discount Type *
                  </Label>
                  <Select 
                    value={form.discountType} 
                    onValueChange={(val) => setField('discountType', val as 'percentage' | 'flat')}
                  >
                    <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50 font-bold">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/50">
                      <SelectItem value="percentage" className="text-xs font-bold">Percentage (%)</SelectItem>
                      <SelectItem value="flat" className="text-xs font-bold">Flat Amount (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {form.discountType === 'percentage' ? 'Percentage Value *' : 'Amount Off (₹) *'}
                  </Label>
                  <Input 
                    type="number" 
                    value={form.discountValue}
                    onChange={e => setField('discountValue', e.target.value)}
                    placeholder={form.discountType === 'percentage' ? '20' : '500'} 
                    min="0" 
                    className="bg-muted/20 h-10 text-xs border-border/50 font-bold rounded-lg"
                  />
                </div>
              </div>

              {/* Max Discount Cap (only for percentage) */}
              {form.discountType === 'percentage' && (
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Max Discount Cap (₹)
                  </Label>
                  <Input 
                    type="number" 
                    value={form.maxDiscountAmount}
                    onChange={e => setField('maxDiscountAmount', e.target.value)}
                    placeholder="e.g. 2000 — leave blank for no cap" 
                    min="0" 
                    className="bg-muted/20 h-10 text-xs border-border/50 font-bold rounded-lg"
                  />
                </div>
              )}

              {/* Min Order Value */}
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Minimum Order Value (₹)
                </Label>
                <Input 
                  type="number" 
                  value={form.minOrderValue}
                  onChange={e => setField('minOrderValue', e.target.value)}
                  placeholder="e.g. 50000 — leave blank for no minimum" 
                  min="0" 
                  className="bg-muted/20 h-10 text-xs border-border/50 font-bold rounded-lg"
                />
              </div>

              <Separator className="bg-border/30" />

              {/* Usage Limits */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Total Usage Limit
                  </Label>
                  <Input 
                    type="number" 
                    value={form.usageLimit}
                    onChange={e => setField('usageLimit', e.target.value)}
                    placeholder="Unlimited" 
                    min="1" 
                    className="bg-muted/20 h-10 text-xs border-border/50 font-bold rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Uses Per User
                  </Label>
                  <Input 
                    type="number" 
                    value={form.perUserLimit}
                    onChange={e => setField('perUserLimit', e.target.value)}
                    placeholder="1" 
                    min="1" 
                    className="bg-muted/20 h-10 text-xs border-border/50 font-bold rounded-lg"
                  />
                </div>
              </div>

              {/* Validity Window */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Valid From
                  </Label>
                  <Input 
                    type="date" 
                    value={form.validFrom}
                    onChange={e => setField('validFrom', e.target.value)} 
                    className="bg-muted/20 h-10 text-xs border-border/50 font-bold rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Valid Until
                  </Label>
                  <Input 
                    type="date" 
                    value={form.validUntil}
                    onChange={e => setField('validUntil', e.target.value)} 
                    className="bg-muted/20 h-10 text-xs border-border/50 font-bold rounded-lg"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 py-1 bg-muted/10 p-3 rounded-lg border border-border/50">
                <Checkbox id="isActive" checked={form.isActive}
                  onCheckedChange={checked => setField('isActive', !!checked)} />
                <Label htmlFor="isActive" className="text-[10px] font-black uppercase tracking-widest cursor-pointer select-none">
                  Active — customers can apply this coupon
                </Label>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="p-6 border-t border-border/30 bg-background/40 backdrop-blur-md">
            <Button 
              variant="outline" 
              onClick={() => setIsModalOpen(false)}
              className="h-10 px-6 font-black uppercase tracking-widest text-[10px] rounded-lg"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="h-10 px-6 font-black uppercase tracking-widest text-[10px] rounded-lg bg-primary text-white hover:bg-primary/90"
            >
              {isSaving ? 'Saving...' : editingCoupon ? 'Update Coupon' : 'Create Coupon'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirmation ─────────────────────────────────────────────── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={open => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-border/50 max-w-[400px] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline text-2xl font-black uppercase">Delete Coupon?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs uppercase tracking-widest leading-relaxed">
              This will permanently remove <span className="font-mono font-black text-primary underline">{deleteTarget?.code}</span>.
              Any existing orders referencing this coupon will retain their discount snapshot.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="h-10 px-4 font-black uppercase text-[10px] rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm} 
              disabled={isDeleting}
              className="h-10 px-6 font-black uppercase text-[10px] rounded-lg bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
