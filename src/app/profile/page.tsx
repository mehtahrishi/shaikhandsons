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
import { updateUserProfile } from '@/lib/appwrite/auth';

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
      // Sync local state with Appwrite Prefs
      const savedPhone = user.prefs?.phone || "";
      const savedAddress = user.prefs?.address || "";
      
      setPhone(savedPhone);
      setAddress(savedAddress);

      // Notify if profile is incomplete
      if (!savedPhone || !savedAddress) {
        toast({
          title: "Profile Incomplete",
          description: "Please complete your bespoke details to ensure a seamless commission process.",
          variant: "default",
        });
      }
    }
  }, [user, loading, router, toast]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(phone, address);
      await refresh(); // Force refresh context to get latest prefs
      setIsEditing(false);
      toast({
        title: "Identity Updated",
        description: "Your bespoke details have been securely saved.",
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

  const userInitial = user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden flex items-center">
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
          <Card className="bg-card/40 backdrop-blur-3xl border border-border/50 rounded-[2.5rem] overflow-hidden shadow-xl">
            <CardHeader className="text-center pt-12 pb-8 space-y-6">
              <div className="mx-auto">
                <div className="h-28 w-28 flex items-center justify-center pointer-events-none">
                  <span className="text-8xl font-headline font-black text-primary select-none">
                    {userInitial}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <CardTitle className="font-headline text-3xl font-bold tracking-tight text-foreground">
                  {user.name || "Collector"}
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

            <CardContent className="px-6 md:px-12 pb-12 space-y-10">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Identity Details</h3>
                  {!isEditing && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsEditing(true)}
                      className="text-[10px] font-bold uppercase tracking-widest h-8 px-4 hover:bg-muted"
                    >
                      <Edit3 className="h-3 w-3 mr-2" /> Modify
                    </Button>
                  )}
                </div>

                <div className="grid gap-8">
                  {/* Phone Field */}
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Phone className="h-3 w-3" /> Phone Number
                    </Label>
                    {isEditing ? (
                      <Input 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        placeholder="+1 (555) 000-0000"
                        className="bg-muted/30 border-border h-14 font-bold focus:border-primary transition-all text-sm"
                      />
                    ) : (
                      <p className="text-base font-medium text-foreground/90">{phone || "No phone registered"}</p>
                    )}
                  </div>

                  {/* Address Field */}
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-3 w-3" /> Bespoke Address
                    </Label>
                    {isEditing ? (
                      <Input 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        placeholder="123 Elite Avenue, Dubai"
                        className="bg-muted/30 border-border h-14 font-bold focus:border-primary transition-all text-sm"
                      />
                    ) : (
                      <p className="text-base font-medium text-foreground/90 leading-relaxed">{address || "No address registered"}</p>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {isEditing && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex gap-4 pt-4"
                    >
                      <Button onClick={handleSave} disabled={saving} className="flex-1 font-bold uppercase tracking-widest h-14 text-xs">
                        {saving ? <Loader2 className="animate-spin h-4 w-4" /> : <><Check className="h-4 w-4 mr-2" /> Save Changes</>}
                      </Button>
                      <Button variant="ghost" onClick={() => setIsEditing(false)} className="px-6 hover:bg-destructive/10 hover:text-destructive border border-border h-14">
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {!isEditing && (
                <div className="pt-10 border-t border-border/50">
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
                          Your bespoke credentials are protected via AES-256 cloud encryption layers within our production servers.
                        </p>
                      </li>
                      <li className="flex items-start gap-4 p-4 rounded-2xl bg-muted/20 border border-border/50">
                        <EyeOff className="h-4 w-4 text-primary mt-1 shrink-0" />
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          <strong className="text-foreground uppercase tracking-widest block mb-1">Confidential Liaison</strong>
                          Residence data is accessible only to authorized fleet production managers during the commission process.
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}