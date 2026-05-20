"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function ActionDock() {
  const router = useRouter();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  const isAdminPage = pathname?.startsWith('/admin');
  const isHomePage = pathname === '/';
  
  const phoneNumber = "919321111322";
  const message = "Hello Shaikh & Sons, I'm interested in your electric vehicles.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  if (!mounted || isAdminPage) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="hidden lg:flex fixed bottom-8 right-6 z-50 flex-col gap-3"
        >
          {/* WhatsApp Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button 
                className="w-14 h-14 rounded-2xl shadow-xl bg-[#25D366] hover:bg-[#20ba5a] text-white p-0 border border-white/10 flex items-center justify-center transition-all duration-300"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="h-6 w-6" />
              </Button>
            </a>
          </motion.div>

          {/* Back Button (Desktop Only, Hidden on Home) */}
          {!isHomePage && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="hidden lg:block"
            >
              <Button 
                onClick={() => router.back()}
                className="w-14 h-14 rounded-2xl shadow-xl bg-primary hover:bg-primary/90 text-primary-foreground p-0 border border-white/10 flex items-center justify-center transition-all duration-300"
                title="Go Back"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
