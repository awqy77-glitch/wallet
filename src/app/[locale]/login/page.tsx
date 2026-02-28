'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import ThreeBackground from '@/components/ThreeBackground';
import { useAccount } from 'wagmi';
import { useEffect } from 'react';
import Link from 'next/link';

export default function LoginPage({ params }: { params: { locale: string } }) {
    const t = useTranslations('HomePage');
    const router = useRouter();
    const supabase = createClient();
    const { isConnected } = useAccount();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Use locale from params or default to 'en'
    const currentLocale = params?.locale || 'en';

    useEffect(() => {
        // If Web3 wallet connects, redirect to dashboard automatically
        if (isConnected) {
            router.push(`/${currentLocale}/dashboard`);
        }
    }, [isConnected, router, currentLocale]);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push(`/${currentLocale}/dashboard`);
        }
    };

    const handleSignUp = async () => {
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            alert("Check your email for the confirmation link!");
        }
        setLoading(false);
    };

    return (
        <main className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <ThreeBackground />

            <div className="z-10 max-w-md w-full space-y-8 bg-[#1e1e1e]/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-gray-800">
                <div>
                    <h2 className="mt-2 text-center text-4xl font-extrabold text-white">
                        <Link href="/" className="text-[#F7931A] hover:text-[#e08516] transition-colors">BitWallet</Link>
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Sign in to your account
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-700 placeholder-gray-500 text-white bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-[#F7931A] focus:border-transparent sm:text-sm transition-all"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-700 placeholder-gray-500 text-white bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-[#F7931A] focus:border-transparent sm:text-sm transition-all"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[#F7931A] hover:bg-[#e08516] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#121212] focus:ring-[#F7931A] transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                        <button
                            type="button"
                            onClick={handleSignUp}
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-[#F7931A] text-sm font-bold rounded-xl text-[#F7931A] bg-transparent hover:bg-[#F7931A]/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#121212] focus:ring-[#F7931A] transition-colors disabled:opacity-50"
                        >
                            Sign up
                        </button>
                    </div>
                </form>

                <div className="mt-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[#1e1e1e] text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <ConnectButton
                            label="Connect Wallet"
                            accountStatus="address"
                            showBalance={false}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
