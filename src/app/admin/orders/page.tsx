"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight,
  Filter,
  Search
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const orders = [
  { id: "ORD-7721", user: "Julian Vane", model: "Veridian Aether", date: "2024-05-20", status: "Delivered", price: "$125,000" },
  { id: "ORD-7722", user: "Elena Rodriguez", model: "Noir Spectre", date: "2024-05-21", status: "In Transit", price: "$210,000" },
  { id: "ORD-7723", user: "Michael Chen", model: "Veridian Lumina", date: "2024-05-22", status: "Processing", price: "$98,000" },
  { id: "ORD-7724", user: "Sarah Jenkins", model: "Veridian Aether", date: "2024-05-22", status: "Pending", price: "$125,000" },
  { id: "ORD-7725", user: "Alexander Vance", model: "Noir Spectre", date: "2024-05-23", status: "Production", price: "$210,000" },
];

export default function AdminOrdersPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="font-headline text-4xl md:text-6xl font-black mb-2 text-primary">
            Orders
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl uppercase tracking-widest font-bold">
            Manage global fleet commissions and fulfillment.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue', value: '$1.2M', icon: ShoppingCart, trend: '+18%' },
          { label: 'Active Builds', value: '42', icon: Clock, trend: 'Stable' },
          { label: 'Delivered', value: '128', icon: CheckCircle2, trend: '+5%' },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="bg-card/40 backdrop-blur-xl border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-3.5 w-3.5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-headline font-black mb-1">{stat.value}</div>
                <div className="text-[9px] font-bold text-primary">{stat.trend} this month</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="border-border/50 bg-card/40 backdrop-blur-xl">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="font-headline text-xl font-bold">Order History</CardTitle>
            <CardDescription className="text-[10px] uppercase tracking-widest">Real-time fulfillment tracking.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input placeholder="Search orders..." className="pl-9 h-9 text-xs w-64 bg-muted/20" />
            </div>
            <Button variant="outline" size="sm" className="text-[10px] uppercase font-bold tracking-widest h-9">
              <Filter className="h-3 w-3 mr-2" /> Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-[9px] font-black uppercase tracking-widest">ID</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-widest">Collector</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-widest">Model</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-widest">Status</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-widest text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="border-border/50 hover:bg-primary/5 transition-colors">
                  <TableCell className="py-4 font-mono text-[10px] tracking-widest">{order.id}</TableCell>
                  <TableCell className="py-4">
                    <p className="text-xs font-bold leading-none mb-1">{order.user}</p>
                    <p className="text-[8px] text-muted-foreground uppercase tracking-widest">{order.date}</p>
                  </TableCell>
                  <TableCell className="py-4 text-[10px] font-medium italic opacity-70">
                    {order.model}
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-[0.2em] border-primary/20 bg-primary/5 text-primary">
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-right font-headline font-bold text-sm">
                    {order.price}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}