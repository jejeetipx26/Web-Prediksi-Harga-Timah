"use client"; // karena pakai usePathname

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Navbar() {
    const pathname = usePathname();

    const links = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" }
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0E1E24] border-b border-[#243041]">
            <div className="h-[72px] flex items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-6">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/id/4/40/Timah_Logo1.png"
                        alt="Logo PT Timah"
                        className="w-35 h-auto object-contain"
                    />
                    <div className="flex flex-col">
                        <h1 style={{ fontWeight: 650 }} className="text-xl text-[#ECECEC] leading-tight">
                            Metalytics
                        </h1>
                        <p className="text-xs text-gray-400">AI-Powered Tin Price Forecasting</p>
                    </div>
                    <div className="border-l border-gray-600/30 pl-6 ml-6">
                        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-200 ml-6">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-3 py-2 transition-colors ${
                                        pathname === link.href ? "text-[#03D68A] border-b-2 border-[#03D68A]" : "hover:text-gray-400"
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-xs font-medium border border-green-100">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    System Online
                </div>
            </div>
        </header>
    );
}
