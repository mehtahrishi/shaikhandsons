
"use client"

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Settings, 
  LogOut, 
  Loader2, 
  ShieldCheck,
  ChevronRight,
  ShieldAlert,
  User as UserIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

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
        description: "Please sign in to access your profile.",
        variant: "destructive"
      });
      router.push('/login');
    }
  }, [user, loading, router, toast]);

  const handleSignOut = async () => {
    await logout();
    toast({
      title: "Secure Logout",
      description: "Identity session terminated successfully.",
    });
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="font-headline text-xs uppercase tracking-[0.4em] text-muted-foreground">Confirming Identity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] pt-32 pb-24 relative overflow-hidden flex items-center">
      {/* Cinematic Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[800px] bg-primary/5 rounded-full blur-[160px] opacity-40 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 flex justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-xl"
        >
          <Card className="bg-white/5 backdrop-blur-2xl border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
            <CardHeader className="text-center pt-12 pb-8 space-y-6">
              <div className="relative mx-auto w-fit">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="relative z-10"
                >
                  <Avatar className="h-32 w-32 border-2 border-primary/20 p-1 bg-black/40 shadow-[0_0_40px_rgba(239,68,68,0.15)]">
                    <AvatarImage src={`https://picsum.photos/seed/${user.email}/200/200`} />
                    <AvatarFallback className="text-3xl font-black bg-primary/10 text-white">
                      {user.name?.slice(0, 2).toUpperCase() || 'CP'}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <div className="absolute -bottom-1 -right-1 bg-primary text-white p-2 rounded-full shadow-lg border-2 border-[#020202] z-20">
                  <CrownIcon className="h-5 w-5" />
                </div>
              </div>

              <div className="space-y-2">
                <CardTitle className="font-headline text-4xl font-black uppercase tracking-tighter text-white">
                  {user.name || "Elite Collector"}
                </CardTitle>
                <CardDescription className="flex flex-col items-center gap-3">
                  <Badge variant="outline" className="text-primary border-primary bg-primary/5 px-4 py-1 uppercase tracking-[0.2em] text-[10px] font-black">
                    Elite Member <span className="mx-2 text-white/40">|</span> Tier Alpha
                  </Badge>
                  <span className="font-mono text-xs text-muted-foreground tracking-widest">{user.email.toLowerCase()}</span>
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="px-10 pb-12 space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 text-center">
                  <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Access Level</p>
                  <p className="font-black text-white text-sm uppercase">Priority</p>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 text-center">
                  <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Agent ID</p>
                  <p className="font-black text-white text-sm">#{user.$id.slice(-6).toUpperCase()}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2 mb-4">
                  <ShieldCheck className="h-3 w-3" /> Identity Control
                </h3>
                
                <Button variant="ghost" className="w-full justify-between h-14 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest px-6 rounded-2xl border border-white/5">
                  <span className="flex items-center gap-4"><Settings className="h-4 w-4 text-primary" /> Security Configuration</span>
                  <ChevronRight className="h-4 w-4 opacity-30" />
                </Button>

                <Button variant="ghost" className="w-full justify-between h-14 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest px-6 rounded-2xl border border-white/5">
                  <span className="flex items-center gap-4"><ShieldAlert className="h-4 w-4 text-primary" /> Key Management</span>
                  <ChevronRight className="h-4 w-4 opacity-30" />
                </Button>

                <Button 
                  variant="ghost" 
                  onClick={handleSignOut}
                  className="w-full justify-between h-14 bg-red-500/5 hover:bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-widest px-6 rounded-2xl border border-red-500/10 mt-4"
                >
                  <span className="flex items-center gap-4"><LogOut className="h-4 w-4" /> Terminate Session</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
