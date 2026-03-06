"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Search } from "lucide-react";
import { getNews, NewsItem, NewsCategory } from "@/lib/firestore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CATEGORY_LABELS: Record<string, string> = {
    TIS: "Toplu İş Sözleşmesi",
    ETKINLIK: "Etkinlik",
    MEVZUAT: "Mevzuat",
    EGITIM: "Eğitim",
    GENEL: "Genel",
    TESKILAT: "Teşkilat",
    FAALIYETLER: "Faaliyetler",
};

const CATEGORY_COLORS: Record<string, string> = {
    TIS: "bg-blue-100 text-blue-700 border-blue-200",
    ETKINLIK: "bg-green-100 text-green-700 border-green-200",
    MEVZUAT: "bg-orange-100 text-orange-700 border-orange-200",
    EGITIM: "bg-purple-100 text-purple-700 border-purple-200",
    GENEL: "bg-gray-100 text-gray-700 border-gray-200",
    TESKILAT: "bg-red-100 text-red-700 border-red-200",
    FAALIYETLER: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

const CATEGORY_ACTIVE: Record<string, string> = {
    TIS: "bg-blue-600 text-white",
    ETKINLIK: "bg-green-600 text-white",
    MEVZUAT: "bg-orange-500 text-white",
    EGITIM: "bg-purple-600 text-white",
    GENEL: "bg-gray-600 text-white",
    TESKILAT: "bg-red-600 text-white",
    FAALIYETLER: "bg-yellow-500 text-white",
};

export default function HaberlerPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>("TUMU");
    const [search, setSearch] = useState("");

    useEffect(() => {
        getNews()
            .then((data) => setNews(data.filter((n) => n.status === "PUBLISHED")))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Mevcut kategorileri haberlerden hesapla
    const availableCategories = useMemo(() => {
        const cats = Array.from(new Set(news.map((n) => n.category)));
        return cats.sort((a, b) => (CATEGORY_LABELS[a] ?? a).localeCompare(CATEGORY_LABELS[b] ?? b));
    }, [news]);

    const filtered = useMemo(() => {
        return news.filter((item) => {
            const matchCat = activeCategory === "TUMU" || item.category === activeCategory;
            const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
            return matchCat && matchSearch;
        });
    }, [news, activeCategory, search]);

    // Kategori bazlı gruplama (Tümü seçiliyken)
    const grouped = useMemo(() => {
        if (activeCategory !== "TUMU") return null;
        const groups: Record<string, NewsItem[]> = {};
        for (const item of filtered) {
            if (!groups[item.category]) groups[item.category] = [];
            groups[item.category].push(item);
        }
        return groups;
    }, [filtered, activeCategory]);

    return (
        <div className="min-h-screen bg-zinc-50 font-sans">
            <Navbar />

            {/* Hero Banner */}
            <div className="bg-[#1a2e5e] pt-28 pb-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Ana Sayfaya Dön
                    </Link>
                    <p className="text-amber-400 font-bold text-sm uppercase tracking-widest mb-2">
                        Etkinlik &amp; Haberler
                    </p>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                        Tüm Duyurular
                    </h1>
                    <div className="w-16 h-1 bg-amber-400 rounded-full" />
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Arama + Tab Filtreleri */}
                <div className="flex flex-col md:flex-row gap-4 mb-10 items-start md:items-center justify-between">
                    {/* Kategori Tabları */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setActiveCategory("TUMU")}
                            className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${activeCategory === "TUMU"
                                    ? "bg-[#1a2e5e] text-white border-[#1a2e5e]"
                                    : "bg-white text-gray-600 border-gray-200 hover:border-[#1a2e5e] hover:text-[#1a2e5e]"
                                }`}
                        >
                            Tümü {activeCategory === "TUMU" && <span className="ml-1 opacity-70">({news.length})</span>}
                        </button>
                        {availableCategories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${activeCategory === cat
                                        ? CATEGORY_ACTIVE[cat] ?? "bg-[#1a2e5e] text-white"
                                        : `bg-white border-gray-200 hover:border-current ${CATEGORY_COLORS[cat] ?? "text-gray-600"}`
                                    }`}
                            >
                                {CATEGORY_LABELS[cat] ?? cat}
                                {activeCategory === cat && (
                                    <span className="ml-1 opacity-70">({filtered.length})</span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Arama */}
                    <div className="relative w-full md:w-72 flex-shrink-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Haber ara..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#1a2e5e]"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-24">
                        <div className="w-12 h-12 border-4 border-[#1a2e5e]/20 border-t-[#1a2e5e] rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24 text-gray-400">
                        <p className="text-lg font-medium">Haber bulunamadı.</p>
                    </div>
                ) : activeCategory === "TUMU" && grouped ? (
                    /* Gruplu görünüm */
                    <div className="space-y-14">
                        {Object.entries(grouped).map(([cat, items]) => (
                            <div key={cat}>
                                {/* Kategori Başlığı */}
                                <div className="flex items-center gap-3 mb-6">
                                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${CATEGORY_COLORS[cat] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                                        {CATEGORY_LABELS[cat] ?? cat}
                                    </span>
                                    <div className="flex-1 h-px bg-gray-200" />
                                    <button
                                        onClick={() => setActiveCategory(cat)}
                                        className="text-xs font-bold text-[#1a2e5e] hover:text-amber-500 transition-colors flex items-center gap-1"
                                    >
                                        Tümünü gör <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>

                                {/* Kart Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {items.map((item) => (
                                        <NewsCard key={item.id} item={item} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Tek kategori görünümü */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((item) => (
                            <NewsCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

function NewsCard({ item }: { item: NewsItem }) {
    return (
        <Link
            href={`/haber/${item.id}`}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1 flex flex-col"
        >
            <div className="relative h-48 overflow-hidden bg-[#1a2e5e]">
                <img
                    src={item.imageUrl || "/default-news.png"}
                    alt={item.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
            </div>
            <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[item.category] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                        {CATEGORY_LABELS[item.category] ?? item.category}
                    </span>
                    {item.createdAt && (
                        <span className="text-xs text-gray-400">
                            {new Date(item.createdAt).toLocaleDateString("tr-TR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </span>
                    )}
                </div>
                <h3 className="font-extrabold text-[#1a2e5e] text-base leading-snug mb-3 group-hover:text-amber-500 transition-colors line-clamp-2 flex-1">
                    {item.title}
                </h3>
                <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm mt-auto">
                    Haberi Oku <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </Link>
    );
}
