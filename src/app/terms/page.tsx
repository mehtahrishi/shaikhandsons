"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Gavel, AlertCircle, FileCheck, Landmark, CheckCircle2 } from 'lucide-react';

export default function TermsPage() {
  const sections = [
    {
      id: "usage",
      icon: Scale,
      title: "1. Terms of Use",
      content: [
        "By accessing and using our website or vehicles, you agree to be bound by these terms of service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our products and services."
      ]
    },
    {
      id: "license",
      icon: FileCheck,
      title: "2. Use License",
      content: [
        "Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.",
        "Under this license you may not:",
        "Modify or copy the materials.",
        "Use the materials for any commercial purpose or public display.",
        "Attempt to decompile or reverse engineer any software contained on our website or within our vehicles.",
        "Remove any copyright or other proprietary notations from the materials."
      ],
      isList: true
    },
    {
      id: "disclaimer",
      icon: AlertCircle,
      title: "3. Disclaimer",
      content: [
        "The materials on our website and our vehicles are provided on an 'as is' basis. Shaikh & Sons makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights."
      ]
    },
    {
      id: "limitations",
      icon: Gavel,
      title: "4. Limitations",
      content: [
        "In no event shall Shaikh & Sons or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use our products or services, even if we have been notified orally or in writing of the possibility of such damage."
      ]
    },
    {
      id: "governing",
      icon: Landmark,
      title: "5. Governing Law",
      content: [
        "These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Shaikh & Sons operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location."
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
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/80">Legal Framework</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
              Terms of <span className="text-primary">Service</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              The operational agreement between you and Shaikh & Sons. 
              Review the legal parameters governing our advanced mobility solutions.
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
                    <div className="space-y-6">
                      <p className="text-sm md:text-base">{section.content[0]}</p>
                      <p className="text-sm font-bold uppercase tracking-widest text-foreground">{section.content[1]}</p>
                      <ul className="grid grid-cols-1 gap-3">
                        {section.content.slice(2).map((item, i) => (
                          <li key={i} className="flex gap-3 p-4 rounded-xl bg-card border border-border/40 hover:border-primary/40 transition-colors">
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-1" />
                            <span className="text-sm font-medium">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
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
                  Agreement Archive
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline cursor-pointer">
                  Legal Council Contact
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
