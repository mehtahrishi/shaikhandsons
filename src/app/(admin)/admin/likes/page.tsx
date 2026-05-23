"use client"

import React from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Users,
  Loader2,
  TrendingUp,
  Search,
  Filter
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
import { Input } from "@/components/ui/input";

type PopularVehicle = {
  id: number;
  make: string;
  model: string;
  slug: string;
  likeCount: number;
};

type LikeDetail = {
  id: number;
  userName: string | null;
  userEmail: string;
  vehicleMake: string;
  vehicleModel: string;
  createdAt: string;
};

type DashboardStats = {
  totalLikes: number;
  popularVehicles: PopularVehicle[];
  allLikesDetail: LikeDetail[];
};

export default function AdminLikesPage() {
  const [statsData, setStatsData] = React.useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  React.useEffect(() => {
    async function fetchLikeStats() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/dashboard/stats');
        const data = await response.json();
        if (response.ok) {
          setStatsData(data.stats);
        }
      } catch (err) {
        console.error('Failed to fetch like stats:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLikeStats();
  }, []);

  const filteredLikes = React.useMemo(() => {
    if (!statsData?.allLikesDetail) return [];
    return statsData.allLikesDetail.filter(like =>
      like.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      like.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      like.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [statsData, searchTerm]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-headline text-4xl md:text-6xl font-black text-primary">
              Engagement
            </h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-xl uppercase tracking-widest font-bold">
            Track customer favorites and fleet popularity.
          </p>
        </motion.div>

        <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[150px]">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Favorites</span>
          <span className="text-3xl font-headline font-black text-primary">
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : statsData?.totalLikes || 0}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Popularity Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-4"
        >
          <Card className="border-border/50 bg-card/40 backdrop-blur-xl sticky top-28">
            <CardHeader>
              <CardTitle className="font-headline text-xl font-bold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" /> Fleet Popularity
              </CardTitle>
              <CardDescription className="text-[10px] uppercase tracking-widest">Aggregate likes per model.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Model</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">Likes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={2} className="h-24 text-center">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                      </TableCell>
                    </TableRow>
                  ) : statsData?.popularVehicles && statsData.popularVehicles.length > 0 ? (
                    statsData.popularVehicles.map((v) => (
                      <TableRow key={v.id} className="border-border/50 hover:bg-primary/5 transition-colors group">
                        <TableCell className="font-headline font-bold">
                          <span className="text-muted-foreground uppercase text-[10px] block mb-0.5">{v.make}</span>
                          {v.model}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-lg font-black text-primary">{v.likeCount}</span>
                            <Heart className="h-3 w-3 text-primary fill-current opacity-50 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="h-24 text-center text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                        No data yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right: Detailed Activity Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-8"
        >
          <Card className="border-border/50 bg-card/40 backdrop-blur-xl">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="font-headline text-xl font-bold flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" /> Engagement Log
                  </CardTitle>
                  <CardDescription className="text-[10px] uppercase tracking-widest">Real-time user preferences.</CardDescription>
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search users or models..."
                    className="pl-9 bg-background/50 border-border/50 rounded-xl h-9 text-xs"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">User Details</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Vehicle Favorited</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                      </TableCell>
                    </TableRow>
                  ) : filteredLikes.length > 0 ? (
                    filteredLikes.map((like) => (
                      <TableRow key={like.id} className="border-border/50 hover:bg-primary/5 transition-colors group">
                        <TableCell className="font-headline">
                          <div className="flex flex-col">
                            <span className="font-black text-foreground">{like.userName || 'Verified User'}</span>
                            <span className="text-[10px] text-muted-foreground tracking-tight">{like.userEmail}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-body">
                          <div className="flex flex-col">
                            <span className="text-[9px] text-primary font-black uppercase tracking-widest">{like.vehicleMake}</span>
                            <span className="font-black text-foreground">{like.vehicleModel}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-foreground">
                              {new Date(like.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                            <span className="text-[8px] font-bold text-muted-foreground uppercase">
                              {new Date(like.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-48 text-center text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <Heart className="h-8 w-8 opacity-10" />
                          <p className="text-[10px] font-black uppercase tracking-widest">No matching favorites found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
