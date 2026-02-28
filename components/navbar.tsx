"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full bg-[#000000]">
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
                        {({ openConnectModal }) => (
                            <button
                                onClick={openConnectModal}
                                className="px-5 py-2 text-sm font-medium border border-[#333] hidden md:block rounded-xl text-white bg-transparent hover:bg-[#111] transition-colors"
                            >
                                Connect
                            </button>
                        )}
                    </ConnectButton.Custom>
                </div>

            </div>
        </header>
    );
}
