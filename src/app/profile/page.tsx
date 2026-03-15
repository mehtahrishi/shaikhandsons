
"use client"

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Settings, 
  LogOut, 
  Loader2, 
  ShieldCheck, 
  Zap, 
  Car, 
  Clock, 
  ChevronRight,
  ShieldAlert,
  Crown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { vehicles } from '@/lib/mock-data';

const CrownIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 512 512" fill="currentColor" className={className}>
    <g>
      <path d="M124.536,178.991c12.892,0,23.33-10.438,23.33-23.322s-10.438-23.322-23.33-23.322 c-12.876,0-23.314,10.438-23.314,23.322S111.66,178.991,124.536,178.991z"/>
      <path d="M46.66,211.508c0-12.883-10.454-23.321-23.33-23.321C10.454,188.187,0,198.625,0,211.508 c0,12.884,10.454,23.322,23.33,23.322C36.206,234.83,46.66,224.392,46.66,211.508z"/>
      <path d="M387.464,178.991c12.892,0,23.33-10.438,23.33-23.322s-10.438-23.322-23.33-23.322 c-12.876,0-23.314,10.438-23.314,23.322S374.588,178.991,387.464,178.991z"/>
      <path d="M488.686,188.187c-12.892,0-23.33,10.438-23.33,23.321c0,12.884,10.454,23.322,23.33,23.322 c12.876,0,23.314-10.438,23.314-23.322C512,198.625,501.562,188.187,488.686,188.187z"/>
      <rect x="80.101" y="399.236" width="351.815" height="36.296"/>
      <path d="M400.193,272.999c-33.932-23.322-14.839-82.694-14.839-82.694l-19.388-5.661 c-40.721,77.385-100.608,73.761-95.937-12.728v-27.715h33.686v-28.05h-33.686V76.468h-28.058v39.682h-33.702v28.05h33.702v27.715 c4.679,86.49-55.2,90.113-95.938,12.728l-19.371,5.661c0,0,19.076,59.372-14.839,82.694 c-33.932,23.321-63.626-33.923-63.626-33.923l-19.076,8.474L82.13,374.777H429.87l53.008-127.226l-19.076-8.474 C463.802,239.076,434.125,296.32,400.193,272.999z M170.852,321.058c-9.26,0-16.77-7.501-16.77-16.762 c0-9.252,7.51-16.753,16.77-16.753c9.244,0,16.753,7.501,16.753,16.753C187.606,313.557,180.096,321.058,170.852,321.058z M256.008,312.681c-9.26,0-16.762-7.501-16.762-16.762c0-9.252,7.501-16.753,16.762-16.753c9.252,0,16.753,7.501,16.753,16.753 C272.762,305.18,256.008,312.681,256.008,312.681z M341.164,321.058c-9.26,0-16.753-7.501-16.753-16.762 c0-9.252,7.493-16.753,16.753-16.753c9.26,0,16.753,7.501,16.753,16.753C357.918,313.557,350.425,321.058,341.164,321.058z"/>
    </g>
  </svg>
);

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Unauthorized Access",
        description: "Please sign in to access your garage.",
        variant: "destructive"
      });
      router.push('/login');
    }
  }, [user, loading, router, toast]);

  const handleSignOut = async () => {
    await logout();
    toast({
      title: "Secure Logout",
      description: "Encrypted session terminated successfully.",
    });
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="font-headline text-xs uppercase tracking-[0.4em] text-muted-foreground">Initializing Garage...</p>
        </div>
      </div>
    );
  }

  // Mock Active Reservation
  const activeReservation = vehicles[0];

  return (
    <div className="min-h-screen bg-[#020202] pt-32 pb-24 relative overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-primary/5 rounded-full blur-[160px] opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Profile & Identity */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 space-y-8"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
              
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="relative z-10"
                  >
                    <Avatar className="h-28 w-28 border-2 border-primary/20 p-1 bg-black/40 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
                      <AvatarImage src={`https://picsum.photos/seed/${user.email}/200/200`} />
                      <AvatarFallback className="text-2xl font-black bg-primary/10">{user.name?.slice(0, 2).toUpperCase() || 'CP'}</AvatarFallback>
                    </Avatar>
                  </motion.div>
                  <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-full shadow-lg border-2 border-[#020202] z-20">
                    <CrownIcon className="h-4 w-4" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h1 className="font-headline text-3xl font-black uppercase tracking-tighter text-white">
                    {user.name || "Elite Collector"}
                  </h1>
                  <div className="flex flex-col items-center gap-2">
                    <Badge variant="outline" className="text-primary border-primary bg-primary/5 px-3 py-0.5 uppercase tracking-[0.2em] text-[8px] font-black">
                      Elite Member <span className="mx-1 text-white">|</span> Tier Alpha
                    </Badge>
                    <p className="text-[10px] text-muted-foreground font-mono tracking-widest">{user.email.toLowerCase()}</p>
                  </div>
                </div>

                <div className="w-full pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Fleet Access</p>
                    <p className="font-black text-white">PRIORITY</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Agent ID</p>
                    <p className="font-black text-white">#{user.$id.slice(-6).toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                <ShieldCheck className="h-3 w-3" /> Security Protocol
              </h3>
              <div className="space-y-3">
                <Button variant="ghost" className="w-full justify-between h-12 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest px-4 rounded-xl border border-white/5">
                  <span className="flex items-center gap-3"><Settings className="h-4 w-4 text-primary" /> Configuration</span>
                  <ChevronRight className="h-4 w-4 opacity-30" />
                </Button>
                <Button variant="ghost" className="w-full justify-between h-12 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest px-4 rounded-xl border border-white/5">
                  <span className="flex items-center gap-3"><ShieldAlert className="h-4 w-4 text-primary" /> Encryption Keys</span>
                  <ChevronRight className="h-4 w-4 opacity-30" />
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleSignOut}
                  className="w-full justify-between h-12 bg-red-500/5 hover:bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-widest px-4 rounded-xl border border-red-500/10"
                >
                  <span className="flex items-center gap-3"><LogOut className="h-4 w-4" /> Terminate Session</span>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Fleet & Dashboard */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-8 space-y-8"
          >
            {/* Active Reservation Section */}
            <div className="space-y-4">
              <h2 className="font-headline text-xl font-bold uppercase tracking-widest text-white/90">Your Fleet Status</h2>
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl overflow-hidden group">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-5 h-full">
                    <div className="md:col-span-2 relative h-48 md:h-auto overflow-hidden">
                      <img 
                        src={activeReservation.image} 
                        alt={activeReservation.model} 
                        className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-primary text-white text-[8px] font-black uppercase tracking-widest border-none px-3">Reserved</Badge>
                      </div>
                    </div>
                    <div className="md:col-span-3 p-8 flex flex-col justify-between space-y-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.4em] text-primary font-black mb-1">Current Commission</p>
                          <h3 className="font-headline text-4xl font-black text-white">{activeReservation.model}</h3>
                          <p className="text-xs text-muted-foreground uppercase tracking-widest">{activeReservation.trim} Edition</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] uppercase tracking-widest text-muted-foreground">Est. Delivery</p>
                          <p className="text-lg font-bold text-white">Q4 2025</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-primary">
                            <Zap className="h-3 w-3" />
                            <span className="text-[8px] font-black uppercase tracking-widest">Range</span>
                          </div>
                          <p className="text-sm font-bold text-white">{activeReservation.batteryRangeKm}km</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-primary">
                            <Car className="h-3 w-3" />
                            <span className="text-[8px] font-black uppercase tracking-widest">Power</span>
                          </div>
                          <p className="text-sm font-bold text-white">{activeReservation.horsepower}hp</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-primary">
                            <Clock className="h-3 w-3" />
                            <span className="text-[8px] font-black uppercase tracking-widest">0-60</span>
                          </div>
                          <p className="text-sm font-bold text-white">{activeReservation.zeroToSixtySeconds}s</p>
                        </div>
                      </div>

                      <Button className="w-full rounded-full h-12 bg-white text-black hover:bg-white/90 font-black uppercase tracking-[0.2em] text-[10px]">
                        Track Production
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Technical Support</h4>
                  <Badge variant="outline" className="border-green-500/30 text-green-500 text-[8px] uppercase font-black">Connected</Badge>
                </div>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    "Your personal concierge is on standby for configuration adjustments or logistical inquiries."
                  </p>
                  <Button variant="outline" className="w-full rounded-xl h-12 border-white/10 bg-transparent hover:bg-white/5 font-bold uppercase tracking-widest text-[10px]">
                    Open Concierge Channel
                  </Button>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Digital Assets</h4>
                  <Crown className="h-4 w-4 text-primary" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl text-center border border-white/5">
                    <p className="text-2xl font-black text-white">03</p>
                    <p className="text-[8px] uppercase tracking-widest text-muted-foreground mt-1">Saved Builds</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl text-center border border-white/5">
                    <p className="text-2xl font-black text-white">12</p>
                    <p className="text-[8px] uppercase tracking-widest text-muted-foreground mt-1">Invites Sent</p>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
