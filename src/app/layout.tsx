import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Poppins } from "next/font/google";
import React from "react";
import Navbar from "@/components/ui/Navbar";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "600", "700"],
});

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Tin Price Prediction",
    description: "AI-powered tin price forecasting system",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#1E1E28] text-white`}
        >

        {/* Header */}
        <Navbar />

        {/* ===== PAGE CONTENT ===== */}
        <main className="pt-[72px]">
            {children}
        </main>

        {/* ===== FOOTER ===== */}
        {/* Footer */}
        <footer className="mt-16 border-t border-[#243041] bg-[#0B1A1F]">
            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center gap-4 text-sm text-gray-400">

                {/* Kiri */}
                <div className="text-center">
                    © {new Date().getFullYear()}{" "}
                    <span className="font-semibold text-[#EFF1EE]">
                Tin Price Prediction System
            </span>
                    . All rights reserved.
                </div>

                {/* Tengah */}
                <div className="flex items-center gap-2 text-gray-500">
                    <span>Powered by</span>
                    <span className="text-[#03D68A] font-medium">
                Hybrid AI (Prophet + LSTM)
            </span>
                </div>

                {/* Kanan */}
                <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full border border-[#243041] text-xs">
                Next.js
            </span>
                    <span className="px-3 py-1 rounded-full border border-[#243041] text-xs">
                Tailwind CSS
            </span>
                    <span className="px-3 py-1 rounded-full border border-[#243041] text-xs">
                Recharts
            </span>
                </div>
            </div>
        </footer>

        </body>
        </html>
    );
}
