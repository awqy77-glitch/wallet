import { getTranslations } from 'next-intl/server';
import ThreeBackground from '@/components/ThreeBackground';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import BitcoinChart from '@/components/BitcoinChart';
import HomeCalculator from '@/components/HomeCalculator';
import { Globe, Wallet, ArrowRightLeft, DollarSign } from 'lucide-react';
import HeroTypewriter from '@/components/HeroTypewriter';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const currentLocale = resolvedParams.locale || 'en';
  const t = await getTranslations({ locale: currentLocale, namespace: 'HomePage' });

  return (
    <main className="relative min-h-screen w-full flex flex-col font-sans">
      <Navbar />
      <ThreeBackground />

      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center justify-center px-4 pt-24 pb-12">
        <div className="z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Text */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1 className="text-6xl md:text-8xl font-black text-[#F7931A] drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] mb-6 tracking-tight leading-none">
              BitWallet
            </h1>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 drop-shadow-md">
              {t('title')}
            </h2>
            <div className="text-xl md:text-2xl text-gray-200 mb-12 font-medium max-w-xl h-20">
              <HeroTypewriter />
            </div>

            <Link
              href={`/${currentLocale}/login`}
              className="inline-block bg-[#F7931A] hover:bg-[#e08516] text-white font-black text-2xl py-5 px-10 rounded-full shadow-[0_4px_14px_0_rgba(247,147,26,0.5)] hover:shadow-[0_6px_25px_rgba(247,147,26,0.6)] hover:-translate-y-2 transition-all duration-300 transform"
            >
              {t('heroCta')}
            </Link>
          </div>

          {/* Right Calculator */}
          <div className="flex justify-center lg:justify-end w-full">
            <HomeCalculator />
          </div>

        </div>
      </section>

      {/* How it Works Section */}
      <section className="relative z-10 w-full py-24 bg-[#121212]/95 border-t border-b border-gray-800 backdrop-blur-md px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-16 text-center">
            <span className="text-[#F7931A]">?</span> {t('howItWorksTitle')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
            <div className="flex flex-col items-center text-center p-6 bg-[#1a1a1a] rounded-3xl border border-gray-800 shadow-xl">
              <div className="w-20 h-20 rounded-[2rem] bg-[#2a2a2a] flex items-center justify-center text-[#F7931A] mb-6 shadow-2xl border border-gray-700">
                <Wallet size={36} />
              </div>
              <h4 className="text-xl font-bold text-gray-200">{t('howItWorksStep1')}</h4>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-[#1a1a1a] rounded-3xl border border-gray-800 shadow-xl">
              <div className="w-20 h-20 rounded-[2rem] bg-[#2a2a2a] flex items-center justify-center text-[#F7931A] mb-6 shadow-2xl border border-gray-700">
                <ArrowRightLeft size={36} />
              </div>
              <h4 className="text-xl font-bold text-gray-200">{t('howItWorksStep2')}</h4>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-[#1a1a1a] rounded-3xl border border-gray-800 shadow-xl">
              <div className="w-20 h-20 rounded-[2rem] bg-[#2a2a2a] flex items-center justify-center text-[#F7931A] mb-6 shadow-2xl border border-gray-700">
                <DollarSign size={36} />
              </div>
              <h4 className="text-xl font-bold text-gray-200">{t('howItWorksStep3')}</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Live Chart Section */}
      <section className="relative z-10 w-full pt-16 pb-8 px-4">
        <BitcoinChart />
      </section>

      {/* Where we work */}
      <section className="relative z-10 w-full py-20 bg-[#1a1a1a]/95 border-t border-gray-800 backdrop-blur-md px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Globe className="w-20 h-20 text-[#F7931A] mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            {t('whereWeWorkTitle')}
          </h2>
          <p className="text-xl text-gray-400 font-medium leading-relaxed">
            {t('whereWeWorkDesc')}
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
