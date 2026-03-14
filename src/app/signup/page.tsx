"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Mail, Lock } from 'lucide-react';

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Dummy signup logic
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Account Created",
        description: "Welcome to the Shaikh & Sons inner circle.",
      });
      router.push('/profile');
    }, 1500);
  };

  return (
    <div className="container mx-auto px-6 pt-28 pb-20 flex-1 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
      
      <Card className="w-full max-w-md border-white/10 bg-black/40 backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="font-headline text-3xl font-black uppercase tracking-tighter">
            Join the <span className="text-primary">Elite</span>
          </CardTitle>
          <CardDescription>Begin your journey into high-performance electronic mobility.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignUp}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="name" placeholder="Julian Vane" required className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" placeholder="julian@example.com" type="email" required className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" required className="pl-10" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-6">
            <Button type="submit" className="w-full font-bold uppercase tracking-widest h-12" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : "Create Credentials"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already a collector?{" "}
              <Link href="/login" className="text-primary font-bold hover:underline italic">Sign In</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
