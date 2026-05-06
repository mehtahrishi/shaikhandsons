"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Activity, ChevronRight } from 'lucide-react';

export default function PrivacyPage() {
  const sections = [
    {
      id: "collection",
      icon: Eye,
      title: "1. Information We Collect",
      content: "At Shaikh & Sons, we collect information you provide directly to us when you visit our website, register for an account, or contact us. This includes your name, email, and phone number. Our vehicles also collect data to ensure safety and provide optimal performance."
    },
    {
      id: "usage",
      icon: Activity,
      title: "2. How We Use It",
      content: "We use your data to maintain our services, communicate with you about updates or offers, and ensure the safety and security of our vehicle fleet."
    },
    {
      id: "security",
      icon: Lock,
      title: "3. Data Security",
      content: "We implement modern security measures to protect your information from unauthorized access. All vehicle and account data is encrypted and stored securely."
    },
    {
      id: "choices",
      icon: Shield,
      title: "4. Your Choices",
      content: "You can update your account details at any time. You can also opt-out of certain data collection features within your vehicle settings."
    }
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] relative flex flex-col items-center overflow-hidden bg-background py-12">
      {/* Dynamic Background Accents - Matching Login/Contact Pages */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-4xl px-6 z-10 space-y-16"
      >
        {/* Header Section */}
        <div className="text-center space-y-6">
          <h1 className="font-headline text-6xl md:text-8xl font-black text-foreground tracking-tighter uppercase leading-[0.9]">
            Privacy <span className="text-primary italic">Policy</span>
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm font-bold tracking-[0.3em] uppercase max-w-2xl mx-auto">
            Our commitment to your security is built into every line of code
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-8 md:p-16 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="space-y-16">
            {sections.map((section, idx) => (
              <div key={section.id} className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-center text-primary">
                    <section.icon className="h-5 w-5" />
                  </div>
                  <h2 className="font-headline text-2xl font-black text-foreground uppercase tracking-tight">
                    {section.title}
                  </h2>
                </div>
                <p className="text-muted-foreground text-base leading-relaxed font-light pl-14">
                  {section.content}
                </p>
              </div>
            ))}

            {/* Footer Actions */}
            <div className="pt-2 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-8">
            

            </div>
          </div>
        </div>

        {/* Global Scanline Overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.04] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] z-[60]" />
      </motion.div>
    </div>
  );
}
