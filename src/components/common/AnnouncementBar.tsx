
"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function AnnouncementBar() {
  return (
    <div className="bg-primary py-2 px-4 relative z-[51] text-primary-foreground">
      <div className="container mx-auto flex items-center justify-center text-[10px] sm:text-xs font-bold uppercase tracking-widest">
        <motion.div
          animate={{ x: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex items-center gap-2"
        >
          <span>Exclusive Premier: The Veridian Spectre is now accepting reservations</span>
          <ArrowRight className="h-3 w-3" />
        </motion.div>
      </div>
    </div>
  );
}
