'use client';

import { useTranslations } from 'next-intl';
import { useAccount, useDisconnect } from 'wagmi';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ThreeBackground from '@/components/ThreeBackground';
import DepositFlow from '@/components/DepositFlow';

export default function DashboardPage({ params }: { params: { locale: string } }) {
    const t = useTranslations('Dashboard');
    const router = useRouter();
    const supabase = createClient();
    const { isConnected, address } = useAccount();
    const { disconnect } = useDisconnect();

    const [fiatBalance, setFiatBalance] = useState<number>(0);
    const [cryptoBalance, setCryptoBalance] = useState<number>(0);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    // Use locale from params or default to 'en'
    const currentLocale = params?.locale || 'en';

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user && !isConnected) {
                // Not logged in via either method
                router.push(`/${currentLocale}/login`);
            } else if (user) {
                setUserEmail(user.email || null);
            }
        };
        checkAuth();
    }, [isConnected, router, supabase, currentLocale]);

    const handleDepositComplete = (fiatAmount: number) => {
        // In a real app, this would happen server-side via webhook verification
        // For this simulation, we update the client state immediately
        setFiatBalance(prev => prev + fiatAmount);
        setCryptoBalance(0); // Assuming the deposit was completely sold for Fiat
    };

    const handleLogout = async () => {
        if (isConnected) disconnect();
        await supabase.auth.signOut();
        router.push('/');
    };

    return (
        <main className="relative min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            <ThreeBackground />

            <div className="z-10 w-full max-w-4xl flex justify-between items-center mb-12">
                <h1 className="text-4xl font-extrabold text-[#F7931A] tracking-tight">
                    BitWallet Dashboard
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-300 text-sm hidden sm:inline-block">
                        {userEmail || (address ? `${address.substring(0, 6)}...${address.slice(-4)}` : 'Connecting...')}
                    </span>
                    <button
                        onClick={handleLogout}
                        className="border border-red-500/50 text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="z-10 w-full max-w-4xl grid gap-6 md:grid-cols-2">
                {/* Balances Card */}
                <div className="bg-[#1e1e1e]/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-gray-800 flex flex-col justify-center">
                    <h2 className="text-xl font-bold text-gray-400 mb-2">{t('fiatBalance')}</h2>
                    <div className="text-5xl font-extrabold text-white mb-8">
                        ${fiatBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>

                    <h2 className="text-xl font-bold text-gray-400 mb-2">{t('cryptoBalance')} (BTC)</h2>
                    <div className="text-3xl font-bold text-[#F7931A]">
                        {cryptoBalance.toFixed(8)}
                    </div>
                </div>

                {/* Deposit Flow Component */}
                <div className="flex flex-col items-center justify-center">
                    <DepositFlow onDepositComplete={handleDepositComplete} />
                </div>
            </div>
        </main>
    );
}
