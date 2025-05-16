'use client';

import Link from 'next/link';
import { Mic } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 md:px-8 max-w-[1920px] mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 justify-items-center max-w-6xl mx-auto">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Mic className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">VoiceWave</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              {t('footer.description')}
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">{t('footer.product')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/voices" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.voices')}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.pricing')}
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.api')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">{t('footer.company')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.about')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.blog')}
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.support')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.cookies')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t text-center text-sm text-muted-foreground max-w-6xl mx-auto">
          <p>© {currentYear} VoiceWave. {t('footer.allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
}