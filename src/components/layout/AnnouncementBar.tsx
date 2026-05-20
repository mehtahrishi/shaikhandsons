"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ANNOUNCEMENTS = [
  "Welcome to Shaikh & Sons | High-Performance Electronic Mobility",
  "Experience the Future of Luxury Transportation Today",
  "Uncompromising Engineering meets Sustainable Innovation",
  "Complimentary Home Charging Station with every Premium Vehicle",
  "Visit our New Experience Center in the heart of Mumbai",
  "Now Delivering Nationwide - Book Your Test Drive Online",
  "Shaikh & Sons: Where Heritage meets the Electric Revolution"
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-primary text-primary-foreground h-9 flex items-center justify-center overflow-hidden border-b border-primary-foreground/10">
      <div className="container mx-auto px-4 flex items-center justify-center h-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-center"
          >
            {ANNOUNCEMENTS[index]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
