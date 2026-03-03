"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Map, Building2 } from "lucide-react";

// Temsili Şube Verileri
const branches = [
    { id: 1, city: "Ankara", name: "İç Anadolu Bölge Şubesi", address: "Kavaklıdere Mah. Atatürk Bulvarı No: 123 Çankaya / Ankara", phone: "0312 444 00 00", top: "45%", left: "42%" },
    { id: 2, city: "İstanbul", name: "Marmara Bölge Şubesi", address: "Barbaros Bulvarı No: 45 Beşiktaş / İstanbul", phone: "0212 444 00 00", top: "30%", left: "25%" },
    { id: 3, city: "İzmir", name: "Ege Bölge Şubesi", address: "Alsancak Mah. Kıbrıs Şehitleri Cad. No: 12 Konak / İzmir", phone: "0232 444 00 00", top: "50%", left: "15%" },
    { id: 4, city: "Antalya", name: "Akdeniz Bölge Şubesi", address: "Muratpaşa Mah. Işıklar Cad. No: 8 Muratpaşa / Antalya", phone: "0242 444 00 00", top: "75%", left: "35%" },
    { id: 5, city: "Gaziantep", name: "Güneydoğu Bölge Şubesi", address: "Şehitkamil Mah. İncilipınar Cad. No: 5 Şehitkamil / Gaziantep", phone: "0342 444 00 00", top: "70%", left: "65%" },
    { id: 6, city: "Trabzon", name: "Karadeniz Bölge Şubesi", address: "Ortahisar Mah. Uzun Sokak No: 10 Ortahisar / Trabzon", phone: "0462 444 00 00", top: "25%", left: "68%" },
    { id: 7, city: "Erzurum", name: "Doğu Anadolu Bölge Şubesi", address: "Yakutiye Mah. Cumhuriyet Cad. No: 20 Yakutiye / Erzurum", phone: "0442 444 00 00", top: "40%", left: "80%" },
];

export default function ContactMapSection() {
    const [activeBranch, setActiveBranch] = useState<number | null>(null);

    // Basitleştirilmiş Türkiye Haritası SVG Path (Temsili)
    const turkeyPath = "M100 150 Q 200 50, 400 100 T 700 80 Q 800 100, 850 150 Q 900 200, 850 300 Q 800 400, 700 350 Q 600 300, 450 350 Q 300 400, 200 300 Q 100 200, 80 180 Z";

    return (
        <section id="iletisim" className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-sm font-bold tracking-widest text-lightblue uppercase mb-3 flex items-center justify-center gap-2">
                        <Map className="w-4 h-4 text-gold" />
                        İLETİŞİM VE ŞUBELERİMİZ
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-extrabold text-navy">Türkiye'nin Her Yerindeyiz</h3>
                    <p className="mt-6 text-lg text-gray-600">
                        Güçlü teşkilatımızla, yurdun dört bir yanındaki işçi kardeşlerimize bir adım uzaklıktayız. Size en yakın şubemizi haritadan bulabilirsiniz.
                    </p>
                </div>

                {/* Map & List Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Interactive Map */}
                    <div className="lg:col-span-8 bg-navy/5 rounded-3xl p-6 md:p-12 relative border border-gray-100 min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden">

                        {/* SVG Turkey Map Placeholder */}
                        <svg
                            viewBox="0 0 1000 500"
                            className="w-full h-full text-navy/10 drop-shadow-md"
                            style={{ filter: "drop-shadow(0px 10px 15px rgba(10,25,47,0.1))" }}
                        >
                            <path d={turkeyPath} fill="currentColor" stroke="#0A192F" strokeWidth="2" strokeOpacity="0.2" />
                        </svg>

                        {/* Title Overlay */}
                        <div className="absolute top-8 left-8 hidden md:block opacity-50">
                            <span className="text-4xl font-extrabold text-navy/20 tracking-wider">TÜRKİYE</span>
                        </div>

                        {/* Map Pins */}
                        {branches.map((branch) => (
                            <div
                                key={branch.id}
                                className="absolute"
                                style={{ top: branch.top, left: branch.left }}
                                onMouseEnter={() => setActiveBranch(branch.id)}
                                onMouseLeave={() => setActiveBranch(null)}
                            >
                                {/* Pin Icon */}
                                <div className="relative cursor-pointer group flex flex-col items-center">
                                    <div className="absolute -inset-2 rounded-full bg-gold/20 animate-ping opacity-75" />
                                    <motion.div
                                        whileHover={{ scale: 1.2, y: -5 }}
                                        className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-colors ${activeBranch === branch.id ? "bg-gold text-navy" : "bg-navy text-white"
                                            }`}
                                    >
                                        <MapPin className="w-4 h-4" />
                                    </motion.div>
                                    <span className={`mt-2 text-xs font-bold transition-opacity ${activeBranch === branch.id ? "opacity-100 text-navy" : "opacity-0"}`}>
                                        {branch.city}
                                    </span>
                                </div>

                                {/* Tooltip / Modal */}
                                <AnimatePresence>
                                    {activeBranch === branch.id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 md:w-72 bg-navy text-white p-5 rounded-2xl shadow-2xl border border-white/10 pointer-events-none"
                                        >
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-navy rotate-45 border-b border-r border-white/10" />
                                            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/10">
                                                <Building2 className="w-5 h-5 text-gold" />
                                                <h4 className="font-bold text-lg">{branch.city}</h4>
                                            </div>
                                            <p className="text-sm text-gray-300 font-medium mb-3">{branch.name}</p>
                                            <div className="flex items-start gap-2 mb-2 text-sm text-gray-400">
                                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gold" />
                                                <span className="leading-tight">{branch.address}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <Phone className="w-4 h-4 flex-shrink-0 text-gold" />
                                                <span>{branch.phone}</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                    {/* Quick List */}
                    <div className="lg:col-span-4 flex flex-col h-full">
                        <h4 className="text-2xl font-bold text-navy mb-6 flex items-center gap-2">
                            <span className="w-8 h-1 bg-gold rounded-full" />
                            Bölge Şubeleri
                        </h4>
                        <div className="flex-1 space-y-4">
                            {branches.slice(0, 5).map((branch) => (
                                <div
                                    key={branch.id}
                                    className="p-4 rounded-xl bg-zinc-50 border border-gray-100 hover:border-gold hover:bg-white transition-all cursor-pointer group flex items-start gap-4"
                                    onMouseEnter={() => setActiveBranch(branch.id)}
                                    onMouseLeave={() => setActiveBranch(null)}
                                >
                                    <div className={`w-10 h-10 rounded-lg flex flex-shrink-0 items-center justify-center transition-colors ${activeBranch === branch.id ? "bg-gold text-navy" : "bg-navy/5 text-navy group-hover:bg-gold group-hover:text-navy"}`}>
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-navy text-base">{branch.city}</h5>
                                        <p className="text-sm text-gray-500 mt-1">{branch.phone}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="text-center pt-4">
                                <button className="text-sm font-bold text-lightblue hover:text-navy transition-colors underline underline-offset-4">
                                    Tüm Şubeleri Gör
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
