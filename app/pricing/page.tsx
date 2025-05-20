'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Crown, Sparkles } from 'lucide-react';
import getStripe from '@/lib/stripe';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const { t, language } = useLanguage();
  const { data: session, status } = useSession();

  const [selectedPlan, setSelectedPlan] = useState<'free' | 'basic' | 'pro'>('free');
  const router = useRouter()

  // Currency symbols by language
  const currencySymbols: Record<string, string> = {
    en: '$',
    zh: '¥',
    ja: '¥',
    ko: '₩',
  };

  // Price multipliers for different currencies
  const priceMultipliers: Record<string, number> = {
    en: 1,      // USD
    zh: 7,      // CNY
    ja: 130,    // JPY
    ko: 1300,   // KRW
  };
  type PlanEnum = 'free' | 'basic' | 'pro'

  const payForPlan = async (plan: PlanEnum) => {
    // 检查用户是否已登录
    if (status === 'unauthenticated') {
      // 如果未登录，重定向到登录页面
      router.push('/api/auth/signin');
      return;
    }

    if (plan === 'free') {
      router.push('/text-to-speech');
      return;
    }

    let userId = session?.user.id;
    if (!userId) {
      // 额外检查，确保用户ID存在
      router.push('/api/auth/signin');
      return;
    }

    const stripe = await getStripe();
    const response = await fetch("/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId, type: plan })
    })


    if (response.status === 500) {
      return
    }

    const data = await response.json()
    const result = stripe.redirectToCheckout({ sessionId: data.id })

    if (result.error) {
      console.log(result.error.message)
    }
  }

  const getPrice = (basePrice: number): string => {
    const symbol = currencySymbols[language] || '$';
    const multiplier = priceMultipliers[language] || 1;
    const price = basePrice * multiplier;

    // Format based on currency
    if (language === 'ja' || language === 'ko') {
      return `${symbol}${Math.round(price)}`;
    } else if (language === 'zh') {
      return `${symbol}${Math.round(price)}`;
    } else {
      return `${symbol}${price}`;
    }
  };

  // Get pro price
  const getProPrice = () => {
    const basePrice = 50;
    return getPrice(basePrice);
  };

  return (
    <div className="py-20 container mx-auto px-4">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('pricing.title')}</h1>
        <p className="text-lg text-muted-foreground">{t('pricing.subtitle')}</p>


      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Free Plan */}
        <Card
          className={`border transition-all duration-300 transform hover:scale-[1.02] ${selectedPlan === 'free' ? "ring-2 ring-primary/50 shadow-md" : "border-border/50 hover:border-border"} flex flex-col`}
          onClick={() => setSelectedPlan('free')}
        >
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 rounded-full bg-primary/5 text-primary">
                <Check className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-2xl">{t('pricing.free.title')}</CardTitle>
            <div className="mt-4 text-4xl font-bold">{t('pricing.free.price')}</div>
            <CardDescription className="mt-2">{t('pricing.free.description')}</CardDescription>
          </CardHeader>
          <CardContent className="mt-2 flex-grow">
            <ul className="space-y-3">
              {t('pricing.free.features').split('\n').map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="mt-auto pt-6">
            <Button onClick={() => payForPlan('free')}
              className={`w-full transition-all ${selectedPlan === 'free' ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-primary/10 text-primary hover:bg-primary/20"}`}
            >
              {status === 'unauthenticated' 
                ? t('common.signInRequired') 
                : (selectedPlan === 'free' ? t('pricing.selected') : t('pricing.free.cta'))}
            </Button>
          </CardFooter>
        </Card>

        {/* Basic Plan */}
        <Card
          className={`border transition-all duration-300 transform hover:scale-[1.02] ${selectedPlan === 'basic' ? "ring-2 ring-primary shadow-lg" : "border-border/50 hover:border-primary/30"} relative overflow-hidden flex flex-col`}
          onClick={() => setSelectedPlan('basic')}
        >
          {selectedPlan === 'basic' && (
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-primary"></div>
          )}
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Crown className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-2xl">{t('pricing.basic.title')}</CardTitle>
            <div className="mt-4 flex items-baseline justify-center">
              <span className="text-4xl font-bold">{getPrice(10)}</span>
            </div>
            <CardDescription className="mt-2">{t('pricing.basic.description')}</CardDescription>
          </CardHeader>
          <CardContent className="mt-2 flex-grow">
            <ul className="space-y-3">
              {t('pricing.basic.features').split('\n').map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="mt-auto pt-6">
            <Button onClick={() => payForPlan('basic')}
              className={`w-full transition-all ${selectedPlan === 'basic' ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-primary/10 text-primary hover:bg-primary/20"}`}
              disabled={status === 'unauthenticated'}
            >
              {status === 'unauthenticated' 
                ? t('common.signInRequired') 
                : (selectedPlan === 'basic' ? t('pricing.selected') : t('pricing.basic.cta'))}
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card
          className={`relative transition-all duration-300 transform hover:scale-[1.02] ${selectedPlan === 'pro' ? "ring-2 ring-primary shadow-xl border-primary" : "border-primary/50"} overflow-hidden flex flex-col`}
          onClick={() => setSelectedPlan('pro')}
        >
          <div className="absolute top-0 right-0 left-0 h-2 bg-primary"></div>
          {selectedPlan === 'pro' && (
            <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none"></div>
          )}
          <div className={`absolute -right-10 top-5 rotate-45 bg-primary text-xs px-10 py-1 text-primary-foreground ${selectedPlan === 'pro' ? "bg-primary" : "bg-primary/80"}`}>
            {t('pricing.recommended')}
          </div>
          <CardHeader className="text-center pt-8">
            <div className="flex justify-center mb-2">
              <div className={`p-2 rounded-full ${selectedPlan === 'pro' ? "bg-primary text-primary-foreground" : "bg-primary/20 text-primary"}`}>
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-2xl">{t('pricing.pro.title')}</CardTitle>
            <div className="mt-4 flex items-baseline justify-center">
              <span className="text-4xl font-bold">{getProPrice()}</span>
            </div>
            <CardDescription className="mt-2">{t('pricing.pro.description')}</CardDescription>
          </CardHeader>
          <CardContent className="mt-2 flex-grow">
            <ul className="space-y-3">
              {t('pricing.pro.features').split('\n').map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="mr-2 h-5 w-5 flex-shrink-0 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="mt-auto pt-6">
            <Button
              onClick={() => payForPlan('pro')}
              className={`w-full transition-all bg-primary hover:bg-primary/90 text-primary-foreground ${selectedPlan === 'pro' ? "shadow-lg" : ""}`}
              disabled={status === 'unauthenticated'}
            >
              {status === 'unauthenticated' 
                ? t('common.signInRequired') 
                : (selectedPlan === 'pro' ? t('pricing.selected') : t('pricing.pro.cta'))}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}