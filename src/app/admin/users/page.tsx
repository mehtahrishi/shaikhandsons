"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  ShieldCheck, 
  UserPlus,
  Mail,
  Search,
  CheckCircle2
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const customers = [
  { id: "C-101", name: "Alexander Vance", email: "vance.a@shaikh.sons", status: "Verified", tier: "Elite", orders: 2 },
  { id: "C-102", name: "Sarah Jenkins", email: "sj@london.tech", status: "Verified", tier: "Platinum", orders: 1 },
  { id: "C-103", name: "Michael Chen", email: "chen.m@singapore.corp", status: "Pending", tier: "Standard", orders: 1 },
  { id: "C-104", name: "Elena Rodriguez", email: "elena.r@ny.elite", status: "Verified", tier: "Elite", orders: 3 },
  { id: "C-105", name: "Julian Vane", email: "vane.j@ev.world", status: "Verified", tier: "Standard", orders: 1 },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="font-headline text-4xl md:text-6xl font-black mb-2 text-primary">
            Customers
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl uppercase tracking-widest font-bold">
            Elite collector database and access management.
          </p>
        </motion.div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-12 px-6 font-black uppercase tracking-widest text-[10px] rounded-xl">
            <Mail className="h-4 w-4 mr-2" /> Broadcast
          </Button>
          <Button className="h-12 px-6 font-black uppercase tracking-widest text-[10px] rounded-xl">
            <UserPlus className="h-4 w-4 mr-2" /> Invite Collector
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Members', value: '842', icon: Users, trend: '+12' },
          { label: 'Verified Status', value: '92%', icon: ShieldCheck, trend: 'High' },
          { label: 'Elite Tier', value: '156', icon: CheckCircle2, trend: '+5' },
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
                <div className="text-[9px] font-bold text-primary">{stat.trend} this week</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="border-border/50 bg-card/40 backdrop-blur-xl">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="font-headline text-xl font-bold">Collector Directory</CardTitle>
            <CardDescription className="text-[10px] uppercase tracking-widest">Manage access and verification.</CardDescription>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input placeholder="Search directory..." className="pl-9 h-9 text-xs w-64 bg-muted/20" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-[9px] font-black uppercase tracking-widest w-[50px]"></TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-widest">Member</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-widest">Membership</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-widest">Verification</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-widest">Orders</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-widest text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((user) => (
                <TableRow key={user.id} className="border-border/50 hover:bg-primary/5 transition-colors">
                  <TableCell className="py-4">
                    <Avatar className="h-8 w-8 border border-border/50">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="py-4">
                    <p className="text-xs font-bold leading-none mb-1">{user.name}</p>
                    <p className="text-[8px] text-muted-foreground lowercase tracking-widest">{user.email}</p>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-widest ${user.tier === 'Elite' ? 'border-primary text-primary' : ''}`}>
                      {user.tier}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <div className={`h-1.5 w-1.5 rounded-full ${user.status === 'Verified' ? 'bg-green-500' : 'bg-amber-500'}`} />
                      <span className="text-[10px] font-medium opacity-70">{user.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 font-black text-[10px]">
                    {user.orders}
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <Button variant="link" size="sm" className="text-[9px] font-black uppercase tracking-widest text-primary">
                      Inspect
                    </Button>
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