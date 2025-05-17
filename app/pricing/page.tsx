'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import { useSession, signIn } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';

export default function PricingPage() {
  const { t, language } = useLanguage();
  const { data: session } = useSession();
  const user = session?.user;
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

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

  // Calculate pro price with yearly discount if applicable
  const getProPrice = () => {
    const basePrice = 12;
    const finalPrice = billingPeriod === 'yearly' ? basePrice * 0.8 : basePrice;
    return getPrice(finalPrice);
  };

  return (
    <div className="py-20 container mx-auto px-4">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('pricing.title')}</h1>
        <p className="text-lg text-muted-foreground">{t('pricing.subtitle')}</p>
        
        <div className="flex items-center justify-center space-x-4 mt-8">
          <Label htmlFor="billing-period" className={billingPeriod === 'monthly' ? 'font-medium' : 'text-muted-foreground'}>
            {t('pricing.monthly')}
          </Label>
          <Switch
            id="billing-period"
            checked={billingPeriod === 'yearly'}
            onCheckedChange={(checked) => setBillingPeriod(checked ? 'yearly' : 'monthly')}
          />
          <Label htmlFor="billing-period" className={billingPeriod === 'yearly' ? 'font-medium' : 'text-muted-foreground'}>
            {t('pricing.yearly')}
          </Label>
        </div>
        
        {billingPeriod === 'yearly' && (
          <div className="mt-2 inline-block bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
            {t('pricing.saveWithYearly')}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Free Plan */}
        <Card className="border border-border/50 hover-lift">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{t('pricing.free.title')}</CardTitle>
            <div className="mt-4 text-4xl font-bold">{t('pricing.free.price')}</div>
            <CardDescription className="mt-2">{t('pricing.free.description')}</CardDescription>
          </CardHeader>
          <CardContent className="mt-2">
            <ul className="space-y-3">
              {t('pricing.free.features').split('\n').map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-primary/10 text-primary hover:bg-primary/20">
              {t('pricing.free.cta')}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Pro Plan */}
        <Card className="border-primary relative purple-glow hover-lift">
          <div className="absolute top-0 right-0 left-0 h-2 bg-primary rounded-t-lg"></div>
          <CardHeader className="text-center pt-8">
            <CardTitle className="text-2xl">{t('pricing.pro.title')}</CardTitle>
            <div className="mt-4 flex items-baseline justify-center">
              <span className="text-4xl font-bold">{getProPrice()}</span>
              <span className="text-muted-foreground ml-2">{t('pricing.pro.period')}</span>
            </div>
            <CardDescription className="mt-2">{t('pricing.pro.description')}</CardDescription>
          </CardHeader>
          <CardContent className="mt-2">
            <ul className="space-y-3">
              {t('pricing.pro.features').split('\n').map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-primary hover:bg-primary/90">
              {t('pricing.pro.cta')}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Enterprise Plan */}
        <Card className="border border-border/50 hover-lift">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{t('pricing.enterprise.title')}</CardTitle>
            <div className="mt-4 text-4xl font-bold">{t('pricing.enterprise.price')}</div>
            <CardDescription className="mt-2">{t('pricing.enterprise.description')}</CardDescription>
          </CardHeader>
          <CardContent className="mt-2">
            <ul className="space-y-3">
              {t('pricing.enterprise.features').split('\n').map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              {t('pricing.enterprise.cta')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}