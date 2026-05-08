
"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('shaikh_cookies_accepted');
    if (!hasAccepted) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('shaikh_cookies_accepted', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-[60]"
        >
          <div className="bg-background/80 backdrop-blur-2xl border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-colors duration-700" />
            
            <div className="flex gap-4 relative z-10">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Cookie className="h-6 w-6" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-headline text-lg font-bold uppercase tracking-tight">Privacy Handshake</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Shaikh & Sons uses cookies to refine your digital experience and ensure your interaction with our fleet is seamless and secure.
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button 
                    onClick={handleAccept} 
                    className="flex-1 font-bold uppercase tracking-widest text-[10px] h-10"
                  >
                    Accept Terms
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsVisible(false)}
                    className="shrink-0 hover:bg-white/5"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
