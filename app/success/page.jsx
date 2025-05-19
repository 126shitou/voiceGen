
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowRight, Loader2 } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function SuccessPage() {
  // 不再需要获取sessionId参数
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 短暂延迟以展示加载动画
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-lg">{t('payment.success.processing')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 container mx-auto px-4">
      <Card className="max-w-2xl mx-auto border-primary/20 shadow-lg">
        <CardHeader className="text-center pb-6 border-b">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">{t('payment.success.title')}</CardTitle>
          <CardDescription className="text-lg mt-2">
            {t('payment.success.subtitle')}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <p className="text-lg">
              {t('payment.success.thankYou')}
            </p>
          </div>

          <div className="bg-primary/5 rounded-lg p-4">
            <p className="text-sm text-center">
              {t('payment.success.enjoyService')}
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 pt-6">
          <Button asChild className="w-full">
            <Link href="/dashboard">
              {t('payment.success.dashboard')} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">
              {t('payment.success.home')}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
