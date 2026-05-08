"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock, Mail, ChevronRight } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';

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
    <div className="min-h-[calc(100vh-80px)] relative flex flex-col items-center justify-start overflow-hidden bg-background pt-16 md:pt-24 pb-8 px-6">
      {/* Dynamic Background Accents */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <div className="mb-4 md:mb-6 text-center">
          <h1 className="font-headline text-5xl md:text-6xl font-black text-foreground tracking-tighter uppercase mb-2">
            Admin <span className="text-primary italic">Core</span>
          </h1>
          <p className="text-muted-foreground text-xs font-bold tracking-[0.2em] uppercase">
            Authorized Personnel Access Only
          </p>
        </div>

        <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground ml-1">Admin Identifier</Label>
              <div className="relative group/input">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within/input:text-primary transition-colors" />
                <Input
                  id="email"
                  placeholder="admin@shaikh.sons"
                  type="email"
                  required
                  className="bg-background/50 border-border h-14 pl-12 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all rounded-xl text-foreground placeholder:text-muted-foreground/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <Label htmlFor="password" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Encryption Key</Label>
              </div>
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within/input:text-primary transition-colors" />
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="bg-background/50 border-border h-14 pl-12 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all rounded-xl text-foreground placeholder:text-muted-foreground/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-[0.2em] text-xs rounded-xl group/btn overflow-hidden relative" 
              disabled={loading}
            >
              <span className="relative z-10 flex items-center justify-center">
                {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : (
                  <>
                    Authorize Entry
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-border/50 text-center">
            <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
              Restricted Area — All Access is Logged
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
