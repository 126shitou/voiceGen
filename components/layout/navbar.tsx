'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Mic, ChevronRight } from 'lucide-react';
import { LanguageSelector } from '@/components/ui/language-selector';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useLanguage } from '@/lib/language-context';
import { MobileMenu } from './mobile-menu';
import { UserMenu } from './user-menu';
import { useSession, signIn } from 'next-auth/react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { t } = useLanguage();
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 定义导航链接
  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/text-to-speech', label: t('nav.tts') },
    { href: '/pricing', label: t('nav.pricing') },
    { href: '/voices', label: t('nav.voices') },
  ];

  // 检查链接是否为当前活动路径
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(path);
  };

  return (
    <header 
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled 
          ? 'bg-background/90 backdrop-blur-md shadow-sm' 
          : 'bg-background/50 backdrop-blur-sm'
      )}
    >
      <div className="w-full px-4 md:px-8 max-w-[1920px] mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Mic className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-xl">VoiceWave</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center">
          <div className="bg-muted/50 rounded-full p-1 flex items-center">
            {navLinks.map((link, index) => {
              const active = isActive(link.href);
              
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={cn(
                    'px-4 py-1.5 text-sm font-medium rounded-full transition-colors',
                    active 
                      ? 'bg-primary/90 text-primary-foreground shadow-md border border-primary/20' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-1 bg-muted/50 p-1 rounded-full">
            <ThemeToggle />
            <div className="h-4 w-px bg-border/50"></div>
            <LanguageSelector />
          </div>

          {session?.user ? (
            <UserMenu user={{
              uid: session.user.id || session.user.email || '',
              email: session.user.email || '',
              displayName: session.user.name || '',
              photoURL: session.user.image || ''
            }} />
          ) : (
            <Button
              onClick={() => { router.push('/auth/login') }}
              variant="default"
              size="sm"
              className="hidden md:inline-flex bg-primary hover:bg-primary/90 text-white"
            >
              {t('nav.login')}
            </Button>
          )}

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}