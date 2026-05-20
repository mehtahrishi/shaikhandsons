"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getImageUrl } from '@/lib/utils';
import { IndianRupee, Zap, Gauge, Battery, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Vehicle {
  id: number | string;
  make: string;
  model: string;
  year?: number;
  trim?: string;
  price: number | string;
  slug?: string;
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
    <Link href={`/vehicles/${liveData.slug || liveData.id}`} className="block w-full h-full">
      <motion.div 
        className="group relative w-full h-[420px] sm:h-[520px] bg-card rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card pointer-events-none z-10" />

        {/* Vehicle Image */}
        <div className="relative h-[55%] sm:h-[60%] w-full overflow-hidden bg-muted">
          <motion.div 
            className="relative w-full h-full"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Image
              src={getImageUrl(primaryImage)}
              alt={`${liveData.make} ${liveData.model}`}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority
              unoptimized={primaryImage.startsWith('/uploads/')}
            />
          </motion.div>
        </div>

        {/* Info Section */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-20 flex flex-col gap-3 sm:gap-4">
          {/* Brand and Model */}
          <div>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{liveData.make}</p>
            <h3 className="text-2xl sm:text-4xl font-black text-foreground leading-tight">
              {liveData.model}
            </h3>
          </div>

          {/* Quick Features */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { icon: Battery, label: 'Distance', value: rangeLabel || '450 km' },
              { icon: Zap, label: 'Power', value: powerLabel || '150 kW' },
              { icon: Gauge, label: 'Speed', value: speedLabel || '180 km/h' }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1">
                  <stat.icon className="h-3.5 w-3.5 text-primary" />
                  <span className="text-[7px] sm:text-[8px] font-semibold text-muted-foreground">{stat.label}</span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-foreground">{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Price and CTA */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[7px] sm:text-[8px] font-semibold text-muted-foreground mb-0.5">Starting From</p>
              <div className="flex items-baseline gap-0.5">
                <IndianRupee className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                <span className="text-lg sm:text-2xl font-bold text-foreground">{inrPrice}</span>
              </div>
            </div>
            
            <button className="h-9 w-9 sm:h-12 sm:w-12 rounded-full bg-primary flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
