'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useAuth } from '@/lib/auth-context';

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const { user, signInWithGoogle } = useAuth();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4 mt-8">
          <Link 
            href="/" 
            className="block px-2 py-1 text-lg hover:text-primary transition-colors"
            onClick={() => setOpen(false)}
          >
            {t('nav.home')}
          </Link>
          <Link 
            href="/pricing" 
            className="block px-2 py-1 text-lg hover:text-primary transition-colors"
            onClick={() => setOpen(false)}
          >
            {t('nav.pricing')}
          </Link>
          <Link 
            href="/voices" 
            className="block px-2 py-1 text-lg hover:text-primary transition-colors"
            onClick={() => setOpen(false)}
          >
            {t('nav.voices')}
          </Link>
          
          <div className="h-px bg-border my-4" />
          
          {user ? (
            <Link 
              href="/dashboard" 
              className="block px-2 py-1 text-lg hover:text-primary transition-colors"
              onClick={() => setOpen(false)}
            >
              {t('nav.dashboard')}
            </Link>
          ) : (
            <>
              <Button 
                onClick={() => {
                  signInWithGoogle();
                  setOpen(false);
                }}
                variant="ghost" 
                className="justify-start px-2"
              >
                {t('nav.login')}
              </Button>
              <Button
                onClick={() => {
                  signInWithGoogle();
                  setOpen(false);
                }}
                className="bg-primary hover:bg-primary/90 mt-2"
              >
                {t('nav.signup')}
              </Button>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}