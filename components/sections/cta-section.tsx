'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/language-context';
import { useSession, signIn } from 'next-auth/react';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export function CTASection() {
  const { t } = useLanguage();
  const { data: session } = useSession();

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background with gradient and blur */}
      <div className="absolute inset-0 gradient-bg opacity-90"></div>

      {/* Pulsing glow effect */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(81,41,216,0.2) 0%, rgba(0,0,0,0) 70%)',
          animation: 'pulse 4s infinite ease-in-out',
        }}
      ></div>

      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-white/80 mb-8">
            {t('cta.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {session?.user ? (
              <Link href="/text-to-speech">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  <Sparkles className="mr-2 h-4 w-4" />
                  {t('cta.button')}
                </Button>
              </Link>
            ) : (
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => signIn('github')}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {t('cta.button')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}