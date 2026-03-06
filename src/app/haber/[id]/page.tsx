"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getNewsById, NewsItem } from "@/lib/firestore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import Link from "next/link";

const CATEGORY_LABELS: Record<string, string> = {
    TIS: "Toplu İş Sözleşmesi",
    ETKINLIK: "Etkinlik",
    MEVZUAT: "Mevzuat",
    EGITIM: "Eğitim",
    GENEL: "Genel",
    TESKILAT: "Teşkilat",
};

export default function HaberDetay() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const [news, setNews] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!id) return;
        getNewsById(id)
            .then((data) => {
                if (!data) setNotFound(true);
                else setNews(data);
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [id]);

    // Düz metin satır sonlarını <br>'e çevir (HTML içeriklerini bozmaz)
    const formatContent = (content: string) => {
        // HTML tag içeriyorsa direkt gönder, yoksa \n → <br>
        if (/<[a-z][\s\S]*>/i.test(content)) {
            return content;
        }
        return content.replace(/\n/g, "<br />");
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-zinc-50">
                {loading ? (
                    <div className="flex items-center justify-center h-[60vh]">
                        <div className="w-12 h-12 border-4 border-navy/20 border-t-navy rounded-full animate-spin" />
                    </div>
                ) : notFound || !news ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                        <p className="text-2xl font-bold text-navy">Haber bulunamadı.</p>
                        <Link href="/" className="px-6 py-3 bg-navy text-white font-bold rounded-xl hover:bg-opacity-90 transition">
                            Ana Sayfaya Dön
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Hero */}
                        <div className="w-full bg-navy">
                            <div className="max-w-4xl mx-auto">
                                <img
                                    src={news.imageUrl || "/default-news.png"}
                                    alt={news.title}
                                    className="w-full max-h-[600px] object-contain"
                                />
                            </div>
                        </div>
                        {/* Başlık */}
                        <div className="max-w-4xl mx-auto px-4 pt-6">
                            <span className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-wider text-navy bg-gold rounded-full">
                                {CATEGORY_LABELS[news.category] ?? news.category}
                            </span>
                            <h1 className="text-2xl md:text-4xl font-extrabold text-navy leading-tight">
                                {news.title}
                            </h1>
                        </div>

                        {/* Content */}
                        <div className="max-w-4xl mx-auto px-4 py-10">
                            {/* Meta */}
                            <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-gray-200">
                                <button
                                    onClick={() => router.back()}
                                    className="flex items-center gap-2 text-sm font-bold text-navy hover:text-gold transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Geri
                                </button>
                                {news.createdAt && (
                                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(news.createdAt).toLocaleDateString("tr-TR", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                    <Tag className="w-4 h-4" />
                                    {CATEGORY_LABELS[news.category] ?? news.category}
                                </div>
                            </div>

                            {/* Body */}
                            <style>{`
                                .news-content table {
                                    border-collapse: collapse !important;
                                    width: 100%;
                                    margin: 16px 0;
                                    font-size: 0.95rem;
                                }
                                .news-content th, .news-content td {
                                    border: 1px solid #d1d5db !important;
                                    padding: 8px 12px !important;
                                    text-align: left;
                                }
                                .news-content th {
                                    background: #1a2e5e !important;
                                    color: #fff !important;
                                    font-weight: 700;
                                }
                                .news-content tr:nth-child(even) td {
                                    background: #f9fafb;
                                }
                                .news-content p { margin: 0.75rem 0; }
                            `}</style>
                            <div
                                className="news-content text-gray-700 text-base leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: formatContent(news.content) }}
                            />

                            {/* Ek Fotoğraflar */}
                            {news.images && news.images.length > 0 && (
                                <div className="mt-10">
                                    <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                                        <span className="w-4 h-1 bg-gold rounded-full inline-block" />
                                        Fotoğraflar
                                    </h2>
                                    <div className="flex flex-col gap-6">
                                        {news.images.map((img, i) => (
                                            <img
                                                key={i}
                                                src={img}
                                                alt={`Fotoğraf ${i + 1}`}
                                                className="w-full rounded-xl object-contain bg-navy max-h-[600px]"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Footer Nav */}
                            <div className="mt-12 pt-8 border-t border-gray-200">
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white font-bold rounded-xl hover:bg-opacity-90 transition"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Ana Sayfaya Dön
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </>
    );
}
