"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Car, 
  Users, 
  TrendingUp, 
  ChevronRight,
  ShieldAlert,
  Zap,
  Cpu,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
            Fleet <span className="text-primary italic">Command</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl uppercase tracking-widest font-bold">
            Central intelligence hub for the Shaikh & Sons ecosystem.
          </p>
        </motion.div>
        
        <div className="flex gap-4">
          <div className="bg-primary/5 border border-primary/20 px-4 py-2 rounded-full flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-primary">Core Synced</span>
          </div>
        </div>
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

      {/* Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="h-full border-primary/10 bg-gradient-to-br from-card to-background">
            <CardHeader>
              <CardTitle className="font-headline text-xl font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" /> AI Synthesis Core
              </CardTitle>
              <CardDescription className="text-xs uppercase tracking-widest opacity-60">
                Harness generative models for the Veridian brand.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/admin/ai-tools">
                  <div className="p-5 rounded-xl bg-muted/20 border border-border/50 hover:border-primary/50 transition-all group cursor-pointer h-full">
                    <h4 className="text-xs font-black uppercase tracking-widest mb-2 flex items-center justify-between">
                      Marketing Suite
                      <ChevronRight className="h-3 w-3 text-primary group-hover:translate-x-1 transition-transform" />
                    </h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed uppercase tracking-wider">
                      Luxury descriptions & bespoke package configuration.
                    </p>
                  </div>
                </Link>
                <div className="p-5 rounded-xl bg-muted/5 border border-dashed border-border flex flex-col items-center justify-center text-center opacity-40">
                  <ShieldAlert className="h-5 w-5 mb-2 text-muted-foreground" />
                  <h4 className="text-[9px] font-black uppercase tracking-widest mb-1">Coming Soon</h4>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Neural Route Logistics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="font-headline text-xl font-bold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-between h-12 group text-[10px] font-black uppercase tracking-widest">
                <span>Fleet Mgmt</span>
                <ChevronRight className="h-3 w-3 text-primary" />
              </Button>
              <Button variant="outline" className="w-full justify-between h-12 group text-[10px] font-black uppercase tracking-widest">
                <span>Inquiries</span>
                <ChevronRight className="h-3 w-3 text-primary" />
              </Button>
              <Button asChild className="w-full h-12 font-black uppercase tracking-widest text-[10px] mt-4">
                <Link href="/admin/ai-tools">Launch AI Hub</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}