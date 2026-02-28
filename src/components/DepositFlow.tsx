'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslations } from 'next-intl';

export default function DepositFlow({
    onDepositComplete
}: {
    onDepositComplete: (amount: number) => void
}) {
    const t = useTranslations('Dashboard');
    const [amount, setAmount] = useState<number>(0.1);
    const [simulating, setSimulating] = useState(false);
    const [btcPrice, setBtcPrice] = useState<number | null>(null);

    const platformAddress = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7";

    useEffect(() => {
        // Fetch live BTC price from CoinGecko
        const fetchPrice = async () => {
            try {
                const response = await axios.get(
                    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
                );
                setBtcPrice(response.data.bitcoin.usd);
            } catch (error) {
                console.error("Failed to fetch CoinGecko API", error);
                setBtcPrice(65000); // Fallback mock price
            }
        };
        fetchPrice();
        const interval = setInterval(fetchPrice, 30000); // 30s updates
        return () => clearInterval(interval);
    }, []);

    const handleSimulateDeposit = async () => {
        setSimulating(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Calculate final fiat value
        const currentPrice = btcPrice || 65000;
        const fiatValue = amount * currentPrice;

        // Optional: Call Supabase here to securely update the database in a real app
        // e.g. await supabase.from('balances').update({ fiat: currentFiat + fiatValue })

        onDepositComplete(fiatValue);
        setSimulating(false);

        alert(`Successfully deposited ${amount} BTC. Converted to $${fiatValue.toFixed(2)} USD!`);
    };

    return (
        <div className="bg-[#1e1e1e]/60 backdrop-blur-md border border-gray-700 p-6 rounded-2xl w-full max-w-lg mt-8 shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-4">
                {t('deposit')} (BTC)
            </h3>

            <div className="bg-black/50 p-4 rounded-xl mb-6 break-all">
                <p className="text-gray-400 text-sm mb-1">{t('depositAddress')}:</p>
                <p className="font-mono text-[#F7931A] text-lg font-bold">
                    {platformAddress}
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Amount to Deposit (BTC)
                    </label>
                    <input
                        type="number"
                        value={amount}
                        step="0.01"
                        min="0.01"
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full bg-[#2a2a2a] text-white border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F7931A]"
                    />
                </div>

                <div className="flex justify-between items-center text-sm bg-[#121212]/50 p-3 rounded-lg border border-gray-700">
                    <span className="text-gray-400">Live Rate (BTC/USD):</span>
                    <span className="text-white font-bold">
                        ${btcPrice ? btcPrice.toLocaleString() : 'Loading...'}
                    </span>
                </div>

                <div className="flex justify-between items-center text-md font-bold text-[#F7931A] px-2">
                    <span>Estimated Fiat Yield:</span>
                    <span>
                        ${btcPrice ? (amount * btcPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '...'}
                    </span>
                </div>

                <button
                    onClick={handleSimulateDeposit}
                    disabled={simulating || !btcPrice}
                    className="w-full mt-4 bg-[#F7931A] hover:bg-[#e08516] disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-all hover:scale-[1.02] shadow-lg"
                >
                    {simulating ? 'Processing...' : t('simulateDeposit')}
                </button>
            </div>
        </div>
    );
}
