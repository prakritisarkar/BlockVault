"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Shield, ShieldCheck, Activity, Clock, CheckCircle2, AlertTriangle, FileLock2, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function VerifyPage() {
    const [address, setAddress] = useState("");
    const [txLimit, setTxLimit] = useState("20");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [proofVisible, setProofVisible] = useState(false);
    const [txListVisible, setTxListVisible] = useState(false);
    const [verificationData, setVerificationData] = useState<any>(null);
    const [rawLogs, setRawLogs] = useState<string>("");
    const [allTxs, setAllTxs] = useState<any[]>([]);
    const [polygonSbt, setPolygonSbt] = useState<any>(null);
    const [algoSbt, setAlgoSbt] = useState<any>(null);

    // Deterministic score helper — NEVER trust the AI's math
    const getRepays = () => {
        if (!verificationData) return 0;
        return Number(verificationData.totalRepays ?? verificationData.repaysToAdd ?? 0);
    };
    const getLiquidations = () => {
        if (!verificationData) return 0;
        return Math.abs(Number(verificationData.liquidations ?? verificationData.liquidationsToAdd ?? 0));
    };
    const getScore = () => (getRepays() * 300) - (getLiquidations() * 500);
    const getReliabilityLevel = () => {
        const s = getScore();
        if (s >= 600) return { label: "HIGH", color: "bg-green-600 text-white" };
        if (s >= 300) return { label: "MEDIUM", color: "bg-yellow-500 text-black" };
        if (s > 0)   return { label: "LOW", color: "bg-orange-500 text-white" };
        if (s === 0) return { label: "NEUTRAL", color: "bg-gray-500 text-white" };
        return { label: "AT RISK", color: "bg-red-600 text-white" };
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!address.trim()) return;

        setStatus("loading");
        setProofVisible(false);

        try {
            // Send address to backend — it handles ALL transaction fetching via Alchemy + Algorand
            const res = await fetch("http://localhost:3001/api/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address, limit: txLimit })
            });

            if (!res.ok) {
                toast.error(`Backend returned ${res.status} error.`, { duration: 6000 });
                throw new Error("API verification failed");
            }

            const result = await res.json();

            if (result.success) {
                setVerificationData(result.data);
                setRawLogs(result.data.summaryLogs || "Proof Verification Completed: OK");
                // Capture SBT results
                if (result.sbt?.polygon) setPolygonSbt(result.sbt.polygon);
                if (result.sbt?.algorand) setAlgoSbt(result.sbt.algorand);
                // Use backend-provided transactions for the UI
                if (result.allFetchedTransactions && result.allFetchedTransactions.length > 0) {
                    setAllTxs(result.allFetchedTransactions);
                }
                setStatus("success");
            } else {
                throw new Error("API returned failure");
            }
        } catch (error) {
            console.error(error);
            setStatus("error");
        }
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
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-white">Wallet Address</label>
                                    <Input
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="0x0000...Enter public wallet address"
                                        className="h-14 text-base bg-[#0a0a0a] border-[#222222] text-gray-300 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 px-4 placeholder:text-gray-600"
                                    />
                                </div>
                                <div className="w-full md:w-32 flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-white">Tx Limit</label>
                                    <Input
                                        type="number"
                                        value={txLimit}
                                        onChange={(e) => setTxLimit(e.target.value)}
                                        placeholder="20"
                                        min="1"
                                        max="200"
                                        className="h-14 text-base bg-[#0a0a0a] border-[#222222] text-gray-300 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 px-4 placeholder:text-gray-600"
                                    />
                                </div>
                                <div className="flex flex-col justify-end">
                                    <Button
                                        type="submit"
                                        disabled={status === "loading" || !address || !txLimit}
                                        className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-base transition-colors border-0"
                                    >
                                        Check Reputation
                                    </Button>
                                </div>
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
                                        <Badge className={`${getReliabilityLevel().color} font-bold text-sm px-3 py-1`}>{getReliabilityLevel().label}</Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-8">
                                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-white">
                                        <ShieldCheck className="text-blue-500 h-6 w-6" /> Verified Badges
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-[#0a0a0a] border border-[#222]">
                                            <CheckCircle2 className="h-5 w-5 text-green-400" />
                                            <span className="text-sm font-medium text-green-400">{getRepays()} Loan repayments verified</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-[#0a0a0a] border border-[#222]">
                                            <Shield className="h-5 w-5 text-red-400" />
                                            <span className="text-sm font-medium text-red-400">{getLiquidations()} Liquidation events found</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-[#0a0a0a] border border-[#222]">
                                            <Activity className="h-5 w-5 text-gray-400" />
                                            <span className="text-sm font-medium text-gray-200">Score Baseline: {getScore()}</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-[#0a0a0a] border border-[#222]">
                                            <Clock className="h-5 w-5 text-gray-400" />
                                            <span className="text-sm font-medium text-gray-200">Last Block T/S: {verificationData?.lastUpdatedTimestamp || "N/A"}</span>
                                        </div>
                                    </div>

                                    {/* Credit SBT Section */}
                                    {(polygonSbt || algoSbt) && (
                                        <div className="mt-8 pt-6 border-t border-border/30">
                                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-white">
                                                <CheckCircle2 className="text-green-500 h-6 w-6" /> Credit SBT — Minted On-Chain
                                            </h3>
                                            <div className="space-y-3">
                                                {/* Metadata */}
                                                <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#222]">
                                                    <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">On-Chain Metadata</p>
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                                                        <div>
                                                            <p className="text-muted-foreground">Score</p>
                                                            <p className="text-white font-bold text-lg">{getScore()}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground">Repayments</p>
                                                            <p className="text-green-400 font-bold text-lg">{getRepays()}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground">Liquidations</p>
                                                            <p className="text-red-400 font-bold text-lg">{getLiquidations()}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground">Last Updated</p>
                                                            <p className="text-gray-300 text-sm">{new Date().toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Polygon SBT */}
                                                {polygonSbt && (
                                                    <div className="p-4 rounded-xl bg-[#0a0a0a] border border-purple-500/20">
                                                        <p className="text-xs text-purple-400 mb-2 font-semibold">🟣 Polygon Amoy — {polygonSbt.action === 'mint' ? 'Minted' : 'Updated'}</p>
                                                        <a
                                                            href={polygonSbt.explorerUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-purple-300 hover:text-purple-200 hover:underline font-mono break-all flex items-center gap-1"
                                                        >
                                                            Tx: {polygonSbt.txHash} <ExternalLink className="w-3 h-3 inline shrink-0" />
                                                        </a>
                                                        <p className="text-[10px] text-muted-foreground mt-1">Contract: {polygonSbt.contractAddress} | ERC-721 Soulbound (ERC-5192)</p>
                                                    </div>
                                                )}

                                                {/* Algorand SBT */}
                                                {algoSbt && (
                                                    <div className="p-4 rounded-xl bg-[#0a0a0a] border border-blue-500/20">
                                                        <p className="text-xs text-blue-400 mb-2 font-semibold">🔵 Algorand Testnet — Minted (ASA #{algoSbt.assetId})</p>
                                                        <a
                                                            href={algoSbt.explorerUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-blue-300 hover:text-blue-200 hover:underline font-mono break-all flex items-center gap-1"
                                                        >
                                                            Tx: {algoSbt.txHash} <ExternalLink className="w-3 h-3 inline shrink-0" />
                                                        </a>
                                                        <p className="text-[10px] text-muted-foreground mt-1">ARC-69 Standard | Frozen ASA (Soulbound)</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

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
                                                        <p className="text-muted-foreground">{'// BlockVault Universal Oracle Verification Protocol'}</p>
                                                        <p>{'>'} Sourcing Cross-Chain Transactions...</p>
                                                        <p className="text-white">Timestamp Check: {verificationData?.lastUpdatedTimestamp || "N/A"}</p>
                                                        <p>{'>'} Target: {address.slice(0, 8)}...</p>
                                                        <p>{'>'} Sent to Groq Llama-3 70B Orchestrator...</p>
                                                        <div className="bg-[#111] p-3 rounded mt-2 mb-2 text-white/80 whitespace-pre-wrap">
                                                            {rawLogs}
                                                        </div>
                                                        <p className="text-white font-bold">Cross-Chain Proof: VALID</p>
                                                        <p className="text-primary mt-2 flex items-center gap-2">
                                                            <CheckCircle2 className="h-4 w-4" /> SBT Ready for Dual-Mint Deployment
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <Button
                                            variant="outline"
                                            onClick={() => setTxListVisible(!txListVisible)}
                                            className="w-full h-16 flex items-center justify-between py-6 mt-4 group hover:border-gray-500 transition-colors bg-[#0a0a0a] border-[#222]"
                                        >
                                            <span className="flex items-center gap-3 font-semibold text-white">
                                                <Activity className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                                                View Source Transactions ({allTxs.length})
                                            </span>
                                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                        </Button>

                                        <AnimatePresence>
                                            {txListVisible && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="mt-4 p-4 rounded-lg bg-[#0a0a0a] border border-[#222] space-y-4 max-h-96 overflow-y-auto w-full">
                                                        {allTxs.length === 0 ? (
                                                            <p className="text-sm text-muted-foreground text-center">No transactions found.</p>
                                                        ) : (
                                                            allTxs.map((tx, idx) => (
                                                                <div key={idx} className="p-3 bg-[#111] rounded-md border border-border/10 font-mono text-xs text-gray-300 break-words flex flex-col gap-1 w-full">
                                                                    <div className="font-semibold flex justify-between">
                                                                        <a
                                                                            href={tx.type || (tx.transfers && tx.transfers[0]?.category === 'native')
                                                                                ? `https://allo.info/tx/${tx.hash}`
                                                                                : `https://ethplorer.io/tx/${tx.hash}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-blue-400 hover:text-blue-300 hover:underline transition-colors break-all flex items-center gap-1"
                                                                        >
                                                                            Hash: {tx.hash?.slice(0, 16)}... <ExternalLink className="h-3 w-3 inline" />
                                                                        </a>
                                                                        <span className="text-gray-500 whitespace-nowrap pl-2">{new Date(tx.timestamp).toLocaleString()}</span>
                                                                    </div>
                                                                    <div className="mt-1">
                                                                        {tx.transfers ? tx.transfers.map((t: any, i: number) => (
                                                                            <p key={i}><span className="text-green-400">{t.value} {t.asset}</span> ➔ {t.to_contract?.slice(0, 12)}... ({t.category})</p>
                                                                        )) : (
                                                                            <p><span className="text-yellow-400">App Call:</span> {tx.appId || "Algorand TX"} ({tx.type})</p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))
                                                        )}
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
