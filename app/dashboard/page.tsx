'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  VolumeX,
  Wallet,
  CreditCard,
  ListMusic,
  Calendar,
  RefreshCw,
  Download,
  Play,
  User as UserIcon,
  History
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useToast } from '@/hooks/use-toast';



const mockOrderHistory = [
  { id: 'ord_001', product: 'Basic Plan', price: 50, date: '2025-05-15', currency: 'USD' },
  { id: 'ord_002', product: 'Pro Plan', price: 100, date: '2025-04-20', currency: 'USD' },
];

const mockVoiceHistory = [
  { id: 'voice_001', url: 'https://example.com/voice1.mp3', cost: 25, date: '2025-05-18', text: 'Welcome to our voice generation service.' },
  { id: 'voice_002', url: 'https://example.com/voice2.mp3', cost: 35, date: '2025-05-16', text: 'This is an example of our high-quality voice synthesis technology.' },
  { id: 'voice_003', url: 'https://example.com/voice3.mp3', cost: 15, date: '2025-05-10', text: 'Thank you for using our service.' },
  { id: 'voice_004', url: 'https://example.com/voice4.mp3', cost: 30, date: '2025-05-05', text: 'Voice generation has never been easier.' },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const user = session?.user;
  const router = useRouter();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [totalSpent, setTotalSpent] = useState(0)

  // 当前播放的音频
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 模拟加载数据
  const [orderHistory, setOrderHistory] = useState(mockOrderHistory);
  const [voiceHistory, setVoiceHistory] = useState(mockVoiceHistory);

  // 播放音频
  const playAudio = (url: string) => {
    if (currentAudio === url && isPlaying) {
      // 暂停当前播放
      const audio = document.getElementById('audio-player') as HTMLAudioElement;
      if (audio) {
        audio.pause();
        setIsPlaying(false);
      }
    } else {
      // 播放新的音频
      setCurrentAudio(url);
      setIsPlaying(true);
      const audio = document.getElementById('audio-player') as HTMLAudioElement;
      if (audio) {
        audio.src = url;
        audio.play().catch(error => {
          console.error('播放失败:', error);
          toast({
            variant: 'destructive',
            title: t('dashboard.playbackError'),
            description: t('dashboard.playbackErrorDesc'),
          });
        });
      }
    }
  };

  // 下载音频
  const downloadAudio = (url: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `voice_${new Date().getTime()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast({
      title: t('dashboard.downloadStarted'),
      description: t('dashboard.downloadStartedDesc'),
    });
  };

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // 音频播放结束事件
  useEffect(() => {
    const audio = document.getElementById('audio-player') as HTMLAudioElement;
    if (audio) {
      const handleEnded = () => {
        setIsPlaying(false);
      };
      audio.addEventListener('ended', handleEnded);
      return () => {
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]">{t('dashboard.loading')}</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container py-10 px-4 mx-auto">
      {/* 隐藏的音频播放器 */}
      <audio id="audio-player" className="hidden" />

      {/* 用户信息和欢迎消息 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">{t('dashboard.welcome')}</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center">
          <Avatar className="h-10 w-10 mr-2">
            <AvatarImage src={user.image || ''} alt={user.name || ''} />
            <AvatarFallback>{(user.name || 'User').charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name || ''}</p>
            <p className="text-sm text-muted-foreground">{user.email || ''}</p>
          </div>
        </div>
      </div>

      {/* 主要统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.accountBalance')}</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.balance} {t('dashboard.points')}</div>
            <Progress className="mt-2" value={(user.balance / 1000) * 100} />
            <p className="text-xs text-muted-foreground mt-2">{t('dashboard.maxBalance')}: {1000}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.totalSpent')}</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSpent} {t('dashboard.points')}</div>
            <p className="text-xs text-muted-foreground mt-2">{t('dashboard.lastPurchase')}: {orderHistory[0]?.date || '-'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.voicesGenerated')}</CardTitle>
            <ListMusic className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{voiceHistory.length}</div>
            <p className="text-xs text-muted-foreground mt-2">{t('dashboard.lastGenerated')}: {voiceHistory[0]?.date || '-'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.accountAge')}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65 {t('dashboard.days')}</div>
            <p className="text-xs text-muted-foreground mt-2">{t('dashboard.memberSince')}: {user.createDate}</p>
          </CardContent>
        </Card>
      </div>

      {/* 标签页内容 */}
      <Tabs defaultValue="voices" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="voices">
            <ListMusic className="h-4 w-4 mr-2" />
            {t('dashboard.voiceHistory')}
          </TabsTrigger>
          <TabsTrigger value="orders">
            <History className="h-4 w-4 mr-2" />
            {t('dashboard.orderHistory')}
          </TabsTrigger>
          <TabsTrigger value="account">
            <UserIcon className="h-4 w-4 mr-2" />
            {t('dashboard.accountInfo')}
          </TabsTrigger>
        </TabsList>

        {/* 语音历史标签页 */}
        <TabsContent value="voices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.recentVoices')}</CardTitle>
              <CardDescription>{t('dashboard.recentVoicesDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              {voiceHistory.length > 0 ? (
                <div className="space-y-4">
                  {voiceHistory.map((voice) => (
                    <div key={voice.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg">
                      <div className="mb-2 md:mb-0 md:mr-4 flex-grow">
                        <p className="font-medium truncate max-w-md">{voice.text}</p>
                        <div className="flex items-center mt-1">
                          <Badge variant="outline" className="mr-2">{voice.cost} {t('dashboard.points')}</Badge>
                          <span className="text-xs text-muted-foreground">{voice.date}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => playAudio(voice.url)}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          {currentAudio === voice.url && isPlaying ? t('dashboard.pause') : t('dashboard.play')}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadAudio(voice.url)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          {t('dashboard.download')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <VolumeX className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p>{t('dashboard.noVoices')}</p>
                  <Button className="mt-4" onClick={() => router.push('/text-to-speech')}>
                    {t('dashboard.generateVoice')}
                  </Button>
                </div>
              )}
            </CardContent>
            {voiceHistory.length > 0 && (
              <CardFooter className="flex justify-center">
                <Button variant="outline" onClick={() => router.push('/text-to-speech')}>
                  {t('dashboard.generateMore')}
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        {/* 订单历史标签页 */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.purchaseHistory')}</CardTitle>
              <CardDescription>{t('dashboard.purchaseHistoryDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              {orderHistory.length > 0 ? (
                <div className="space-y-4">
                  {orderHistory.map((order) => (
                    <div key={order.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{order.product}</p>
                        <div className="flex items-center mt-1">
                          <Badge className="mr-2">{order.price} {order.currency}</Badge>
                          <span className="text-xs text-muted-foreground">{order.date}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        {t('dashboard.viewDetails')}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p>{t('dashboard.noOrders')}</p>
                  <Button className="mt-4" onClick={() => router.push('/pricing')}>
                    {t('dashboard.viewPlans')}
                  </Button>
                </div>
              )}
            </CardContent>
            {orderHistory.length > 0 && (
              <CardFooter className="flex justify-center">
                <Button variant="outline" onClick={() => router.push('/pricing')}>
                  {t('dashboard.buyMore')}
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        {/* 账户信息标签页 */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.profileInformation')}</CardTitle>
              <CardDescription>{t('dashboard.profileInformationDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{t('dashboard.name')}</p>
                    <p>{user.name}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{t('dashboard.email')}</p>
                    <p>{user.email}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{t('dashboard.memberSince')}</p>
                    <p>{user.createDate}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{t('dashboard.currentBalance')}</p>
                    <p>{user.balance} {t('dashboard.points')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                {t('dashboard.refreshData')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}