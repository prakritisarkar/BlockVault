import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "sonner";
import LiquidEther from "@/components/LiquidEther";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "BlockVault | Trustless On-Chain Reputation",
  description: "Turn Blockchain History Into Borrowing Power.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen bg-background font-sans antialiased text-foreground`} suppressHydrationWarning>
        <Providers>
          <div className="relative flex min-h-screen flex-col bg-grid-pattern">
            <div className="absolute inset-0 -z-10 pointer-events-none fixed">
              <LiquidEther
                colors={['#000000', '#ffc677', '#ffffff']}
                mouseForce={21}
                cursorSize={80}
                isViscous={false}
                viscous={30}
                iterationsViscous={32}
                iterationsPoisson={32}
                resolution={0.5}
                isBounce={false}
                autoDemo
                autoSpeed={0.55}
                autoIntensity={2.2}
                takeoverDuration={0.25}
                autoResumeDelay={3000}
                autoRampDuration={0.6}
              />
            </div>
            {/* Extremely subtle background grid pattern overlay for texture */}
            <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-20" />

            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster position="bottom-left" theme="dark" />
          </div>
        </Providers>
      </body>
    </html>
  );
}
