'use client';

import { useState, useEffect } from 'react';
import '../auth.css';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Github, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';

// Client-side only component to prevent hydration mismatch
function AnimatedCircles() {
  const [circles, setCircles] = useState<Array<{
    width: number;
    height: number;
    top: number;
    left: number;
    animation: number;
    opacity: number;
    scale: number;
  }>>([]);

  useEffect(() => {
    // Generate random circles only on the client side
    const newCircles = Array.from({ length: 5 }).map(() => ({
      width: Math.random() * 300 + 100,
      height: Math.random() * 300 + 100,
      top: Math.random() * 100,
      left: Math.random() * 100,
      animation: Math.random() * 10 + 15,
      opacity: Math.random() * 0.5 + 0.2,
      scale: Math.random() * 0.5 + 0.5,
    }));
    setCircles(newCircles);
  }, []);

  return (
    <>
      {circles.map((circle, i) => (
        <div
          key={i}
          className="absolute bg-primary/5 rounded-full"
          style={{
            width: `${circle.width}px`,
            height: `${circle.height}px`,
            top: `${circle.top}%`,
            left: `${circle.left}%`,
            animation: `float ${circle.animation}s infinite ease-in-out`,
            opacity: circle.opacity,
            transform: `scale(${circle.scale})`,
          }}
        />
      ))}
    </>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const handleGithubLogin = async () => {
    setIsLoading(true);
    try {
      await signIn('github', { callbackUrl: '/' });
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        variant: 'destructive',
        title: t('auth.loginFailed'),
        description: t('auth.tryAgain'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10 z-0"></div>

      {/* Animated circles */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatedCircles />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-card/80 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-border">
          <div className="flex flex-col items-center mb-6">
            <Link href="/" className="flex items-center gap-2 mb-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-primary"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
              <span className="font-bold text-2xl">VoiceWave</span>
            </Link>
            <h1 className="text-2xl font-bold mb-2">{t('auth.welcomeBack')}</h1>
            <p className="text-muted-foreground text-center">
              {t('auth.loginToContinue')}
            </p>
          </div>

          <div className="space-y-4">
            <Button
              variant="outline"
              size="lg"
              className="w-full relative overflow-hidden group"
              onClick={handleGithubLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Github className="h-4 w-4 mr-2" />
              )}
              {t('auth.continueWithGithub')}
              <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              {/* <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">
                  {t('auth.or')}
                </span>
              </div> */}
            </div>


          </div>


        </div>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>
            {t('auth.byLogging')}{' '}
            <Link href="/terms" className="text-primary hover:underline">
              {t('auth.terms')}
            </Link>{' '}
            {t('auth.and')}{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              {t('auth.privacy')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
