
"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, RefreshCw } from 'lucide-react';

export default function VerifyOTPPage() {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== "") {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    
    if (fullOtp.length < 6) {
      toast({
        title: "Incomplete Code",
        description: "Please enter the full 6-digit verification code.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('shaikh_auth_token', 'true');
      toast({
        title: "Access Granted",
        description: "Identity confirmed. Welcome to the Shaikh & Sons inner circle.",
      });
      router.push('/profile');
    }, 1500);
  };

  return (
    <div className="container mx-auto px-6 py-32 flex-1 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
      
      <Card className="w-full max-w-md border-white/10 bg-black/40 backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl font-black uppercase tracking-tighter">
            Verify <span className="text-primary">Identity</span>
          </CardTitle>
          <CardDescription>Enter the 6-digit code sent to your registered device.</CardDescription>
        </CardHeader>
        <form onSubmit={handleVerify}>
          <CardContent className="space-y-6">
            <div className="flex justify-between gap-2">
              {otp.map((data, index) => (
                <Input
                  key={index}
                  type="text"
                  maxLength={1}
                  className="w-12 h-14 text-center text-2xl font-black border-white/10 bg-white/5 focus:border-primary"
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onFocus={(e) => e.target.select()}
                  required
                />
              ))}
            </div>
            <div className="text-center">
              <Button variant="link" size="sm" type="button" className="text-muted-foreground hover:text-primary transition-colors text-xs uppercase tracking-widest font-bold">
                <RefreshCw className="mr-2 h-3 w-3" /> Resend Code
              </Button>
            </div>
          </CardContent>
          <CardFooter className="pt-6">
            <Button type="submit" className="w-full font-bold uppercase tracking-widest h-12" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : "Authorize Handshake"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
