'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslations } from 'next-intl';

export default function DepositFlow({
    onDepositComplete
}: {
    onDepositComplete: (fiatYield: number, cryptoAmount: number) => void
}) {
    const t = useTranslations('Dashboard');
    const [amountStr, setAmountStr] = useState<string>("0.1");
    const [simulating, setSimulating] = useState(false);
    const [btcPrice, setBtcPrice] = useState<number | null>(null);
    const [step, setStep] = useState<'input' | 'payment'>('input');
    const [copied, setCopied] = useState(false);

    // Provide a static wallet address for the demo, in real life this could be dynamically generated via an API
    const platformAddress = "0x8920...E7";
    const fullAddress = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7";

    const numAmount = parseFloat(amountStr) || 0;

    useEffect(() => {
        const fetchPrice = async () => {
            try {
                const response = await axios.get(
                    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
                );
                setBtcPrice(response.data.bitcoin.usd);
            } catch (error) {
                console.error("Failed to fetch CoinGecko API", error);
                setBtcPrice(65000);
            }
        };
        fetchPrice();
        const interval = setInterval(fetchPrice, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleStartDeposit = () => {
        if (numAmount > 0) {
            setStep('payment');
        }
    };

    const handleConfirmPayment = async () => {
        setSimulating(true);

        // Simulate network/blockchain verification delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        setSimulating(false);

        // As requested: Trigger an error because the server listener is not yet connected to the blockchain.
        alert("Transaction not found. Our blockchain node hasn't detected a transfer to this address yet. Please wait a few more minutes or verify the transaction hash.");
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(fullAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Enforce numeric mask but allow text keyboard on mobile
        let val = e.target.value.replace(/,/g, '.'); // Swap commas for dots
        val = val.replace(/[^0-9.]/g, ''); // Strip non-numeric/dots

        // Prevent multiple dots
        const parts = val.split('.');
        if (parts.length > 2) {
            val = parts[0] + '.' + parts.slice(1).join('');
        }

        setAmountStr(val);
    };

    return (
        <div className="bg-[#1e1e1e]/60 backdrop-blur-md border border-gray-700 p-6 rounded-2xl w-full max-w-lg shadow-xl flex flex-col justify-center h-full min-h-[400px]">
            <h3 className="text-2xl font-bold text-white mb-6">
                {step === 'input' ? 'Make a Deposit' : 'Send Payment'}
            </h3>

            {step === 'input' && (
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Amount to Deposit (BTC)
                        </label>
                        <input
                            type="text"
                            inputMode="text"
                            value={amountStr}
                            onChange={handleAmountChange}
                            placeholder="0.00"
                            className="w-full bg-[#2a2a2a] text-white border border-gray-600 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#F7931A]"
                        />
                    </div>

                    <div className="flex justify-between items-center text-sm bg-[#121212]/50 p-4 rounded-xl border border-gray-700">
                        <span className="text-gray-400">Live Rate (BTC/USD):</span>
                        <span className="text-white font-bold text-base">
                            ${btcPrice ? btcPrice.toLocaleString() : 'Loading...'}
                        </span>
                    </div>

                    <div className="flex justify-between items-center text-md font-bold text-green-400 px-2">
                        <span>You will receive approximately:</span>
                        <span className="text-xl">
                            ${btcPrice ? (numAmount * btcPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '...'}
                        </span>
                    </div>

                    <button
                        onClick={handleStartDeposit}
                        disabled={!btcPrice || numAmount <= 0}
                        className="w-full mt-6 bg-white text-black hover:bg-gray-200 disabled:opacity-50 font-bold py-4 px-6 rounded-xl transition-all hover:scale-[1.02] shadow-lg text-lg"
                    >
                        Continue to Payment
                    </button>
                </div>
            )}

            {step === 'payment' && (
                <div className="space-y-6 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">

                    <div className="text-center">
                        <p className="text-gray-400 mb-2">Please send exactly:</p>
                        <div className="text-4xl font-extrabold text-[#F7931A]">
                            {numAmount} <span className="text-2xl text-white">BTC</span>
                        </div>
                    </div>

                    <div className="w-full bg-black/60 border border-gray-700 p-5 rounded-2xl">
                        <p className="text-gray-400 text-sm mb-3">To this Bitcoin Address:</p>
                        <div className="flex items-center justify-between bg-[#2a2a2a] p-3 rounded-xl">
                            <span className="font-mono text-white text-sm break-all mr-3">
                                {fullAddress}
                            </span>
                            <button
                                onClick={copyToClipboard}
                                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm text-white font-medium transition-colors shrink-0"
                            >
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>

                    <div className="w-full p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                        <p className="text-yellow-400 text-xs text-center">
                            Note: The transfer will be credited to your account as soon as 1 network confirmation is reached.
                        </p>
                    </div>

                    <div className="flex gap-3 w-full mt-4">
                        <button
                            onClick={() => setStep('input')}
                            className="flex-1 bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-800 font-bold py-4 px-6 rounded-xl transition-all"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleConfirmPayment}
                            disabled={simulating}
                            className="border-2 border-[#F7931A] text-[#F7931A] hover:bg-[#F7931A] hover:text-white disabled:opacity-50 font-bold py-4 px-6 rounded-xl transition-all hover:scale-[1.02] shadow-lg flex-[2]"
                        >
                            {simulating ? 'Verifying Block...' : 'I have made the transfer'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
