
"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  Loader2, 
  User as UserIcon,
  Phone,
  MapPin,
  Edit3,
  Check,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading, logout } = useAuth();

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
      // Logic for toast if fields are missing
      const hasPhone = !!phone;
      const hasAddress = !!address;
      
      if (!hasPhone || !hasAddress) {
        toast({
          title: "Profile Incomplete",
          description: "Please fill in your phone and address to make the commission process easier.",
          variant: "default",
        });
      }
    }
  }, [user, loading, router, toast]);

  const handleSignOut = async () => {
    await logout();
    toast({
      title: "Secure Logout",
      description: "Identity session terminated successfully.",
    });
    router.push('/');
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call for persistence
    setTimeout(() => {
      setSaving(false);
      setIsEditing(false);
      toast({
        title: "Identity Updated",
        description: "Your credentials have been securely saved.",
      });
    }, 1000);
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
                <Avatar className="h-24 w-24 border-2 border-primary/20 bg-black/40">
                  <AvatarFallback className="text-4xl font-black bg-primary/10 text-white">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-2">
                <CardTitle className="font-headline text-4xl font-black uppercase tracking-tighter text-white">
                  {user.name || "Elite Collector"}
                </CardTitle>
                <CardDescription className="flex flex-col items-center gap-3">
                  <Badge variant="outline" className="text-primary border-primary bg-primary/5 px-4 py-1 uppercase tracking-[0.2em] text-[10px] font-black">
                    Elite Member
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
                        className="bg-white/5 border-white/10 h-12 font-bold"
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
                        className="bg-white/5 border-white/10 h-12 font-bold"
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
                  <Button 
                    variant="ghost" 
                    onClick={handleSignOut}
                    className="w-full h-14 bg-red-500/5 hover:bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-widest px-6 rounded-2xl border border-red-500/10"
                  >
                    <span className="flex items-center gap-4"><LogOut className="h-4 w-4" /> Terminate Session</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
