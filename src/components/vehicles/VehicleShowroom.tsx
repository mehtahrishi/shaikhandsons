
"use client"

import React from 'react';
import { vehicles } from '@/lib/mock-data';
import { VehicleCard } from './VehicleCard';
import { motion } from 'framer-motion';

export function VehicleShowroom() {
  return (
    <section id="showroom" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-headline text-5xl md:text-7xl font-black mb-6"
            >
              The <span className="text-primary italic">Collection</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg"
            >
              Discover the pinnacle of electronic mobility. Each vehicle in our fleet is a masterpiece of design, performance, and sustainable luxury.
            </motion.p>
          </div>
          <div className="flex gap-4">
            <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Scroll to discover</span>
            <div className="w-12 h-[1px] bg-primary my-auto"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <VehicleCard vehicle={vehicle} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
