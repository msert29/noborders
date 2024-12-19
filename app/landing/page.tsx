import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0B14] via-[#1A1F2E] to-[#232742] text-white">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent pointer-events-none" />
        <Header />
        <main>
          <Hero />
          <Features />
          <HowItWorks />
        </main>
        <Footer />
      </div>
    </div>
  );
}
