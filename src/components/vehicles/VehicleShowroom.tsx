
"use client"

import React, { useState, useEffect } from 'react';
import { VehicleCard } from './VehicleCard';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  price: number;
  batteryRangeKm: number;
  horsepower: number;
  zeroToSixtySeconds: number;
  images: string[];
  designPhilosophy: string;
  createdAt: string;
};

export function VehicleShowroom() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/inventory');
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

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <motion.div
                key={`skeleton-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="space-y-4">
                  <Skeleton className="h-[250px] w-full rounded-2xl" />
                  <div className="space-y-2 px-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
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
