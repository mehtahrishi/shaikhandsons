
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
  const images = vehicle.imageUrls || vehicle.images || [];
  const primaryImage = images.length > 0 ? images[0] : 'https://picsum.photos/seed/placeholder/1200/800';
  const inrPrice = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.max(0, typeof vehicle.price === 'string' ? parseFloat(vehicle.price) : vehicle.price));

  const formatCompact = (value: number | undefined) => {
    if (!value || !Number.isFinite(value)) return '0';
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  const rangeLabel = `${formatCompact(vehicle.batteryRangeKm)} km`;
  const powerLabel = `${formatCompact(vehicle.horsepower)} HP`;
  const accelLabel = `${formatCompact(vehicle.zeroToSixtySeconds)} s`;

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
                alt={vehicle.model}
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
                    <p className="text-[10px] uppercase tracking-[0.24em] font-semibold text-muted-foreground">{vehicle.make}</p>
                    <p className="text-[10px] uppercase tracking-[0.24em] font-semibold text-muted-foreground truncate">{vehicle.model}</p>
                  </div>
                </div>
                <div className="mb-1 flex items-center gap-1">
                  <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="font-headline text-[34px] font-black text-primary leading-none tabular-nums truncate">{inrPrice}</p>
                </div>
              </div>
              <Link href={`/vehicles/${vehicle.id}`} className="block w-full">
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
                  <p className="text-base font-black text-foreground tabular-nums truncate">{vehicle.make}</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Model</p>
                  <p className="text-base font-black text-foreground tabular-nums truncate">{vehicle.model}</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Range</p>
                  <p className="text-base font-black text-foreground tabular-nums truncate">{rangeLabel}</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Power</p>
                  <p className="text-base font-black text-foreground tabular-nums truncate">{powerLabel}</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">0-60</p>
                  <p className="text-base font-black text-foreground tabular-nums truncate">{accelLabel}</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Trim</p>
                  <p className="text-base font-black text-foreground truncate">{vehicle.trim}</p>
                </div>
              </div>

            </div>

            <div className="bg-gradient-to-b from-card to-card/80">
              <div className="px-4 py-3">
                <p className="mb-1 text-muted-foreground"><IndianRupee className="h-3.5 w-3.5" /></p>
                <p className="font-headline text-[34px] font-black text-primary leading-none tabular-nums truncate">{inrPrice}</p>
              </div>
              <Link href={`/vehicles/${vehicle.id}`} className="block w-full">
                <Button className="w-full h-12 rounded-none font-bold uppercase tracking-[0.14em] text-[10px] group/button shadow-none">
                  <span>Discover</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block bg-card border border-border/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_36px_-24px_hsl(var(--primary))]">
        <div className="relative h-60 w-full overflow-hidden flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
          <Image
            src={primaryImage}
            alt={vehicle.model}
            fill
            sizes="(max-width: 1024px) 50vw, 25vw"
            className="object-contain grayscale transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:grayscale-0"
            data-ai-hint="luxury electric car"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white/80 text-xs uppercase tracking-[0.24em] font-semibold truncate">{vehicle.make}</p>
            <h3 className="font-headline text-3xl font-black text-white tracking-tight truncate">{vehicle.model}</h3>
          </div>
        </div>

        <div className="px-5 py-5 space-y-4">
          <div className="flex items-end justify-between gap-3 border-b border-border/40 pb-3">
            <p className="font-headline text-4xl font-black text-primary leading-none tabular-nums">₹{inrPrice}</p>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider text-right">Starting Price</p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center border-b border-border/40 pb-4">
            <div className="space-y-1 min-w-0">
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">Range</p>
              <p className="text-lg font-black text-foreground tabular-nums truncate">{rangeLabel}</p>
            </div>
            <div className="space-y-1 min-w-0">
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">Power</p>
              <p className="text-lg font-black text-foreground tabular-nums truncate">{powerLabel}</p>
            </div>
            <div className="space-y-1 min-w-0">
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">0-60</p>
              <p className="text-lg font-black text-foreground tabular-nums truncate">{accelLabel}</p>
            </div>
          </div>

          <Link href={`/vehicles/${vehicle.id}`} className="block w-full">
            <Button className="w-full h-12 rounded-xl font-bold uppercase tracking-[0.14em] text-xs group/button">
              <span>Discover Model</span>
              <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover/button:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

