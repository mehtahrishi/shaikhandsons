
"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, LogOut, Loader2, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  const [isVerifying, setIsVerifying] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('shaikh_auth_token');
    if (!isAuthenticated) {
      toast({
        title: "Unauthorized Access",
        description: "Please sign in to access your garage.",
        variant: "destructive"
      });
      router.push('/login');
    } else {
      setIsVerifying(false);
    }
  }, [router, toast]);

  const handleSignOut = () => {
    localStorage.removeItem('shaikh_auth_token');
    toast({
      title: "Signed Out",
      description: "Secure session terminated.",
    });
    router.push('/');
    window.dispatchEvent(new Event('storage'));
  };

  if (isVerifying) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10 md:py-20 min-h-[calc(100vh-80px)] flex items-center justify-center relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] aspect-square bg-primary/5 rounded-full blur-[100px] -z-10"></div>
      
      <Card className="w-full max-w-md border-white/10 bg-black/40 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/20 to-transparent"></div>
        
        <CardHeader className="pt-12 flex flex-col items-center relative z-10">
          <div className="relative mb-4">
            <Avatar className="h-20 w-20 md:h-24 md:w-24 border-3 border-background shadow-2xl">
              <AvatarImage src="https://picsum.photos/seed/user/200/200" alt="Julian Vane" />
              <AvatarFallback className="text-xl md:text-2xl font-black">JV</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-1 rounded-full shadow-lg border-2 border-background">
              <ShieldCheck className="h-3 w-3 md:h-4 md:w-4" />
            </div>
          </div>
          
          <div className="text-center space-y-1.5">
            <CardTitle className="font-headline text-2xl md:text-3xl font-black uppercase tracking-tight">
              Julian Vane
            </CardTitle>
            <Badge variant="outline" className="text-primary border-primary bg-primary/5 px-3 py-0.5 uppercase tracking-widest text-[9px] font-bold">
              Elite Collector Member
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4 px-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-center">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Status</p>
              <p className="font-bold text-[11px] md:text-xs">Verified Agent</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-center">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Fleet Access</p>
              <p className="font-bold text-[11px] md:text-xs">Priority Tier</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 pb-10 px-6">
          <Button className="w-full h-10 font-bold uppercase tracking-widest gap-2 text-[10px]">
            <Settings className="h-4 w-4" /> Account Configuration
          </Button>
          <Button 
            variant="ghost" 
            className="w-full h-10 font-bold uppercase tracking-widest text-destructive hover:bg-destructive/10 gap-2 text-[10px]"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" /> Terminate Session
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
