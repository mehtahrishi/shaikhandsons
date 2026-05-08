"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, RefreshCw, Mail, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const { refresh } = useAuth();

  useEffect(() => {
    const email = sessionStorage.getItem('pending_email') ?? '';
    setPendingEmail(email);

    if (!sessionStorage.getItem('pending_otp_token') || !sessionStorage.getItem('pending_password')) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];

    if (value.length > 1) {
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
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, otp: fullOtp }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Verification failed.');
      }

      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!loginRes.ok) {
        throw new Error('Failed to create session');
      }
      
      sessionStorage.removeItem('pending_email');
      sessionStorage.removeItem('pending_password');
      sessionStorage.removeItem('pending_otp_token');

      await refresh();

      toast({
        title: "Access Granted",
        description: "Identity confirmed. Welcome to the Shaikh & Sons inner circle.",
      });
      router.push('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Verification failed.';
      toast({
        title: "Verification Failed",
        description: message,
        variant: "destructive",
      });
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  };

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
    <div className="min-h-[calc(100vh-80px)] relative flex items-center justify-center overflow-hidden bg-background py-12">
      {/* Dynamic Background Accents */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md px-6 z-10"
      >
        <div className="mb-10 text-center">
          <h1 className="font-headline text-5xl md:text-6xl font-black text-foreground tracking-tighter uppercase mb-2">
            Verify <span className="text-primary italic">Identity</span>
          </h1>
          <p className="text-muted-foreground text-xs font-bold tracking-[0.2em] uppercase">
            A secure handshake is required
          </p>
          {pendingEmail && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <Mail className="h-3 w-3 text-primary/60" />
              <span className="text-[10px] text-primary font-bold tracking-widest truncate max-w-[200px]">{pendingEmail}</span>
            </div>
          )}
        </div>

        <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <form onSubmit={handleVerify} className="space-y-8">
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={OTP_LENGTH}
                  className="w-12 h-16 text-center text-2xl font-black border-border bg-background/50 focus:border-primary focus:bg-background/80 transition-all rounded-xl text-foreground selection:bg-primary/30"
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
                className="text-muted-foreground/60 hover:text-primary transition-colors text-[10px] uppercase tracking-[0.2em] font-bold"
              >
                {resending ? (
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-3 w-3" />
                )}
                {countdown > 0 ? `Retry in ${countdown}s` : 'Request New Code'}
              </Button>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-[0.2em] text-xs rounded-xl group/btn overflow-hidden relative" 
              disabled={verifying || otp.join('').length < OTP_LENGTH}
            >
              <span className="relative z-10 flex items-center justify-center">
                {verifying ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : (
                  <>
                    Complete Handshake
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
