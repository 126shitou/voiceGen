import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VoiceWave - Text to Speech Converter',
  description: 'Premium Text to Speech Conversion with Multiple Languages and Voices',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <html lang="en" suppressHydrationWarning>
      <GoogleTagManager gtmId="GTM-WJFFKXK7" />

      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col bg-background">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
      <GoogleAnalytics gaId="G-V62CZCQHLL" />

    </html>
  );
}