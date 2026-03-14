
"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, LogOut, Clock, Calendar, Car, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const [isVerifying, setIsVerifying] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('shaikh_auth_token');
    if (!isAuthenticated) {
      toast({
        title: "Unauthorized Access",
        description: "Please sign in to access your garage.",
        variant: "destructive"
      });
      router.push('/login');
    } else {
      setIsVerifying(false);
    }
  }, [router, toast]);

  const handleSignOut = () => {
    localStorage.removeItem('shaikh_auth_token');
    toast({
      title: "Signed Out",
      description: "Secure session terminated.",
    });
    router.push('/');
  };

  if (isVerifying) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  const history = [
    { id: '1', item: 'Veridian Aether', type: 'Reservation', date: '2025-02-15', status: 'Pending' },
    { id: '2', item: 'Veridian Lumina', type: 'Test Drive', date: '2025-01-10', status: 'Completed' },
    { id: '3', item: 'Noir Spectre', type: 'Inquiry', date: '2024-12-05', status: 'Quote Sent' },
  ];

  return (
    <div className="container mx-auto px-6 py-32 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="h-24 bg-primary"></div>
            <CardContent className="pt-0 -mt-10 flex flex-col items-center">
              <Avatar className="h-20 w-20 border-4 border-background mb-4">
                <AvatarImage src="https://picsum.photos/seed/user/100/100" />
                <AvatarFallback>VN</AvatarFallback>
              </Avatar>
              <h2 className="font-headline text-2xl font-bold">Julian Vane</h2>
              <p className="text-sm text-muted-foreground mb-4">Collector Level: Gold</p>
              <Button variant="outline" size="sm" className="w-full">
                <Settings className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </CardContent>
          </Card>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:bg-destructive/10"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="font-headline text-4xl font-black mb-2">My Garage</h1>
              <p className="text-muted-foreground">Manage your reservations and inquiries.</p>
            </div>
            <div className="hidden md:flex gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">1</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Reservations</p>
              </div>
              <div className="w-[1px] h-8 bg-border my-auto"></div>
              <div className="text-center">
                <p className="text-2xl font-bold">2</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Inquiries</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {history.map((item) => (
              <Card key={item.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      {item.type === 'Reservation' ? <Car className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{item.item}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {item.date}</span>
                        <span className="h-1 w-1 rounded-full bg-border"></span>
                        <span>{item.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                    <Badge variant={item.status === 'Completed' ? 'secondary' : 'outline'} className={item.status === 'Pending' ? 'text-primary border-primary' : ''}>
                      {item.status}
                    </Badge>
                    <Button variant="ghost" size="sm">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-primary/5 border-dashed">
            <CardContent className="p-12 text-center">
              <Car className="h-12 w-12 text-primary mx-auto mb-4 opacity-50" />
              <h3 className="font-headline text-xl font-bold mb-2">Build Your Next Masterpiece</h3>
              <p className="text-muted-foreground mb-6">Explore our latest models and configure your perfect electronic luxury vehicle.</p>
              <Button className="bg-primary hover:bg-primary/90">Browse Showroom</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
