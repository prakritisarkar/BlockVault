"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Shield, ShieldCheck, Activity, Clock, CheckCircle2, AlertTriangle, FileLock2, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function VerifyPage() {
    const [address, setAddress] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [proofVisible, setProofVisible] = useState(false);

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        if (!address.trim()) return;

        setStatus("loading");
        setProofVisible(false);

        setTimeout(() => {
            // Fake logic: if it starts with 0x0... treat as error
            if (address.toLowerCase().startsWith("0x000")) {
                setStatus("error");
            } else {
                setStatus("success");
            }
        }, 3500);
    };

    return (
        <div className="container px-4 md:px-8 py-20 mx-auto max-w-4xl min-h-[calc(100vh-140px)] flex flex-col items-center mt-10">

            <div className="text-center mb-16 space-y-6">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
                    Verify Wallet<br />Reputation
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Enter a public wallet address to check its verified on-chain financial reliability.
                </p>
            </div>

            <div className="w-full max-w-3xl mb-12">
                <Card className="bg-[#050505] border-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl">
                    <CardContent className="p-8 md:p-10">
                        <form onSubmit={handleVerify} className="space-y-4">
                            <label className="text-sm font-semibold text-white block mb-2">Wallet Address</label>
                            <div className="flex flex-col md:flex-row gap-4">
                                <Input
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="0x0000...Enter public wallet address"
                                    className="flex-1 h-14 text-base bg-[#0a0a0a] border-[#222222] text-gray-300 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 px-4 placeholder:text-gray-600"
                                />
                                <Button
                                    type="submit"
                                    disabled={status === "loading" || !address}
                                    className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-base transition-colors border-0"
                                >
                                    Check Reputation
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <div className="w-full max-w-3xl">
                <AnimatePresence mode="wait">
                    {status === "idle" && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center text-muted-foreground mt-8"
                        >
                            <Shield className="h-16 w-16 mx-auto mb-4 opacity-20" />
                            <p>Cryptographically secured verifications.</p>
                        </motion.div>
                    )}

                    {status === "loading" && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center justify-center p-12 bg-card/20 rounded-3xl border border-border/30 backdrop-blur"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                className="w-16 h-16 border-t-2 border-r-2 border-white rounded-full mb-6"
                            />
                            <motion.p
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="text-xl font-medium text-white"
                            >
                                Scanning blockchain history & generating proof...
                            </motion.p>
                            <div className="mt-8 space-y-2 w-full max-w-md">
                                <div className="h-2 w-full bg-border/50 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 3.5, ease: "easeInOut" }}
                                        className="h-full bg-blue-600"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground font-mono flex justify-between">
                                    <span>Querying Archival Node</span>
                                    <span>Generating snark...</span>
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {status === "error" && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <Card className="border-red-500/30 bg-red-950/10 backdrop-blur w-full">
                                <CardHeader className="text-center pb-2">
                                    <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                                        <AlertTriangle className="h-8 w-8 text-red-500" />
                                    </div>
                                    <CardTitle className="text-2xl text-red-400">Verification Failed</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-muted-foreground">
                                        This wallet has insufficient transaction history or does not meet the minimum requirements for a credit credential.
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {status === "success" && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <Card className="border-border/40 bg-[#050505] w-full overflow-hidden relative shadow-2xl rounded-3xl">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] -mr-20 -mt-20 pointer-events-none" />

                                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/30 bg-[#0a0a0a]">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg font-medium text-muted-foreground">Wallet Profile</CardTitle>
                                        <p className="font-mono text-xl text-white break-all">{address.slice(0, 10)}...{address.slice(-8)}</p>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <p className="text-sm text-muted-foreground mb-2">Reliability Level</p>
                                        <Badge className="bg-white text-black font-bold text-sm px-3 py-1 hover:bg-white/90">HIGH</Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-8">
                                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-white">
                                        <ShieldCheck className="text-blue-500 h-6 w-6" /> Verified Badges
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[
                                            { icon: CheckCircle2, text: "Loan repayments verified" },
                                            { icon: Shield, text: "No liquidation events" },
                                            { icon: Activity, text: "Active wallet history" },
                                            { icon: Clock, text: "Long-term holder (> 2yrs)" }
                                        ].map((badge, i) => (
                                            <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-[#0a0a0a] border border-[#222]">
                                                <badge.icon className="h-5 w-5 text-gray-400" />
                                                <span className="text-sm font-medium text-gray-200">{badge.text}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-border/30">
                                        <Button
                                            variant="outline"
                                            onClick={() => setProofVisible(!proofVisible)}
                                            className="w-full h-16 flex items-center justify-between py-6 group hover:border-gray-500 transition-colors bg-[#0a0a0a] border-[#222]"
                                        >
                                            <span className="flex items-center gap-3 font-semibold text-white">
                                                <FileLock2 className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                                                {proofVisible ? "Hide Cryptographic Verification" : "View Cryptographic Verification"}
                                            </span>
                                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                        </Button>

                                        <AnimatePresence>
                                            {proofVisible && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="mt-4 p-4 rounded-lg bg-black/80 font-mono text-xs sm:text-sm text-[#d4a373] border border-[#d4a373]/30 space-y-2">
                                                        <p className="text-muted-foreground">{'// BlockVault Verification Node Protocol'}</p>
                                                        <p>{'>'} Fetching historical state root...</p>
                                                        <p className="text-white">Block Number: 19432881</p>
                                                        <p>{'>'} Verifying storage slots... [OK]</p>
                                                        <p className="text-white break-all">Storage Slot: 0x8a1b32d...7c81a9f</p>
                                                        <p>{'>'} State Root Matched: TRUE</p>
                                                        <p>{'>'} Executing ZK-SNARK verifier...</p>
                                                        <p className="text-white font-bold">Merkle Proof: VALID</p>
                                                        <p className="text-primary mt-2 flex items-center gap-2">
                                                            <CheckCircle2 className="h-4 w-4" /> Smart Contract Verification Successful
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
