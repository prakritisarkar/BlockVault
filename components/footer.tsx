import Link from "next/link";
import { Shield } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-border/40 bg-background py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 md:px-8 mx-auto max-w-7xl">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4 text-primary" />
                    <p className="font-medium text-foreground">BlockVault</p>
                    <span>&copy; {new Date().getFullYear()}</span>
                </div>
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    Trustless on-chain reputation system. Built for the modern builder.
                </p>
            </div>
        </footer>
    );
}
