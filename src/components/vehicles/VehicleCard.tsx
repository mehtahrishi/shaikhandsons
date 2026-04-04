"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { IndianRupee, Zap, Gauge, Battery, ChevronRight, Activity } from 'lucide-react';
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
  const [liveData, setLiveData] = React.useState<Vehicle>(vehicle);

  // Fetch real-time vehicle data
  React.useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const response = await fetch(`/api/vehicles?id=${vehicle.id}`);
        if (response.ok) {
          const data = await response.json();
          const vehicleData = data.vehicles?.[0] || vehicle;
          setLiveData(vehicleData);
        }
      } catch (error) {
        console.error('Failed to fetch vehicle data:', error);
        setLiveData(vehicle);
      }
    };

    fetchVehicleData();
    const interval = setInterval(fetchVehicleData, 30000);
    return () => clearInterval(interval);
  }, [vehicle.id, vehicle]);

  const images = liveData.imageUrls || liveData.images || [];
  const primaryImage = images.length > 0 ? images[0] : 'https://picsum.photos/seed/placeholder/1200/800';
  const inrPrice = new Intl.NumberFormat('en-IN', { 
    maximumFractionDigits: 0,
    style: 'decimal'
  }).format(Math.max(0, typeof liveData.price === 'string' ? parseFloat(liveData.price) : liveData.price));

  const formatCompact = (value: number | undefined) => {
    if (value === null || value === undefined || !Number.isFinite(value)) return null;
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  const rangeLabel = liveData.certifiedRange || (liveData.batteryRangeKm ? `${formatCompact(liveData.batteryRangeKm)} km` : null);
  const powerLabel = liveData.motorPower || (liveData.horsepower ? `${formatCompact(liveData.horsepower)} HP` : null);
  const speedLabel = liveData.topSpeed || (liveData.zeroToSixtySeconds ? `${formatCompact(typeof liveData.zeroToSixtySeconds === 'string' ? parseFloat(liveData.zeroToSixtySeconds) : liveData.zeroToSixtySeconds)}s` : null);

  return (
    <Link href={`/vehicles/${liveData.id}`} className="block w-full h-full">
      <motion.div 
        className="group relative w-full h-[420px] sm:h-[520px] bg-card rounded-[1.5rem] sm:rounded-[2.5rem] border border-border/40 overflow-hidden shadow-2xl transition-all duration-500 hover:border-primary/30"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
      >
        {/* Stage Lighting / Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-rgb),0.05),transparent_60%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-card via-card/80 to-transparent pointer-events-none z-10" />

        {/* HUD Elements */}
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-20 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">Active Showroom</span>
          </div>
          <div className="h-[1px] w-8 bg-primary/20" />
        </div>

        {/* Main Stage Image */}
        <div className="relative h-[60%] sm:h-[65%] w-full overflow-hidden">
          <motion.div 
            className="relative w-full h-full"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Image
              src={primaryImage}
              alt={`${liveData.make} ${liveData.model}`}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority
            />
          </motion.div>
          {/* Reflective Surface overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent z-10" />
        </div>

        {/* Info HUD Panel */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 z-20 flex flex-col gap-4 sm:gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-primary">{liveData.make}</span>
              <Activity className="h-3 w-3 text-primary/60" />
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-foreground uppercase tracking-tighter leading-none">
              {liveData.model}
            </h3>
          </div>

          {/* Precision Stats Strip */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 py-3 border-y border-border/40">
            {[
              { icon: Battery, label: 'Range', value: rangeLabel || '450 km' },
              { icon: Zap, label: 'Power', value: powerLabel || '150 kW' },
              { icon: Gauge, label: 'Top', value: speedLabel || '180 km/h' }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <stat.icon className="h-3 w-3 text-primary" />
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-tighter text-muted-foreground">{stat.label}</span>
                </div>
                <span className="text-[11px] sm:text-[14px] font-black text-foreground tabular-nums">{stat.value}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-col">
              <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-0.5">Asset Valuation</span>
              <div className="flex items-baseline gap-1">
                <IndianRupee className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                <span className="text-xl sm:text-3xl font-black text-foreground tracking-tighter tabular-nums">{inrPrice}</span>
              </div>
            </div>
            
            <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-full bg-secondary border border-border flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]">
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-foreground group-hover:text-primary-foreground transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>

        {/* Scanline Effect Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%]" />
      </motion.div>
    </Link>
  );
}
