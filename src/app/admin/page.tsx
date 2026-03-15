"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Car, 
  Users, 
  TrendingUp, 
  Zap,
  Cpu,
  Mail,
  ArrowUpRight
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
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts";

const chartData = [
  { month: "Jan", reservations: 186 },
  { month: "Feb", reservations: 305 },
  { month: "Mar", reservations: 237 },
  { month: "Apr", reservations: 273 },
  { month: "May", reservations: 409 },
  { month: "Jun", reservations: 514 },
];

const chartConfig = {
  reservations: {
    label: "Reservations",
    color: "hsl(var(--primary))",
  },
};

const recentEnquiries = [
  { id: "ENQ-101", user: "Alexander Vance", model: "Veridian Aether", region: "London", status: "New" },
  { id: "ENQ-102", user: "Sarah Jenkins", model: "Noir Spectre", region: "Dubai", status: "In Progress" },
  { id: "ENQ-103", user: "Michael Chen", model: "Veridian Lumina", region: "Singapore", status: "Pending" },
  { id: "ENQ-104", user: "Elena Rodriguez", model: "Veridian Aether", region: "New York", status: "Contacted" },
];

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Active Reservations', value: '1,284', icon: Car, trend: '+12%' },
    { label: 'Network Hashrate', value: '42.8 PH/s', icon: Cpu, trend: 'Stable' },
    { label: 'Verified Collectors', value: '842', icon: Users, trend: '+5%' },
    { label: 'Energy Efficiency', value: '98.2%', icon: Zap, trend: '+1.4%' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="font-headline text-4xl md:text-6xl font-black mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl uppercase tracking-widest font-bold">
            Overview of your store's performance.
          </p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
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
                <div className="flex items-center gap-1 text-[9px] font-bold text-primary">
                  <TrendingUp className="h-2.5 w-2.5" /> {stat.trend}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reservation Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="border-border/50 bg-card/40 backdrop-blur-xl h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-headline text-xl font-bold">Reservation Trends</CardTitle>
                  <CardDescription className="text-[10px] uppercase tracking-widest">Global fleet acquisition data.</CardDescription>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="fillReservations" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-reservations)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--color-reservations)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700 }}
                      dy={10}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="reservations"
                      stroke="var(--color-reservations)"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#fillReservations)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Enquiries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-border/50 bg-card/40 backdrop-blur-xl h-full">
            <CardHeader>
              <CardTitle className="font-headline text-xl font-bold flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" /> Recent Enquiries
              </CardTitle>
              <CardDescription className="text-[10px] uppercase tracking-widest">Latest concierge requests.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-[9px] font-black uppercase tracking-widest h-8">User</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-widest h-8">Model</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-widest h-8 text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentEnquiries.map((enq) => (
                    <TableRow key={enq.id} className="border-border/50 hover:bg-primary/5 transition-colors">
                      <TableCell className="py-4">
                        <p className="text-xs font-bold leading-none mb-1">{enq.user}</p>
                        <p className="text-[8px] text-muted-foreground uppercase tracking-widest">{enq.region}</p>
                      </TableCell>
                      <TableCell className="py-4 text-[10px] font-medium italic opacity-70">
                        {enq.model.split(' ')[1]}
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 bg-primary/10 text-primary rounded-full">
                          {enq.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}