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
import { CheckCircle, Download, Pause, Play, RefreshCw, Volume2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  // Japanese - Male
  { id: 'jm_kumo', name: 'voice.jm_kumo' },
  // Japanese - Female
  { id: 'jf_tebukuro', name: 'voice.jf_tebukuro' },
  { id: 'jf_alpha', name: 'voice.jf_alpha' },
  { id: 'jf_gongitsune', name: 'voice.jf_gongitsune' },
  // Chinese - Male
  { id: 'zm_yunxia', name: 'voice.zm_yunxia' },
  { id: 'zm_yunxi', name: 'voice.zm_yunxi' },
  { id: 'zm_yunyang', name: 'voice.zm_yunyang' },
  // Chinese - Female
  { id: 'zf_xiaobei', name: 'voice.zf_xiaobei' },
  { id: 'zf_xiaoni', name: 'voice.zf_xiaoni' },
  // French - Female
  { id: 'ff_siwis', name: 'voice.ff_siwis' },
];

export function TextToSpeechSection() {
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

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0]);
  };

  const generateSpeech = async () => {
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
      console.log(text, voice, speed);
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
        console.log(`Polling attempt ${i+1}/${maxAttempts}, status: ${latest.status}`);
        
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
        
        toast({
          title: 'Success',
          description: 'Your audio has been generated successfully.',
        });
      } else {
        throw new Error('Generation failed, please try again.');
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
    if (!audioUrl) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No audio available to download.',
      });
      return;
    }

    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = audioUrl;
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
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  return (
    <section id="tts-section" className="py-16 bg-background">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">{t('tts.title')}</h2>

        <div className="max-w-4xl mx-auto">
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

                <Button
                  variant="outline"
                  onClick={resetAll}
                  disabled={!text}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  {t('tts.clear')}
                </Button>

                {!user && (
                  <div className="w-full mt-4 text-center text-sm text-muted-foreground">
                    {t('tts.signInPrompt')}
                  </div>
                )}
              </div>

              {showGenerated && (
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
                      src={audioUrl}
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
                          if (!audioUrl) {
                            toast({
                              variant: 'destructive',
                              title: 'Error',
                              description: 'No audio link available to copy.',
                            });
                            return;
                          }
                          
                          // Copy the audio URL to clipboard
                          navigator.clipboard.writeText(audioUrl)
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
        </div>
      </div>
    </section>
  );
}