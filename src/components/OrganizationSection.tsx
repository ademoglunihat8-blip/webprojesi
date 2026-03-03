"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const president = {
    name: "Bülent Gök",
    title: "Genel Başkan",
    quote: "İnsanı yaşat ki devlet yaşasın prensibiyle, işçi kardeşlerimizin alın terini en yüce değer biliyoruz. Her bir üyemizin hakkı, bizim onurumuzdur.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
};

const vicePresidents = [
    {
        id: 1,
        name: "Ahmet Yılmaz",
        title: "Genel Başkan Yardımcısı",
        role: "Teşkilatlanma",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Ayşe Demir",
        title: "Genel Başkan Yardımcısı",
        role: "Eğitim ve Sosyal İşler",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Mehmet Kaya",
        title: "Genel Başkan Yardımcısı",
        role: "Mali İşler",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Fatma Şahin",
        title: "Genel Başkan Yardımcısı",
        role: "Mevzuat ve TİS",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
];

export default function OrganizationSection() {
    return (
        <section id="teskilat" className="py-24 bg-zinc-50 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-lightblue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-sm font-bold tracking-widest text-gold uppercase mb-3">Teşkilatımız</h2>
                    <h3 className="text-3xl md:text-5xl font-extrabold text-navy">Öz İş Ailesi</h3>
                    <p className="mt-6 text-lg text-gray-600">
                        Gücümüzü birliğimizden, ilhamımızı işçi kardeşlerimizin alın terinden alıyoruz.
                        Güçlü kadromuzla her an yanınızdayız.
                    </p>
                </div>

                {/* President Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto mb-20"
                >
                    <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(10,25,47,0.12)] overflow-hidden flex flex-col md:flex-row border border-gray-100">
                        <div className="md:w-2/5 h-80 md:h-auto relative">
                            <img
                                src={president.image}
                                alt={president.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent md:hidden" />
                            <div className="absolute bottom-4 left-6 md:hidden">
                                <h4 className="text-2xl font-bold text-white">{president.name}</h4>
                                <p className="text-gold font-medium">{president.title}</p>
                            </div>
                        </div>
                        <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center relative bg-white">
                            <Quote className="absolute top-8 left-8 w-16 h-16 text-gray-100 -z-10" />
                            <div className="hidden md:block mb-6">
                                <h4 className="text-3xl font-extrabold text-navy">{president.name}</h4>
                                <p className="text-gold font-bold tracking-wide uppercase text-sm mt-1">{president.title}</p>
                            </div>
                            <p className="text-xl md:text-2xl text-gray-700 italic font-medium leading-relaxed">
                                "{president.quote}"
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Vice Presidents Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {vicePresidents.map((vp, index) => (
                        <motion.div
                            key={vp.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(10,25,47,0.08)] hover:shadow-[0_20px_40px_rgba(10,25,47,0.15)] transition-shadow duration-300 border border-gray-50 h-full flex flex-col">
                                <div className="h-64 overflow-hidden relative">
                                    <img
                                        src={vp.image}
                                        alt={vp.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-navy/20 group-hover:bg-transparent transition-colors duration-300" />
                                </div>
                                <div className="p-6 text-center flex-grow flex flex-col justify-center bg-white relative z-10 bottom-0">
                                    <h4 className="text-xl font-bold text-navy mb-1">{vp.name}</h4>
                                    <p className="text-sm text-gray-500 font-medium mb-3">{vp.title}</p>
                                    <div className="w-12 h-0.5 bg-gold mx-auto mb-3" />
                                    <p className="text-sm font-bold text-lightblue uppercase tracking-wider">{vp.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
