import { MapPin, Phone, Mail, Instagram, Twitter, Facebook, ArrowRight } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-navy text-white pt-20 pb-10 relative overflow-hidden">
            {/* Decorative shapes */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
            <div className="absolute -right-40 -top-40 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Logo & About */}
                    <div className="col-span-1 lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center text-navy font-bold text-xl shadow-lg">
                                Öİ
                            </div>
                            <div className="flex flex-col">
                                <span className="font-extrabold text-white text-xl leading-tight tracking-wider">ÖZ İŞ</span>
                                <span className="text-sm text-gold font-medium">Belediye Sendikası</span>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            İşçi haklarını merkeze alan çağdaş sendikacılık anlayışımızla, emeğin ve alın terinin savunucusu olmaya devam ediyoruz.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-all">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-all">
                                <Facebook className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <span className="w-4 h-1 bg-gold rounded-full" />
                            Hızlı Erişim
                        </h4>
                        <ul className="space-y-3">
                            {['Hakkımızda', 'Teşkilatımız', 'Haberler & Duyurular', 'Toplu İş Sözleşmeleri', 'Sıkça Sorulan Sorular'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-gray-400 hover:text-gold transition-colors flex items-center gap-2 group text-sm">
                                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all font-bold" />
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="col-span-1 lg:col-span-2">
                        <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <span className="w-4 h-1 bg-gold rounded-full" />
                            İletişim Bilgileri
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 text-gold border border-white/10">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h5 className="font-bold mb-1 text-sm uppercase tracking-wider text-gray-300">Genel Merkez</h5>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        Kavaklıdere Mah. Atatürk Bulvarı No: 123/4<br />
                                        Çankaya / Ankara
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 text-gold border border-white/10">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold mb-1 text-sm uppercase tracking-wider text-gray-300">Telefon</h5>
                                        <p className="text-sm text-gray-400 font-mono tracking-wide">+90 (312) 444 00 00</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 text-gold border border-white/10">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold mb-1 text-sm uppercase tracking-wider text-gray-300">E-Posta</h5>
                                        <p className="text-sm text-gray-400">iletisim@ozisbelediye.org.tr</p>
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
                        <a href="#" className="hover:text-white transition-colors">KVKK Aydınlatma Metni</a>
                        <a href="#" className="hover:text-white transition-colors">Çerez Politikası</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
