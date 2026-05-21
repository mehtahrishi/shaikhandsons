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
  ChartSpline,
  ShieldCheck,
  CircleDollarSign,
  Loader2,
  Heart
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
  totalUsers: number;
  totalVehicles: number;
  totalBrands: number;
  totalLikes: number;
  totalAssetValue: number;
  popularVehicles: PopularVehicle[];
  allLikesDetail: LikeDetail[];
};

export default function AdminDashboardPage() {
  const [statsData, setStatsData] = React.useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchDashboardStats() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/dashboard/stats');
        const data = await response.json();
        if (response.ok) {
          setStatsData(data.stats);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboardStats();
  }, []);

  const formattedTotalValue = React.useMemo(() => {
    if (!statsData) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(statsData.totalAssetValue);
  }, [statsData]);

  const stats = [
    { 
      label: 'Total Users', 
      value: statsData ? String(statsData.totalUsers) : '...', 
      icon: Users, 
      trend: 'Registered' 
    },
    { 
      label: 'Engagement', 
      value: statsData ? String(statsData.totalLikes) : '...', 
      icon: Heart, 
      trend: 'Likes' 
    },
    { 
      label: 'Brand Network', 
      value: statsData ? String(statsData.totalBrands) : '...', 
      icon: ShieldCheck, 
      trend: 'Active' 
    },
    { 
      label: 'Fleet Valuation', 
      value: statsData ? formattedTotalValue : '...', 
      icon: CircleDollarSign, 
      trend: 'Estimated' 
    },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="font-headline text-4xl md:text-6xl font-black mb-2 text-primary">
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
                <div className="text-2xl font-headline font-black mb-1 flex items-center gap-2">
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  ) : (
                    stat.value
                  )}
                </div>
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
                  <ChartSpline className="h-4 w-4" />
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
              <CardDescription className="text-[10px] uppercase tracking-widest">Latest support requests.</CardDescription>
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
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                      No enquiries yet
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Popular Vehicles - Likes Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="border-border/50 bg-card/40 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl font-bold flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" /> Popular Vehicles
            </CardTitle>
            <CardDescription className="text-[10px] uppercase tracking-widest">Most liked vehicles by customers.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Model</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">Total Likes</TableHead>
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
                      No engagement data yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
      {/* Who Liked What - Individual Records */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="border-border/50 bg-card/40 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> User Engagement Details
            </CardTitle>
            <CardDescription className="text-[10px] uppercase tracking-widest">Individual customer favorites.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">User</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Liked Product</TableHead>
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
                ) : statsData?.allLikesDetail && statsData.allLikesDetail.length > 0 ? (
                  statsData.allLikesDetail.map((like) => (
                    <TableRow key={like.id} className="border-border/50 hover:bg-primary/5 transition-colors">
                      <TableCell className="font-headline">
                        <div className="flex flex-col">
                          <span className="font-bold">{like.userName || 'N/A'}</span>
                          <span className="text-[9px] text-muted-foreground">{like.userEmail}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-body">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-primary font-black uppercase tracking-tighter">{like.vehicleMake}</span>
                          <span className="font-bold">{like.vehicleModel}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-[10px] font-bold text-muted-foreground">
                        {new Date(like.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                      No individual likes recorded
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
      </div>
      );
      }