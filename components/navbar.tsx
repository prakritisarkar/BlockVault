"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full bg-black/40 backdrop-blur-md border-b border-white/5">
            <div className="container flex h-20 items-center justify-between px-4 md:px-8 mx-auto max-w-6xl">

                {/* Logo Section */}
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-2">
                        {/* Custom SVG Icon to match the interlocking squares logo */}
                        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Top Left Square (Opaque White stroke) */}
                            <rect x="4" y="6" width="10" height="10" rx="2" stroke="white" strokeWidth="2" />
                            {/* Center Dot inside Top Left Square */}
                            <circle cx="9" cy="11" r="1.5" fill="white" />

                            {/* Top Right Square (Semi-transparent stroke) */}
                            <rect x="13" y="6" width="10" height="10" rx="2" stroke="white" strokeWidth="2" strokeOpacity="0.5" />

                            {/* Bottom Square (Semi-transparent stroke) */}
                            <rect x="8.5" y="14" width="10" height="10" rx="2" stroke="white" strokeWidth="2" strokeOpacity="0.3" />
                        </svg>
                        <span className="inline-block font-bold text-[22px] tracking-tight text-white ml-1">BlockVault</span>
                    </Link>
                </div>

                {/* Center Links removed as requested */}

                {/* Right Side Connect Button wrapper */}
                <div className="flex flex-1 items-center justify-end">
                    <ConnectButton.Custom>
                        {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                            const ready = mounted;
                            const connected = ready && account && chain;

                            if (!ready) {
                                return (
                                    <button disabled className="px-5 py-2 text-sm font-medium border border-[#333] hidden md:block rounded-xl text-gray-500 bg-transparent cursor-not-allowed">
                                        Loading...
                                    </button>
                                );
                            }

                            if (!connected) {
                                return (
                                    <button
                                        onClick={openConnectModal}
                                        className="px-5 py-2 text-sm font-medium border border-[#333] hidden md:block rounded-xl text-white bg-transparent hover:bg-[#111] transition-colors"
                                    >
                                        Connect
                                    </button>
                                );
                            }

                            return (
                                <div className="hidden md:flex items-center gap-2">
                                    <button
                                        onClick={openChainModal}
                                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-[#333] rounded-xl text-gray-300 bg-transparent hover:bg-[#111] transition-colors"
                                    >
                                        {chain.hasIcon && chain.iconUrl && (
                                            <img src={chain.iconUrl} alt={chain.name ?? ''} className="w-4 h-4 rounded-full" />
                                        )}
                                        {chain.name ?? "Switch"}
                                    </button>
                                    <button
                                        onClick={openAccountModal}
                                        className="px-4 py-2 text-sm font-medium border border-[#333] rounded-xl text-white bg-transparent hover:bg-[#111] transition-colors"
                                    >
                                        {account.displayName}
                                    </button>
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center justify-center w-9 h-9 border border-[#333] rounded-xl text-gray-300 bg-transparent hover:bg-[#111] transition-colors"
                                        title="Dashboard"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="8" r="4" />
                                            <path d="M20 21a8 8 0 0 0-16 0" />
                                        </svg>
                                    </Link>
                                </div>
                            );
                        }}
                    </ConnectButton.Custom>
                </div>

            </div>
        </header>
    );
}
