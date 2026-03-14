
"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, LogOut, Loader2, User, ShieldCheck } from 'lucide-react';
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
    // Trigger storage event for navbar update
    window.dispatchEvent(new Event('storage'));
  };

  if (isVerifying) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-32 min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
      
      <Card className="w-full max-w-lg border-white/10 bg-black/40 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/20 to-transparent"></div>
        
        <CardHeader className="pt-16 flex flex-col items-center relative z-10">
          <div className="relative mb-6">
            <Avatar className="h-32 w-32 border-4 border-background shadow-2xl">
              <AvatarImage src="https://picsum.photos/seed/user/200/200" alt="Julian Vane" />
              <AvatarFallback className="text-3xl font-black">JV</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2 rounded-full shadow-lg border-2 border-background">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <CardTitle className="font-headline text-4xl font-black uppercase tracking-tight">
              Julian Vane
            </CardTitle>
            <Badge variant="outline" className="text-primary border-primary bg-primary/5 px-4 py-1 uppercase tracking-widest text-[10px] font-bold">
              Elite Collector Member
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Status</p>
              <p className="font-bold text-sm">Verified Agent</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Fleet Access</p>
              <p className="font-bold text-sm">Priority Tier</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pb-12">
          <Button className="w-full h-12 font-bold uppercase tracking-widest gap-2">
            <Settings className="h-4 w-4" /> Account Configuration
          </Button>
          <Button 
            variant="ghost" 
            className="w-full h-12 font-bold uppercase tracking-widest text-destructive hover:bg-destructive/10 gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" /> Terminate Session
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
