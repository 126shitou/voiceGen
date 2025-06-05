'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/lib/language-context';
import { useSession } from 'next-auth/react';
import {
  CheckCircle,
  Download,
  Pause,
  Play,
  RefreshCw,
  Volume2,
  XCircle,
  Wand2,
  Save,
  History,
  Copy,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { getAudioStorage } from '@/lib/indexedDB';
import { sendGTMEvent } from '@next/third-parties/google';
// Voice models
const voices = [
  // English - British Male
  { id: 'bm_lewis', name: 'voice.bm_lewis' },
  { id: 'bm_daniel', name: 'voice.bm_daniel' },
  { id: 'bm_george', name: 'voice.bm_george' },
  // English - British Female
  { id: 'bf_emma', name: 'voice.bf_emma' },
  { id: 'bf_alice', name: 'voice.bf_alice' },
  { id: 'bf_lily', name: 'voice.bf_lily' },
  // French - Female
  { id: 'ff_siwis', name: 'voice.ff_siwis' },
];

// Type for saved audio
interface SavedAudio {
  id: string;
  text: string;
  voice: string;
  speed: number;
  url: string;
  createdAt: Date;
}

export default function TextToSpeechPage() {
  const { t, language } = useLanguage();
  const { data: session } = useSession();
  const user = session?.user;
  const { toast } = useToast();
  const [text, setText] = useState('');
  const [voice, setVoice] = useState(voices[0]?.id || '');
  const [speed, setSpeed] = useState(1.0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [showGenerated, setShowGenerated] = useState(false);
  const [savedAudios, setSavedAudios] = useState<SavedAudio[]>([]);
  const [activeTab, setActiveTab] = useState('generate');
  const [currentAudio, setCurrentAudio] = useState<SavedAudio | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [audioToDelete, setAudioToDelete] = useState<{ id: string, url?: string } | null>(null);
  // 删除与保存相关的状态

  // Set initial voice based on language
  useEffect(() => {
    // Set default voice based on language prefix
    const languagePrefix = language === 'en' ? 'b' : // British for English
      language === 'zh' ? 'z' : // Chinese
        language === 'ja' ? 'j' : // Japanese
          language === 'fr' ? 'f' : // French
            'b'; // Default to British

    const defaultVoice = voices.find(v => v.id.startsWith(`${languagePrefix}m_`) || v.id.startsWith(`${languagePrefix}f_`));
    if (defaultVoice) {
      setVoice(defaultVoice.id);
    } else if (voices.length > 0) {
      setVoice(voices[0].id);
    }
  }, [language]);

  // 加载音频数据的函数
  const loadIndexedDBData = async () => {
    if (typeof window === 'undefined') return;

    try {
      const audioStorage = getAudioStorage();
      const audioList = await audioStorage.listAllAudio();

      // 将IndexedDB中的音频添加到已保存的音频列表中
      if (audioList.length > 0) {
        const indexedDBaudios = audioList.map(item => ({
          id: item.id,
          text: item.metadata.text || '',
          voice: item.metadata.voice || '',
          speed: item.metadata.speed || 1.0,
          url: item.id, // 使用ID作为URL，播放时会从IndexedDB中获取
          createdAt: item.metadata.createdAt ? new Date(item.metadata.createdAt) : new Date()
        }));

        // 按时间排序
        setSavedAudios(indexedDBaudios.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
      }
    } catch (error) {
      console.error('Error loading audios from IndexedDB:', error);
    }
  };

  // 页面加载时加载音频数据
  useEffect(() => {
    loadIndexedDBData();
  }, []);

  // 当标签切换到library时重新加载音频数据
  useEffect(() => {
    if (activeTab === 'library') {
      loadIndexedDBData();
    }
  }, [activeTab]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0]);
  };

  const generateSpeech = async () => {
    sendGTMEvent({
      event: 'GENERATE', user: session?.user.email, vioceParams: {
        voice,
        speed
      }
    })
    // 检查用户是否登录
    if (!session?.user?.id) {
      toast({
        variant: 'destructive',
        title: t('tts.authRequired'),
        description: t('tts.mustBeLoggedIn'),
      });
      return;
    }

    if (!text.trim()) {
      toast({
        variant: 'destructive',
        title: t('tts.error'),
        description: t('tts.emptyTextError'),
      });
      return;
    }

    setIsGenerating(true);

    try {
      // 显示处理中的提示
      toast({
        title: t('tts.processing'),
        description: t('tts.generatingAudio'),
      });

      // 调用服务端API生成语音
      const response = await fetch('/api/replicate/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: session.user.id,
          text: text,
          voice: voice,
          speed: speed,
        }),
      });

      if (!response.ok) {
        // 处理错误响应
        if (response.headers.get('Content-Type')?.includes('application/json')) {
          const errorData = await response.json();

          // 处理余额不足的情况
          if (response.status === 402 && errorData.error === 'Insufficient balance') {
            toast({
              variant: 'destructive',
              title: t('tts.insufficientBalance'),
              description: t('tts.balanceNeeded')
                .replace('{0}', errorData.requiredBalance)
                .replace('{1}', errorData.currentBalance),
            });
            return;
          }

          throw new Error(errorData.error || `Failed with status: ${response.status}`);
        } else {
          throw new Error(`Failed with status: ${response.status}`);
        }
      }

      // 获取音频文件作为Blob
      const audioBlob = await response.blob();

      // 获取使用的余额和当前余额（从响应头中获取）
      const usedBalance = response.headers.get('X-Used-Balance') || '0';
      const currentBalance = response.headers.get('X-Current-Balance') || '0';

      // 将音频文件存储到IndexedDB
      const audioStorage = getAudioStorage();
      const audioId = await audioStorage.storeAudioFromUrl(
        URL.createObjectURL(audioBlob),
        {
          text,
          voice,
          speed,
          usedBalance,
          createdAt: new Date()
        }
      );

      // 创建临时URL用于播放
      const tempUrl = URL.createObjectURL(audioBlob);

      // 更新UI
      setAudioUrl(tempUrl);
      setShowGenerated(true);
      setCurrentAudio(null);

      // 显示成功消息和存储位置提示
      toast({
        title: t('tts.success'),
        description: `${t('tts.audioGenerated').replace('{0}', usedBalance)}\n${t('tts.audioStoredInIndexedDB')}`,
      });

      // 生成音频后自动加载音频列表
      loadIndexedDBData();
    } catch (error) {
      console.error('Error generating speech:', error);
      toast({
        variant: 'destructive',
        title: t('tts.error'),
        description: error instanceof Error ? error.message : 'Failed to generate speech. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const playAudio = async (audioUrlToPlay?: string, switchToGenerate: boolean = true) => {
    // 确保audioRef存在
    if (!audioRef.current) {
      console.error('Audio reference is null');
      toast({
        variant: 'destructive',
        title: 'Playback Error',
        description: 'Audio player is not available.',
      });
      return;
    }

    try {
      // 先暂停当前播放，避免多个音频同时播放
      audioRef.current.pause();
      setIsPlaying(false);

      // 如果提供了特定URL，则播放该URL
      if (audioUrlToPlay) {
        // 检查URL是否是IndexedDB中的ID格式 (以'audio-'开头)
        if (audioUrlToPlay.startsWith('audio-')) {
          try {
            // 从IndexedDB获取音频
            const audioStorage = getAudioStorage();
            const audioData = await audioStorage.getAudio(audioUrlToPlay);

            if (audioData && audioData.blob) {
              // 创建临时URL
              const tempUrl = URL.createObjectURL(audioData.blob);
              audioRef.current.src = tempUrl;
              audioRef.current.load();
              setAudioUrl(tempUrl);

              // 等待加载完成
              await new Promise((resolve) => {
                audioRef.current!.onloadeddata = resolve;
              });
            } else {
              throw new Error('Audio not found in storage or invalid blob');
            }
          } catch (error) {
            console.error('Error loading audio from IndexedDB:', error);
            throw error;
          }
        } else {
          // 直接使用URL
          audioRef.current.src = audioUrlToPlay;
          audioRef.current.load(); // 确保重新加载音频
          setAudioUrl(audioUrlToPlay);

          // 等待加载完成
          await new Promise((resolve) => {
            audioRef.current!.onloadeddata = resolve;
          });
        }

        setCurrentAudio(null);

        // 只有在需要切换到生成标签页时才显示生成的音频播放器
        if (switchToGenerate) {
          setShowGenerated(true);
          setActiveTab('generate');
        }
      }

      // 等待一小段时间再播放，确保音频已经加载完成
      await new Promise(resolve => setTimeout(resolve, 100));

      // 播放音频
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error playing audio:', error);
        toast({
          variant: 'destructive',
          title: 'Playback Error',
          description: 'Could not play the audio. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error in playAudio function:', error);
      toast({
        variant: 'destructive',
        title: 'Playback Error',
        description: 'An unexpected error occurred while trying to play the audio.',
      });
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const downloadAudio = async () => {
    if (!audioUrl && !currentAudio?.url) {
      toast({
        variant: 'destructive',
        title: t('tts.error'),
        description: t('tts.noAudioToDownload'),
      });
      return;
    }

    const url = currentAudio?.url || audioUrl;
    let blobToDownload: Blob | null = null;

    // 检查URL是否是IndexedDB中的ID格式
    if (url.startsWith('audio-')) {
      // 从IndexedDB获取音频
      const audioStorage = getAudioStorage();
      const audioData = await audioStorage.getAudio(url);

      if (audioData) {
        blobToDownload = audioData.blob;
      } else {
        toast({
          variant: 'destructive',
          title: t('tts.error'),
          description: '无法从存储中找到音频文件',
        });
        return;
      }
    } else {
      // 尝试从URL获取Blob
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch audio file');
        }
        blobToDownload = await response.blob();
      } catch (error) {
        console.error('Error downloading audio:', error);
        toast({
          variant: 'destructive',
          title: t('tts.error'),
          description: '无法下载音频文件',
        });
        return;
      }
    }

    if (blobToDownload) {
      // 创建临时URL和下载链接
      const downloadUrl = URL.createObjectURL(blobToDownload);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `voice-gen-${new Date().getTime()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // 释放临时URL
      URL.revokeObjectURL(downloadUrl);

      toast({
        title: t('tts.downloadStarted'),
        description: t('tts.downloadStartedDesc'),
      });
    }
  };

  const resetAll = () => {
    setText('');
    setShowGenerated(false);
    setAudioUrl('');
    setCurrentAudio(null);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  const handleDeleteClick = (id: string) => {
    setAudioToDelete({ id });
    setDeleteDialogOpen(true);
  };

  const deleteSavedAudio = async () => {
    if (!audioToDelete) return;

    const { id } = audioToDelete;

    // Delete from local library
    const updatedAudios = savedAudios.filter(audio => audio.id !== id);
    setSavedAudios(updatedAudios);

    // 如果是IndexedDB中的音频（ID以'audio-'开头），也从那里删除
    if (id.startsWith('audio-')) {
      try {
        const audioStorage = getAudioStorage();
        await audioStorage.deleteAudio(id);
        console.log('Audio deleted from IndexedDB:', id);
      } catch (error) {
        console.error('Error deleting audio from IndexedDB:', error);
      }
    }

    toast({
      title: t('tts.audioDeletedTitle'),
      description: t('tts.audioDeletedFromLocal'),
    });

    // Reset state
    setAudioToDelete(null);
    setDeleteDialogOpen(false);
  };

  const loadSavedAudio = (audio: SavedAudio) => {
    setCurrentAudio(audio);
    setText(audio.text);
    setVoice(audio.voice);
    setSpeed(audio.speed);
    setShowGenerated(true);
    setAudioUrl('');

    if (audioRef.current) {
      audioRef.current.pause();
      // 不直接设置 src，而是调用 playAudio 方法，该方法会处理 IndexedDB 中的音频
      setIsPlaying(false);
    }

    // 异步加载音频，但不播放
    playAudio(audio.url, true);

    // Switch to Generate Audio tab
    setActiveTab('generate');
  };

  const copyTextToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: t('tts.textCopiedTitle'),
          description: t('tts.textCopiedDesc'),
        });
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: t('tts.error'),
          description: t('tts.failedToCopyText'),
        });
      });
  };

  // 确保音频元素在组件挂载后初始化
  useEffect(() => {
    // 组件卸载时清理
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // 当currentAudio或audioUrl变化时更新音频源
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentAudio?.url || audioUrl || '';
    }
  }, [currentAudio, audioUrl]);

  return (
    <div className="container py-10 mx-auto">
      {/* 全局音频元素 */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        preload="auto"
        style={{ display: 'none' }}
      ></audio>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('tts.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('tts.confirmDelete')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('tts.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={deleteSavedAudio} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t('tts.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 删除保存对话框 */}
      <h1 className="text-4xl font-bold text-center mb-8">{t('tts.pageTitle')}</h1>
      <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-10">
        {t('tts.pageDescription')}
      </p>

      <div className="max-w-5xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="generate">
              <Wand2 className="mr-2 h-4 w-4" />
              {t('tts.generateTab')}
            </TabsTrigger>
            <TabsTrigger value="library" disabled={!user}>
              <History className="mr-2 h-4 w-4" />
              {t('tts.libraryTab')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
            <Card className="shadow-lg purple-glow">
              <CardContent className="p-6">
                <div className="mb-6">
                  <Label htmlFor="text-input" className="block mb-2">
                    {t('tts.charactersCount').replace('{count}', text.length.toString())}
                  </Label>
                  <Textarea
                    id="text-input"
                    placeholder={t('tts.inputPlaceholder')}
                    className="min-h-32 resize-y"
                    value={text}
                    onChange={handleTextChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label htmlFor="voice-select" className="block mb-2">
                      {t('tts.selectVoice')}
                    </Label>
                    <Select value={voice} onValueChange={setVoice}>
                      <SelectTrigger id="voice-select">
                        <SelectValue placeholder={t('tts.selectVoice')} />
                      </SelectTrigger>
                      <SelectContent>
                        {voices.map((v) => (
                          <SelectItem key={v.id} value={v.id}>
                            {t(v.name)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="block mb-2">
                      {t('tts.speed')}: {speed.toFixed(1)}x
                    </Label>
                    <Slider
                      value={[speed]}
                      min={0.1}
                      max={5.0}
                      step={0.1}
                      onValueChange={handleSpeedChange}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 justify-between items-center">
                  <Button
                    onClick={generateSpeech}
                    disabled={!text.trim() || isGenerating}
                    className="bg-primary hover:bg-primary/90 min-w-36"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        {t('tts.generate')}...
                      </>
                    ) : (
                      <>
                        <Volume2 className="mr-2 h-4 w-4" />
                        {t('tts.generate')}
                      </>
                    )}
                  </Button>

                  <div className="flex gap-2">
                    {/* 删除Save to Library按钮 */}

                    <Button
                      variant="outline"
                      onClick={resetAll}
                      disabled={!text}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      {t('tts.clear')}
                    </Button>
                  </div>

                  {!user && (
                    <div className="w-full mt-4 text-center text-sm text-muted-foreground">
                      {t('tts.signInPrompt')}
                    </div>
                  )}
                </div>

                {(showGenerated || currentAudio) && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">{t('tts.generated')}</h3>

                    <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                      <div className="flex items-center space-x-1">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-1 bg-primary rounded-full animate-waveform`}
                            style={{
                              animationDelay: `${i * 0.1}s`,
                              opacity: isPlaying ? 1 : 0.5,
                              height: isPlaying ? undefined : '0.5rem',
                            }}
                          ></div>
                        ))}
                      </div>

                      {/* 音频控制已移至全局音频元素 */}

                      <div className="flex gap-2">
                        {isPlaying ? (
                          <Button size="icon" variant="ghost" onClick={pauseAudio}>
                            <Pause className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button size="icon" variant="ghost" onClick={() => playAudio()}>
                            <Play className="h-4 w-4" />
                          </Button>
                        )}

                        <Button size="icon" variant="ghost" onClick={downloadAudio}>
                          <Download className="h-4 w-4" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            const url = currentAudio?.url || audioUrl;
                            if (!url) {
                              toast({
                                variant: 'destructive',
                                title: 'Error',
                                description: 'No audio link available to copy.',
                              });
                              return;
                            }

                            // Copy the audio URL to clipboard
                            navigator.clipboard.writeText(url)
                              .then(() => {
                                toast({
                                  title: 'Success',
                                  description: 'Audio link copied to clipboard',
                                });
                              })
                              .catch(() => {
                                toast({
                                  variant: 'destructive',
                                  title: 'Error',
                                  description: 'Failed to copy link to clipboard',
                                });
                              });
                          }}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="library">
            <div className="space-y-6">
              {/* 删除Local Library标题 */}
              {savedAudios.length === 0 ? (
                <div className="text-center py-6">
                  <h3 className="text-lg font-medium mb-2">{t('tts.noSavedAudios')}</h3>
                  <p className="text-muted-foreground">{t('tts.generateToSave')}</p>
                </div>
              ) : (
                savedAudios.map((audio, index) => (
                  <div key={`${audio.id}-${index}`} className="flex flex-col gap-2 p-4 border rounded-md">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate max-w-[150px]" title={audio.text}>
                          {audio.text.substring(0, 30)}{audio.text.length > 30 ? '...' : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => playAudio(audio.url, false)}
                          title={t('tts.play')}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyTextToClipboard(audio.text)}
                          title={t('tts.copyText')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        {/* 删除loadToEditor按钮 */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(audio.id)}
                          title={t('tts.delete')}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(audio.createdAt).toLocaleString()}
                      {audio.id.startsWith('audio-') && (
                        <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                          IndexedDB
                        </span>
                      )}
                    </div>
                  </div>
                )))}
            </div>
          </TabsContent>


        </Tabs>
      </div>
    </div>
  );
}