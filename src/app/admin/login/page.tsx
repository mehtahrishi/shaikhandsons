
"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, Lock, Mail, ChevronLeft } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const { login, user } = useAdminAuth();

  useEffect(() => {
    if (user) {
      router.push('/admin');
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      
      toast({
        title: "Command Authorized",
        description: "Welcome back to the Fleet Core.",
      });

      router.push('/admin');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authorization failed.';
      toast({
        title: "Access Denied",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-background relative overflow-hidden p-6">
      {/* Red ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10"></div>
      
      <div className="absolute top-8 left-8">
        <Button asChild variant="ghost" className="text-xs font-bold uppercase tracking-widest gap-2">
          <Link href="/"><ChevronLeft className="h-3 w-3" /> Back to Showroom</Link>
        </Button>
      </div>

      <div className="w-full max-w-sm">
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-3 mb-2">
            <span className="font-headline font-black text-3xl text-foreground uppercase tracking-tight" style={{ fontFamily: 'Playfair Display' }}>SHAIKH</span>
            <span className="font-headline font-light tracking-[0.3em] text-foreground text-3xl uppercase" style={{ fontFamily: 'Playfair Display' }}>& SONS</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Fleet Command Core</p>
        </div>

        <Card className="border-border/50 bg-card/40 backdrop-blur-2xl shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" /> Administrative Entry
            </CardTitle>
            <CardDescription className="text-xs uppercase tracking-widest opacity-60">Enter secure bypass credentials.</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] uppercase tracking-widest text-muted-foreground">Admin Identifier</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@shaikh.sons"
                    required
                    className="pl-10 h-12 bg-muted/20 border-border focus:border-primary transition-all text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[10px] uppercase tracking-widest text-muted-foreground">Security Token</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="pl-10 h-12 bg-muted/20 border-border focus:border-primary transition-all text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-6 pb-8">
              <Button type="submit" className="w-full h-12 font-black uppercase tracking-widest text-xs" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2" /> : "Initiate Authorization"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-12 text-center space-y-1">
          <p className="text-[9px] text-muted-foreground uppercase tracking-widest opacity-40">
            Proprietary Fleet Management System
          </p>
          <p className="text-[8px] text-primary font-bold uppercase tracking-[0.3em]">
            AES-256 Cloud Encrypted Persistence
          </p>
        </div>
      </div>
    </div>
  );
}
