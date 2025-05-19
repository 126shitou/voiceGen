"use client"
import { HeroSection } from '@/components/sections/hero-section';
import { FeaturesSection } from '@/components/sections/features-section';
import { CTASection } from '@/components/sections/cta-section';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, Volume2, Headphones, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col w-full">
      <HeroSection />

      {/* Use Cases Section */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('home.useCases.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.useCases.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Use Case 1: Content Creation */}
            <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-105">
              <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M8 13h8" />
                  <path d="M8 17h8" />
                  <path d="M8 9h1" />
                </svg>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold">{t('home.useCases.cases.content.title')}</h3>
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {t('home.useCases.cases.content.badge')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{t('home.useCases.cases.content.description')}</p>
              </CardContent>
            </Card>

            {/* Use Case 2: Accessibility */}
            <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-105">
              <div className="h-40 bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M12 8v4" />
                  <path d="M12 16h.01" />
                </svg>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold">{t('home.useCases.cases.accessibility.title')}</h3>
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {t('home.useCases.cases.accessibility.badge')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{t('home.useCases.cases.accessibility.description')}</p>
              </CardContent>
            </Card>

            {/* Use Case 3: Education */}
            <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-105">
              <div className="h-40 bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold">{t('home.useCases.cases.education.title')}</h3>
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {t('home.useCases.cases.education.badge')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{t('home.useCases.cases.education.description')}</p>
              </CardContent>
            </Card>

            {/* Use Case 4: Business */}
            <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-105">
              <div className="h-40 bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold">{t('home.useCases.cases.business.title')}</h3>
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {t('home.useCases.cases.business.badge')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{t('home.useCases.cases.business.description')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('home.howItWorks.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{t('home.howItWorks.steps.step1.title')}</h3>
              <p className="text-muted-foreground">{t('home.howItWorks.steps.step1.description')}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{t('home.howItWorks.steps.step2.title')}</h3>
              <p className="text-muted-foreground">{t('home.howItWorks.steps.step2.description')}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{t('home.howItWorks.steps.step3.title')}</h3>
              <p className="text-muted-foreground">{t('home.howItWorks.steps.step3.description')}</p>
            </div>
          </div>
        </div>
      </section>

      <FeaturesSection />
      <CTASection />
    </div>
  );
}