import React from "react";
import { Poppins } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "600", "700"],
});

export default function AboutPage() {
    return (
        <div className={`${poppins.className} min-h-screen bg-[#1E1E28]`}>
        <>
        <section className="relative w-full h-[665px] mt-[0px] overflow-hidden">
            {/* HERO IMAGE dengan bottom fade */}
            <img
                src="/images/about.png"
                alt="Tin Price Prediction Banner"
                className="absolute inset-0 w-full h-full object-cover scale-x-[-1] z-0"
                style={{
                    filter: "brightness(0.7)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 20%, transparent 70%)",
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskSize: "cover",
                    maskImage: "linear-gradient(to bottom, black 10%, transparent 60%)",
                    maskRepeat: "no-repeat",
                    maskSize: "cover",
                }}
            />
            {/* CONTENT TENGAH */}
            <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
                <div className="max-w-3xl">
                    <h2 className="mt-1 text-4xl md:text-5xl font-bold text-[#ECECEC] leading-tight">
                        ABOUT
                    </h2>

                    <p className="mt-6 font-light text-gray-300 text-sm md:text-base leading-relaxed">
                        This platform is an AI-powered forecasting dashboard that leverages
                        hybrid time-series models, combining Prophet and LSTM to analyze
                        historical trends and predict future global tin prices.
                        <br /><br />
                        Designed for researchers, analysts, and decision-makers, the system
                        focuses on accuracy, transparency, and long-term market insights.
                        In addition, this website was developed as part of the final project
                        requirements for an internship program, integrating real-world
                        problem analysis with applied machine learning solutions.
                    </p>
                </div>
            </div>
        </section>
            {/* ================= IMAGE KIRI + TEXT ================= */}
            <section className="-mt-2 max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center gap-8">

                    {/* IMAGE KIRI */}
                    <div className="flex-shrink-0">
                        <img
                            src="/images/img.png"
                            alt="About AI Dashboard"
                            className="w-64 h-64 md:w-78 md:h-78 object-cover rounded-3xl shadow-lg"
                        />
                    </div>

                    {/* TEKS KANAN */}
                    <div className="-mt-3 flex-1 text-center md:text-left">
                        <p className="font-light text-gray-300 text-sm md:text-base leading-relaxed">
                            ABOUT US
                        </p>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#ECECEC] mb-4">
                            AI-Powered Tin Price Forecasting
                        </h2>
                        <p className="text-gray-300 text-sm md:text-base leading-relaxed text-justify">
                            This platform is an AI-powered forecasting dashboard that leverages hybrid time-series models, combining Prophet and LSTM, to analyze historical trends and predict future global tin prices.
                            Designed for researchers, analysts, and decision-makers, the system focuses on accuracy, transparency, and long-term market insights.
                            In addition, this website was developed as part of the final project requirements for an internship program, integrating real-world problem analysis with applied machine learning solutions.
                        </p>
                        {/* BUTTON GO PREDICT */}
                        <div className="mt-6">
                            <Link href="/#prediction-section">
                                <button className="px-8 py-4 rounded-xl bg-[#03D68A] text-[#0E1E24] font-semibold text-sm hover:bg-[#02c27d] transition">
                                    GO PREDICT
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mt-15 w-full bg-[#0E1E24] py-24 px-6">
                <div className="flex flex-col md:flex-row gap-12 max-w-7xl mx-auto">

                    {/* TEKS KIRI */}
                    <div className="flex-1 flex flex-col justify-center text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#ECECEC] mb-4">
                            Our Commitment
                        </h2>
                        <p className="text-gray-300 text-sm md:text-base leading-relaxed text-justify">
                            Metalytics leverages AI to deliver precise, data-driven tin price forecasts. Our mission is to empower stakeholders with insights that drive smarter decisions, bridging research and market practice.
                        </p>
                    </div>

                    {/* KANAN 3 CARD */}
                    <div className="flex-1 flex flex-col gap-6">
                        {/* Card 1 */}
                        <div className="bg-[#132A33] p-6 rounded-xl shadow-lg border border-[#243041] text-center flex-1">
                            <h3 className="text-xl font-bold text-[#03D68A] mb-2">Our Goal</h3>
                            <p className="text-gray-300 text-sm md:text-base">
                                Provide accurate and reliable AI-powered forecasts to help decision-makers make informed choices in the global tin market.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-[#132A33] p-6 rounded-xl shadow-lg border border-[#243041] text-center flex-1">
                            <h3 className="text-xl font-bold text-[#03D68A] mb-2">Our Vision</h3>
                            <p className="text-gray-300 text-sm md:text-base">
                                Become the leading platform for hybrid AI forecasting in commodities, bridging research insights and practical market applications.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-[#132A33] p-6 rounded-xl shadow-lg border border-[#243041] text-center flex-1">
                            <h3 className="text-xl font-bold text-[#03D68A] mb-2">Our Mission</h3>
                            <p className="text-gray-300 text-sm md:text-base">
                                Combine cutting-edge AI models with transparent data analysis to empower analysts, researchers, and investors in making data-driven decisions.
                            </p>
                        </div>
                    </div>

                </div>
            </section>
        </>
        </div>
    );
}
