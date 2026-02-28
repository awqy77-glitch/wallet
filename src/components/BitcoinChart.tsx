'use client';

import { useTranslations } from 'next-intl';

export default function BitcoinChart() {
    const t = useTranslations('HomePage');

    return (
        <div className="w-full flex justify-center py-10">
            <div className="w-full max-w-5xl bg-[#1e1e1e]/80 backdrop-blur-md rounded-3xl p-6 border border-gray-800 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#F7931A] animate-pulse"></span>
                    {t('chartTitle')}
                </h3>
                <div className="h-[500px] w-full rounded-xl overflow-hidden bg-black">
                    {/* TradingView Advanced Chart Widget - Zero Dependencies */}
                    <iframe
                        src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_btc&symbol=CRYPTO%3ABTCUSD&interval=D&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&utm_source=&utm_medium=widget&utm_campaign=chart&utm_term=CRYPTO%3ABTCUSD"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        title="Bitcoin Chart"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    );
}
