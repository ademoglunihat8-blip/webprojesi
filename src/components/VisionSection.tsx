"use client";

import { motion } from "framer-motion";
import { Scale, FileSignature, HeartHandshake } from "lucide-react";

const visionItems = [
    {
        id: 1,
        icon: <Scale className="w-12 h-12 text-gold group-hover:text-white transition-colors" />,
        title: "Hukuksal Destek",
        description: "İş hayatında karşılaştığınız her türlü hukuki sorunda, uzman avukat kadromuzla arkanızdayız. Hakkınızı savunmak bizim birincil önceliğimizdir."
    },
    {
        id: 2,
        icon: <FileSignature className="w-12 h-12 text-gold group-hover:text-white transition-colors" />,
        title: "Toplu İş Sözleşmeleri",
        description: "Masaya işçinin gücüyle oturuyor, alın terinizin tam karşılığını almak için enflasyona ezdirmeyen, güçlü sözleşmelere imza atıyoruz."
    },
    {
        id: 3,
        icon: <HeartHandshake className="w-12 h-12 text-gold group-hover:text-white transition-colors" />,
        title: "Sosyal Haklar",
        description: "Sadece maaş değil; ikramiye, eğitim yardımı, sağlık sigortası gibi yaşam kalitenizi artıracak kapsamlı sosyal kazanımlar sağlıyoruz."
    }
];

export default function VisionSection() {
    return (
        <section className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-sm font-bold tracking-widest text-lightblue uppercase mb-3">VİZYONUMUZ</h2>
                        <h3 className="text-3xl md:text-5xl font-extrabold text-navy leading-tight">
                            Temel Prensibimiz <br className="hidden md:block" /> İşçiye Yarar Sağlamak
                        </h3>
                        <p className="mt-6 text-lg text-gray-600">
                            Güçlü sendika, güvenceli gelecek demektir. İşçi haklarını merkeze alan çağdaş sendikacılık anlayışımızla tüm üyelerimize değer katıyoruz.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {visionItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="group"
                        >
                            <div className="bg-zinc-50 rounded-3xl p-10 h-full border border-gray-100 hover:bg-navy transition-colors duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2 transform">
                                <div className="w-20 h-20 rounded-2xl bg-white shadow-md flex items-center justify-center mb-8 group-hover:bg-white/10 transition-colors duration-500">
                                    {item.icon}
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

                {/* Call to action ribbon */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-20 bg-gradient-to-r from-navy to-[#0F264A] rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
                >
                    {/* Decorative shapes */}
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
                    <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-gold/10 rounded-full blur-2xl" />

                    <div className="relative z-10 text-center md:text-left">
                        <h4 className="text-2xl md:text-3xl font-bold text-white mb-2">Birlikte Daha Güçlüyüz</h4>
                        <p className="text-gray-300 text-lg">Siz de sendikamıza katılın, haklarınızı güvence altına alın.</p>
                    </div>

                    <div className="relative z-10 flex-shrink-0">
                        <a
                            href="https://www.turkiye.gov.tr/"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 bg-gold text-navy px-8 py-4 rounded-full font-extrabold text-lg hover:bg-white hover:text-navy transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Hemen Üye Ol
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
