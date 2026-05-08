import type {Metadata} from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Toaster } from '@/components/ui/toaster';
import { InitialLoaderEV as InitialLoader } from '@/components/common/InitialLoaderEV';
import { CookieConsent } from '@/components/common/CookieConsent';
import { AuthProvider } from '@/context/AuthContext';
import { PageWrapper } from '@/components/layout/PageWrapper';

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
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <head />
      <body className="font-body antialiased selection:bg-primary/30 min-h-screen flex flex-col bg-background text-foreground">
        <AuthProvider>
          <InitialLoader />
          <Navbar />
          <main className="flex-1 flex flex-col">
            <PageWrapper>
              {children}
            </PageWrapper>
          </main>
          <SiteFooter />
          <CookieConsent />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
