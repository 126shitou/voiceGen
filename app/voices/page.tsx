'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Play, Headphones, Star, Lock } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { sendGTMEvent } from '@next/third-parties/google';

// Voice models data
const allVoices = [
  // English - British Male
  { id: 'bm_lewis', nameKey: 'voice.bm_lewis', gender: 'male', premium: false, sample: '#', avatar: 'lewis', rating: 4.8, language: 'en' },
  { id: 'bm_daniel', nameKey: 'voice.bm_daniel', gender: 'male', premium: false, sample: '#', avatar: 'daniel', rating: 4.7, language: 'en' },
  { id: 'bm_george', nameKey: 'voice.bm_george', gender: 'male', premium: true, sample: '#', avatar: 'george', rating: 4.9, language: 'en' },
  // English - British Female
  { id: 'bf_emma', nameKey: 'voice.bf_emma', gender: 'female', premium: false, sample: '#', avatar: 'emma', rating: 4.7, language: 'en' },
  { id: 'bf_alice', nameKey: 'voice.bf_alice', gender: 'female', premium: false, sample: '#', avatar: 'alice', rating: 4.8, language: 'en' },
  { id: 'bf_lily', nameKey: 'voice.bf_lily', gender: 'female', premium: true, sample: '#', avatar: 'lily', rating: 4.9, language: 'en' },
  // Japanese - Male
  { id: 'jm_kumo', nameKey: 'voice.jm_kumo', gender: 'male', premium: false, sample: '#', avatar: 'kumo', rating: 4.7, language: 'ja' },
  // Japanese - Female
  { id: 'jf_tebukuro', nameKey: 'voice.jf_tebukuro', gender: 'female', premium: false, sample: '#', avatar: 'tebukuro', rating: 4.8, language: 'ja' },
  { id: 'jf_alpha', nameKey: 'voice.jf_alpha', gender: 'female', premium: true, sample: '#', avatar: 'alpha', rating: 4.9, language: 'ja' },
  { id: 'jf_gongitsune', nameKey: 'voice.jf_gongitsune', gender: 'female', premium: true, sample: '#', avatar: 'gongitsune', rating: 4.8, language: 'ja' },
  // Chinese - Male
  { id: 'zm_yunxia', nameKey: 'voice.zm_yunxia', gender: 'male', premium: false, sample: '#', avatar: 'yunxia', rating: 4.8, language: 'zh' },
  { id: 'zm_yunxi', nameKey: 'voice.zm_yunxi', gender: 'male', premium: true, sample: '#', avatar: 'yunxi', rating: 4.9, language: 'zh' },
  { id: 'zm_yunyang', nameKey: 'voice.zm_yunyang', gender: 'male', premium: true, sample: '#', avatar: 'yunyang', rating: 4.8, language: 'zh' },
  // Chinese - Female
  { id: 'zf_xiaobei', nameKey: 'voice.zf_xiaobei', gender: 'female', premium: false, sample: '#', avatar: 'xiaobei', rating: 4.7, language: 'zh' },
  { id: 'zf_xiaoni', nameKey: 'voice.zf_xiaoni', gender: 'female', premium: true, sample: '#', avatar: 'xiaoni', rating: 4.9, language: 'zh' },
  // French - Female
  { id: 'ff_siwis', nameKey: 'voice.ff_siwis', gender: 'female', premium: true, sample: '#', avatar: 'siwis', rating: 4.8, language: 'fr' },
];

type Voice = {
  id: string;
  nameKey: string;
  gender: string;
  premium: boolean;
  sample: string;
  avatar: string;
  rating: number;
  language: string;
};

