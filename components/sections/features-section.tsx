'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/lib/language-context';
import { Wand2, Globe, Gauge, Music } from 'lucide-react';

export function FeaturesSection() {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: <Wand2 className="h-10 w-10 text-primary" />,
      title: t('features.naturalVoices.title'),
      description: t('features.naturalVoices.description'),
    },
    {
      icon: <Globe className="h-10 w-10 text-primary" />,
      title: t('features.multiLanguage.title'),
      description: t('features.multiLanguage.description'),
    },
    {
      icon: <Gauge className="h-10 w-10 text-primary" />,
      title: t('features.speedControl.title'),
      description: t('features.speedControl.description'),
    },
    {
      icon: <Music className="h-10 w-10 text-primary" />,
      title: t('features.highQuality.title'),
      description: t('features.highQuality.description'),
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-background/50">
      <div className="container px-4 mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">{t('features.title')}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
          {t('features.subtitle')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover-lift border border-border/50">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}