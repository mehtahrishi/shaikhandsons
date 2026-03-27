
"use client"

import React, { use } from 'react';
import Image from 'next/image';
import { vehicles } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Check, Share2, Info } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const vehicle = vehicles.find(v => v.id === id);
  const { toast } = useToast();

  if (!vehicle) return <div className="p-32 text-center">Vehicle not found.</div>;

  const handleInquiry = () => {
    toast({
      title: "Inquiry Sent",
      description: `A Veridian specialist will contact you regarding the ${vehicle.model}.`
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[60vh] w-full">
        <Image 
          src={vehicle.image} 
          alt={vehicle.model} 
          fill 
          className="object-cover" 
          priority
          data-ai-hint="luxury electric car profile"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        <div className="absolute top-32 left-8">
          <Link href="/#showroom">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Showroom
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-32 relative z-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card/50 backdrop-blur-md border p-8 rounded-lg"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <Badge variant="outline" className="text-primary border-primary mb-2">{vehicle.year} Model</Badge>
                  <h1 className="font-headline text-6xl font-black">{vehicle.model}</h1>
                  <p className="text-xl text-muted-foreground">{vehicle.trim} Edition</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Starting at</p>
                  <p className="text-4xl font-headline font-bold text-primary">₹{vehicle.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
              <p className="text-lg leading-relaxed text-muted-foreground border-l-2 border-primary pl-6">
                {vehicle.designPhilosophy} Engineered for those who refuse to compromise on either sustainability or absolute luxury.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="text-lg uppercase tracking-widest flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" /> Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Acceleration (0-60)</span>
                      <span className="font-bold">{vehicle.zeroToSixtySeconds}s</span>
                    </div>
                    <Progress value={95} className="h-1" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Battery Range</span>
                      <span className="font-bold">{vehicle.batteryRangeKm} km</span>
                    </div>
                    <Progress value={85} className="h-1" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Horsepower</span>
                      <span className="font-bold">{vehicle.horsepower} HP</span>
                    </div>
                    <Progress value={90} className="h-1" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="text-lg uppercase tracking-widest">Premium Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {vehicle.features.map(feature => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Configuration Panel */}
          <div className="space-y-8">
            <Card className="sticky top-32">
              <CardHeader>
                <CardTitle className="font-headline">Reservation</CardTitle>
                <CardDescription>Secure your place in the future of mobility.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Preferred Color</Label>
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary border-2 border-primary cursor-pointer ring-offset-2 ring-primary"></div>
                    <div className="h-8 w-8 rounded-full bg-slate-900 border cursor-pointer hover:scale-110 transition-transform"></div>
                    <div className="h-8 w-8 rounded-full bg-slate-100 border cursor-pointer hover:scale-110 transition-transform"></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Delivery Region</Label>
                  <Select defaultValue="na">
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="na">North America</SelectItem>
                      <SelectItem value="eu">Europe</SelectItem>
                      <SelectItem value="as">Asia-Pacific</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Reservation Fee</span>
                    <span>₹1,000</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Estimated Delivery</span>
                    <span>Q4 2025</span>
                  </div>
                </div>

                <Button onClick={handleInquiry} className="w-full h-12 text-md font-bold uppercase tracking-widest">
                  Secure Reservation
                </Button>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
                  <Button variant="outline" className="flex-1">Financing</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
