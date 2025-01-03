import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';

import { getDictionary, Dictionary } from '@/app/[lang]/dictionaries';

export default async function Home({
  params,
}: {
  params: Promise<{ lang: 'en' | 'fr' | 'ar' | 'tr' }>;
}) {
  const lang = (await params).lang;
  const dict: Dictionary = await getDictionary(lang);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0B14] via-[#1A1F2E] to-[#232742] text-white">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent pointer-events-none" />
        <Header dictionary={dict} />
        <main>
          <Hero dictionary={dict} />
          <Features dictionary={dict} />
          <HowItWorks dictionary={dict} />
        </main>
        <Footer dictionary={dict} />
      </div>
    </div>
  );
}
