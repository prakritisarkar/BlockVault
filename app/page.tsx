"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Shield, Activity, Clock, FileLock2, BrainCircuit, Server, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-8 pb-20 md:pt-12 md:pb-32 flex items-center justify-center min-h-[85vh]">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="container px-4 md:px-8 mx-auto text-center z-10 space-y-8 max-w-5xl"
        >
          <Badge variant="outline" className="px-4 py-1.5 border-primary/50 text-primary bg-primary/10 rounded-full mb-4">
            New: Credit Credential SBTs Live
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-glow">
            Turn Blockchain History Into <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#d4a373]">Borrowing Power</span>
          </h1>
          <p className="text-xl text-muted-foreground md:text-2xl max-w-2xl mx-auto leading-relaxed">
            BlockVault verifies past financial behavior using cryptographic proof, not identity or credit bureaus.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <div className="rounded-xl">
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <Button size="lg" className="h-14 px-8 w-full sm:w-[240px] text-lg font-semibold bg-white text-black hover:bg-gray-200" onClick={openConnectModal}>
                    Connect Wallet <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                )}
              </ConnectButton.Custom>
            </div>
            <Link href="/verify" className="w-full sm:w-auto">
              <Button size="lg" className="h-14 px-8 w-full sm:w-[240px] text-lg font-semibold bg-white text-black hover:bg-gray-200">
                Verify Wallet <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section id="about" className="py-24 border-t border-border/30 bg-black/40 relative">
        <div className="container px-4 md:px-8 mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="flex flex-col md:flex-row gap-12 items-center"
          >
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">The DeFi Inefficiency</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                DeFi lending platforms require massive over-collateralization because they treat every address as a fresh, unknown entity. They cannot see your reliable past behavior.
              </p>
            </div>
            <div className="flex-1 w-full relative">
              <Card className="border-red-900/30 bg-black/60 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-gray-400 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-red-400" />
                    Standard DeFi Lending
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center p-6 bg-red-950/20 rounded-lg border border-red-900/50">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">You Want to Borrow</p>
                      <p className="text-2xl font-mono font-bold text-white">$100</p>
                    </div>
                    <ArrowRight className="text-red-500" />
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Required to Lock</p>
                      <p className="text-2xl font-mono font-bold text-red-500">$150</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solution Section Update based on Mock */}
      <section className="py-24 relative bg-[#000000]">
        <div className="container px-4 md:px-8 mx-auto max-w-7xl">
          <div className="text-center mb-20 space-y-6">
            <p className="font-mono text-sm tracking-widest text-[#555] font-semibold uppercase">
              [02] AI Analysis
            </p>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              <span className="text-white">The AI Agent Scans Your</span> <br />
              <span className="text-[#555]">On-Chain Behavior</span>
            </h2>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { stage: "STAGE 01", title: "Transaction History", icon: Clock, text: "AI indexes all wallet transactions across chains and identifies behavioral patterns." },
              { stage: "STAGE 02", title: "Risk Assessment", icon: Activity, text: "ML models analyze repayment patterns, position maintenance, and liquidity events." },
              { stage: "STAGE 03", title: "Reputation Score", icon: Server, text: "Generates verifiable credit score based on cryptographically auditable behavior." },
              { stage: "STAGE 04", title: "Proof Generation", icon: Shield, text: "Cryptographic proof created without exposing sensitive transaction details." },
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeIn} className="h-full">
                <Card className="h-full bg-[#050505] border-[#1a1a1a] rounded-3xl p-4 transition-colors hover:border-[#333]">
                  <CardHeader className="p-4">
                    <p className="font-mono text-xs text-[#555] mb-6 uppercase tracking-wider">{feature.stage}</p>
                    <div className="w-12 h-12 rounded-xl border border-[#222] flex items-center justify-center mb-6 bg-[#0a0a0a]">
                      <feature.icon className="h-5 w-5 text-gray-400" />
                    </div>
                    <CardTitle className="text-xl text-white font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0">
                    <p className="text-base text-gray-500 leading-relaxed">{feature.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Architecture Div */}
      <section id="how-it-works" className="py-24 border-t border-border/30 bg-black/40">
        <div className="container px-4 md:px-8 mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How BlockVault Works</h2>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0"
          >
            {[
              { title: "AI Agent", icon: BrainCircuit, text: "Analyzes History" },
              { title: "Rust Relayer", icon: Server, text: "Generates Storage Proofs" },
              { title: "Smart Contract", icon: Cpu, text: "Verifies Proofs On-Chain" },
              { title: "Credit Credential", icon: FileLock2, text: "Mints SBT (Verified)" }
            ].map((step, i, arr) => (
              <div key={i} className="flex flex-col md:flex-row items-center w-full">
                <div className="flex flex-col items-center text-center space-y-4 flex-1">
                  <div className="w-20 h-20 rounded-2xl bg-border/20 border border-border flex items-center justify-center glow-cyan">
                    <step.icon className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.text}</p>
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground/50 flex-shrink-0" />
                )}
                {i < arr.length - 1 && (
                  <ArrowRight className="md:hidden block h-6 w-6 text-muted-foreground/50 rotate-90 my-4" />
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Demo Preview Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/10 blur-[150px] rounded-t-full pointer-events-none" />
        <div className="container px-4 md:px-8 mx-auto max-w-7xl text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">See the Difference</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Compare a normal DeFi interaction against a BlockVault verified transaction.
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-8 text-left">
              <Card className="border-border/40 bg-card/30 backdrop-blur pt-6">
                <CardContent className="space-y-6">
                  <Badge variant="outline" className="text-gray-400 border-gray-600 bg-gray-900">Normal User</Badge>
                  <div className="flex justify-between items-end border-b border-border pb-4">
                    <p className="text-muted-foreground">Borrow Amount:</p>
                    <p className="text-2xl font-mono">100 USDC</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="text-muted-foreground">Required Collateral:</p>
                    <p className="text-2xl font-mono text-red-400">150 ETH</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/40 bg-primary/5 backdrop-blur pt-6 glow-cyan ring-1 ring-primary/20">
                <CardContent className="space-y-6">
                  <Badge variant="outline" className="text-primary border-primary/50 bg-primary/10">BlockVault Verified</Badge>
                  <div className="flex justify-between items-end border-b border-border/50 pb-4">
                    <p className="text-muted-foreground">Borrow Amount:</p>
                    <p className="text-2xl font-mono text-white">100 USDC</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="text-muted-foreground text-primary/80">Required Collateral:</p>
                    <p className="text-2xl font-mono text-primary font-bold drop-shadow-md">110 ETH</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="pt-12">
              <Link href="/simulator">
                <Button size="lg" className="h-14 px-8 text-lg font-semibold bg-white text-black hover:bg-gray-200">
                  Try the Simulator
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}