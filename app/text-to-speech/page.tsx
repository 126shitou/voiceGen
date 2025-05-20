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
  Copy
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
import { getCurrentTime } from '@/lib/utils';
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
  const [collectionAudios, setCollectionAudios] = useState<{ url: string, id: string }[]>([]);
  const [activeTab, setActiveTab] = useState('generate');
  const [currentAudio, setCurrentAudio] = useState<SavedAudio | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [audioToDelete, setAudioToDelete] = useState<{ id: string, url?: string, isCloud?: boolean } | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [audioToSave, setAudioToSave] = useState<{ text: string, voice: string, speed: number, url: string } | null>(null);

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

  // Load saved audios from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      const saved = localStorage.getItem(`savedAudios-${user.id}`);
      if (saved) {
        try {
          const parsedAudios = JSON.parse(saved);
          // Convert string dates back to Date objects
          const audiosWithDates = parsedAudios.map((audio: any) => ({
            ...audio,
            createdAt: new Date(audio.createdAt)
          }));
          setSavedAudios(audiosWithDates);
        } catch (e) {
          console.error('Error parsing saved audios', e);
        }
      }
      // Load user's collection from database
      fetchUserCollection();
    }
  }, [user]);

  // Fetch user's collection from database
  const fetchUserCollection = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/user/${user.id}/collect`);
      if (response.ok) {
        const data = await response.json();
        // 将URL数组转换为对象数组，添加唯一ID
        const formattedCollection = data.collection.map((url: string) => ({
          url,
          id: `cloud-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }));
        setCollectionAudios(formattedCollection);
      }
    } catch (error) {
      console.error('Error fetching user collection:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load your audio collection.'
      });
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0]);
  };


  const generateSpeech = async () => {
    let voiceUrl = ''
    // 检查用户是否登录
    if (!session?.user?.id) {
      toast({
        variant: 'destructive',
        title: t('tts.authRequired'),
        description: t('tts.mustBeLoggedIn'),
      });
      return;
    }

    // 获取用户信息和余额
    let res = await fetch(`/api/user/${session.user.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    let { user: dbUser } = await res.json()

    // 计算所需费用 - 每个字符0.1点
    const textLength = text.trim().length;
    const requiredBalance = textLength * 0.1;

    // 检查用户余额是否足够
    if (dbUser.balance < requiredBalance) {
      toast({
        variant: 'destructive',
        title: t('tts.insufficientBalance'),
        description: t('tts.balanceNeeded')
          .replace('{0}', requiredBalance.toFixed(1))
          .replace('{1}', dbUser.balance.toFixed(1)),
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
      // Use the voice ID directly since it already matches the model's voice ID
      const tk = process.env.NEXT_PUBLIC_TK;

      // Create the prediction
      const createResponse = await fetch('/api/replicate/v1/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tk}`
        },
        body: JSON.stringify({
          version: "jaaari/kokoro-82m:f559560eb822dc509045f3921a1921234918b91739db4bf3daab2169b71c7a13",
          input: {
            text: text,
            voice: voice,
            speed: speed
          }
        }),
      });

      if (!createResponse.ok) {
        throw new Error(`Failed to create prediction: ${createResponse.status}`);
      }

      const prediction = await createResponse.json();
      console.log('Prediction created:', prediction.id);

      // Show a toast to indicate processing has started
      toast({
        title: t('tts.processing'),
        description: t('tts.generatingAudio'),
      });

      // Poll for the result
      let completed;
      const maxAttempts = 15; // Maximum number of polling attempts
      const pollingInterval = 2000; // 2 seconds between polls

      for (let i = 0; i < maxAttempts; i++) {
        // Get the latest status
        const statusResponse = await fetch(`/api/replicate/v1/predictions/${prediction.id}`, {
          headers: {
            'Authorization': `Bearer ${tk}`
          }
        });

        if (!statusResponse.ok) {
          throw new Error(`Failed to check prediction status: ${statusResponse.status}`);
        }

        const latest = await statusResponse.json();
        console.log(`Polling attempt ${i + 1}/${maxAttempts}, status: ${latest.status}`);

        // Check if processing is complete
        if (latest.status !== "starting" && latest.status !== "processing") {
          completed = latest;
          break;
        }

        // Wait before polling again
        await new Promise(resolve => setTimeout(resolve, pollingInterval));
      }

      if (!completed) {
        throw new Error('Processing timed out. Please try again.');
      }

      // Check for output
      if (completed.output) {
        setAudioUrl(completed.output);
        setShowGenerated(true);
        setCurrentAudio(null);

        // 计算并扣除用户余额
        const usedBalance = (textLength * 0.1).toFixed(2);

        // 更新用户余额
        let balanceData = await fetch(`/api/user/${session?.user.id}/balance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount: -usedBalance })
        });

        let { balance } = await balanceData.json()

        toast({
          title: t('tts.success'),
          description: t('tts.audioGenerated').replace('{0}', usedBalance),
        });

        await fetch(`/api/voice/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: session?.user.id,
            voiceUrl: completed.output,
            text: text, // 添加文本内容
            cost: usedBalance,
            balance: balance,
            createDate: getCurrentTime()
          })
        })
      } else {
        throw new Error('No output was generated.');
      }
    } catch (error) {
      console.error('Error generating speech:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate speech. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const playAudio = (audioUrlToPlay?: string, switchToGenerate: boolean = true) => {
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
      // 如果提供了特定URL，则播放该URL
      if (audioUrlToPlay) {
        // 先暂停当前播放，避免多个音频同时播放
        audioRef.current.pause();

        // 设置新的音频源
        audioRef.current.src = audioUrlToPlay;
        audioRef.current.load(); // 确保重新加载音频
        setAudioUrl(audioUrlToPlay);
        setCurrentAudio(null);

        // 只有在需要切换到生成标签页时才显示生成的音频播放器
        if (switchToGenerate) {
          setShowGenerated(true);
          setActiveTab('generate');
        }
      }

      // 播放音频
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error('Error playing audio:', error);
            toast({
              variant: 'destructive',
              title: 'Playback Error',
              description: 'Could not play the audio. Please try again.',
            });
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

  const downloadAudio = () => {
    if (!audioUrl && !currentAudio?.url) {
      toast({
        variant: 'destructive',
        title: t('tts.error'),
        description: t('tts.noAudioToDownload'),
      });
      return;
    }

    const url = currentAudio?.url || audioUrl;

    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = `voice-gen-${new Date().getTime()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast({
      title: t('tts.downloadStarted'),
      description: t('tts.downloadStartedDesc'),
    });
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

  const handleSaveClick = () => {
    if (!audioUrl || !user) {
      toast({
        variant: 'destructive',
        title: t('tts.error'),
        description: !audioUrl
          ? t('tts.noAudioToSave')
          : t('tts.mustBeLoggedInToSave'),
      });
      return;
    }

    setAudioToSave({
      text,
      voice,
      speed,
      url: audioUrl
    });
    setSaveDialogOpen(true);
  };

  const saveToLocal = async () => {
    if (!audioToSave || !user) return;

    const { text, voice, speed, url } = audioToSave;

    const newAudio: SavedAudio = {
      id: `audio-${Date.now()}`,
      text,
      voice,
      speed,
      url,
      createdAt: new Date()
    };

    const updatedAudios = [newAudio, ...savedAudios];
    setSavedAudios(updatedAudios);

    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(`savedAudios-${user.id}`, JSON.stringify(updatedAudios));
    }

    toast({
      title: t('tts.audioSavedLocally'),
      description: t('tts.audioSavedLocallyDesc'),
    });

    // Reset state
    setAudioToSave(null);
    setSaveDialogOpen(false);
  };
  const saveToCloud = async () => {
    if (!audioToSave || !user) return;

    const { url } = audioToSave;

    // Save to user's collection in database
    try {
      const response = await fetch(`/api/user/${user.id}/collect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      });

      if (response.ok) {
        const data = await response.json();
        // 将URL数组转换为对象数组，添加唯一ID
        const formattedCollection = data.collection.map((url: string) => ({
          url,
          id: `cloud-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }));
        setCollectionAudios(formattedCollection);

        toast({
          title: t('tts.audioSavedToCloud'),
          description: t('tts.audioSavedToCloudDesc'),
        });
      }
    } catch (error) {
      console.error('Error saving to collection:', error);
      toast({
        variant: 'destructive',
        title: t('tts.error'),
        description: t('tts.failedToSaveCloud'),
      });
    }

    // Reset state
    setAudioToSave(null);
    setSaveDialogOpen(false);
  };

  const saveToBoth = async () => {
    await saveToLocal();
    await saveToCloud();
  };

  const handleDeleteClick = (id: string, url?: string, isCloud?: boolean) => {
    setAudioToDelete({ id, url, isCloud });
    setDeleteDialogOpen(true);
  };

  const deleteSavedAudio = async () => {
    if (!audioToDelete) return;

    const { id, url, isCloud } = audioToDelete;

    if (isCloud && url) {
      // Delete from cloud collection
      try {
        const response = await fetch(`/api/user/${user?.id}/collect`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url })
        });

        if (response.ok) {
          const data = await response.json();
          // 将URL数组转换为对象数组，添加唯一ID
          const formattedCollection = data.collection.map((url: string) => ({
            url,
            id: `cloud-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          }));
          setCollectionAudios(formattedCollection);
          toast({
            title: t('tts.audioDeletedTitle'),
            description: t('tts.audioDeletedFromCloud'),
          });
        }
      } catch (error) {
        console.error('Error deleting from collection:', error);
        toast({
          variant: 'destructive',
          title: t('tts.error'),
          description: t('tts.failedToDeleteCloud'),
        });
      }
    } else {
      // Delete from local library
      const updatedAudios = savedAudios.filter(audio => audio.id !== id);
      setSavedAudios(updatedAudios);

      // Update localStorage
      if (typeof window !== 'undefined' && user) {
        localStorage.setItem(`savedAudios-${user.id}`, JSON.stringify(updatedAudios));
      }

      toast({
        title: t('tts.audioDeletedTitle'),
        description: t('tts.audioDeletedFromLocal'),
      });
    }

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
      audioRef.current.src = audio.url;
      setIsPlaying(false);
    }

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
      />

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

      <AlertDialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('tts.saveLocationTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('tts.saveLocationDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
            <Button onClick={saveToLocal} variant="outline" className="w-full">
              <span className="mr-2">💻</span> {t('tts.saveToLocal')}
            </Button>
            <Button onClick={saveToCloud} variant="outline" className="w-full">
              <span className="mr-2">☁️</span> {t('tts.saveToCloud')}
            </Button>
            <Button onClick={saveToBoth} className="w-full">
              <span className="mr-2">🔄</span> {t('tts.saveToBoth')}
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('tts.cancel')}</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
                    {user && audioUrl && (
                      <Button
                        variant="outline"
                        onClick={handleSaveClick}
                        className="border-primary/30 text-primary"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {t('tts.save')}
                      </Button>
                    )}

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
              <h3 className="text-xl font-medium mb-4">{t('tts.localLibrary')}</h3>
              {savedAudios.length === 0 ? (
                <div className="text-center py-6">
                  <h3 className="text-lg font-medium mb-2">{t('tts.noSavedAudios')}</h3>
                  <p className="text-muted-foreground">{t('tts.generateToSave')}</p>
                </div>
              ) : (
                savedAudios.map((audio) => (
                  <Card key={audio.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-sm text-muted-foreground">
                              {new Date(audio.createdAt).toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {t(voices.find(v => v.id === audio.voice)?.name || '')}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {audio.speed.toFixed(1)}x
                            </p>
                          </div>
                          <p className="text-sm line-clamp-2">{audio.text}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => loadSavedAudio(audio)}
                          >
                            {t('tts.load')}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyTextToClipboard(audio.text)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteClick(audio.id, audio.url)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}

              <h3 className="text-xl font-medium mt-8 mb-4">{t('tts.cloudCollection')}</h3>
              {collectionAudios.length === 0 ? (
                <div className="text-center py-6">
                  <h3 className="text-lg font-medium mb-2">{t('tts.noCloudAudios')}</h3>
                  <p className="text-muted-foreground">{t('tts.generateToSaveCloud')}</p>
                </div>
              ) : (
                collectionAudios.map((item) => (
                  <Card key={item.id} className="mb-4 overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0 flex justify-center">
                            <p className="text-sm text-muted-foreground">{new Date().toLocaleString()}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                // 云端音频直接播放，不切换标签页
                                playAudio(item.url, false);
                              }}
                            >
                              <Play className="h-4 w-4 mr-2" />
                              {t('tts.play')}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const a = document.createElement('a');
                                a.href = item.url;
                                a.download = `voice-gen-${new Date().getTime()}.mp3`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                              }}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              {t('tts.download')}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteClick(item.id, item.url, true)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 bg-accent rounded-lg p-3">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-1 bg-primary rounded-full`}
                                style={{
                                  height: '0.5rem',
                                  opacity: 0.5,
                                }}
                              ></div>
                            ))}
                          </div>
                          <div className="flex-1 truncate">
                            <p className="text-sm truncate">{item.url.split('/').pop()}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}