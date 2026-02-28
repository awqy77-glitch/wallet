export default function Footer() {
    return (
        <footer className="bg-[#0a0a0a] border-t border-gray-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-[#F7931A] flex items-center justify-center">
                                <span className="text-[#121212] font-black text-xl leading-none">B</span>
                            </div>
                            <span className="text-2xl font-extrabold text-[#F7931A] tracking-tight">BitWallet</span>
                        </div>
                        <p className="text-gray-400 max-w-sm">
                            The premier platform to exchange your Crypto for Fiat anywhere in the world, securely and instantly.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-white font-bold mb-4">Platform</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-[#F7931A]">Exchange</a></li>
                            <li><a href="#" className="hover:text-[#F7931A]">Wallet</a></li>
                            <li><a href="#" className="hover:text-[#F7931A]">Markets</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white font-bold mb-4">Support</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-[#F7931A]">Help Center</a></li>
                            <li><a href="#" className="hover:text-[#F7931A]">Fees</a></li>
                            <li><a href="#" className="hover:text-[#F7931A]">Security</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm">
                    <p>© {new Date().getFullYear()} BitWallet. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white">Privacy Policy</a>
                        <a href="#" className="hover:text-white">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
