"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Instagram, Twitter, Facebook, ArrowRight } from "lucide-react";
import { getFooterContent, DEFAULT_FOOTER, FooterContent } from "@/lib/firestore";

export default function Footer() {
    const [footer, setFooter] = useState<FooterContent>(DEFAULT_FOOTER);

    useEffect(() => {
        getFooterContent()
            .then(data => setFooter(data))
            .catch(() => setFooter(DEFAULT_FOOTER));
    }, []);

    return (
        <footer className="bg-navy text-white pt-20 pb-10 relative overflow-hidden">
            {/* Decorative shapes */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
            <div className="absolute -right-40 -top-40 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Logo & About */}
                    <div className="col-span-1 lg:col-span-1">
                        <div className="flex items-center gap-3 mb-8">
                            <img
                                src="/logo-horizontal.png"
                                alt="Öz Belediye İş Sendikası"
                                className="h-16 w-auto object-contain bg-white rounded-xl p-2.5 shadow-lg border border-gray-100"
                            />
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            {footer.description}
                        </p>
                        <div className="flex gap-4">
                            <a href={footer.instagram || "#"} target="_blank" rel="noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href={footer.twitter || "#"} target="_blank" rel="noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-all">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href={footer.facebook || "#"} target="_blank" rel="noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-all">
                                <Facebook className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="col-span-1 lg:col-span-3">
                        <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <span className="w-4 h-1 bg-gold rounded-full" />
                            İletişim Bilgileri
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 text-gold border border-white/10">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h5 className="font-bold mb-1 text-sm uppercase tracking-wider text-gray-300">Genel Merkez</h5>
                                    <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">{footer.address}</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 text-gold border border-white/10">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold mb-1 text-sm uppercase tracking-wider text-gray-300">Telefon</h5>
                                        <p className="text-sm text-gray-400 font-mono tracking-wide">{footer.phone}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 text-gold border border-white/10">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold mb-1 text-sm uppercase tracking-wider text-gray-300">E-Posta</h5>
                                        <p className="text-sm text-gray-400">{footer.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} Öz İş Belediye Sendikası. Tüm hakları saklıdır.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        {footer.bottomLinks?.map((link, idx) => (
                            <a key={idx} href={link.url} className="hover:text-white transition-colors">
                                {link.title}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
