'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export default function Navbar() {
    const t = useTranslations('HomePage');
    const params = useParams();
    const locale = params?.locale || 'en';

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#121212]/80 backdrop-blur-md border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <Link href={`/${locale}`} className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#F7931A] flex items-center justify-center">
                                <span className="text-[#121212] font-black text-xl leading-none">B</span>
                            </div>
                            <span className="text-2xl font-extrabold text-white tracking-tight">BitWallet</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/${locale}/login`}
                            className="bg-[#1e1e1e] hover:bg-[#333333] border border-gray-700 text-white font-bold py-2 px-6 rounded-full transition-all"
                        >
                            {t('login')}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
