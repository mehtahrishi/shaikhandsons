"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Gavel, AlertCircle, FileCheck, Landmark, CheckCircle2, ChevronRight } from 'lucide-react';

export default function TermsPage() {
  const sections = [
    {
      id: "usage",
      icon: Scale,
      title: "1. Terms of Use",
      content: "By accessing and using our website or vehicles, you agree to be bound by these terms of service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using our products."
    },
    {
      id: "license",
      icon: FileCheck,
      title: "2. Use License",
      content: "We grant you permission to temporarily use our website for personal, non-commercial viewing only. You may not modify or copy our materials, use them for commercial purposes, or attempt to reverse engineer our software."
    },
    {
      id: "disclaimer",
      icon: AlertCircle,
      title: "3. Disclaimer",
      content: "Our materials and vehicles are provided on an 'as is' basis. Shaikh & Sons makes no warranties and hereby disclaims all other warranties including fitness for a particular purpose or non-infringement of rights."
    },
    {
      id: "limitations",
      icon: Gavel,
      title: "4. Limitations",
      content: "Shaikh & Sons shall not be liable for any damages arising out of the use or inability to use our products, even if we have been notified of the possibility of such damage."
    },
    {
      id: "governing",
      icon: Landmark,
      title: "5. Governing Law",
      content: "These terms are governed by the laws of our operating jurisdiction, and you submit to the exclusive jurisdiction of the local courts."
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
            Terms of <span className="text-primary italic">Service</span>
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm font-bold tracking-[0.3em] uppercase max-w-2xl mx-auto">
            The agreement between you and Shaikh & Sons
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
