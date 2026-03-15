"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, RefreshCw, Mail } from 'lucide-react';
import { createSessionFromCredentials } from '@/lib/appwrite/auth';
import { useAuth } from '@/context/AuthContext';

const OTP_LENGTH = 6;

export default function VerifyOTPPage() {
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [pendingEmail, setPendingEmail] = useState('');
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const { toast } = useToast();
  const { refresh } = useAuth(); // to ensure Appwrite context updates instantly

  // Load pending auth info from sessionStorage
  useEffect(() => {
    const email = sessionStorage.getItem('pending_email') ?? '';
    setPendingEmail(email);

    if (!sessionStorage.getItem('pending_otp_token') || !sessionStorage.getItem('pending_password')) {
      // Missing required data — bump them back to login
      router.push('/login');
    }
  }, [router]);

  // Resend cooldown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // ─── Input handling ──────────────────────────────────────────────────────────

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return; // digits only

    const newOtp = [...otp];

    if (value.length > 1) {
      // Handle paste: distribute digits across boxes
      const digits = value.split('').slice(0, OTP_LENGTH - index);
      digits.forEach((d, i) => {
        if (index + i < OTP_LENGTH) newOtp[index + i] = d;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, OTP_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // ─── Verify ──────────────────────────────────────────────────────────────────

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join('');

    if (fullOtp.length < OTP_LENGTH) {
      toast({
        title: "Incomplete Code",
        description: "Please enter the full 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    const token = sessionStorage.getItem('pending_otp_token');
    const password = sessionStorage.getItem('pending_password');
    const email = sessionStorage.getItem('pending_email');

    if (!token || !password || !email) {
      toast({ title: "Session Expired", description: "Please login again.", variant: "destructive" });
      router.push('/login');
      return;
    }

    setVerifying(true);
    try {
      // 1. Verify custom OTP token via API
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, otp: fullOtp }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Verification failed.');
      }

      // 2. If verification is successful, officially log them into Appwrite!
      await createSessionFromCredentials(email, password);
      
      // Cleanup sensitive data immediately
      sessionStorage.removeItem('pending_email');
      sessionStorage.removeItem('pending_password');
      sessionStorage.removeItem('pending_otp_token');

      // Update auth context
      await refresh();

      toast({
        title: "Access Granted",
        description: "Identity confirmed. Welcome to the Shaikh & Sons inner circle.",
      });
      router.push('/profile');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Verification failed.';
      toast({
        title: "Verification Failed",
        description: message,
        variant: "destructive",
      });
      // Clear OTP inputs on failure
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  };

  // ─── Resend ───────────────────────────────────────────────────────────────────

  const handleResend = async () => {
    if (countdown > 0 || !pendingEmail) return;
    setResending(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to resent code');

      // Update token with new one
      sessionStorage.setItem('pending_otp_token', data.token);

      setCountdown(60);
      toast({
        title: "Code Resent",
        description: `A new code was sent to ${pendingEmail}.`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to resend code.';
      toast({ title: "Resend Failed", description: message, variant: "destructive" });
    } finally {
      setResending(false);
    }
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
          <CardDescription>
            Enter the 6-digit code sent to your email.
          </CardDescription>
          {pendingEmail && (
            <div className="flex items-center justify-center gap-2 pt-1">
              <Mail className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs text-primary font-medium truncate max-w-[260px]">{pendingEmail}</span>
            </div>
          )}
        </CardHeader>

        <form onSubmit={handleVerify}>
          <CardContent className="space-y-6">
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={OTP_LENGTH}
                  className="w-12 h-14 text-center text-2xl font-black border-white/10 bg-white/5 focus:border-primary transition-colors"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={(e) => e.target.select()}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <div className="text-center">
              <Button
                variant="link"
                size="sm"
                type="button"
                onClick={handleResend}
                disabled={countdown > 0 || resending}
                className="text-muted-foreground hover:text-primary transition-colors text-xs uppercase tracking-widest font-bold"
              >
                {resending ? (
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-3 w-3" />
                )}
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
              </Button>
            </div>
          </CardContent>

          <CardFooter className="pt-6">
            <Button
              type="submit"
              className="w-full font-bold uppercase tracking-widest h-12"
              disabled={verifying || otp.join('').length < OTP_LENGTH}
            >
              {verifying ? <Loader2 className="animate-spin mr-2" /> : "Authorize Handshake"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
