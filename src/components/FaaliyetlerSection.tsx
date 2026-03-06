"use client";

import { useEffect, useState } from "react";
import { getNews, NewsItem } from "@/lib/firestore";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
    TIS: "Toplu İş Sözleşmesi",
    ETKINLIK: "Etkinlik",
    MEVZUAT: "Mevzuat",
    EGITIM: "Eğitim",
    GENEL: "Genel",
    TESKILAT: "Teşkilat",
};

const CATEGORY_COLORS: Record<string, string> = {
    TIS: "bg-blue-100 text-blue-700",
    ETKINLIK: "bg-green-100 text-green-700",
    MEVZUAT: "bg-orange-100 text-orange-700",
    EGITIM: "bg-purple-100 text-purple-700",
    GENEL: "bg-gray-100 text-gray-700",
    TESKILAT: "bg-red-100 text-red-700",
};

export default function FaaliyetlerSection() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getNews()
            .then((data) => setNews(data.slice(0, 6))) // son 6 haber
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <section id="haberler" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 flex justify-center">
                    <div className="w-10 h-10 border-4 border-navy/20 border-t-navy rounded-full animate-spin" />
                </div>
            </section>
        );
    }

    if (news.length === 0) return null;

    return (
        <section id="faaliyetler" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Başlık */}
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <p className="text-gold font-bold text-sm uppercase tracking-widest mb-2">Etkinlik & Haberler</p>
                        <h2 className="text-4xl font-extrabold text-navy">Duyurular</h2>
                        <div className="mt-3 w-16 h-1 bg-gold rounded-full" />
                    </div>
                    <Link
                        href="/haberler"
                        className="hidden md:flex items-center gap-2 text-navy font-bold hover:text-gold transition-colors text-sm"
                    >
                        Tümünü Gör <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {news.map((item) => (
                        <Link
                            key={item.id}
                            href={`/haber/${item.id}`}
                            className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
                        >
                            {/* Görsel */}
                            <div className="relative h-48 overflow-hidden bg-navy">
                                <img
                                    src={item.imageUrl || "/default-news.png"}
                                    alt={item.title}
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* İçerik */}
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[item.category] ?? "bg-gray-100 text-gray-600"}`}>
                                        {CATEGORY_LABELS[item.category] ?? item.category}
                                    </span>
                                    {item.createdAt && (
                                        <span className="text-xs text-gray-400">
                                            {new Date(item.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-extrabold text-navy text-base leading-snug mb-3 group-hover:text-gold transition-colors line-clamp-2">
                                    {item.title}
                                </h3>
                                <div className="flex items-center gap-1.5 text-gold font-bold text-sm">
                                    Haberi Oku <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
