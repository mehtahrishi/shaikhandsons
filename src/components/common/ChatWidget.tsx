
"use client"

import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-card border shadow-2xl rounded-lg w-80 mb-4 overflow-hidden"
          >
            <div className="bg-primary p-4 flex justify-between items-center">
              <div>
                <h3 className="text-primary-foreground font-bold">Veridian Concierge</h3>
                <p className="text-primary-foreground/70 text-[10px] uppercase tracking-wider">Online</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-primary-foreground hover:bg-white/10">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-64 p-4 overflow-y-auto bg-muted/30">
              <div className="bg-muted p-3 rounded-lg text-sm mb-4">
                Hello! How can I assist you with your luxury EV inquiry today?
              </div>
            </div>
            <div className="p-4 border-t flex gap-2">
              <Input placeholder="Ask us anything..." className="text-xs" />
              <Button size="icon" className="shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Button 
        size="icon" 
        className="h-14 w-14 rounded-full shadow-lg" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>
    </div>
  );
}
