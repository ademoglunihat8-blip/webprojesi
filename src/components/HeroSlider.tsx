"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const newsItems = [
    {
        id: 1,
        title: "Kamu Çerçeve Sözleşmesi Görüşmeleri Başladı",
        excerpt: "İşçi haklarını koruyan, adil ve sürdürülebilir bir gelecek için masadayız. Tüm üyelerimizin hakları için mücadele ediyoruz.",
        date: "3 Mart 2026",
        category: "Toplu İş Sözleşmesi",
        image: "https://images.unsplash.com/photo-1541888082470-3d71241f893e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    },
    {
        id: 2,
        title: "1 Mayıs Emek ve Dayanışma Günü Hazırlıkları",
        excerpt: "Alanlarda coşkuyla buluşuyor, taleplerimizi tek ses, tek yürek olarak haykırıyoruz.",
        date: "1 Mart 2026",
        category: "Etkinlik",
        image: "https://images.unsplash.com/photo-1575320181282-9afab399332c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    },
    {
        id: 3,
        title: "Belediye Çalışanlarına Yönelik Seminer Düzenlendi",
        excerpt: "İş sağlığı ve güvenliği konusunda bilinçlendirme çalışmalarımız hız kesmeden devam ediyor.",
        date: "24 Şubat 2026",
        category: "Eğitim",
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    }
];

export default function HeroSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % newsItems.length);
        }, 10000); // 10 seconds

        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % newsItems.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + newsItems.length) % newsItems.length);
    };

    return (
        <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-navy group">
            {/* Slides */}
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
                        <img
                            src={newsItems[currentIndex].image}
                            alt={newsItems[currentIndex].title}
                            className="w-full h-full object-cover"
                        />
                        {/* Gradient Overlay for better readability */}
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
                                {newsItems[currentIndex].category}
                            </motion.span>

                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
                            >
                                {newsItems[currentIndex].title}
                            </motion.h1>

                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl"
                            >
                                {newsItems[currentIndex].excerpt}
                            </motion.p>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="flex items-center gap-4"
                            >
                                <button className="flex items-center gap-2 px-6 py-3 bg-white text-navy font-bold rounded-lg hover:bg-gray-100 transition shadow-lg group/btn">
                                    Haberi Oku
                                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                                <span className="text-gray-300 font-medium text-sm">
                                    {newsItems[currentIndex].date}
                                </span>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="absolute z-20 bottom-8 right-8 md:bottom-12 md:right-12 flex items-center gap-6">

                {/* Arrows */}
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

                {/* Numbered Pagination */}
                <div className="flex items-center gap-2">
                    {newsItems.map((_, index) => (
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
        </div>
    );
}
