"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Scale, FileSignature, HeartHandshake } from "lucide-react";
import { getVisionContent, VisionContent } from "@/lib/firestore";

const CARD_ICONS = [
    <Scale key="scale" className="w-12 h-12 text-gold group-hover:text-white transition-colors" />,
    <FileSignature key="filesig" className="w-12 h-12 text-gold group-hover:text-white transition-colors" />,
    <HeartHandshake key="heart" className="w-12 h-12 text-gold group-hover:text-white transition-colors" />,
];

const DEFAULT_CONTENT: VisionContent = {
    badge: "VİZYONUMUZ",
    titleLine1: "Temel Prensibimiz",
    titleLine2: "İşçiye Yarar Sağlamak",
    description: "Güçlü sendika, güvenceli gelecek demektir. İşçi haklarını merkeze alan çağdaş sendikacılık anlayışımızla tüm üyelerimize değer katıyoruz.",
    cards: [
        { title: "Hukuksal Destek", description: "İş hayatında karşılaştığınız her türlü hukuki sorunda, uzman avukat kadromuzla arkanızdayız. Hakkınızı savunmak bizim birincil önceliğimizdir." },
        { title: "Toplu İş Sözleşmeleri", description: "Masaya işçinin gücüyle oturuyor, alın terinizin tam karşılığını almak için enflasyona ezdirmeyen, güçlü sözleşmelere imza atıyoruz." },
        { title: "Sosyal Haklar", description: "Sadece maaş değil; ikramiye, eğitim yardımı, sağlık sigortası gibi yaşam kalitenizi artıracak kapsamlı sosyal kazanımlar sağlıyoruz." },
    ],
    ctaTitle: "Birlikte Daha Güçlüyüz",
    ctaSubtitle: "Siz de sendikamıza katılın, haklarınızı güvence altına alın.",
    ctaButtonText: "Hemen Üye Ol",
    ctaButtonUrl: "https://www.turkiye.gov.tr/",
};

export default function VisionSection() {
    const [content, setContent] = useState<VisionContent>(DEFAULT_CONTENT);

    useEffect(() => {
        getVisionContent()
            .then(setContent)
            .catch(() => { /* Hata durumunda default göster */ });
    }, []);

    // Üst bölüm: en az bir alan doluysa göster
    const hasTopSection = !!(content.badge || content.titleLine1 || content.titleLine2 || content.description);

    // CTA bölümü: en az ctaTitle doluysa göster
    const hasCta = !!(content.ctaTitle);

    return (
        <section className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Üst bölüm — opsiyonel */}
                {hasTopSection && (
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            {content.badge && (
                                <h2 className="text-sm font-bold tracking-widest text-lightblue uppercase mb-3">{content.badge}</h2>
                            )}
                            {(content.titleLine1 || content.titleLine2) && (
                                <h3 className="text-3xl md:text-5xl font-extrabold text-navy leading-tight">
                                    {content.titleLine1}
                                    {content.titleLine1 && content.titleLine2 && <br className="hidden md:block" />}
                                    {content.titleLine2 && ` ${content.titleLine2}`}
                                </h3>
                            )}
                            {content.description && (
                                <p className="mt-6 text-lg text-gray-600">{content.description}</p>
                            )}
                        </motion.div>
                    </div>
                )}

                {/* Kartlar */}
                {content.cards.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        {content.cards.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="group"
                            >
                                <div className="bg-zinc-50 rounded-3xl p-10 h-full border border-gray-100 hover:bg-navy transition-colors duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2 transform">
                                    <div className="w-20 h-20 rounded-2xl bg-white shadow-md flex items-center justify-center mb-8 group-hover:bg-white/10 transition-colors duration-500">
                                        {CARD_ICONS[index % CARD_ICONS.length]}
                                    </div>
                                    <h4 className="text-2xl font-bold text-navy mb-4 group-hover:text-white transition-colors duration-500">
                                        {item.title}
                                    </h4>
                                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-300 transition-colors duration-500">
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* CTA Ribbon — opsiyonel */}
                {hasCta && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="mt-20 bg-gradient-to-r from-navy to-[#0F264A] rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
                    >
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
                        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-gold/10 rounded-full blur-2xl" />

                        <div className="relative z-10 text-center md:text-left">
                            <h4 className="text-2xl md:text-3xl font-bold text-white mb-2">{content.ctaTitle}</h4>
                            {content.ctaSubtitle && (
                                <p className="text-gray-300 text-lg">{content.ctaSubtitle}</p>
                            )}
                        </div>

                        {content.ctaButtonText && content.ctaButtonUrl && (
                            <div className="relative z-10 flex-shrink-0">
                                <a
                                    href={content.ctaButtonUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 bg-gold text-navy px-8 py-4 rounded-full font-extrabold text-lg hover:bg-white hover:text-navy transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    {content.ctaButtonText}
                                </a>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
