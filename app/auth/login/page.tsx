'use client';

import { useState, useEffect } from 'react';
import '../auth.css';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Github, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { sendGTMEvent } from '@next/third-parties/google';

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
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const handleGithubLogin = async () => {
    sendGTMEvent({ event: 'LOGIN', provider: 'github' })
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

  const handleGoogleLogin = async () => {
    sendGTMEvent({ event: 'LOGIN', provider: 'google' })
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
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
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              )}
              {t('auth.continueWithGoogle')}
              <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full relative overflow-hidden group mb-3"
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
