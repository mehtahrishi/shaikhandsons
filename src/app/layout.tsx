import type {Metadata} from 'next';
import './globals.css';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Toaster } from '@/components/ui/toaster';
import { InitialLoaderEV as InitialLoader } from '@/components/common/InitialLoaderEV';
import { CookieConsent } from '@/components/common/CookieConsent';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Shaikh & Sons | High-Performance Electronic Mobility',
  description: 'Uncompromising luxury and engineering excellence by Shaikh & Sons.',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary/30 min-h-screen flex flex-col">
        <AuthProvider>
          <InitialLoader />
          <SiteHeader />
          <main className="flex-1 pt-16 md:pt-20">
            {children}
          </main>
          <SiteFooter />
          <CookieConsent />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}