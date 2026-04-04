"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Activity, ArrowRight } from 'lucide-react';

export default function PrivacyPage() {
  const sections = [
    {
      id: "collection",
      icon: Eye,
      title: "1. Information We Collect",
      content: [
        "At Shaikh & Sons, we collect information you provide directly to us when you visit our website, register for an account, or contact us. This includes your name, email, phone number, and any other information you choose to provide.",
        "Our vehicles also collect operational data to ensure safety and provide optimal performance. This data includes battery health, autonomous system logs, and vehicle performance metrics."
      ]
    },
    {
      id: "usage",
      icon: Activity,
      title: "2. How We Use Your Information",
      content: [
        "To provide, maintain, and improve our services and vehicles.",
        "To communicate with you about products, services, and offers.",
        "To monitor and analyze trends and usage of our vehicles.",
        "To ensure the safety and security of our fleet."
      ],
      isList: true
    },
    {
      id: "security",
      icon: Lock,
      title: "3. Data Security",
      content: [
        "We implement advanced security measures designed to protect your information from unauthorized access, use, or disclosure. All vehicle data is encrypted and stored in secure facilities."
      ]
    },
    {
      id: "choices",
      icon: Shield,
      title: "4. Your Choices",
      content: [
        "You may update or correct your account information at any time. You can also choose to opt-out of certain data collection features within your vehicle settings, though some features may require data to function correctly."
      ]
    },
    {
      id: "updates",
      icon: FileText,
      title: "5. Updates to This Policy",
      content: [
        "We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the 'Last Updated' date."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-rgb),0.1),transparent_50%)] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/80">Security Protocol</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
              Privacy <span className="text-primary">Policy</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Our commitment to your security is engineered into every line of code. 
              Learn how we handle your digital assets and vehicle telemetry data.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto space-y-20">
            {sections.map((section, index) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-foreground">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  {section.isList ? (
                    <ul className="grid grid-cols-1 gap-3">
                      {section.content.map((item, i) => (
                        <li key={i} className="flex gap-3 p-4 rounded-xl bg-card border border-border/40 hover:border-primary/40 transition-colors">
                          <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-1" />
                          <span className="text-sm font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    section.content.map((text, i) => (
                      <p key={i} className="text-sm md:text-base">
                        {text}
                      </p>
                    ))
                  )}
                </div>
              </motion.section>
            ))}

            <div className="pt-20 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">
                Last Updated: March 24, 2026
              </div>
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline cursor-pointer">
                  Download PDF
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline cursor-pointer">
                  Contact Security Team
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scanline Effect Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] z-50" />
    </div>
  );
}
