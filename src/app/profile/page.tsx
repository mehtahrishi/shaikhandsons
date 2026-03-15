
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
  EyeOff,
  Server
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { updateUserProfile } from '@/lib/appwrite/auth';

const CrownIcon = () => (
  <svg viewBox="0 0 512 512" fill="currentColor" className="w-full h-full">
    <g>
      <path d="M124.536,178.991c12.892,0,23.33-10.438,23.33-23.322s-10.438-23.322-23.33-23.322 c-12.876,0-23.314,10.438-23.314,23.322S111.66,178.991,124.536,178.991z"/>
      <path d="M46.66,211.508c0-12.883-10.454-23.321-23.33-23.321C10.454,188.187,0,198.625,0,211.508 c0,12.884,10.454,23.322,23.33,23.322C36.206,234.83,46.66,224.392,46.66,211.508z"/>
      <path d="M387.464,178.991c12.892,0,23.33-10.438,23.33-23.322s-10.438-23.322-23.33-23.322 c-12.876,0-23.314,10.438-23.314,23.322S374.588,178.991,387.464,178.991z"/>
      <path d="M488.686,188.187c-12.892,0-23.33,10.438-23.33,23.321c0,12.884,10.454,23.322,23.33,23.322 c12.876,0,23.314-10.438,23.314-23.322C512,198.625,501.562,188.187,488.686,188.187z"/>
      <rect x="80.101" y="399.236" width="351.815" height="36.296"/>
      <path d="M400.193,272.999c-33.932-23.322-14.839-82.694-14.839-82.694l-19.388-5.661 c-40.721,77.385-100.608,73.761-95.937-12.728v-27.715h33.686v-28.05h-33.686V76.468h-28.058v39.682h-33.702v28.05h33.702v27.715 c4.679,86.49-55.2,90.113-95.938,12.728l-19.371,5.661c0,0,19.076,59.372-14.839,82.694 c-33.932,23.321-63.626-33.923-63.626-33.923l-19.076,8.474L82.13,374.777H429.87l53.008-127.226l-19.076-8.474 C463.802,239.076,434.125,296.32,400.193,272.999z M170.852,321.058c-9.26,0-16.77-7.501-16.77-16.762 c0-9.252,7.51-16.753,16.77-16.753c9.244,0,16.753,7.501,16.753,16.753C187.606,313.557,180.096,321.058,170.852,321.058z M256.008,312.681c-9.26,0-16.762-7.501-16.762-16.762c0-9.252,7.501-16.753,16.762-16.753c9.252,0,16.753,7.501,16.753,16.753 C272.762,305.18,256.008,312.681,256.008,312.681z M341.164,321.058c-9.26,0-16.753-7.501-16.753-16.762 c0-9.252,7.493-16.753,16.753-16.753c9.26,0,16.753,7.501,16.753,16.753C357.918,313.557,350.425,321.058,341.164,321.058z"/>
    </g>
  </svg>
);

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
          description: "Please complete your phone and address to ensure a seamless commission process.",
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
          <p className="font-headline text-xs uppercase tracking-[0.4em] text-muted-foreground">Verifying Status...</p>
        </div>
      </div>
    );
  }

  const userInitial = user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#020202] pt-32 pb-24 relative overflow-hidden flex items-center">
      <div className="container mx-auto px-6 relative z-10 flex justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-xl"
        >
          <Card className="bg-white/5 backdrop-blur-2xl border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
            <CardHeader className="text-center pt-12 pb-8 space-y-6">
              <div className="mx-auto">
                <Avatar className="h-24 w-24 border-2 border-primary/20 bg-black/40 pointer-events-none ring-0">
                  <AvatarFallback className="text-4xl font-black bg-black text-white border-none shadow-none">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-2">
                <CardTitle className="font-headline text-4xl font-bold tracking-tight text-white capitalize">
                  {user.name || "Collector"}
                </CardTitle>
                <CardDescription className="flex flex-col items-center gap-3">
                  <Badge variant="outline" className="text-primary border-primary bg-primary/5 px-4 py-1 uppercase tracking-[0.2em] text-[10px] font-black flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified User
                  </Badge>
                  <span className="font-mono text-xs text-muted-foreground tracking-widest">{user.email.toLowerCase()}</span>
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="px-10 pb-12 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Core Credentials</h3>
                  {!isEditing && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsEditing(true)}
                      className="text-[10px] font-bold uppercase tracking-widest h-8 px-4 hover:bg-white/5"
                    >
                      <Edit3 className="h-3 w-3 mr-2" /> Modify Identity
                    </Button>
                  )}
                </div>

                <div className="grid gap-6">
                  {/* Phone Field */}
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Phone className="h-3 w-3" /> Phone Number
                    </Label>
                    {isEditing ? (
                      <Input 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        placeholder="+1 (555) 000-0000"
                        className="bg-white/5 border-white/10 h-12 font-bold focus:border-primary transition-colors"
                      />
                    ) : (
                      <p className="text-sm font-bold text-white pl-1">{phone || "Not specified"}</p>
                    )}
                  </div>

                  {/* Address Field */}
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-3 w-3" /> Delivery Residence
                    </Label>
                    {isEditing ? (
                      <Input 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        placeholder="123 Elite Drive, Monaco"
                        className="bg-white/5 border-white/10 h-12 font-bold focus:border-primary transition-colors"
                      />
                    ) : (
                      <p className="text-sm font-bold text-white pl-1">{address || "Not specified"}</p>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {isEditing && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex gap-3 pt-4"
                    >
                      <Button onClick={handleSave} disabled={saving} className="flex-1 font-bold uppercase tracking-widest h-12">
                        {saving ? <Loader2 className="animate-spin h-4 w-4" /> : <><Check className="h-4 w-4 mr-2" /> Save Changes</>}
                      </Button>
                      <Button variant="ghost" onClick={() => setIsEditing(false)} className="px-6 hover:bg-red-500/10 hover:text-red-500 border border-white/5 h-12">
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {!isEditing && (
                <div className="pt-8 border-t border-white/5">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 text-primary">
                      <Shield className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Privacy Manifest</span>
                    </div>
                    <ul className="grid grid-cols-1 gap-3 w-full max-w-[320px]">
                      <li className="flex items-start gap-3 bg-white/[0.02] p-3 rounded-lg border border-white/5">
                        <Lock className="h-3 w-3 text-muted-foreground mt-0.5" />
                        <p className="text-[9px] text-muted-foreground font-medium leading-relaxed">
                          <strong className="text-white block mb-0.5 uppercase tracking-wider">Encrypted Handshake</strong>
                          All identity details are managed via SHA-256 encrypted protocols.
                        </p>
                      </li>
                      <li className="flex items-start gap-3 bg-white/[0.02] p-3 rounded-lg border border-white/5">
                        <EyeOff className="h-3 w-3 text-muted-foreground mt-0.5" />
                        <p className="text-[9px] text-muted-foreground font-medium leading-relaxed">
                          <strong className="text-white block mb-0.5 uppercase tracking-wider">Bespoke Privacy</strong>
                          Your residence and contact data remain strictly between you and the fleet manager.
                        </p>
                      </li>
                      <li className="flex items-start gap-3 bg-white/[0.02] p-3 rounded-lg border border-white/5">
                        <Server className="h-3 w-3 text-muted-foreground mt-0.5" />
                        <p className="text-[9px] text-muted-foreground font-medium leading-relaxed">
                          <strong className="text-white block mb-0.5 uppercase tracking-wider">Secure Commissions</strong>
                          Data persistence is localized to facilitate future vehicle production cycles.
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
