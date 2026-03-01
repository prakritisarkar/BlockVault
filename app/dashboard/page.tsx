"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Activity, Clock, BadgeCheck, AlertCircle, RefreshCcw, ExternalLink, CheckCircle2, Shield, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";
import { toast } from "sonner";

interface SBTResult {
    txHash: string;
    action: "mint" | "update";
    contractAddress?: string;
    assetId?: number;
    explorerUrl: string;
}

interface ReputationData {
    totalRepays: number;
    liquidations: number;
    reliabilityScore: number;
    lastUpdatedTimestamp: number;
    summaryLogs: string;
}

interface TxItem {
    hash: string;
    timestamp: string;
    transfers?: { to_contract: string; asset: string; value: string; category: string }[];
    type?: string;
    appId?: number;
}

export default function Dashboard() {
    const { address, isConnected } = useAccount();
    const [loading, setLoading] = useState(false);
    const [reputation, setReputation] = useState<ReputationData | null>(null);
    const [transactions, setTransactions] = useState<TxItem[]>([]);
    const [hasFetched, setHasFetched] = useState(false);
    const [lastChecked, setLastChecked] = useState<Date | null>(null);
    const [sbtResult, setSbtResult] = useState<SBTResult | null>(null);
    const [algoSbtResult, setAlgoSbtResult] = useState<SBTResult | null>(null);

    // Deterministic score calc
    const getRepays = () => Math.abs(Number(reputation?.totalRepays ?? 0));
    const getLiquidations = () => Math.abs(Number(reputation?.liquidations ?? 0));
    const getScore = () => (getRepays() * 300) - (getLiquidations() * 500);
    const getReliabilityLevel = () => {
        const s = getScore();
        if (s >= 600) return { label: "HIGH", color: "bg-green-600 text-white" };
        if (s >= 300) return { label: "MEDIUM", color: "bg-yellow-500 text-black" };
        if (s > 0)   return { label: "LOW", color: "bg-orange-500 text-white" };
        if (s === 0) return { label: "NEUTRAL", color: "bg-gray-500 text-white" };
        return { label: "AT RISK", color: "bg-red-600 text-white" };
    };

    const fetchReputation = async () => {
        if (!address) return;
        setLoading(true);
        try {
            // Send address to backend — it handles ALL transaction fetching via Alchemy + Algorand
            const res = await fetch("http://localhost:3001/api/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address, limit: 20 })
            });

            if (!res.ok) {
                toast.error(`Backend error ${res.status}`, { duration: 4000 });
                throw new Error("Backend failed");
            }

            const result = await res.json();
            if (result.success) {
                setReputation(result.data);
                setLastChecked(new Date());
                if (result.sbt?.polygon) {
                    setSbtResult(result.sbt.polygon);
                }
                if (result.sbt?.algorand) {
                    setAlgoSbtResult(result.sbt.algorand);
                }
                if (result.allFetchedTransactions?.length > 0) {
                    setTransactions(result.allFetchedTransactions);
                }
                setHasFetched(true);
            }
        } catch (err) {
            console.error("Dashboard fetch error:", err);
            toast.error("Failed to fetch reputation data. Is the backend running?", { duration: 5000 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isConnected && address && !hasFetched) {
            fetchReputation();
        }
    }, [isConnected, address]);

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-4">
                <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                    <Wallet className="w-12 h-12 text-blue-400" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-4 text-white">Wallet Not Connected</h1>
                <p className="text-muted-foreground text-center max-w-md">
                    Connect your wallet using the button in the navigation bar to view your personal reputation dashboard.
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-20 h-20 border-t-2 border-r-2 border-blue-500 rounded-full mb-8"
                />
                <motion.h2
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-xl font-bold tracking-tight text-white"
                >
                    Scanning your blockchain history...
                </motion.h2>
                <p className="text-muted-foreground mt-2 text-sm">Analyzing protocols: Aave, Compound, Folks Finance...</p>
            </div>
        );
    }

    return (
        <div className="container px-4 md:px-8 py-16 mx-auto max-w-6xl min-h-[calc(100vh-140px)]">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1 text-white">My Dashboard</h1>
                    <p className="text-muted-foreground font-mono text-sm">{address}</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchReputation}
                        className="border-[#333] text-gray-300 hover:bg-[#111]"
                    >
                        <RefreshCcw className="w-4 h-4 mr-2" /> Refresh
                    </Button>
                    {reputation && (
                        <Badge className={`${getReliabilityLevel().color} font-bold text-sm px-3 py-1`}>
                            {getReliabilityLevel().label}
                        </Badge>
                    )}
                </div>
            </div>

            {/* Main Layout: Left Stats + Right Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* Left Column: Reputation Stats (2/5) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Score Card */}
                    <Card className="border-[#1a1a1a] bg-[#050505] rounded-2xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 blur-[60px] -mr-10 -mt-10 pointer-events-none" />
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-muted-foreground">Reputation Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end gap-2 mb-3">
                                <span className="text-5xl font-extrabold text-white">{reputation ? getScore() : "—"}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Formula: (Repayments × 300) − (Liquidations × 500)
                            </p>
                        </CardContent>
                    </Card>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="border-[#1a1a1a] bg-[#050505] rounded-2xl">
                            <CardContent className="pt-5 pb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                                    <span className="text-xs text-muted-foreground">Repayments</span>
                                </div>
                                <p className="text-2xl font-bold text-green-400">{reputation ? getRepays() : "—"}</p>
                            </CardContent>
                        </Card>
                        <Card className="border-[#1a1a1a] bg-[#050505] rounded-2xl">
                            <CardContent className="pt-5 pb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Shield className="w-4 h-4 text-red-400" />
                                    <span className="text-xs text-muted-foreground">Liquidations</span>
                                </div>
                                <p className="text-2xl font-bold text-red-400">{reputation ? getLiquidations() : "—"}</p>
                            </CardContent>
                        </Card>
                        <Card className="border-[#1a1a1a] bg-[#050505] rounded-2xl">
                            <CardContent className="pt-5 pb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span className="text-xs text-muted-foreground">Last Updated</span>
                                </div>
                                <p className="text-sm font-mono text-gray-300">
                                    {lastChecked
                                        ? lastChecked.toLocaleString()
                                        : "—"}
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-[#1a1a1a] bg-[#050505] rounded-2xl">
                            <CardContent className="pt-5 pb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Activity className="w-4 h-4 text-blue-400" />
                                    <span className="text-xs text-muted-foreground">Txs Analyzed</span>
                                </div>
                                <p className="text-2xl font-bold text-blue-400">{transactions.length}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* SBT Section */}
                    <Card className="border-[#1a1a1a] bg-[#050505] rounded-2xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <BadgeCheck className="w-4 h-4 text-blue-400" />
                                <span className="text-muted-foreground">Credit SBT (Soulbound Token)</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {reputation ? (
                                <>
                                    <div className={`p-3 rounded-lg bg-[#0a0a0a] border ${
                                        getScore() > 0 ? 'border-green-500/20' : getScore() === 0 ? 'border-gray-500/20' : 'border-red-500/20'
                                    }`}>
                                        <p className={`text-xs mb-1 ${getScore() > 0 ? 'text-green-400' : getScore() === 0 ? 'text-gray-400' : 'text-red-400'}`}>
                                            {getScore() > 0 ? '✅' : getScore() === 0 ? '⚪' : '⚠️'} SBT Score: {getScore()} — Ready to mint on-chain
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Contract: BlockVaultSBT (BVR) on Polygon Amoy
                                        </p>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Every wallet that checks reputation gets an SBT recording their score.
                                        The SBT is permanently locked to your wallet (ERC-5192 Soulbound) — it updates
                                        each time you verify via <code className="text-blue-400">updateScore()</code>.
                                    </p>
                                    {sbtResult && (
                                        <div className="p-3 rounded-lg bg-[#0a0a0a] border border-purple-500/20 mt-2">
                                            <p className="text-xs text-purple-400 mb-1">🟣 Polygon — {sbtResult.action === 'mint' ? 'Minted' : 'Updated'}</p>
                                            <a
                                                href={sbtResult.explorerUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-purple-300 hover:text-purple-200 hover:underline font-mono break-all flex items-center gap-1"
                                            >
                                                {sbtResult.txHash.slice(0, 24)}...
                                                <ExternalLink className="w-3 h-3 inline shrink-0" />
                                            </a>
                                            {sbtResult.contractAddress && (
                                                <p className="text-[10px] text-muted-foreground mt-1">Contract: {sbtResult.contractAddress}</p>
                                            )}
                                        </div>
                                    )}
                                    {algoSbtResult && (
                                        <div className="p-3 rounded-lg bg-[#0a0a0a] border border-blue-500/20 mt-2">
                                            <p className="text-xs text-blue-400 mb-1">🔵 Algorand — Minted (ASA #{algoSbtResult.assetId})</p>
                                            <a
                                                href={algoSbtResult.explorerUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-blue-300 hover:text-blue-200 hover:underline font-mono break-all flex items-center gap-1"
                                            >
                                                {algoSbtResult.txHash.slice(0, 24)}...
                                                <ExternalLink className="w-3 h-3 inline shrink-0" />
                                            </a>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="p-3 rounded-lg bg-[#0a0a0a] border border-[#222]">
                                    <p className="text-xs text-muted-foreground">
                                        Run a reputation check to generate your SBT data.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Transactions (3/5) */}
                <div className="lg:col-span-3">
                    <Card className="border-[#1a1a1a] bg-[#050505] rounded-2xl h-full">
                        <CardHeader className="border-b border-[#1a1a1a] pb-4">
                            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                Recent Transactions ({transactions.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 max-h-[600px] overflow-y-auto space-y-3">
                            {transactions.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground text-sm">No transactions found for this address.</p>
                                    <p className="text-muted-foreground text-xs mt-1">Try refreshing or check that the backend is running.</p>
                                </div>
                            ) : (
                                transactions.map((tx, idx) => (
                                    <div key={idx} className="p-3 bg-[#0a0a0a] rounded-lg border border-[#1a1a1a] font-mono text-xs text-gray-300">
                                        <div className="flex justify-between items-start mb-1">
                                            <a
                                                href={tx.type ? `https://allo.info/tx/${tx.hash}` : `https://ethplorer.io/tx/${tx.hash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 break-all"
                                            >
                                                {tx.hash?.slice(0, 20)}... <ExternalLink className="w-3 h-3 inline flex-shrink-0" />
                                            </a>
                                            <span className="text-gray-500 whitespace-nowrap pl-2 text-[10px]">
                                                {new Date(tx.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                        {tx.transfers ? tx.transfers.map((t, i) => (
                                            <p key={i} className="mt-1">
                                                <span className="text-green-400">{t.value} {t.asset}</span>
                                                <span className="text-gray-500"> → {t.to_contract?.slice(0, 14)}... ({t.category})</span>
                                            </p>
                                        )) : (
                                            <p className="mt-1">
                                                <span className="text-yellow-400">App Call:</span> {tx.appId || "TX"} ({tx.type})
                                            </p>
                                        )}
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* AI Summary Log */}
            {reputation?.summaryLogs && (
                <Card className="border-[#1a1a1a] bg-[#050505] rounded-2xl mt-6">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">AI Oracle Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="p-3 rounded-lg bg-black font-mono text-xs text-[#d4a373] whitespace-pre-wrap border border-[#d4a373]/20">
                            {reputation.summaryLogs}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
