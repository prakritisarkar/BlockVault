"use client";

import Link from "next/link";
import { Clock, Crosshair, Diamond, Star } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* Subtle Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(255,255,255,0.04),transparent_40%)] pointer-events-none" />

      {/* NAVBAR */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6 border-b border-white/5">
        <Link href="/" className="text-xl font-semibold tracking-wide">
          BlockVault
        </Link>

        <div className="hidden md:flex gap-10 text-sm text-gray-400">
          <Link href="/how-it-works" className="hover:text-white transition">
            Analysis
          </Link>
          <span className="hover:text-white transition cursor-pointer">
            Demo
          </span>
          <span className="hover:text-white transition cursor-pointer">
            Docs
          </span>
        </div>

        <button className="px-6 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition">
          Connect
        </button>
      </nav>

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">

        {/* Section Label */}
        <p className="text-center text-gray-500 tracking-[0.3em] text-sm mb-6">
          [02] AI ANALYSIS
        </p>

        {/* Headline */}
        <h1 className="text-center text-4xl md:text-7xl font-bold leading-tight mb-20">
          <span className="block">
            The AI Agent Scans Your
          </span>
          <span className="block text-gray-500">
            On-Chain Behavior
          </span>
        </h1>

        {/* STAGES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* CARD 1 */}
          <div className="border border-white/10 rounded-2xl p-8 bg-white/[0.02] backdrop-blur-md hover:border-white/20 hover:-translate-y-2 transition-all duration-300">
            <p className="text-gray-500 text-xs tracking-widest mb-8">
              STAGE 01
            </p>

            <div className="w-12 h-12 flex items-center justify-center border border-white/20 rounded-xl mb-6">
              <Clock size={18} />
            </div>

            <h3 className="text-lg font-semibold mb-4">
              Transaction History
            </h3>

            <p className="text-gray-400 text-sm leading-relaxed">
              AI indexes wallet transactions across chains and identifies
              behavioral patterns from historical on-chain activity.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="border border-white/10 rounded-2xl p-8 bg-white/[0.02] backdrop-blur-md hover:border-white/20 hover:-translate-y-2 transition-all duration-300">
            <p className="text-gray-500 text-xs tracking-widest mb-8">
              STAGE 02
            </p>

            <div className="w-12 h-12 flex items-center justify-center border border-white/20 rounded-xl mb-6">
              <Crosshair size={18} />
            </div>

            <h3 className="text-lg font-semibold mb-4">
              Risk Assessment
            </h3>

            <p className="text-gray-400 text-sm leading-relaxed">
              ML models analyze repayment patterns, collateral health,
              liquidation survival, and liquidity management.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="border border-white/10 rounded-2xl p-8 bg-white/[0.02] backdrop-blur-md hover:border-white/20 hover:-translate-y-2 transition-all duration-300">
            <p className="text-gray-500 text-xs tracking-widest mb-8">
              STAGE 03
            </p>

            <div className="w-12 h-12 flex items-center justify-center border border-white/20 rounded-xl mb-6">
              <Diamond size={18} />
            </div>

            <h3 className="text-lg font-semibold mb-4">
              Reputation Score
            </h3>

            <p className="text-gray-400 text-sm leading-relaxed">
              Generates a verifiable credit score based on
              cryptographically auditable on-chain behavior.
            </p>
          </div>

          {/* CARD 4 */}
          <div className="border border-white/10 rounded-2xl p-8 bg-white/[0.02] backdrop-blur-md hover:border-white/20 hover:-translate-y-2 transition-all duration-300">
            <p className="text-gray-500 text-xs tracking-widest mb-8">
              STAGE 04
            </p>

            <div className="w-12 h-12 flex items-center justify-center border border-white/20 rounded-xl mb-6">
              <Star size={18} />
            </div>

            <h3 className="text-lg font-semibold mb-4">
              Proof Generation
            </h3>

            <p className="text-gray-400 text-sm leading-relaxed">
              A Rust relayer generates Merkle storage proofs without
              exposing sensitive transaction details.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}