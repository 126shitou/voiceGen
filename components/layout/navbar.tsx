'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';
import { LanguageSelector } from '@/components/ui/language-selector';
import { useLanguage } from '@/lib/language-context';
import { useAuth } from '@/lib/auth-context';
import { MobileMenu } from './mobile-menu';
import { UserMenu } from './user-menu';

export function Navbar() {
  const { t } = useLanguage();
  const { user, signInWithGoogle } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled ? 'bg-background/95 backdrop-blur-md border-b' : 'bg-transparent'
    }`}>
      <div className="w-full px-4 md:px-8 max-w-[1920px] mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Mic className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">VoiceWave</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            {t('nav.home')}
          </Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
            {t('nav.pricing')}
          </Link>
          <Link href="/voices" className="text-sm font-medium hover:text-primary transition-colors">
            {t('nav.voices')}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSelector />
          
          {user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Button
                onClick={signInWithGoogle}
                variant="ghost"
                className="hidden md:inline-flex"
              >
                {t('nav.login')}
              </Button>
              <Button
                onClick={signInWithGoogle}
                variant="default"
                className="hidden md:inline-flex bg-primary hover:bg-primary/90"
              >
                {t('nav.signup')}
              </Button>
            </>
          )}
          
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}