export default function VoicesPage() {
  const { language, t } = useLanguage();
  const { data: session } = useSession();
  const user = session?.user;
  const [activeTab, setActiveTab] = useState('all');
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [voices, setVoices] = useState<Voice[]>([]);

  // Language filter state
  const [languageFilter, setLanguageFilter] = useState<string>('all');

  useEffect(() => {
    // Set initial language filter based on user's language
    setLanguageFilter(language);
  }, [language]);

  useEffect(() => {
    // Filter voices based on selected language
    if (languageFilter === 'all') {
      setVoices(allVoices);
    } else {
      setVoices(allVoices.filter(voice => voice.language === languageFilter));
    }
  }, [languageFilter]);

  const filteredVoices = activeTab === 'all'
    ? voices
    : voices.filter(voice => voice.gender === activeTab);

  const playDemo = (voiceId: string) => {
    // In a real app, this would play a sample of the voice
    setPlayingVoice(voiceId);

    // Simulate audio playback end after 3 seconds
    setTimeout(() => {
      setPlayingVoice(null);
    }, 3000);
  };

  const getAvatarUrl = (avatar: string) => {
    return `https://api.dicebear.com/7.x/personas/svg?seed=${avatar}`;
  };
  const tabClick = (v: any) => {
    sendGTMEvent({ event: 'VIEW_MODEL', user: session?.user.email, gender: v, language: languageFilter })
    setActiveTab(v)
  }
  const languageChange = (v: any) => {
    sendGTMEvent({ event: 'VIEW_MODEL', user: session?.user.email, gender: activeTab, language: v })
    setLanguageFilter(v)
  }
  return (
    <div className="py-16 container mx-auto px-4">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('voices.pageTitle')}</h1>
        <p className="text-lg text-muted-foreground">
          {t('voices.pageDescription')}
        </p>
      </div>

      {/* Voice filters */}
      <div className="mb-8 flex flex-col gap-4 justify-center">
        {/* Language filter */}
        <Tabs
          defaultValue={language}
          value={languageFilter}
          onValueChange={languageChange}
          className="w-full max-w-md mx-auto"
        >
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all">{t('voices.allLanguages')}</TabsTrigger>
            <TabsTrigger value="en">{t('voices.english')}</TabsTrigger>
            <TabsTrigger value="zh">{t('voices.chinese')}</TabsTrigger>
            <TabsTrigger value="ja">{t('voices.japanese')}</TabsTrigger>
            <TabsTrigger value="fr">{t('voices.french')}</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Gender filter */}
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={v => tabClick(v)}
          className="w-full max-w-md mx-auto"
        >
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="all">{t('voices.allGenders')}</TabsTrigger>
            <TabsTrigger value="male">{t('voices.male')}</TabsTrigger>
            <TabsTrigger value="female">{t('voices.female')}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Voice grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVoices.map((voice) => (
          <Card key={voice.id} className={`hover-lift ${voice.premium && !user ? 'bg-card/50' : ''}`}>
            <CardHeader className="space-y-0 pb-2">
              <div className="flex justify-between items-start">
                <Avatar className="h-12 w-12 border border-border/50">
                  <AvatarImage src={getAvatarUrl(voice.avatar)} alt={t(voice.nameKey)} />
                  <AvatarFallback>{t(voice.nameKey).charAt(0)}</AvatarFallback>
                </Avatar>

                {voice.premium && (
                  <div className="bg-primary/10 text-primary text-xs font-medium rounded-full px-2 py-1 flex items-center">
                    <Star className="h-3 w-3 mr-1" fill="currentColor" />
                    {t('voices.premium')}
                  </div>
                )}
              </div>

              <CardTitle className="text-xl mt-3">{t(voice.nameKey)}</CardTitle>
              <CardDescription className="flex items-center">
                <span className="flex items-center">
                  <Star className="h-3 w-3 mr-1 text-yellow-500" fill="currentColor" />
                  {voice.rating}
                </span>
                <span className="mx-2">•</span>
                <span>{voice.gender === 'male' ? t('voices.male') : t('voices.female')}</span>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Headphones className="h-4 w-4 mr-1" />
                {t('voices.demoAvailable')}
              </div>
            </CardContent>

            <CardFooter>
              {voice.premium && !user ? (
                <Button variant="outline" className="w-full">
                  <Lock className="h-4 w-4 mr-2" />
                  {t('voices.unlockPremium')}
                </Button>
              ) : (
                <Button
                  className="w-full"
                  variant="secondary"
                  onClick={() => playDemo(voice.id)}
                  disabled={playingVoice === voice.id}
                >
                  {playingVoice === voice.id ? (
                    <>
                      <div className="flex items-center space-x-1 mr-2">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 bg-primary rounded-full animate-waveform"
                            style={{ animationDelay: `${i * 0.2}s` }}
                          ></div>
                        ))}
                      </div>
                      {t('voices.playing')}
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      {t('voices.playSample')}
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}