import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="space-y-12">
              <div className="space-y-6">
                <h1 className="font-headline text-5xl md:text-7xl font-black uppercase tracking-tighter text-primary">
                  Connect With Us
                </h1>
                <p className="text-xl text-muted-foreground font-light leading-relaxed">
                  Our concierge team is available to assist you with inquiries regarding our fleet, technology, or custom commissions.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold uppercase tracking-widest text-xs mb-1">Inquiries</h3>
                    <p className="text-muted-foreground">concierge@shaikh-sons.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold uppercase tracking-widest text-xs mb-1">Support</h3>
                    <p className="text-muted-foreground">+1 (800) LUX-EV-SS</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold uppercase tracking-widest text-xs mb-1">Headquarters</h3>
                    <p className="text-muted-foreground">1200 Innovation Way, Suite 500<br />Silicon Valley, CA 94025</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/10 border border-border/50 rounded-3xl p-8 md:p-12">
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest">Full Name</Label>
                  <Input id="name" placeholder="Johnathan Wick" className="bg-background/50 border-border/50 h-12 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" className="bg-background/50 border-border/50 h-12 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-[10px] font-black uppercase tracking-widest">Subject</Label>
                  <Input id="subject" placeholder="Inquiry about Spectre GT" className="bg-background/50 border-border/50 h-12 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest">Message</Label>
                  <Textarea id="message" placeholder="How can we assist you today?" className="bg-background/50 border-border/50 min-h-[150px] text-sm" />
                </div>
                <Button className="w-full h-14 font-black uppercase tracking-[0.2em] text-xs rounded-xl">
                  Send Message <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
