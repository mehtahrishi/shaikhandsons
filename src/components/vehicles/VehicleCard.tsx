
"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Vehicle } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Gauge, MapPin } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <div className="group h-[500px] w-full perspective-1000 relative">
      <div className="relative w-full h-full card-inner preserve-3d">
        {/* Front Face */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-card border rounded-lg overflow-hidden flex flex-col">
          <div className="relative h-2/3 w-full overflow-hidden">
            <Image 
              src={vehicle.image} 
              alt={vehicle.model} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              data-ai-hint="luxury electric car"
            />
            <div className="absolute top-4 left-4">
              <Badge className="bg-primary/90 text-primary-foreground border-none">Available</Badge>
            </div>
          </div>
          <div className="p-6 flex flex-col justify-between flex-1">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">{vehicle.make}</p>
              <h3 className="font-headline text-3xl font-bold tracking-tight">{vehicle.model}</h3>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-primary">${vehicle.price.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                Explore <Zap className="h-3 w-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-primary/5 border border-primary/20 backdrop-blur-xl rounded-lg p-8 flex flex-col">
          <div className="mb-6">
            <h3 className="font-headline text-2xl font-black mb-2">{vehicle.model} Specifications</h3>
            <p className="text-sm text-muted-foreground italic">&quot;{vehicle.designPhilosophy}&quot;</p>
          </div>
          
          <div className="space-y-6 flex-1">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Gauge className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">0-60 MPH</p>
                <p className="font-bold text-xl">{vehicle.zeroToSixtySeconds}s</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Peak Power</p>
                <p className="font-bold text-xl">{vehicle.horsepower} HP</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Range</p>
                <p className="font-bold text-xl">{vehicle.batteryRangeKm} KM</p>
              </div>
            </div>
          </div>

          <Link href={`/vehicles/${vehicle.id}`} className="mt-auto">
            <Button className="w-full bg-primary hover:bg-primary/90">Configure & Order</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
