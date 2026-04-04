
"use client"

import React, { useState, useEffect } from 'react';
import { VehicleCard } from './VehicleCard';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

type Vehicle = {
  id: number;
  brandId: number;
  make: string;
  model: string;
  year: number;
  trim?: string;
  price: number | string;
  
  modelCode?: string;
  category?: string;
  shortDescription?: string;
  topSpeed?: string;
  certifiedRange?: string;
  realWorldRange?: string;
  ridingModes?: string[];
  climbingDegree?: string;
  loadCapacity?: string;
  
  batteryType?: string;
  batteryCapacity?: string;
  chargingTime?: string;
  fastCharging?: boolean;
  chargerIncluded?: string;
  batteryWarranty?: string;
  
  motorPower?: string;
  brakingSystem?: string;
  tyreType?: string;
  wheelType?: string;
  wheelSize?: string;
  groundClearance?: string;
  
  displayType?: string;
  colors?: string[];
  keyFeatures?: string[];
  bootSpace?: string;
  
  designPhilosophy?: string;
  imageUrls?: string[];
  
  batteryRangeKm?: number;
  horsepower?: number;
  zeroToSixtySeconds?: number;
  
  createdAt?: string;
  updatedAt?: string;
};

export function VehicleShowroom() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/vehicles');
        if (!response.ok) {
          throw new Error('Failed to fetch the vehicle collection.');
        }
        const data = await response.json();
        setVehicles(data.vehicles || []);
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  return (
    <section id="showroom" className="pt-5 pb-24 bg-background">
      <div className="container mx-auto px-6">
        {error && <div className="text-center text-red-500 py-8">{error}</div>}

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <motion.div
                key={`skeleton-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="h-[420px] sm:h-[520px] w-full rounded-[1.5rem] sm:rounded-[2.5rem] bg-zinc-950/50 border border-white/5 flex flex-col p-8 space-y-8">
                  <div className="flex-1 flex items-center justify-center">
                    <Skeleton className="h-40 w-full rounded-3xl opacity-20" />
                  </div>
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-3/4 opacity-20" />
                    <Skeleton className="h-12 w-full opacity-10" />
                    <div className="flex justify-between items-end">
                      <Skeleton className="h-10 w-24 opacity-20" />
                      <Skeleton className="h-12 w-12 rounded-full opacity-20" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            vehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <VehicleCard vehicle={vehicle} />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
