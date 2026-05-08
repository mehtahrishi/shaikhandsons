"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  Phone,
  MapPin,
  Edit3,
  Check,
  X,
  CheckCircle2,
  Shield,
  Lock,
  EyeOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading, refresh } = useAuth();

  // Local state for editability
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

  // Initialize data and check for missing fields
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      // Initialize from user data
      setPhone(user.phone || "");
      setAddress(user.address || "");
    }
  }, [user, loading, router]);

  // Timeout to prevent stuck loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading && !user) {
        router.push('/login');
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timer);
  }, [loading, user, router]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone || null,
          address: address || null,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update profile');
      }

      const data = await res.json();
      setIsEditing(false);
      await refresh(); // Refresh user data from context

      toast({
        title: "Identity Updated",
        description: "Your saved details have been securely saved.",
      });
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message || "Failed to save profile details.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="font-headline text-xs uppercase tracking-[0.4em] text-muted-foreground">Authenticating Access...</p>
        </div>
      </div>
    );
  }

  const userInitial = user.fullName?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-background pt-10 pb-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary),0.05)_0%,transparent_100%)] opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[160px] opacity-20" />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >
          {/* Profile Card */}
          <Card className="bg-card/40 backdrop-blur-3xl border border-border/50 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="text-center pt-8 pb-6 space-y-5">
              <div className="mx-auto">
                <div className="h-28 w-28 flex items-center justify-center pointer-events-none">
                  <span className="text-8xl font-headline font-black text-primary select-none">
                    {userInitial}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <CardTitle className="font-headline text-3xl font-bold tracking-tight text-foreground">
                  {user.fullName || user.email.split('@')[0]}
                </CardTitle>
                <div className="flex flex-col items-center gap-2">
                  <Badge variant="outline" className="text-primary border-primary bg-primary/5 px-4 py-1 uppercase tracking-[0.2em] text-[10px] font-black flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified User
                  </Badge>
                  <span className="font-mono text-[10px] text-muted-foreground tracking-widest">{user.email.toLowerCase()}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-6 md:px-12 pb-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Identity Details</h3>
                  {!isEditing && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsEditing(true)}
                      className="text-[10px] font-bold uppercase tracking-widest h-8 px-4"
                    >
                      <Edit3 className="h-3 w-3 mr-2" /> Modify
                    </Button>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div
                      key="edit-form"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-8 pt-4">
                        {/* Phone Field */}
                        <div className="space-y-3">
                          <Label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2 min-w-0">
                            <Phone className="h-3 w-3" /> Phone Number
                          </Label>
                          <Input 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            placeholder="+1 (555) 000-0000"
                            className="h-11 rounded-none border-0 border-b border-border bg-transparent px-0 font-bold text-sm outline-none transition-colors duration-150 focus:border-primary focus-visible:border-primary focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
                          />
                        </div>

                        {/* Address Field */}
                        <div className="space-y-3">
                          <Label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2 min-w-0">
                            <MapPin className="h-3 w-3" /> Saved Address
                          </Label>
                          <Input 
                            value={address} 
                            onChange={(e) => setAddress(e.target.value)} 
                            placeholder="123 Elite Avenue, Dubai"
                            className="h-11 rounded-none border-0 border-b border-border bg-transparent px-0 font-bold text-sm outline-none transition-colors duration-150 focus:border-primary focus-visible:border-primary focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
                          />
                        </div>
                      </div>

                      <div className="flex justify-center gap-3 pt-6 pb-4">
                        <Button
                          onClick={handleSave}
                          disabled={saving}
                          size="icon"
                          aria-label="Save changes"
                          className="h-12 w-12 rounded-full"
                        >
                          {saving ? <Loader2 className="animate-spin h-4 w-4" /> : <Check className="h-5 w-5" />}
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => setIsEditing(false)}
                          size="icon"
                          aria-label="Cancel editing"
                          className="h-12 w-12 rounded-full border border-border hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="view-mode"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="grid gap-8 pt-4"
                    >
                      {/* Phone Field */}
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2 min-w-0">
                          <Phone className="h-3 w-3" /> Phone Number
                        </Label>
                        <p className="min-h-11 border-b border-border pb-3 text-sm sm:text-base font-medium text-foreground/90 break-words">
                          {phone || "No phone registered"}
                        </p>
                      </div>

                      {/* Address Field */}
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2 min-w-0">
                          <MapPin className="h-3 w-3" /> Saved Address
                        </Label>
                        <p className="min-h-11 border-b border-border pb-3 text-sm sm:text-base font-medium text-foreground/90 leading-relaxed break-words">
                          {address || "No address registered"}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Manifest Card */}
          <Card className="mt-3 bg-card/40 backdrop-blur-3xl border border-border/50 rounded-[2.5rem] overflow-hidden">
            <CardContent className="px-6 md:px-12 py-10">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 text-primary">
                  <Shield className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Privacy Manifest</span>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4 p-4 rounded-2xl bg-muted/20 border border-border/50">
                    <Lock className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      <strong className="text-foreground uppercase tracking-widest block mb-1">Encrypted Persistence</strong>
                      Your account credentials are protected via AES-256 cloud encryption layers within our production servers.
                    </p>
                  </li>
                  <li className="flex items-start gap-4 p-4 rounded-2xl bg-muted/20 border border-border/50">
                    <EyeOff className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      <strong className="text-foreground uppercase tracking-widest block mb-1">Privacy Protection</strong>
                      Residence data is accessible only to authorized fleet production managers during the ordering process.
                    </p>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
