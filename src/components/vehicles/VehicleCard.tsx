
"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, IndianRupee, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface Vehicle {
  id: number | string;
  make: string;
  model: string;
  year?: number;
  trim?: string;
  price: number | string;
  certifiedRange?: string;
  motorPower?: string;
  topSpeed?: string;
  batteryRangeKm?: number;
  horsepower?: number;
  zeroToSixtySeconds?: number;
  imageUrls?: string[];
  images?: string[];
  designPhilosophy?: string;
  createdAt?: string;
}

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [liveData, setLiveData] = React.useState<Vehicle>(vehicle);
  const [isLoading, setIsLoading] = React.useState(false);

  // Fetch real-time vehicle data
  React.useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/vehicles?id=${vehicle.id}`);
        if (response.ok) {
          const data = await response.json();
          const vehicleData = data.vehicles?.[0] || vehicle;
          setLiveData(vehicleData);
        }
      } catch (error) {
        console.error('Failed to fetch vehicle data:', error);
        setLiveData(vehicle);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicleData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchVehicleData, 30000);
    return () => clearInterval(interval);
  }, [vehicle.id, vehicle]);

  const images = liveData.imageUrls || liveData.images || [];
  const primaryImage = images.length > 0 ? images[0] : 'https://picsum.photos/seed/placeholder/1200/800';
  const inrPrice = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.max(0, typeof liveData.price === 'string' ? parseFloat(liveData.price) : liveData.price));

  const formatCompact = (value: number | undefined) => {
    if (value === null || value === undefined || !Number.isFinite(value)) return null;
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  const rangeLabel = liveData.certifiedRange || liveData.batteryRangeKm ? formatCompact(liveData.batteryRangeKm) : null;
  const powerLabel = liveData.motorPower || (liveData.horsepower ? formatCompact(liveData.horsepower) : null);
  const speedLabel = liveData.topSpeed || (liveData.zeroToSixtySeconds ? formatCompact(typeof liveData.zeroToSixtySeconds === 'string' ? parseFloat(liveData.zeroToSixtySeconds) : liveData.zeroToSixtySeconds) : null);

  return (
    <motion.div
      className="group relative w-full"
      layout
    >
      <div className="md:hidden relative h-[384px] rounded-2xl" style={{ perspective: '1400px' }}>
        <button
          type="button"
          aria-label="Flip vehicle card"
          onClick={() => setIsFlipped((prev) => !prev)}
          className="absolute right-3 top-3 z-20 h-9 w-9 rounded-full border border-border/60 bg-background/80 backdrop-blur flex items-center justify-center shadow-sm"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>

        <div
          className="relative h-full w-full transition-transform duration-500"
          style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          <div
            className="absolute inset-0 bg-card border border-border/50 overflow-hidden flex flex-col"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="relative h-64 w-full overflow-hidden flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
              <Image
                src={primaryImage}
                alt={liveData.model}
                fill
                sizes="100vw"
                className="object-contain grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                data-ai-hint="luxury electric car"
              />
            </div>

            <div className="flex-1 flex flex-col justify-end bg-gradient-to-b from-card to-card/80">
              <div className="px-4 pt-4 pb-3">
                <div className="mb-3">
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] uppercase tracking-[0.24em] font-semibold text-muted-foreground">{liveData.make}</p>
                    <p className="text-[10px] uppercase tracking-[0.24em] font-semibold text-muted-foreground truncate">{liveData.model}</p>
                  </div>
                </div>
                <div className="mb-1 flex items-center gap-1">
                  <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="font-headline text-[34px] font-black text-primary leading-none tabular-nums truncate">{inrPrice}</p>
                </div>
              </div>
              <Link href={`/vehicles/${liveData.id}`} className="block w-full">
                <Button className="w-full h-12 rounded-none font-bold uppercase tracking-[0.14em] text-[10px] group/button shadow-none">
                  <span>Discover</span>
                </Button>
              </Link>
            </div>
          </div>

          <div
            className="absolute inset-0 bg-card border border-border/50 overflow-hidden flex flex-col"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="h-64 w-full px-4 py-5 bg-muted/20">
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.24em] mb-4">Performance</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Brand</p>
                  <p className="text-base font-black text-foreground tabular-nums truncate">{liveData.make}</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Model</p>
                  <p className="text-base font-black text-foreground tabular-nums truncate">{liveData.model}</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Range</p>
                  <p className="text-base font-black text-foreground tabular-nums truncate">{liveData.certifiedRange || rangeLabel || 'N/A'}</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Power</p>
                  <p className="text-base font-black text-foreground tabular-nums truncate">{liveData.motorPower || powerLabel || 'N/A'}</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Speed</p>
                  <p className="text-base font-black text-foreground tabular-nums truncate">{liveData.topSpeed || speedLabel || 'N/A'}</p>
                </div>
              </div>

            </div>

            <div className="bg-gradient-to-b from-card to-card/80">
              <div className="px-4 py-3 flex items-center gap-1">
                <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="font-headline text-[34px] font-black text-primary leading-none tabular-nums truncate">{inrPrice}</p>
              </div>
              <Link href={`/vehicles/${liveData.id}`} className="block w-full">
                <Button className="w-full h-12 rounded-none font-bold uppercase tracking-[0.14em] text-[10px] group/button shadow-none">
                  <span>Discover</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block relative h-[384px] rounded-2xl" style={{ perspective: '1400px' }}>
        <button
          type="button"
          aria-label="Flip vehicle card"
          onClick={() => setIsFlipped((prev) => !prev)}
          className="absolute right-3 top-3 z-20 h-9 w-9 rounded-full border border-border/60 bg-background/80 backdrop-blur flex items-center justify-center shadow-sm"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>

        <div
          className="relative h-full w-full transition-transform duration-500"
          style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          <div
            className="absolute inset-0 bg-card border border-border/50 overflow-hidden flex flex-col"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="relative h-64 w-full overflow-hidden flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
              <Image
                src={primaryImage}
                alt={liveData.model}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-contain grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                data-ai-hint="luxury electric car"
              />
            </div>

            <div className="flex-1 flex flex-col justify-end bg-gradient-to-b from-card to-card/80">
              <div className="px-4 pt-4 pb-3">
                <div className="mb-3">
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] uppercase tracking-[0.24em] font-semibold text-muted-foreground">{liveData.make}</p>
                    <p className="text-[10px] uppercase tracking-[0.24em] font-semibold text-muted-foreground truncate">{liveData.model}</p>
                  </div>
                </div>
                <div className="mb-1 flex items-center gap-1">
                  <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="font-headline text-[34px] font-black text-primary leading-none tabular-nums truncate">{inrPrice}</p>
                </div>
              </div>
              <Link href={`/vehicles/${liveData.id}`} className="block w-full">
                <Button className="w-full h-12 rounded-none font-bold uppercase tracking-[0.14em] text-[10px] group/button shadow-none">
                  <span>Discover</span>
                </Button>
              </Link>
            </div>
          </div>

          <div
            className="absolute inset-0 bg-card border border-border/50 overflow-hidden flex flex-col"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="h-64 w-full px-4 py-5 bg-muted/20">
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.24em] mb-4">Performance</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Brand</p>
                  <p className="text-base font-black text-foreground tabular-nums truncate">{liveData.make}</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Model</p>
                  <p className="text-base font-black text-foreground tabular-nums truncate">{liveData.model}</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Range</p>
                  <p className="text-base font-black text-foreground tabular-nums truncate">{liveData.certifiedRange || rangeLabel || 'N/A'}</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Power</p>
                  <p className="text-base font-black text-foreground tabular-nums truncate">{liveData.motorPower || powerLabel || 'N/A'}</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Speed</p>
                  <p className="text-base font-black text-foreground tabular-nums truncate">{liveData.topSpeed || speedLabel || 'N/A'}</p>
                </div>
              </div>

            </div>

            <div className="bg-gradient-to-b from-card to-card/80">
              <div className="px-4 py-3 flex items-center gap-1">
                <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="font-headline text-[34px] font-black text-primary leading-none tabular-nums truncate">{inrPrice}</p>
              </div>
              <Link href={`/vehicles/${liveData.id}`} className="block w-full">
                <Button className="w-full h-12 rounded-none font-bold uppercase tracking-[0.14em] text-[10px] group/button shadow-none">
                  <span>Discover</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

