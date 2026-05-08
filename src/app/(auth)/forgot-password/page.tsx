"use client"

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

import { forgotPassword, resetPassword, verifyOTP } from '@/lib/auth/auth-client';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [token, setToken] = useState<string>('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { token: newToken } = await forgotPassword(email);

      setToken(newToken);
      setStep('otp');
      toast({
        title: "Code Sent",
        description: `A reset code was sent to ${email}.`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send code.';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join('');

    if (fullOtp.length < 6) {
      toast({
        title: "Incomplete Code",
        description: "Please enter the full 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await verifyOTP(token, fullOtp);

      sessionStorage.setItem('reset_email', email);
      sessionStorage.setItem('reset_token', token);

      toast({
        title: "Code Verified",
        description: "Please enter your new password.",
      });
      setStep('reset');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Verification failed.';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];

    if (value.length > 1) {
      const digits = value.split('').slice(0, 6 - index);
      digits.forEach((d, i) => {
        if (index + i < 6) newOtp[index + i] = d;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const passwordInput = (e.target as HTMLFormElement).elements.namedItem('password') as HTMLInputElement;
    const confirmPasswordInput = (e.target as HTMLFormElement).elements.namedItem('confirmPassword') as HTMLInputElement;
    
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        description: "Please ensure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await resetPassword({
        email,
        otp: otp.join(''),
        newPassword: password,
        token,
      });

      sessionStorage.removeItem('reset_email');
      sessionStorage.removeItem('reset_token');
      setOtp(Array(6).fill(''));

      toast({
        title: "Password Reset",
        description: "Your password has been successfully reset. You can now login.",
      });
      router.push('/login');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Password reset failed.';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      const { token: newToken } = await forgotPassword(email);

      setToken(newToken);
      toast({
        title: "Code Resent",
        description: `A new code was sent to ${email}.`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to resend code.';
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] relative flex items-center justify-center overflow-hidden bg-background py-12">
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
            {step === 'email' && <><span className="text-primary italic">Forgot</span> Password</>}
            {step === 'otp' && <><span className="text-primary italic">Verify</span> Identity</>}
            {step === 'reset' && <><span className="text-primary italic">New</span> Passcode</>}
          </h1>
          <p className="text-muted-foreground text-xs font-bold tracking-[0.2em] uppercase">
            {step === 'email' && 'Enter your email to recover access'}
            {step === 'otp' && 'A security handshake is required'}
            {step === 'reset' && 'Create a new secure passcode'}
          </p>
          {step === 'otp' && email && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <Mail className="h-3 w-3 text-primary/60" />
              <span className="text-[10px] text-primary font-bold tracking-widest truncate max-w-[200px]">{email}</span>
            </div>
          )}
        </div>

        <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {step === 'email' && (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground ml-1">Email Identifier</Label>
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

              <Button 
                type="submit" 
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-[0.2em] text-xs rounded-xl group/btn overflow-hidden relative" 
                disabled={loading}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : (
                    <>
                      Send Recovery Code
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
              </Button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerify} className="space-y-8">
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
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
                  disabled={loading}
                  className="text-muted-foreground/60 hover:text-primary transition-colors text-[10px] uppercase tracking-[0.2em] font-bold"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  ) : (
                    <>
                      Refresh Code
                      <ChevronRight className="ml-1 h-3 w-3" />
                    </>
                  )}
                </Button>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-[0.2em] text-xs rounded-xl group/btn overflow-hidden relative" 
                disabled={loading || otp.join('').length < 6}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : (
                    <>
                      Confirm Recovery
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
              </Button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground ml-1">New Passcode</Label>
                <div className="relative group/input">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within/input:text-primary transition-colors" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="bg-background/50 border-border h-14 pl-12 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all rounded-xl text-foreground placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground ml-1">Confirm Passcode</Label>
                <div className="relative group/input">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within/input:text-primary transition-colors" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="bg-background/50 border-border h-14 pl-12 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all rounded-xl text-foreground placeholder:text-muted-foreground/50"
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
                      Update Passcode
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
              </Button>
            </form>
          )}

          <div className="mt-8 pt-8 border-t border-border/50 text-center">
            {step === 'email' && (
              <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                Remember your passcode?{" "}
                <Link href="/login" className="text-primary hover:text-primary/80 transition-colors">Sign In</Link>
              </p>
            )}
            {step === 'reset' && (
              <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                Back to{" "}
                <Link href="/login" className="text-primary hover:text-primary/80 transition-colors">Sign In</Link>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
