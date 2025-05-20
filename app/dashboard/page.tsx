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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
  History,
  Loader2,
  Trash2
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useToast } from '@/hooks/use-toast';
import { formatDistance } from 'date-fns';
import { zhCN } from 'date-fns/locale/zh-CN';
import { ja } from 'date-fns/locale/ja';
import { ko } from 'date-fns/locale/ko';

// 订单类型定义
type Order = {
  _id: string;
  userId: string;
  price: number;
  product: string;
  payCurrency?: string;
  payName?: string;
  payEmail?: string;
  createDate: string;
};

// 语音类型定义
type Voice = {
  _id: string;
  userId: string;
  voiceUrl: string;
  cost: number;
  balance: number;
  text?: string;
  createDate: string;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const user = session?.user;
  const router = useRouter();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [totalSpent, setTotalSpent] = useState(0);
  const [dataLoading, setDataLoading] = useState(false);

  // 当前播放的音频
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 真实数据
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [voiceHistory, setVoiceHistory] = useState<Voice[]>([]);
  const [lastOrderDate, setLastOrderDate] = useState<string>('-');
  const [lastVoiceDate, setLastVoiceDate] = useState<string>('-');
  const [memberSince, setMemberSince] = useState<string>('-');
  const [accountAge, setAccountAge] = useState<number>(0);

  // 删除确认对话框状态
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [voiceToDelete, setVoiceToDelete] = useState<string | null>(null);

  // 获取最新用户信息
  const fetchUserInfo = async () => {
    if (!user?.id) return;

    try {
      const userRes = await fetch(`/api/user/${user.id}`);
      const userData = await userRes.json();

      if (userData.user) {
        // 使用会话对象的更新方法更新会话
        // 注意：这里仅更新前端状态，不改变实际会话
        if (session) {
          Object.assign(session.user, {
            balance: userData.user.balance,
            createDate: userData.user.createDate,
            updateDate: userData.user.updateDate
          });
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return false;
    }
  };

  // 获取用户数据
  const fetchUserData = async () => {
    if (!user?.id) return;

    setDataLoading(true);
    try {
      // 获取订单历史
      const orderRes = await fetch(`/api/order/user/${user.id}`);
      const orderData = await orderRes.json();

      if (orderData.success && orderData.orders) {
        setOrderHistory(orderData.orders);

        // 计算总支出
        const total = orderData.orders.reduce((sum: number, order: Order) => sum + (order.price || 0), 0);
        setTotalSpent(total / 100); // 假设价格以分为单位存储

        // 设置最后订单日期
        if (orderData.orders.length > 0) {
          setLastOrderDate(orderData.orders[0].createDate);
        }
      }

      // 获取语音历史
      const voiceRes = await fetch(`/api/voice/user/${user.id}`);
      const voiceData = await voiceRes.json();

      if (voiceData.success && voiceData.voices) {
        // 按创建日期降序排序语音历史
        const sortedVoices = [...voiceData.voices].sort((a, b) => {
          return new Date(b.createDate).getTime() - new Date(a.createDate).getTime();
        });

        setVoiceHistory(sortedVoices);

        // 设置最后语音生成日期（使用排序后的第一条记录）
        if (sortedVoices.length > 0) {
          setLastVoiceDate(sortedVoices[0].createDate);
        }
      }

      // 计算账户年龄
      if (user.createDate) {
        const createDate = new Date(user.createDate);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - createDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setAccountAge(diffDays);
        setMemberSince(user.createDate);
      }
    } catch (error) {
      console.error('获取数据失败:', error);
      toast({
        variant: 'destructive',
        title: t('dashboard.dataLoadFailed'),
        description: t('dashboard.dataLoadFailedDesc'),
      });
    } finally {
      setDataLoading(false);
    }
  };

  // 刷新数据
  const refreshData = async () => {
    setDataLoading(true);
    try {
      const userInfoSuccess = await fetchUserInfo();
      await fetchUserData();
      if (userInfoSuccess) {
        toast({
          title: t('dashboard.refreshData'),
          description: t('dashboard.dataUpdated'),
        });
      } else {
        toast({
          variant: 'destructive',
          title: t('dashboard.dataLoadFailed'),
          description: t('dashboard.dataLoadFailedDesc'),
        });
      }
    } catch (error) {
      console.error('刷新用户信息失败:', error);
      toast({
        variant: 'destructive',
        title: t('dashboard.dataLoadFailed'),
        description: t('dashboard.dataLoadFailedDesc'),
      });
    } finally {
      setDataLoading(false);
    }
  };

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
  
  // 处理删除按钮点击
  const handleDeleteClick = (voiceId: string) => {
    setVoiceToDelete(voiceId);
    setDeleteDialogOpen(true);
  };
  // TODO 添加提示 xx小时就会删除文件
  // 删除语音记录
  const deleteVoice = async () => {
    if (!voiceToDelete || !user?.id) return;
    
    try {
      const response = await fetch('/api/voice/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          voiceId: voiceToDelete,
          userId: user.id 
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // 更新语音历史
        setVoiceHistory(data.voices);
        
        // 更新最后语音生成日期
        if (data.voices.length > 0) {
          setLastVoiceDate(data.voices[0].createDate);
        } else {
          setLastVoiceDate('-');
        }
        
        toast({
          title: t('dashboard.deleteSuccess'),
          description: t('dashboard.deleteSuccessDesc'),
        });
      } else {
        throw new Error(data.error || 'Failed to delete voice record');
      }
    } catch (error) {
      console.error('删除语音记录失败:', error);
      toast({
        variant: 'destructive',
        title: t('dashboard.deleteError'),
        description: t('dashboard.deleteErrorDesc'),
      });
    } finally {
      // 重置状态
      setVoiceToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();

      // 根据当前语言选择相应的语言包
      let locale;
      switch (t('nav.home')) {
        case '首页': // 中文
          locale = zhCN;
          break;
        case 'ホーム': // 日语
          locale = ja;
          break;
        case '홈': // 韩语
          locale = ko;
          break;
        default: // 英文
          locale = undefined;
      }

      return formatDistance(date, now, { addSuffix: true, locale });
    } catch (e) {
      return dateString;
    }
  };

  // 加载数据
  useEffect(() => {
    if (user?.id) {
      fetchUserData();
    }
  }, [user]);

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
      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dashboard.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('dashboard.deleteConfirmDesc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('dashboard.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={deleteVoice} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t('dashboard.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* 隐藏的音频播放器 */}
      <audio id="audio-player" onEnded={() => setIsPlaying(false)} className="hidden" />

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
            <p className="text-xs text-muted-foreground mt-2">{t('dashboard.lastPurchase')}: {lastOrderDate !== '-' ? formatDate(lastOrderDate) : '-'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.voicesGenerated')}</CardTitle>
            <ListMusic className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{voiceHistory.length}</div>
            <p className="text-xs text-muted-foreground mt-2">{t('dashboard.lastGenerated')}: {lastVoiceDate !== '-' ? formatDate(lastVoiceDate) : '-'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.accountAge')}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accountAge} {t('dashboard.days')}</div>
            <p className="text-xs text-muted-foreground mt-2">{t('dashboard.memberSince')}: {formatDate(memberSince)}</p>
          </CardContent>
        </Card>
      </div>

      {/* 标签页内容 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t('dashboard.title')}</h2>
        <Button
          variant="outline"
          onClick={refreshData}
          disabled={dataLoading}
        >
          {dataLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('dashboard.loading')}
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('dashboard.refreshData')}
            </>
          )}
        </Button>
      </div>

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
                    <div key={voice._id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg">
                      <div className="mb-2 md:mb-0 md:mr-4 flex-grow">
                        {voice.text ? (
                          <div className="mb-2 p-2 bg-muted/50 rounded-md">
                            <p className="font-medium text-sm">"{voice.text}"</p>
                          </div>
                        ) : (
                          <p className="font-medium text-muted-foreground italic">{t('dashboard.noTextAvailable')}</p>
                        )}
                        <div className="flex items-center mt-1">
                          <Badge variant="outline" className="mr-2">{(voice.cost).toFixed(2)} {t('dashboard.points')}</Badge>
                          <span className="text-xs text-muted-foreground">{formatDate(voice.createDate)}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => playAudio(voice.voiceUrl)}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          {currentAudio === voice.voiceUrl && isPlaying ? t('dashboard.pause') : t('dashboard.play')}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadAudio(voice.voiceUrl)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          {t('dashboard.download')}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleDeleteClick(voice._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          {t('dashboard.delete')}
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
                    <div key={order._id} className="p-4 border rounded-lg">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center">
                          <span className="text-xs text-muted-foreground mr-2">{t('dashboard.paymentName')}:</span>
                          <span className="font-medium">{order.payName || t('dashboard.noName')}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs text-muted-foreground mr-2">{t('dashboard.paymentEmail')}:</span>
                          <span className="text-sm">{order.payEmail || t('dashboard.noEmail')}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs text-muted-foreground mr-2">{t('dashboard.amount')}:</span>
                          <Badge>{order.price / 100} {order.payCurrency || 'USD'}</Badge>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs text-muted-foreground mr-2">{t('dashboard.orderDate')}:</span>
                          <span className="text-sm">{formatDate(order.createDate)}</span>
                        </div>
                      </div>
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
              {/* 刷新按钮已移至Tab外部 */}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}