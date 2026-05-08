"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Activity } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function PrivacyPage() {
  const sections = [
    {
      id: "collection",
      icon: Eye,
      title: "Information We Collect",
      content: "At Shaikh & Sons, we collect information you provide directly to us when you visit our website, register for an account, or contact us. This includes your name, email, and phone number. Our vehicles also collect data to ensure safety and provide optimal performance."
    },
    {
      id: "usage",
      icon: Activity,
      title: "How We Use It",
      content: "We use your data to maintain our services, communicate with you about updates or offers, and ensure the safety and security of our vehicle fleet."
    },
    {
      id: "security",
      icon: Lock,
      title: "Data Security",
      content: "We implement modern security measures to protect your information from unauthorized access. All vehicle and account data is encrypted and stored securely."
    },
    {
      id: "choices",
      icon: Shield,
      title: "Your Choices",
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

        <Accordion type="single" collapsible defaultValue={sections[0].id} className="space-y-4">
          {sections.map((section) => (
            <AccordionItem key={section.id} value={section.id} className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl px-5 md:px-6">
              <AccordionTrigger className="gap-4 py-5 text-left hover:no-underline">
                <span className="flex min-w-0 items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center text-primary">
                    <section.icon className="h-5 w-5" />
                  </span>
                  <span className="font-headline text-lg md:text-2xl font-black text-foreground uppercase tracking-tight">
                    {section.title}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pl-14 pr-2 pb-6 text-muted-foreground text-sm md:text-base leading-relaxed font-light">
                {section.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Global Scanline Overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.04] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] z-[60]" />
      </motion.div>
    </div>
  );
}
