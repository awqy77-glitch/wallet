'use client';

import { TypeAnimation } from 'react-type-animation';

export default function HeroTypewriter() {
    return (
        <span className="text-[#F7931A] font-bold block mt-2 sm:mt-0 font-medium whitespace-pre-wrap">
            <TypeAnimation
                sequence={[
                    'Buy and Sell Crypto for Cash instantly.', 1500,
                    'Compre e Venda Cripto por Dinheiro instantaneamente.', 1500,
                    'Compra y Vende Crypto por Efectivo al instante.', 1500,
                    'Achetez et Vendez des Cryptos contre des Espèces.', 1500,
                    '买卖加密货币即刻变现.', 1500,
                    'شراء وبيع العملات الرقمية نقداً.', 1500
                ]}
                wrapper="span"
                cursor={true}
                repeat={Infinity}
                speed={75}
                deletionSpeed={85}
            />
        </span>
    );
}
