"use client"

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Sparkles, 
  Car, 
  Users, 
  TrendingUp, 
  ChevronRight,
  ShieldAlert,
  Zap,
  Cpu
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-headline text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Initializing Command...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Active Reservations', value: '1,284', icon: Car, trend: '+12%' },
    { label: 'Network Hashrate', value: '42.8 PH/s', icon: Cpu, trend: 'Stable' },
    { label: 'Verified Collectors', value: '842', icon: Users, trend: '+5%' },
    { label: 'Energy Efficiency', value: '98.2%', icon: Zap, trend: '+1.4%' },
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="font-headline text-5xl md:text-7xl font-black mb-4">
              Fleet <span className="text-primary italic">Command</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Central intelligence hub for the Shaikh & Sons ecosystem. Monitor network status, manage inventory, and access AI synthesis tools.
            </p>
          </motion.div>
          
          <div className="flex gap-4">
            <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-full flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">System Online</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="bg-card/40 backdrop-blur-xl border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-headline font-black mb-1">{stat.value}</div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-primary">
                    <TrendingUp className="h-3 w-3" /> {stat.trend}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="h-full border-primary/20 bg-gradient-to-br from-card to-background">
              <CardHeader>
                <CardTitle className="font-headline text-2xl font-bold flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-primary" /> AI Synthesis Core
                </CardTitle>
                <CardDescription>
                  Harness advanced generative models to curate the Veridian brand experience.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/admin/ai-tools">
                    <div className="p-6 rounded-2xl bg-muted/20 border border-border/50 hover:border-primary/50 transition-all group cursor-pointer h-full">
                      <h4 className="font-bold mb-2 flex items-center justify-between">
                        Marketing Suite
                        <ChevronRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Generate editorial-style luxury descriptions and configure vehicle packages for the global showroom.
                      </p>
                    </div>
                  </Link>
                  <div className="p-6 rounded-2xl bg-muted/5 border border-dashed border-border flex flex-col items-center justify-center text-center opacity-50 grayscale">
                    <ShieldAlert className="h-8 w-8 mb-4 text-muted-foreground" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">Coming Soon</h4>
                    <p className="text-[10px] text-muted-foreground">Neural Route Planning & Logistics</p>
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
                <CardTitle className="font-headline text-2xl font-bold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-between h-14 group">
                  <span className="text-xs font-bold uppercase tracking-widest">Inventory Management</span>
                  <ChevronRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all" />
                </Button>
                <Button variant="outline" className="w-full justify-between h-14 group">
                  <span className="text-xs font-bold uppercase tracking-widest">Collector Inquiries</span>
                  <ChevronRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all" />
                </Button>
                <Button variant="outline" className="w-full justify-between h-14 group">
                  <span className="text-xs font-bold uppercase tracking-widest">System Diagnostics</span>
                  <ChevronRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all" />
                </Button>
                <Button asChild className="w-full h-14 font-black uppercase tracking-widest mt-4">
                  <Link href="/admin/ai-tools">Launch AI Workspace</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}