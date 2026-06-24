import FloatingParticles from '@/components/FloatingParticles';
import HeroSection from '@/components/HeroSection';
import GratitudeCards from '@/components/GratitudeCards';
import Timeline from '@/components/Timeline';
import BirthdayCake from '@/components/BirthdayCake';
import FooterBlessing from '@/components/FooterBlessing';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-animated text-white relative overflow-hidden">
      <FloatingParticles />
      
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_rgba(255,105,180,0.1),_transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom,_rgba(255,215,0,0.08),_transparent_50%)]" />
      </div>

      <main className="relative z-10">
        <HeroSection />
        <GratitudeCards />
        <Timeline />
        <BirthdayCake />
        <FooterBlessing />
      </main>
    </div>
  );
}
