'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useSession, signIn } from 'next-auth/react';

// Define a type for the background element styles
type BackgroundElementStyle = {
  width: string;
  height: string;
  top: string;
  left: string;
  animationDuration: string;
  animationDelay: string;
  animation: string;
  opacity: number;
};

export function HeroSection() {
  const { t } = useLanguage();
  const { data: session } = useSession();
  const user = session?.user;
  const [backgroundStyles, setBackgroundStyles] = useState<BackgroundElementStyle[]>([]);

  // Generate random styles on the client side only
  useEffect(() => {
    const styles = Array.from({ length: 10 }, () => ({
      width: `${Math.random() * 200 + 50}px`,
      height: `${Math.random() * 200 + 50}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 20 + 10}s`,
      animationDelay: `${Math.random() * 5}s`,
      animation: 'float 20s infinite ease-in-out',
      opacity: Math.random() * 0.2,
    }));

    setBackgroundStyles(styles);
  }, []);

  return (
    <div className="relative w-full py-24 md:py-32 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 gradient-bg opacity-90"></div>

      {/* Purple glow effect */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(81,41,216,0.3) 0%, rgba(0,0,0,0) 70%)',
        }}
      ></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {backgroundStyles.map((style, i) => (
          <div
            key={i}
            className="absolute bg-primary/10 rounded-full"
            style={style}
          />
        ))}
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80 mb-6">
          {t('hero.title')} 
        </h1>
        <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-8">
          {t('hero.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {user ? (
            <Link href="/text-to-speech">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                <Sparkles className="mr-2 h-4 w-4" />
                {t('hero.tryNow')}
              </Button>
            </Link>
          ) : (
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white" onClick={() => signIn('google')}>
              <Sparkles className="mr-2 h-4 w-4" />
              {t('hero.tryNow')}
            </Button>
          )}
          <Link href="/pricing">
            <Button variant="outline" size="lg" className="border-white/20 bg-white/5 hover:bg-white/10 text-white">
              {t('hero.learnMore')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}