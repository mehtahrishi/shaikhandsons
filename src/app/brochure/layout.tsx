import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Shaikh & Sons | Product Brochure",
  description: "Official product brochure from Shaikh & Sons.",
};

export default function BrochureLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-neutral-900 antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
