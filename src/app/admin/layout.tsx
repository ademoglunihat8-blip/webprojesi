import Link from "next/link";
import { Newspaper, Users, MapPin, LogOut } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-zinc-50 font-sans overflow-hidden">

            {/* Sidebar */}
            <aside className="w-64 bg-navy text-white flex flex-col justify-between hidden md:flex">
                <div>
                    {/* Logo Area */}
                    <div className="h-20 flex items-center justify-center border-b border-white/10 px-6">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-white text-navy flex items-center justify-center font-bold text-lg">Öİ</div>
                            <span className="font-extrabold text-lg tracking-wider">ÖZ İŞ ADMIN</span>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <nav className="mt-8 px-4 space-y-2">
                        <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-3 bg-white/10 text-gold font-semibold rounded-xl transition-colors"
                        >
                            <Newspaper className="w-5 h-5" />
                            Haber Yönetimi
                        </Link>
                        <Link
                            href="/admin/teskilat"
                            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white font-medium rounded-xl transition-colors"
                        >
                            <Users className="w-5 h-5" />
                            Teşkilat/Kişi Yönetimi
                        </Link>
                        <Link
                            href="/admin/subeler"
                            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white font-medium rounded-xl transition-colors"
                        >
                            <MapPin className="w-5 h-5" />
                            Şube/Harita Yönetimi
                        </Link>
                    </nav>
                </div>

                {/* Logout Button */}
                <div className="p-4 border-t border-white/10">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-500/10 hover:text-red-200 font-bold rounded-xl transition-colors w-full"
                    >
                        <LogOut className="w-5 h-5" />
                        Çıkış Yap
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-20 bg-white border-b border-gray-100 flex items-center px-8 shadow-sm">
                    <h1 className="text-2xl font-bold text-navy">Yönetim Paneli</h1>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
