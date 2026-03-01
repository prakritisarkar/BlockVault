import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Galaxy from "@/components/Galaxy";

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
              <Galaxy transparent />
            </div>
            {/* Extremely subtle background grid pattern overlay for texture */}
            <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-20" />

            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
