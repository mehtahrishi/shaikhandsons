"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Mail, Lock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName: name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Sign-up failed');
      }

      toast({
        title: "Account Created",
        description: "Welcome to Shaikh & Sons! Please sign in to verify your access.",
      });

      router.push('/login');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign-up failed.';
      toast({
        title: "Sign Up Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] relative flex items-center justify-center overflow-hidden bg-background py-12">
      {/* Dynamic Background Accents */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md px-6 z-10"
      >
        <div className="mb-10 text-center">
          <h1 className="font-headline text-5xl md:text-6xl font-black text-foreground tracking-tighter uppercase mb-2">
            Sign <span className="text-primary italic">Up</span>
          </h1>
          <p className="text-muted-foreground text-xs font-bold tracking-[0.2em] uppercase">
            Begin your journey into high-performance mobility
          </p>
        </div>

        <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground ml-1">Full Name</Label>
              <div className="relative group/input">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within/input:text-primary transition-colors" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  required
                  className="bg-background/50 border-border h-14 pl-12 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all rounded-xl text-foreground placeholder:text-muted-foreground/50"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground ml-1">Email Address</Label>
              <div className="relative group/input">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within/input:text-primary transition-colors" />
                <Input
                  id="email"
                  placeholder="johndoe@gmail.com"
                  type="email"
                  required
                  className="bg-background/50 border-border h-14 pl-12 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all rounded-xl text-foreground placeholder:text-muted-foreground/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground ml-1">Secure Passcode</Label>
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within/input:text-primary transition-colors" />
                <Input
                  id="password"
                  type="password"
                  required
                  className="bg-background/50 border-border h-14 pl-12 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all rounded-xl text-foreground placeholder:text-muted-foreground/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-[0.2em] text-xs rounded-xl shadow-lg shadow-primary/20 group/btn overflow-hidden relative" 
              disabled={loading}
            >
              <span className="relative z-10 flex items-center justify-center">
                {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : (
                  <>
                    Create Account
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-border/50 text-center">
            <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold italic">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-primary/80 transition-colors not-italic">Sign In</Link>
            </p>
          </div>
        </div>
        
      </motion.div>
    </div>
  );
}
