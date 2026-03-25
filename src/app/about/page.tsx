import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="space-y-6">
            <h1 className="font-headline text-5xl md:text-7xl font-black uppercase tracking-tighter text-primary">
              About Us
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed">
              At Shaikh & Sons, we don't just build electric vehicles. We engineer transcendental experiences that bridge the gap between luxury and sustainable innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-border/50">
            <div className="space-y-4">
              <h2 className="font-headline text-2xl font-bold uppercase tracking-widest text-foreground">
                The Heritage
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Founded on the principles of uncompromising craftsmanship, Shaikh & Sons began as a pursuit of perfection. Today, that legacy continues through our commitment to defining the pinnacle of electronic luxury.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="font-headline text-2xl font-bold uppercase tracking-widest text-foreground">
                The Future
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Our fleet represents the future of mobility. By combining high-performance electric powertrains with artisanal design, we are setting new standards for what a luxury vehicle can be.
              </p>
            </div>
          </div>

          <div className="bg-muted/10 border border-border/50 rounded-2xl p-8 md:p-12 space-y-8">
            <h2 className="font-headline text-3xl font-black uppercase tracking-widest text-center">
              Our Philosophy
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-2">
                <div className="text-primary font-black text-4xl mb-2">01</div>
                <h3 className="font-bold uppercase tracking-widest text-sm">Innovation</h3>
                <p className="text-xs text-muted-foreground">Pushing the boundaries of battery technology and autonomous systems.</p>
              </div>
              <div className="text-center space-y-2">
                <div className="text-primary font-black text-4xl mb-2">02</div>
                <h3 className="font-bold uppercase tracking-widest text-sm">Artistry</h3>
                <p className="text-xs text-muted-foreground">Every curve and stitch is a testament to our dedication to aesthetic excellence.</p>
              </div>
              <div className="text-center space-y-2">
                <div className="text-primary font-black text-4xl mb-2">03</div>
                <h3 className="font-bold uppercase tracking-widest text-sm">Responsibility</h3>
                <p className="text-xs text-muted-foreground">Sustainable luxury that respects the world it traverses.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
