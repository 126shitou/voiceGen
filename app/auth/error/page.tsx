'use client';

import { useEffect, useState } from 'react';
import '../auth.css';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
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

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const { t } = useLanguage();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Map error codes to user-friendly messages
    switch (error) {
      case 'Configuration':
        setErrorMessage(t('auth.errorConfiguration') || 'Authentication configuration error');
        break;
      case 'AccessDenied':
        setErrorMessage(t('auth.errorAccessDenied') || 'Access denied');
        break;
      case 'Verification':
        setErrorMessage(t('auth.errorVerification') || 'Verification error');
        break;
      case 'OAuthSignin':
      case 'OAuthCallback':
      case 'OAuthCreateAccount':
      case 'EmailCreateAccount':
      case 'Callback':
      case 'OAuthAccountNotLinked':
      case 'EmailSignin':
      case 'CredentialsSignin':
      case 'SessionRequired':
      default:
        setErrorMessage(t('auth.errorDefault') || 'An authentication error occurred');
        break;
    }
  }, [error, t]);

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
            
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            
            <h1 className="text-2xl font-bold mb-2">{t('auth.errorTitle') || 'Authentication Error'}</h1>
            <p className="text-muted-foreground text-center mb-6">
              {errorMessage}
            </p>
            
            <div className="flex flex-col gap-4 w-full">
              <Button asChild className="w-full">
                <Link href="/auth/login">
                  {t('auth.tryAgainButton') || 'Try Again'}
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/">
                  {t('auth.backToHome') || 'Back to Home'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
