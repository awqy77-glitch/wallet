'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { ArrowRightLeft } from 'lucide-react';

export default function HomeCalculator() {
    const t = useTranslations('HomePage');
    const [amount, setAmount] = useState<number>(1);
    const [btcPrice, setBtcPrice] = useState<number | null>(null);

    useEffect(() => {
        const fetchPrice = async () => {
            try {
                const response = await axios.get(
                    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
                );
                setBtcPrice(response.data.bitcoin.usd);
            } catch (error) {
                setBtcPrice(65000);
            }
        };
        fetchPrice();
    }, []);

    const totalFiat = btcPrice ? amount * btcPrice : 0;

    return (
        <div className="w-full flex justify-center py-10">
            <div className="w-full max-w-md bg-gradient-to-br from-[#F7931A] to-[#d67b10] rounded-3xl p-1 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <div className="bg-[#121212] rounded-[22px] p-8 w-full h-full">
                    <h3 className="text-2xl font-bold text-white mb-2">{t('calcTitle')}</h3>
                    <p className="text-sm text-gray-400 mb-8">{t('calcDesc')}</p>

                    <div className="space-y-6">
                        {/* You Send */}
                        <div className="bg-[#1e1e1e] rounded-xl p-4 border border-gray-800">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">You Send (BTC)</label>
                            <div className="flex items-center justify-between">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    className="bg-transparent text-3xl font-bold text-white w-full outline-none focus:ring-0"
                                />
                                <div className="flex items-center gap-2 bg-[#2a2a2a] px-3 py-1 rounded-lg">
                                    <div className="w-6 h-6 rounded-full bg-[#F7931A] flex items-center justify-center text-xs font-bold text-black border border-white/20">₿</div>
                                    <span className="text-white font-bold">BTC</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center -my-3 relative z-10">
                            <div className="bg-[#F7931A] text-white p-2 rounded-full border-4 border-[#121212]">
                                <ArrowRightLeft className="w-5 h-5 rotate-90" />
                            </div>
                        </div>

                        {/* You Receive */}
                        <div className="bg-[#1e1e1e] rounded-xl p-4 border border-[#F7931A]/30">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">You Receive (USD)</label>
                            <div className="flex items-center justify-between">
                                <div className="text-3xl font-bold text-[#F7931A] truncate max-w-[200px]">
                                    ${totalFiat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <div className="flex items-center gap-2 bg-[#2a2a2a] px-3 py-1 rounded-lg">
                                    <span className="text-xl">💵</span>
                                    <span className="text-white font-bold">USD</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 text-center text-xs text-gray-500 flex justify-between">
                        <span>Live Rate: 1 BTC = ${btcPrice?.toLocaleString() ?? '...'}</span>
                        <span>No hidden fees</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
