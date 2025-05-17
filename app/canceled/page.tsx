'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function CanceledPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [reason, setReason] = useState<string | null>(null);

  useEffect(() => {
    // 获取取消原因（如果有）
    const cancelReason = searchParams.get('reason');
    setReason(cancelReason);
  }, [searchParams]);

  return (
    <div className="min-h-screen py-20 container mx-auto px-4">
      <Card className="max-w-2xl mx-auto border-muted/20 shadow-lg">
        <CardHeader className="text-center pb-6 border-b">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-3xl font-bold">{t('payment.canceled.title')}</CardTitle>
          <CardDescription className="text-lg mt-2">
            {t('payment.canceled.subtitle')}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="space-y-4">
            {reason && (
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm font-medium">{t('payment.canceled.reason')}</p>
                <p className="text-sm mt-1">{reason}</p>
              </div>
            )}
            
            <div className="bg-primary/5 rounded-lg p-4 mt-6">
              <p className="text-sm">
                {t('payment.canceled.noCharges')}
              </p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-3 pt-6">
          <Button asChild className="w-full">
            <Link href="/pricing">
              <RefreshCw className="mr-2 h-4 w-4" /> {t('payment.canceled.tryAgain')}
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('payment.canceled.home')}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
