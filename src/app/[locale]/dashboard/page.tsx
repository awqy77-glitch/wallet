'use client';

import { useTranslations } from 'next-intl';
import { useAccount, useDisconnect } from 'wagmi';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ThreeBackground from '@/components/ThreeBackground';
import DepositFlow from '@/components/DepositFlow';
import axios from 'axios';

export default function DashboardPage({ params }: { params: { locale: string } }) {
    const t = useTranslations('Dashboard');
    const router = useRouter();
    const supabase = createClient();
    const { isConnected, address } = useAccount();
    const { disconnect } = useDisconnect();

    const [fiatBalance, setFiatBalance] = useState<number>(0);
    const [userId, setUserId] = useState<string | null>(null);
    const [cryptoBalance, setCryptoBalance] = useState<number>(0);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [btcPrice, setBtcPrice] = useState<number | null>(null);

    // Use locale from params or default to 'en'
    const currentLocale = params?.locale || 'en';

    useEffect(() => {
        const fetchPrice = async () => {
            try {
                const response = await axios.get(
                    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
                );
                setBtcPrice(response.data.bitcoin.usd);
            } catch (error) {
                console.error("Failed to fetch CoinGecko API", error);
            }
        };
        fetchPrice();
        const interval = setInterval(fetchPrice, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user && !isConnected) {
                // Not logged in via either method
                router.push(`/${currentLocale}/login`);
                return;
            }

            // Unified ID: Supabase ID (if Email auth) or Wallet Address (if Web3 connect)
            const activeId = user?.id || address;

            if (activeId) {
                setUserId(activeId as string);
                if (user) setUserEmail(user.email || null);

                // Fetch real balances from DB
                fetchBalances(activeId as string);
            }
        };
        checkAuth();
    }, [isConnected, address, router, supabase, currentLocale]);

    const fetchBalances = async (uid: string) => {
        const { data, error } = await supabase
            .from('balances')
            .select('fiat, crypto')
            .eq('user_id', uid)
            .single();

        if (data) {
            setFiatBalance(data.fiat || 0);
            setCryptoBalance(data.crypto || 0);
        } else {
            // New user, create initial balances row
            await supabase.from('balances').insert({ user_id: uid, fiat: 0, crypto: 0 });
        }
    };

    const handleDepositComplete = async (fiatYield: number, cryptoDeposited: number) => {
        if (!userId) return;

        // Visual Optimistic Update
        const newCrypto = cryptoBalance + cryptoDeposited;
        setCryptoBalance(newCrypto);
        // Fiat is calculated dynamically so no state update is needed for it here

        // Permanent DB Update
        await supabase
            .from('balances')
            .update({ crypto: newCrypto })
            .eq('user_id', userId);
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

            <div className="z-10 w-full max-w-4xl grid gap-6 md:grid-cols-2 items-stretch min-h-[400px]">
                {/* Balances Card */}
                <div className="bg-[#1e1e1e]/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-gray-800 flex flex-col justify-center h-full">
                    <h2 className="text-xl font-bold text-gray-400 mb-2">{t('fiatBalance')}</h2>
                    <div className="text-5xl font-extrabold text-white mb-8">
                        ${(btcPrice ? cryptoBalance * btcPrice : fiatBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>

                    <h2 className="text-xl font-bold text-gray-400 mb-2">{t('cryptoBalance')} (BTC)</h2>
                    <div className="text-3xl font-bold text-[#F7931A]">
                        {cryptoBalance.toFixed(8)}
                    </div>
                </div>

                {/* Deposit Flow Component */}
                <div className="h-full w-full flex flex-col">
                    <DepositFlow onDepositComplete={handleDepositComplete} />
                </div>
            </div>
        </main>
    );
}
