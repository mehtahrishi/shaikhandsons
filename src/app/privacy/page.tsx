import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="font-headline text-5xl font-black uppercase tracking-tighter text-primary mb-12">
          Privacy Policy
        </h1>
        <div className="prose prose-invert prose-sm max-w-none space-y-12 text-muted-foreground leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground uppercase tracking-widest border-b border-border/50 pb-2">1. Information We Collect</h2>
            <p>At Shaikh & Sons, we collect information you provide directly to us when you visit our website, register for an account, or contact us. This includes your name, email, phone number, and any other information you choose to provide.</p>
            <p>Our vehicles also collect operational data to ensure safety and provide optimal performance. This data includes battery health, autonomous system logs, and vehicle performance metrics.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground uppercase tracking-widest border-b border-border/50 pb-2">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide, maintain, and improve our services and vehicles.</li>
              <li>To communicate with you about products, services, and offers.</li>
              <li>To monitor and analyze trends and usage of our vehicles.</li>
              <li>To ensure the safety and security of our fleet.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground uppercase tracking-widest border-b border-border/50 pb-2">3. Data Security</h2>
            <p>We implement advanced security measures designed to protect your information from unauthorized access, use, or disclosure. All vehicle data is encrypted and stored in secure facilities.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground uppercase tracking-widest border-b border-border/50 pb-2">4. Your Choices</h2>
            <p>You may update or correct your account information at any time. You can also choose to opt-out of certain data collection features within your vehicle settings, though some features may require data to function correctly.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground uppercase tracking-widest border-b border-border/50 pb-2">5. Updates to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.</p>
          </section>

          <p className="text-[10px] uppercase tracking-widest text-muted-foreground pt-12">
            Last Updated: March 24, 2026
          </p>
        </div>
      </div>
    </div>
  );
}
