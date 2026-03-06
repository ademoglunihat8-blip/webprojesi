"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { getMembers, Member, MemberRole, MEMBER_ROLE_LABELS } from "@/lib/firestore";

// Kurul renkleri
const ROLE_COLORS: Record<MemberRole, { badge: string; accent: string }> = {
    BASKAN: { badge: "bg-amber-100 text-amber-800 border-amber-200", accent: "bg-amber-400" },
    DENETLEME_KURULU: { badge: "bg-blue-100 text-blue-800 border-blue-200", accent: "bg-blue-500" },
    GENEL_YONETIM_KURULU: { badge: "bg-navy/10 text-navy border-navy/20", accent: "bg-navy" },
    GENEL_DISIPLIN_KURULU: { badge: "bg-red-100 text-red-800 border-red-200", accent: "bg-red-500" },
};

// Grupların sıralama önceliği
const ROLE_ORDER: MemberRole[] = [
    "BASKAN",
    "GENEL_YONETIM_KURULU",
    "DENETLEME_KURULU",
    "GENEL_DISIPLIN_KURULU",
];

export default function OrganizationSection() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMembers()
            .then(setMembers)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <section id="teskilat" className="py-24 bg-zinc-50">
                <div className="max-w-7xl mx-auto px-4 flex justify-center">
                    <div className="w-10 h-10 border-4 border-navy/20 border-t-navy rounded-full animate-spin" />
                </div>
            </section>
        );
    }

    if (members.length === 0) return null;

    const president = members.find((m) => m.role === "BASKAN");
    // Diğerlerini kurul gruplarına ayır
    const grouped = ROLE_ORDER.filter((r) => r !== "BASKAN").reduce<Record<string, Member[]>>(
        (acc, role) => {
            const group = members.filter((m) => m.role === role);
            if (group.length > 0) acc[role] = group;
            return acc;
        },
        {}
    );

    return (
        <section id="teskilat" className="py-24 bg-zinc-50 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-lightblue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Başlık */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-sm font-bold tracking-widest text-gold uppercase mb-3">Teşkilatımız</h2>
                    <h3 className="text-3xl md:text-5xl font-extrabold text-navy">Öz İş Ailesi</h3>
                    <p className="mt-6 text-lg text-gray-600">
                        Gücümüzü birliğimizden, ilhamımızı işçi kardeşlerimizin alın terinden alıyoruz.
                        Güçlü kadromuzla her an yanınızdayız.
                    </p>
                </div>

                {/* Genel Başkan Kartı */}
                {president && (
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
                                    src={president.imageUrl || "/default-news.png"}
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
                                    {/* Kurul rozeti */}
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border mb-3 ${ROLE_COLORS.BASKAN.badge}`}>
                                        {MEMBER_ROLE_LABELS["BASKAN"]}
                                    </span>
                                    <h4 className="text-3xl font-extrabold text-navy">{president.name}</h4>
                                    <p className="text-gold font-bold tracking-wide uppercase text-sm mt-1">{president.title}</p>
                                    {president.department && (
                                        <p className="text-gray-400 text-sm mt-0.5">{president.department}</p>
                                    )}
                                </div>
                                {president.quote && (
                                    <p className="text-xl md:text-2xl text-gray-700 italic font-medium leading-relaxed">
                                        "{president.quote}"
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Kurul Grupları */}
                {Object.entries(grouped).map(([role, groupMembers]) => {
                    const memberRole = role as MemberRole;
                    const colors = ROLE_COLORS[memberRole];

                    return (
                        <div key={role} className="mb-16">
                            {/* Kurul Başlığı */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className={`w-1 h-8 rounded-full ${colors.accent}`} />
                                <h3 className="text-2xl font-extrabold text-navy">
                                    {MEMBER_ROLE_LABELS[memberRole]}
                                </h3>
                                <div className="flex-1 h-px bg-gray-200" />
                                <span className="text-sm text-gray-400 font-medium">{groupMembers.length} üye</span>
                            </div>

                            {/* Üye Kartları */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {groupMembers.map((member, index) => (
                                    <motion.div
                                        key={member.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.08 }}
                                        className="group"
                                    >
                                        <div className="bg-white rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(10,25,47,0.08)] hover:shadow-[0_20px_40px_rgba(10,25,47,0.15)] transition-shadow duration-300 border border-gray-50 h-full flex flex-col">
                                            {/* Fotoğraf */}
                                            <div className="h-56 overflow-hidden relative">
                                                <img
                                                    src={member.imageUrl || "/default-news.png"}
                                                    alt={member.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-navy/20 group-hover:bg-transparent transition-colors duration-300" />
                                                {/* Kurul rozeti – fotoğrafın üstünde */}
                                                <div className="absolute top-3 left-3">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${colors.badge}`}>
                                                        {MEMBER_ROLE_LABELS[memberRole]}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Bilgi */}
                                            <div className="p-5 text-center flex-grow flex flex-col justify-center bg-white">
                                                <h4 className="text-lg font-bold text-navy mb-1">{member.name}</h4>
                                                <p className="text-sm text-gray-500 font-medium">{member.title}</p>
                                                {member.department && (
                                                    <>
                                                        <div className={`w-10 h-0.5 mx-auto my-3 ${colors.accent}`} />
                                                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                                            {member.department}
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
