
"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Dummy login logic
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Welcome Back",
        description: "Successfully signed into your Veridian account.",
      });
      router.push('/profile');
    }, 1500);
  };

  return (
    <div className="container mx-auto px-6 py-32 min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
      
      <Card className="w-full max-w-md border-white/10 bg-black/40 backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="font-headline text-3xl font-black uppercase tracking-tighter">
            Sign <span className="text-primary">In</span>
          </CardTitle>
          <CardDescription>Enter your credentials to access your garage.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" placeholder="julian.vane@example.com" type="email" required className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" required className="pl-10" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-6">
            <Button type="submit" className="w-full font-bold uppercase tracking-widest h-12" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : "Authorize Entry"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              New to the fleet?{" "}
              <Link href="/signup" className="text-primary font-bold hover:underline italic">Create Account</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
