"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ShieldAlert, BadgeCheck, FileLock2, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SimulatorPage() {
    const [borrowAmount, setBorrowAmount] = useState<number[]>([100]);
    const [showCredential, setShowCredential] = useState(false);

    const calculateNormalCollateral = (amount: number) => Math.round(amount * 1.5);
    const calculateVerifiedCollateral = (amount: number) => Math.round(amount * 1.1);

    return (
        <div className="container px-4 md:px-8 py-16 mx-auto max-w-5xl min-h-[calc(100vh-140px)]">

            <div className="text-center mb-16 space-y-4">
                <Badge variant="outline" className="px-4 py-1.5 border-primary/50 text-white bg-primary/20 rounded-full mb-4">
                    Interactive Demo
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Lending Simulator</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    See exactly how a BlockVault Credit Credential reduces your collateral requirements across lending protocols.
                </p>
            </div>

            <div className="mb-16">
                <label className="text-lg font-medium text-white mb-6 block text-center">
                    Amount to Borrow (USDC)
                </label>
                <div className="max-w-xl mx-auto flex items-center gap-6">
                    <span className="text-xl font-mono text-muted-foreground">$10</span>
                    <Slider
                        value={borrowAmount}
                        onValueChange={setBorrowAmount}
                        max={1000}
                        min={10}
                        step={10}
                        className="flex-1 cursor-pointer"
                    />
                    <span className="text-xl font-mono text-white glow-cyan">${borrowAmount[0]}</span>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="h-full"
                >
                    <Card className="h-full border-border/40 bg-card/30 backdrop-blur">
                        <CardHeader className="text-center border-b border-border/40 pb-6 mb-6">
                            <div className="mx-auto w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-600">
                                <ShieldAlert className="h-6 w-6 text-gray-400" />
                            </div>
                            <CardTitle className="text-2xl text-gray-300">Normal User</CardTitle>
                            <CardDescription className="text-gray-500">Unverified / Anonymous</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="flex justify-between items-center text-lg">
                                <span className="text-muted-foreground">LTV Ratio:</span>
                                <span className="font-mono text-gray-300">66.6%</span>
                            </div>
                            <div className="flex justify-between items-center text-lg">
                                <span className="text-muted-foreground">Borrow Amount:</span>
                                <span className="font-mono text-white">${borrowAmount[0]}</span>
                            </div>
                            <div className="pt-6 border-t border-border/40">
                                <p className="text-sm text-red-400 mb-2 flex items-center gap-1"><Info className="h-4 w-4" /> Requires 150% Collateral</p>
                                <div className="flex justify-between items-end">
                                    <span className="text-muted-foreground text-xl">Required Lock:</span>
                                    <span className="text-4xl font-mono font-bold text-red-500">
                                        ${calculateNormalCollateral(borrowAmount[0])}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="h-full"
                >
                    <Card className="h-full border-primary/40 bg-primary/5 backdrop-blur glow-cyan ring-1 ring-primary/20 relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-[60px] pointer-events-none" />
                        <CardHeader className="text-center border-b border-primary/20 pb-6 mb-6">
                            <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4 border border-primary/50 text-glow">
                                <BadgeCheck className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="text-2xl text-primary drop-shadow-sm">BlockVault Verified</CardTitle>
                            <CardDescription className="text-primary/70">Cryptographic History Proof</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="flex justify-between items-center text-lg">
                                <span className="text-muted-foreground">LTV Ratio:</span>
                                <span className="font-mono text-primary font-medium">90.9%</span>
                            </div>
                            <div className="flex justify-between items-center text-lg">
                                <span className="text-muted-foreground text-primary/80">Borrow Amount:</span>
                                <span className="font-mono text-white drop-shadow-sm">${borrowAmount[0]}</span>
                            </div>
                            <div className="pt-6 border-t border-primary/20">
                                <p className="text-sm text-[#d4a373] mb-2 flex items-center gap-1"><BadgeCheck className="h-4 w-4" /> Requires 110% Collateral</p>
                                <div className="flex justify-between items-end">
                                    <span className="text-muted-foreground text-primary/80 text-xl">Required Lock:</span>
                                    <span className="text-4xl font-mono font-bold text-primary drop-shadow-md">
                                        ${calculateVerifiedCollateral(borrowAmount[0])}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <div className="mt-16 text-center">
                {!showCredential ? (
                    <Button
                        size="lg"
                        className="h-16 px-10 text-xl font-bold bg-white text-black hover:bg-gray-200 shadow-xl shadow-white/10"
                        onClick={() => setShowCredential(true)}
                    >
                        Mint Credit Credential
                    </Button>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md mx-auto"
                    >
                        <Card className="border-primary/50 bg-black backdrop-blur glow-cyan overflow-hidden relative">
                            <div className="absolute inset-0 bg-grid-pattern opacity-30" />
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/30 blur-[40px]" />
                            <CardHeader className="text-left relative z-10 border-b border-border/50 pb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <Shield className="h-8 w-8 text-primary" />
                                    <Badge variant="outline" className="border-primary text-primary bg-primary/10 tracking-widest uppercase text-[10px]">
                                        Non-Transferable SBT
                                    </Badge>
                                </div>
                                <CardTitle className="text-2xl tracking-widest text-white uppercase mt-4">Credit Credential</CardTitle>
                                <CardDescription className="text-primary/70">BlockVault Certified Reputation</CardDescription>
                            </CardHeader>
                            <CardContent className="text-left relative z-10 pt-6 space-y-4 font-mono">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest">Owner Address</p>
                                    <p className="text-sm sm:text-base text-gray-300">0x742d...44e</p>
                                </div>
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest">Issued Block</p>
                                        <p className="text-sm text-gray-300">19432881</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest">Status</p>
                                        <p className="text-sm text-primary font-bold flex items-center justify-end gap-1"><FileLock2 className="h-3 w-3" /> VERIFIED</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>

        </div>
    );
}
