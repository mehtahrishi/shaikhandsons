"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Activity, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  const contactMethods = [
    {
      icon: Mail,
      label: "Inquiries",
      value: "concierge@shaikh-sons.com",
      desc: "Response within 2 hours"
    },
    {
      icon: Phone,
      label: "Direct Line",
      value: "+1 (800) LUX-EV-SS",
      desc: "24/7 Concierge Support"
    },
    {
      icon: MapPin,
      label: "Headquarters",
      value: "Innovation Way, Silicon Valley",
      desc: "Global Operations Center"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Hero Header */}
      <section className="relative pt-32 pb-16 overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-rgb),0.1),transparent_50%)] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Activity className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/80">Communication Link Active</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
              Establish <span className="text-primary">Contact</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Our concierge team is standing by to assist with fleet inquiries, 
              custom commissions, and technical support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left: Info HUD */}
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-6">
                <h2 className="text-3xl font-black uppercase tracking-tight">Global <br /><span className="text-primary">Network Nodes</span></h2>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                  We maintain a decentralized support infrastructure to ensure 
                  uninterrupted service for our global fleet owners.
                </p>
              </div>

              <div className="space-y-4">
                {contactMethods.map((method, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-6 p-6 rounded-3xl bg-card border border-border/40 hover:border-primary/40 transition-all group"
                  >
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary transition-all duration-300">
                      <method.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">{method.label}</p>
                      <p className="text-lg font-black text-foreground mb-0.5">{method.value}</p>
                      <p className="text-[10px] font-bold text-primary/60 uppercase tracking-tighter">{method.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="pt-8 border-t border-border/40">
                <div className="flex items-center gap-4 p-6 rounded-3xl bg-primary/5 border border-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                    Prefer immediate assistance? Our <span className="text-primary font-bold">AI Concierge</span> is active 24/7 in the bottom right corner.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Message Form HUD */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:col-span-7"
            >
              <div className="bg-card border border-border/60 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Send className="h-32 w-32" />
                </div>
                
                <form className="space-y-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Assigned Name</label>
                      <Input 
                        placeholder="IDENTIFY YOURSELF" 
                        className="bg-background/50 border-border/60 h-14 rounded-2xl text-xs font-bold tracking-widest focus-visible:ring-primary/40 uppercase"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Return Frequency</label>
                      <Input 
                        type="email" 
                        placeholder="EMAIL@PROTOCOL.COM" 
                        className="bg-background/50 border-border/60 h-14 rounded-2xl text-xs font-bold tracking-widest focus-visible:ring-primary/40 uppercase"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Transmission Subject</label>
                    <Input 
                      placeholder="FLEET INQUIRY / CUSTOM COMMISSION" 
                      className="bg-background/50 border-border/60 h-14 rounded-2xl text-xs font-bold tracking-widest focus-visible:ring-primary/40 uppercase"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Data Payload</label>
                    <Textarea 
                      placeholder="ENTER MESSAGE CONTENT..." 
                      className="bg-background/50 border-border/60 min-h-[180px] rounded-3xl text-xs font-bold tracking-widest focus-visible:ring-primary/40 p-6 uppercase"
                    />
                  </div>

                  <Button className="w-full h-16 bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl font-black uppercase tracking-[0.3em] text-xs transition-all duration-300 shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)] group/btn">
                    Execute Transmission 
                    <Send className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Button>
                  
                  <p className="text-[8px] text-center font-black uppercase tracking-[0.3em] text-muted-foreground/40">
                    Encrypted End-to-End Transmission Protocol v2.4.0
                  </p>
                </form>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Scanline Effect Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] z-50" />
    </div>
  );
}
