
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
      <div className="h-[calc(100vh-80px)] flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 min-h-[calc(100vh-140px)] flex items-center justify-center relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] aspect-square bg-primary/5 rounded-full blur-[80px] -z-10"></div>
      
      <Card className="w-full max-w-sm border-white/10 bg-black/40 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-primary/10 to-transparent"></div>
        
        <CardHeader className="pt-8 flex flex-col items-center relative z-10">
          <div className="relative mb-3">
            <Avatar className="h-14 w-14 border-2 border-background shadow-2xl">
              <AvatarImage src="https://picsum.photos/seed/user/200/200" alt="Julian Vane" />
              <AvatarFallback className="text-base font-black">JV</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 bg-primary text-primary-foreground p-0.5 rounded-full shadow-lg border-2 border-background">
              <ShieldCheck className="h-2.5 w-2.5" />
            </div>
          </div>
          
          <div className="text-center space-y-1">
            <CardTitle className="font-headline text-lg font-black uppercase tracking-tight">
              Julian Vane
            </CardTitle>
            <Badge variant="outline" className="text-primary border-primary bg-primary/5 px-1.5 py-0 uppercase tracking-widest text-[7px] font-bold">
              Elite Collector Member
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4 px-6">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-center">
              <p className="text-[7px] uppercase tracking-widest text-muted-foreground mb-0.5">Status</p>
              <p className="font-bold text-[9px]">Verified Agent</p>
            </div>
            <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-center">
              <p className="text-[7px] uppercase tracking-widest text-muted-foreground mb-0.5">Fleet Access</p>
              <p className="font-bold text-[9px]">Priority Tier</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 pb-8 px-6">
          <Button className="w-full h-8 font-bold uppercase tracking-widest gap-2 text-[8px]">
            <Settings className="h-3.5 w-3.5" /> Account Configuration
          </Button>
          <Button 
            variant="ghost" 
            className="w-full h-8 font-bold uppercase tracking-widest text-destructive hover:bg-destructive/10 gap-2 text-[8px]"
            onClick={handleSignOut}
          >
            <LogOut className="h-3.5 w-3.5" /> Terminate Session
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
