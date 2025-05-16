import { HeroSection } from '@/components/sections/hero-section';
import { TextToSpeechSection } from '@/components/sections/text-to-speech-section';
import { FeaturesSection } from '@/components/sections/features-section';
import { CTASection } from '@/components/sections/cta-section';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <TextToSpeechSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}