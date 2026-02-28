"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Activity, Clock, BadgeCheck, AlertCircle, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAccount } from "wagmi";

export default function Dashboard() {
    const { address, isConnected } = useAccount();
    const [analyzing, setAnalyzing] = useState(true);

    useEffect(() => {
        if (isConnected) {
            // Fake loading state
            const timer = setTimeout(() => {
                setAnalyzing(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isConnected]);

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-4">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle className="w-12 h-12 text-primary glow-cyan" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-4 text-glow">Wallet Not Connected</h1>
                <p className="text-muted-foreground text-center max-w-md">
                    Please connect your wallet using the button in the navigation bar to view your reputation dashboard.
                </p>
            </div>
        );
    }

    if (analyzing) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-24 h-24 border-t-4 border-l-4 border-primary rounded-full glow-cyan mb-8"
                />
                <motion.h2
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
                    className="text-2xl font-bold tracking-tight"
                >
                    Analyzing blockchain history...
                </motion.h2>
                <p className="text-muted-foreground mt-2">Checking protocols: Aave, Compound, Maker...</p>
            </div>
        );
    }

    return (
        <div className="container px-4 md:px-8 py-12 mx-auto max-w-5xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Wallet Reputation Dashboard</h1>
                    <p className="text-muted-foreground">Comprehensive analysis of your on-chain financial history.</p>
                </div>
                <Badge variant="outline" className="px-4 py-2 border-[#d4a373]/50 text-[#d4a373] bg-[#d4a373]/10 text-sm flex items-center gap-2 rounded-full">
                    <BadgeCheck className="w-4 h-4" /> 🟢 Verified Wallet
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <Card className="border-primary/20 bg-card/40 backdrop-blur col-span-1 md:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-muted-foreground">Connected Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl md:text-3xl font-mono text-white tracking-wider break-all">
                            {address}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-primary/50 bg-primary/5 glow-cyan relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] -mr-10 -mt-10 pointer-events-none" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-primary">Reputation Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2">
                            <span className="text-5xl font-extrabold text-white text-glow">98</span>
                            <span className="text-xl text-muted-foreground mb-1">/ 100</span>
                        </div>
                        <p className="text-sm text-primary/80 mt-2 font-medium">Top 2% of network</p>
                    </CardContent>
                </Card>
            </div>

            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" /> Key Metrics
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "Repayments Proven", value: "24", icon: RefreshCcw, color: "text-blue-400" },
                    { title: "Total Volume", value: "$142k", icon: Activity, color: "text-[#d4a373]" },
                    { title: "Wallet Age", value: "3.2 yrs", icon: Clock, color: "text-purple-400" },
                    { title: "Liquidations", value: "0", icon: ShieldCheck, color: "text-primary" },
                ].map((metric, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="border-border/50 bg-card/60 hover:bg-card/80 transition-colors">
                            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
                                <metric.icon className={`h-4 w-4 ${metric.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{metric.value}</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
