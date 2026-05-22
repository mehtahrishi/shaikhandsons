"use client"

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Clock, CheckCircle2, Search,
  Phone, Calendar, MapPin, Tag, User, RefreshCw, FileText,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { fetchAdminOrders, updateOrderStatusAPI } from '@/lib/inventory-client';

type Order = {
  id: number; customerName: string; customerPhone: string; customerEmail?: string;
  vehicleName: string; vehicleSlug: string; variantName?: string; vehiclePrice: string;
  couponCode?: string; discountAmount: string; finalPrice: string;
  preferredShowroom?: string; preferredDate?: string; orderType: string;
  status: string; adminNotes?: string; createdAt: string;
  userEmail?: string; userFullName?: string;
};

const STATUS_OPTIONS = ['pending', 'confirmed', 'cancelled', 'completed'] as const;
const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  confirmed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
};
const fmt = (p: string | number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(Number(p));
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export default function AdminOrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [updatingId, setUpdatingId] = React.useState<number | null>(null);
  const [expandedId, setExpandedId] = React.useState<number | null>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminOrders(statusFilter === 'all' ? undefined : statusFilter);
      setOrders(data);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally { setIsLoading(false); }
  };

  React.useEffect(() => { load(); }, [statusFilter]);

  const handleStatus = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      await updateOrderStatusAPI(id, status);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      toast({ title: 'Updated', description: `Order #${id} → ${status}` });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally { setUpdatingId(null); }
  };

  const filtered = orders.filter(o => {
    const q = searchQuery.toLowerCase();
    return o.customerName.toLowerCase().includes(q) || o.customerPhone.includes(q)
      || o.vehicleName.toLowerCase().includes(q) || String(o.id).includes(q);
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="font-headline text-4xl md:text-6xl font-black mb-2 text-primary">Orders</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Manage bookings & reservations</p>
        </motion.div>
        <Button variant="outline" size="sm" onClick={load} disabled={isLoading}
          className="h-9 text-[10px] uppercase font-black tracking-widest self-start md:self-auto">
          <RefreshCw className={`h-3 w-3 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: ShoppingCart, color: 'text-primary' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-500' },
          { label: 'Confirmed', value: stats.confirmed, icon: CheckCircle2, color: 'text-blue-500' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'text-emerald-500' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="bg-card/40 backdrop-blur-xl border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">{s.label}</CardTitle>
                <s.icon className={`h-3.5 w-3.5 ${s.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-headline font-black ${s.color}`}>{s.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="border-border/50 bg-card/40 backdrop-blur-xl">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="font-headline text-xl font-bold">Booking Requests</CardTitle>
            <CardDescription className="text-[10px] uppercase tracking-widest">Click a row to expand details</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input placeholder="Search name, phone, vehicle..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs w-full sm:w-64 bg-muted/20" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="h-9 px-3 text-xs font-bold bg-muted/20 border border-border/50 rounded-md outline-none focus:border-primary transition-colors">
              <option value="all">All Statuses</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
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
              <ShoppingCart className="h-10 w-10 opacity-20" />
              <p className="text-sm font-bold uppercase tracking-widest">No orders found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  {['#', 'Customer', 'Vehicle', 'Type', 'Status', 'Price', 'Action'].map(h => (
                    <TableHead key={h} className={`text-[9px] font-black uppercase tracking-widest ${h === 'Price' ? 'text-right' : ''}`}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(order => (
                  <React.Fragment key={order.id}>
                    <TableRow className="border-border/50 hover:bg-primary/5 transition-colors cursor-pointer"
                      onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>
                      <TableCell className="py-4 font-mono text-[10px] tracking-widest text-muted-foreground">#{order.id}</TableCell>
                      <TableCell className="py-4">
                        <p className="text-xs font-bold leading-none mb-1">{order.customerName}</p>
                        <p className="text-[9px] text-muted-foreground flex items-center gap-1">
                          <Phone className="h-2.5 w-2.5" />{order.customerPhone}
                        </p>
                      </TableCell>
                      <TableCell className="py-4">
                        <p className="text-xs font-bold">{order.vehicleName}</p>
                        {order.variantName && <p className="text-[9px] text-primary font-bold">{order.variantName}</p>}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-border/40">
                          {order.orderType === 'test_drive' ? '🚗 Test Drive' : '🛒 Purchase'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-widest border ${STATUS_STYLES[order.status] || ''}`}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <p className="text-sm font-black text-primary">{fmt(order.finalPrice || order.vehiclePrice || 0)}</p>
                        {Number(order.discountAmount) > 0 && (
                          <p className="text-[9px] text-emerald-500 font-bold">-{fmt(order.discountAmount)} off</p>
                        )}
                      </TableCell>
                      <TableCell className="py-4" onClick={e => e.stopPropagation()}>
                        <select value={order.status} onChange={e => handleStatus(order.id, e.target.value)}
                          disabled={updatingId === order.id}
                          className="h-7 px-2 text-[9px] font-black uppercase bg-muted/20 border border-border/50 rounded-md outline-none focus:border-primary disabled:opacity-50">
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                      </TableCell>
                    </TableRow>

                    <AnimatePresence>
                      {expandedId === order.id && (
                        <TableRow className="border-border/50 bg-muted/5">
                          <TableCell colSpan={7} className="py-0">
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                              <div className="py-4 px-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                {[
                                  { icon: Calendar, label: 'Preferred Date', value: order.preferredDate || '—' },
                                  { icon: MapPin, label: 'Showroom', value: order.preferredShowroom || '—' },
                                  { icon: Tag, label: 'Coupon', value: order.couponCode || '—' },
                                  { icon: User, label: 'Account', value: order.userEmail || order.customerEmail || 'Guest' },
                                ].map(item => (
                                  <div key={item.label} className="space-y-0.5">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                                      <item.icon className="h-2.5 w-2.5" />{item.label}
                                    </p>
                                    <p className="font-bold">{item.value}</p>
                                  </div>
                                ))}
                                <div className="space-y-0.5 col-span-2">
                                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                                    <FileText className="h-2.5 w-2.5" />Booked On
                                  </p>
                                  <p className="font-bold">{fmtDate(order.createdAt)}</p>
                                </div>
                                {order.adminNotes && (
                                  <div className="space-y-0.5 col-span-2">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Admin Notes</p>
                                    <p className="font-medium text-muted-foreground">{order.adminNotes}</p>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}