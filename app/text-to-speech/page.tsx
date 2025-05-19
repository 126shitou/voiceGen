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
import User from '@/models/User';

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
    }
  }, [user]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0]);
  };

  const generateSpeech = async () => {
    // 检查用户是否登录
    if (!session?.user?.id) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You must be logged in to generate speech.',
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
    if (dbUser.Balance < requiredBalance) {
      toast({
        variant: 'destructive',
        title: 'Insufficient Balance',
        description: `You need ${requiredBalance.toFixed(1)} points to generate this audio. Your current balance is ${dbUser.Balance.toFixed(1)} points.`,
      });
      return;
    }

    if (!text.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter some text to convert to speech.',
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Use the voice ID directly since it already matches the model's voice ID
      const tk = process.env.NEXT_PUBLIC_TK;

      // Initial submission to create the prediction
      const submitData = {
        version: "jaaari/kokoro-82m:f559560eb822dc509045f3921a1921234918b91739db4bf3daab2169b71c7a13",
        input: {
          text: text,
          voice: voice,
          speed: speed
        }
      };

      // Create the prediction
      const createResponse = await fetch('/api/replicate/v1/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tk}`
        },
        body: JSON.stringify(submitData),
      });

      if (!createResponse.ok) {
        throw new Error(`Failed to create prediction: ${createResponse.status}`);
      }

      const prediction = await createResponse.json();
      console.log('Prediction created:', prediction.id);

      // Show a toast to indicate processing has started
      toast({
        title: 'Processing',
        description: 'Generating audio, please wait...',
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
        const usedBalance = textLength * 0.1;

        // 更新用户余额
        await fetch(`/api/user/${session?.user.id}/balance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount: -usedBalance })
        });

        toast({
          title: 'Success',
          description: `Your audio has been generated successfully. Used ${usedBalance.toFixed(1)} points.`,
        });
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

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
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
        title: 'Error',
        description: 'No audio available to download.',
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
      title: 'Download started',
      description: 'Your audio file is being downloaded.',
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

  const saveAudio = () => {
    if (!audioUrl || !user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: !audioUrl
          ? 'No audio available to save.'
          : 'You must be logged in to save audio.',
      });
      return;
    }

    const newAudio: SavedAudio = {
      id: `audio-${Date.now()}`,
      text,
      voice,
      speed,
      url: audioUrl,
      createdAt: new Date()
    };

    const updatedAudios = [newAudio, ...savedAudios];
    setSavedAudios(updatedAudios);

    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(`savedAudios-${user.id}`, JSON.stringify(updatedAudios));
    }

    toast({
      title: 'Audio saved',
      description: 'Your audio has been saved to your library.',
    });
  };

  const deleteSavedAudio = (id: string) => {
    const updatedAudios = savedAudios.filter(audio => audio.id !== id);
    setSavedAudios(updatedAudios);

    // Update localStorage
    if (typeof window !== 'undefined' && user) {
      localStorage.setItem(`savedAudios-${user.id}`, JSON.stringify(updatedAudios));
    }

    if (currentAudio?.id === id) {
      setCurrentAudio(null);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    }

    toast({
      title: 'Audio deleted',
      description: 'The audio has been removed from your library.',
    });
  };

  const loadSavedAudio = (audio: SavedAudio) => {
    setCurrentAudio(audio);
    setText(audio.text);
    setVoice(audio.voice);
    setSpeed(audio.speed);
    setShowGenerated(false);
    setAudioUrl('');

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = audio.url;
      setIsPlaying(false);
    }
  };

  const copyTextToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: 'Text copied',
          description: 'Text has been copied to clipboard.',
        });
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to copy text to clipboard.',
        });
      });
  };

  return (
    <div className="py-16 container mx-auto px-4">
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
                        onClick={saveAudio}
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

                      <audio
                        ref={audioRef}
                        src={currentAudio?.url || audioUrl}
                        onEnded={handleAudioEnded}
                      />

                      <div className="flex gap-2">
                        {isPlaying ? (
                          <Button size="icon" variant="ghost" onClick={pauseAudio}>
                            <Pause className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button size="icon" variant="ghost" onClick={playAudio}>
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
              {savedAudios.length === 0 ? (
                <div className="text-center py-12">
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
                            onClick={() => deleteSavedAudio(audio.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
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