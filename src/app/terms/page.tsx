import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="font-headline text-5xl font-black uppercase tracking-tighter text-primary mb-12">
          Terms of Service
        </h1>
        <div className="prose prose-invert prose-sm max-w-none space-y-12 text-muted-foreground leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground uppercase tracking-widest border-b border-border/50 pb-2">1. Terms of Use</h2>
            <p>By accessing and using our website or vehicles, you agree to be bound by these terms of service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our products and services.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground uppercase tracking-widest border-b border-border/50 pb-2">2. Use License</h2>
            <p>Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Modify or copy the materials.</li>
              <li>Use the materials for any commercial purpose or public display.</li>
              <li>Attempt to decompile or reverse engineer any software contained on our website or within our vehicles.</li>
              <li>Remove any copyright or other proprietary notations from the materials.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground uppercase tracking-widest border-b border-border/50 pb-2">3. Disclaimer</h2>
            <p>The materials on our website and our vehicles are provided on an 'as is' basis. Shaikh & Sons makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground uppercase tracking-widest border-b border-border/50 pb-2">4. Limitations</h2>
            <p>In no event shall Shaikh & Sons or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use our products or services, even if we have been notified orally or in writing of the possibility of such damage.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground uppercase tracking-widest border-b border-border/50 pb-2">5. Governing Law</h2>
            <p>These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Shaikh & Sons operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
          </section>

          <p className="text-[10px] uppercase tracking-widest text-muted-foreground pt-12">
            Last Updated: March 24, 2026
          </p>
        </div>
      </div>
    </div>
  );
}
