"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAboutContent, AboutContent, DEFAULT_ABOUT } from "@/lib/firestore";
import { motion } from "framer-motion";
import { Users, Shield, Target } from "lucide-react";

export default function HakkimizdaPage() {
    const [content, setContent] = useState<AboutContent>(DEFAULT_ABOUT);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAboutContent()
            .then(data => setContent(data))
            .catch(() => setContent(DEFAULT_ABOUT))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-zinc-100 border-t-gold rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="relative py-24 bg-navy overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-gold/10 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 bg-gold/20 text-gold rounded-full text-sm font-bold tracking-widest mb-6"
                    >
                        KURUMSAL
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-extrabold text-white mb-6"
                    >
                        {content.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-300 max-w-2xl mx-auto font-medium"
                    >
                        {content.subtitle}
                    </motion.p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="relative">
                                <div className="absolute -left-4 -top-4 w-24 h-24 bg-gold/10 rounded-2xl -z-10"></div>
                                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-navy/5 rounded-2xl -z-10"></div>
                                <img
                                    src={content.imageUrl || "/default-news.png"}
                                    alt="Hakkımızda"
                                    className="rounded-3xl shadow-2xl w-full h-[500px] object-contain border border-gray-100 bg-zinc-50 p-2"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div className="prose prose-lg text-gray-600 max-w-none whitespace-pre-line leading-relaxed">
                                {content.content}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-100">
                                <div className="text-center p-4">
                                    <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gold">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-bold text-navy text-sm uppercase">Güçlü Üye</h4>
                                </div>
                                <div className="text-center p-4">
                                    <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gold">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-bold text-navy text-sm uppercase">Tam Güvence</h4>
                                </div>
                                <div className="text-center p-4">
                                    <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gold">
                                        <Target className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-bold text-navy text-sm uppercase">Net Hedef</h4>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
