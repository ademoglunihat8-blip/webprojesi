"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getNews, NewsItem } from "@/lib/firestore";

const CATEGORY_LABELS: Record<string, string> = {
    TIS: "Toplu İş Sözleşmesi",
    ETKINLIK: "Etkinlik",
    MEVZUAT: "Mevzuat",
    EGITIM: "Eğitim",
    GENEL: "Genel",
    TESKILAT: "Teşkilat",
};

const FALLBACK_IMAGES = [
    "/default-news.png",
];

export default function HeroSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [newsList, setNewsList] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const data = await getNews();
                // Sadece yayında olanları al
                const published = data.filter((n) => n.status === "PUBLISHED");
                setNewsList(published);
            } catch (err) {
                console.error("Haberler yüklenemedi:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    useEffect(() => {
        if (newsList.length === 0) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % newsList.length);
        }, 10000);
        return () => clearInterval(timer);
    }, [newsList]);

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % newsList.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + newsList.length) % newsList.length);

    // Yüklenirken veya haber yoksa gösterilecek placeholder
    if (loading) {
        return (
            <div className="relative w-full h-[600px] md:h-[700px] bg-navy flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white/20 border-t-gold rounded-full animate-spin" />
            </div>
        );
    }

    if (newsList.length === 0) {
        return (
            <div className="relative w-full h-[600px] md:h-[700px] bg-navy flex flex-col items-center justify-center text-white gap-4">
                <p className="text-2xl font-bold">Henüz yayınlanmış haber yok.</p>
                <p className="text-gray-400">Admin panelinden haber ekleyebilirsiniz.</p>
            </div>
        );
    }

    const current = newsList[currentIndex];
    const image = current.imageUrl || FALLBACK_IMAGES[currentIndex % FALLBACK_IMAGES.length];

    return (
        <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-navy group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 z-0">
                        <img src={image} alt={current.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/60 to-transparent" />
                        <div className="absolute inset-0 bg-black/30" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
                        <div className="max-w-2xl">
                            <motion.span
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-block px-3 py-1 mb-6 text-sm font-bold tracking-wider text-navy bg-gold rounded-full"
                            >
                                {CATEGORY_LABELS[current.category] ?? current.category}
                            </motion.span>

                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
                            >
                                {current.title}
                            </motion.h1>

                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl line-clamp-3"
                            >
                                {current.content}
                            </motion.p>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="flex items-center gap-4"
                            >
                                <Link
                                    href={`/haber/${current.id}`}
                                    className="flex items-center gap-2 px-6 py-3 bg-white text-navy font-bold rounded-lg hover:bg-gray-100 transition shadow-lg group/btn"
                                >
                                    Haberi Oku
                                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            {newsList.length > 1 && (
                <div className="absolute z-20 bottom-8 right-8 md:bottom-12 md:right-12 flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={prevSlide}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 transition"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 transition"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        {newsList.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all ${currentIndex === index
                                    ? "bg-gold text-navy shadow-lg scale-110"
                                    : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/20"
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
