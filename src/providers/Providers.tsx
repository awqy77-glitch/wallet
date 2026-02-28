'use client';

import * as React from 'react';
import {
    RainbowKitProvider,
    getDefaultConfig,
    darkTheme,
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import {
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
} from 'wagmi/chains';
import { NextIntlClientProvider } from 'next-intl';

const config = getDefaultConfig({
    appName: 'BitWallet Global Crypto Exchange',
    projectId: '2f2e51dd6fdcd816eeb0c1eaea5c38ac', // Example project ID
    chains: [mainnet, polygon, optimism, arbitrum, base],
    ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

interface ProvidersProps {
    children: React.ReactNode;
    locale: string;
    messages: any;
}

export function Providers({ children, locale, messages }: ProvidersProps) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    theme={darkTheme({
                        accentColor: '#F7931A',
                        accentColorForeground: 'white',
                        borderRadius: 'large',
                    })}
                >
                    <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
                        {children}
                    </NextIntlClientProvider>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
