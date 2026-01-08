"use client"

import { Poppins } from "next/font/google";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "600", "700"],
});

import Link from "next/link";
import { motion } from "framer-motion";
import React, { useState, useEffect, useRef } from 'react';
import { Download } from "lucide-react";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { Search, TrendingUp, AlertCircle, Calendar} from 'lucide-react';

export default function Dashboard() {
    // State untuk tanggal (pakai string biar gampang: "2024-01-01")
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // State data
    const [dataPrediksi, setDataPrediksi] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handlePredict = async () => {
        if (!startDate) return alert("Pilih tanggal awal dulu!");
        setLoading(true);
        setError("");
        setDataPrediksi([]);

        try {
            const response = await fetch("/api/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ startDate: startDate, endDate: endDate || startDate }),
            });
            const json = await response.json();
            if (response.status === 200) {
                console.log(json);
                setDataPrediksi(json.predictions);

                // Scroll ke bawah setelah data siap
                setTimeout(() => {
                    predictionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 100); // Delay kecil biar DOM render dulu
            } else {
                setError(json.message || "Gagal mengambil data");
            }
        } catch (err) {
            setError("Gagal koneksi ke server Backend");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;


    const predictionRef = useRef<HTMLDivElement>(null);

    const totalPages = Math.ceil(dataPrediksi.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    const currentData = dataPrediksi.slice(startIndex, endIndex);

    //Percentage Change
    const getPercentageChange = (index: number) => {
        if (index === 0) return null;

        const prevPrice = dataPrediksi[index - 1]?.price;
        const currentPrice = dataPrediksi[index]?.price;

        if (!prevPrice || prevPrice === 0) return null;

        const diff = ((currentPrice - prevPrice) / prevPrice) * 100;
        return diff;
    };

    const getTomorrow = () => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().split("T")[0];
    };

    //Helper Tomorrow Price
    const tomorrowPrediction =
        dataPrediksi.length > 0
            ? {
                date: getTomorrow(),
                price: dataPrediksi[dataPrediksi.length - 1].price
            }
            : null;

    const getToday = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    //Custom Active Dot
    const CustomActiveDot = (props: any) => {
        if (!props.cx || !props.cy) return null;
        const { cx, cy } = props;

        return (
            <g>
                {/* Lingkaran inti */}
                <circle
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill="#FFE600"
                />

                {/* Ring tengah */}
                <circle
                    cx={cx}
                    cy={cy}
                    r={8}
                    fill="rgba(37, 99, 235, 0.25)"
                />

                {/* Ring luar */}
                <circle
                    cx={cx}
                    cy={cy}
                    r={14}
                    fill="rgba(37, 99, 235, 0.12)"
                />
            </g>
        );
    };

    //Export CSV
    const exportCSV = () => {
        const csv =
            "Date,Price\n" +
            dataPrediksi.map(d => `${d.date},${d.price}`).join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "tin_prediction.csv";
        a.click();
    };

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };
    const filterRef = useRef<HTMLDivElement>(null);

    const scrollToFilter = () => {
        filterRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div className={`${poppins.className} min-h-screen bg-[#1E1E28]`}>
            {/* Hero Section */}
            <section className="relative w-full h-[665px] mt-[0px] overflow-hidden">
                {/* HERO IMAGE dengan bottom fade */}
                <img
                    src="/images/predict.jpg"
                    alt="Tin Price Prediction Banner"
                    className="absolute inset-0 w-full h-full object-cover scale-x-[-1] z-0"
                    style={{
                        filter: "brightness(0.7)",
                        WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
                        WebkitMaskRepeat: "no-repeat",
                        WebkitMaskSize: "cover",
                        maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
                        maskRepeat: "no-repeat",
                        maskSize: "cover"
                    }}
                />

                {/* CONTENT tetap terlihat */}
                <div className="relative z-10 h-full flex items-center">
                    <div className="max-w-7xl mx-auto px-8 w-full flex justify-between items-center">
                        {/* LEFT — Text */}
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-5xl font-bold text-[#ECECEC] leading-tight">
                                SEE THE MARKET DIFFERENTLY IN NEXT 3 YEARS
                            </h2>
                            <p className="mt-4 font-thin text-gray-300 text-sm md:text-base">
                                AI-powered forecasting dashboard using Hybrid Models
                                (Prophet + LSTM) to analyze and predict global tin prices.
                            </p>
                        </div>

                        {/* RIGHT — Button */}
                        <div className="ml-8">
                            <button
                                onClick={scrollToFilter} // <-- tambahkan ini
                                className="
        px-8 py-4 rounded-xl
        bg-[#03D68A] text-[#0E1E24]
        font-semibold text-sm
        hover:bg-[#02c27d]
        transition
        shadow-lg shadow-[#03D68A]/30
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
                            >
                                {loading ? "Loading..." : "Start Prediction"}
                            </button>
                        </div>

                    </div>
                </div>
            </section>

            {/* Our AI Approach Section */}
            <section className="mt-0 bg-[#0E1E24] rounded-xl p-8 md:p-12 shadow-md border border-[#243041]">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#ECECEC] mb-4">
                        Our AI Approach
                    </h2>

                    <p className="text-gray-400 text-sm md:text-base font-thin mb-8">
                        We combine advanced hybrid forecasting models to deliver accurate tin price predictions.
                        Our system leverages the strengths of both Prophet and LSTM to analyze historical trends,
                        capture seasonal patterns, and forecast future market movements.
                    </p>

                    {/* Metrics Cards */}
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: { staggerChildren: 0.2 },
                            },
                        }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        <motion.div
                            variants={{ hidden: { y: 30, opacity: 0 }, show: { y: 0, opacity: 1 } }}
                            className="bg-[#132A33] p-6 rounded-xl shadow-sm border border-[#202038]"
                        >
                            <h3 className="text-lg font-semibold text-[#03D68A] mb-2">MAE</h3>
                            <p className="text-gray-300 text-2xl">120</p>
                            <p className="text-gray-500 text-xs mt-1">Mean Absolute Error</p>
                        </motion.div>

                        <motion.div
                            variants={{ hidden: { y: 30, opacity: 0 }, show: { y: 0, opacity: 1 } }}
                            className="bg-[#132A33] p-6 rounded-xl shadow-sm border border-[#202038]"
                        >
                            <h3 className="text-lg font-semibold text-[#03D68A] mb-2">RMSE</h3>
                            <p className="text-gray-300 text-2xl">150</p>
                            <p className="text-gray-500 text-xs mt-1">Root Mean Squared Error</p>
                        </motion.div>

                        <motion.div
                            variants={{ hidden: { y: 30, opacity: 0 }, show: { y: 0, opacity: 1 } }}
                            className="bg-[#132A33] p-6 rounded-xl shadow-sm border border-[#202038]"
                        >
                            <h3 className="text-lg font-semibold text-[#03D68A] mb-2">R²</h3>
                            <p className="text-gray-300 text-2xl">0.97</p>
                            <p className="text-gray-500 text-xs mt-1">Coefficient of Determination</p>
                        </motion.div>
                    </motion.div>

                    <p className="mt-8 text-gray-400 text-sm md:text-base">
                        These metrics reflect the reliability and accuracy of our predictions,
                        ensuring that decision-makers can trust the insights generated by our AI system.
                    </p>
                </div>
            </section>


            <div className="max-w-7xl mt-[25px]  mx-auto space-y-6">
                {/* Top Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Card KIRI – Tomorrow Prediction */}
                    <div className="bg-linear-to-b from-[#132A33] via-[#0E1E24] to-[#0B1A1F] px-10 py-8 rounded-xl shadow-sm border border-[#202038] flex flex-col min-h-[240px]">
                        <div>
                            <h2 className="text-lg font-semibold text-[#EFF1EE] flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                                Tomorrow Prediction
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Tin Price Prediction for Tomorrow
                            </p>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                            {tomorrowPrediction ? (
                                <>
                                    <p className="text-sm text-gray-400 mb-1">
                                        {tomorrowPrediction.date}
                                    </p>
                                    <p className="text-4xl font-bold text-[#03D68A]">
                                        {formatPrice(tomorrowPrediction.price)}
                                    </p>
                                </>
                            ) : (
                                <p className="text-gray-500 text-sm">
                                    Belum ada data prediksi
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Card KANAN – Prediction Filter */}
                    <div id="prediction-section" ref={filterRef} className="bg-[#0E1E24] px-10 py-8 rounded-xl shadow-sm border border-[#202038]">
                        <h2 className="text-lg font-semibold text-[#EFF1EE] mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-500" />
                            Prediction Filter
                        </h2>

                        <div className="flex flex-col gap-4">
                            {/* Input Tanggal Awal */}
                            <div>
                                <label className="block text-sm font-medium text-[#9CA3AF] mb-1">
                                    From
                                </label>
                                <input
                                    type="date"
                                    className="w-full p-2 border bg-[#0E1E24] text-[#EFF1EE] border-[#343B55] rounded-lg
                               focus:ring-2 focus:ring-blue-500 outline-none [color-scheme:dark]"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>

                            {/* Input Tanggal Akhir */}
                            <div>
                                <label className="block text-sm font-medium text-[#9CA3AF] mb-1">
                                    Until
                                </label>
                                <input
                                    type="date"
                                    className="w-full p-2 border bg-[#0E1E24] text-[#EFF1EE] border-[#343B55] rounded-lg
                               focus:ring-2 focus:ring-blue-500 outline-none [color-scheme:dark]"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>

                            {/* Tombol */}
                            <button
                                onClick={handlePredict}
                                disabled={loading}
                                className="
                    mt-2
                    bg-blue-600 hover:bg-blue-700
                    text-white font-medium
                    py-2 px-6
                    rounded-xl
                    flex items-center justify-center gap-2
                    transition-colors
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                "
                            >
                                {loading ? "Loading..." : (
                                    <>
                                        <Search className="w-4 h-4" /> Predict
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 border border-red-100">
                                <AlertCircle className="w-5 h-5" />
                                {error}
                            </div>
                        )}
                    </div>

                </div>


                {/* Hasil Grafik */}
                {dataPrediksi.length > 0 && (
                    <div className="grid gap-6 animate-fade-in-up">
                        <div className="bg-[#0E1E24] rounded-xl shadow-md border border-none">
                            <div className="flex items-center gap-1 px-8 pt-8 pb-4 md:px-12">
                                <div className="p-2">
                                    <TrendingUp className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-[#EFF1EE]">Price Predictions Graph</h3>
                                    {/* <p className="text-sm text-gray-500">Hasil gabungan model Prophet & LSTM</p> */}
                                </div>

                            </div>

                            <div className="relative px-6 pb-8 md:px-10">
                            <div className="h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={dataPrediksi}>
                                        <defs>
                                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#3E9DCD" stopOpacity={0.45} />
                                                <stop offset="25%" stopColor="#2563eb" stopOpacity={0.30} />
                                                <stop offset="75%" stopColor="#2563eb" stopOpacity={0.15} />
                                                <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#9CA3AF" />
                                        <XAxis
                                            dataKey="date"
                                            tick={false}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            domain={['auto', 'auto']}
                                            tick={{fontSize: 12, fill: '#9CA3AF'}}
                                            tickFormatter={(value) => `$${value}`}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip
                                            contentStyle={{backgroundColor: '#EFF1EE', borderRadius: '8px', border: '1px solid #9CA3AF', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                                            formatter={(value?: number) => {
                                                if (value == null) return ["—", "Price"];
                                                return [formatPrice(value), "Price"];}}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="price"
                                            stroke="#2563eb"
                                            strokeWidth={3}
                                            fill="url(#colorPrice)"
                                            activeDot={<CustomActiveDot />}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        </div>

                        {/* Tabel Ringkasan */}
                        <div className="overflow-x-auto rounded-xl border border-[#243041]">
                            <table className="w-full text-sm text-left text-[#EFF1EE]">
                                <thead className="bg-[#132A33] text-xs uppercase text-gray-400">
                                <tr>
                                    <th className="px-6 py-4 text-center">Id</th>
                                    <th className="px-6 py-4 text-center">Date</th>
                                    <th className="px-6 py-4 text-center">Price Predictions</th>
                                    <th className="px-6 py-4 text-center">% Change</th>
                                </tr>
                                </thead>

                                <tbody className="divide-y divide-[#243041] bg-[#0E1E24]">
                                {currentData.map((item, i) => {
                                    const globalIndex = startIndex + i;
                                    const percent = getPercentageChange(globalIndex);

                                    return (
                                        <tr
                                            key={i}
                                            className="hover:bg-white/5 transition-colors duration-300"
                                        >
                                            <td className="px-6 py-4 text-center align-middle">
                                                {globalIndex + 1}
                                            </td>

                                            <td className="px-6 py-4 text-center align-middle text-gray-300">
                                                {item.date}
                                            </td>

                                            <td className="px-6 py-4 text-center align-middle font-semibold text-[#03D68A]">
                                                {formatPrice(item.price)}
                                            </td>

                                            <td className="px-6 py-4 text-center align-middle font-medium">
                                                {percent === null ? (
                                                    <span className="text-gray-500">—</span>
                                                ) : (
                                                    <span
                                                        className={
                                                            percent >= 0
                                                                ? "text-green-400"
                                                                : "text-red-400"
                                                        }
                                                    >
                        {percent >= 0 ? "+" : ""}
                                                        {percent.toFixed(2)}%
                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}

                                </tbody>
                            </table>

                            <div className="flex items-center justify-between px-4 py-3 bg-[#0E1E24] text-sm text-gray-400 bg-[#0E1E24] border-t border-[#243041]">
  <span>
    Page {currentPage} of {totalPages}
  </span>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 rounded-lg border border-[#243041]
                 hover:bg-white/5 disabled:opacity-40
                 disabled:cursor-not-allowed transition"
                                    >
                                        Prev
                                    </button>

                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 rounded-lg border border-[#243041]
                 hover:text-white hover:bg-white/5 disabled:opacity-40
                 disabled:cursor-not-allowed transition"
                                    >
                                        Next
                                    </button>
                                    <button
                                        onClick={exportCSV}
                                        disabled={dataPrediksi.length === 0}
                                        title="Export CSV"
                                        className="
            p-2 rounded-lg border border-[#243041]
            text-gray-400
            hover:text-white
            hover:bg-white/5
            transition
            disabled:opacity-40
            disabled:cursor-not-allowed
        "
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}