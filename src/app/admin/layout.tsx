"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Newspaper, Users, MapPin, Eye, LogOut, Layout } from "lucide-react";
import { getAdminSession, clearAdminSession } from "@/lib/adminAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const session = getAdminSession();
        if (!session && pathname !== "/admin/login") {
            router.replace("/admin/login");
        } else {
            setChecked(true);
        }
    }, [pathname, router]);

    // Login sayfasında sidebar gösterme
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    if (!checked) {
        return (
            <div className="min-h-screen bg-navy flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-white/20 border-t-gold rounded-full animate-spin" />
            </div>
        );
    }

    const handleLogout = () => {
        clearAdminSession();
        router.push("/admin/login");
    };

    return (
        <div className="flex h-screen bg-zinc-50 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-navy text-white flex flex-col justify-between hidden md:flex">
                <div>
                    <div className="h-20 flex items-center justify-center border-b border-white/10 px-4">
                        <Link href="/" className="flex items-center gap-2">
                            <img src="/logo-horizontal.png" alt="Logo" className="h-12 w-auto object-contain bg-white rounded p-1" />
                            <span className="font-extrabold text-sm tracking-wider text-white">ADMIN</span>
                        </Link>
                    </div>

                    <nav className="mt-8 px-4 space-y-2">
                        <Link
                            href="/admin"
                            className={`flex items-center gap-3 px-4 py-3 font-semibold rounded-xl transition-colors ${pathname === "/admin" ? "bg-white/10 text-gold" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
                        >
                            <Newspaper className="w-5 h-5" />
                            Haber Yönetimi
                        </Link>
                        <Link
                            href="/admin/teskilat"
                            className={`flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-colors ${pathname === "/admin/teskilat" ? "bg-white/10 text-gold" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
                        >
                            <Users className="w-5 h-5" />
                            Teşkilat/Kişi Yönetimi
                        </Link>
                        <Link
                            href="/admin/subeler"
                            className={`flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-colors ${pathname === "/admin/subeler" ? "bg-white/10 text-gold" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
                        >
                            <MapPin className="w-5 h-5" />
                            Şube/Harita Yönetimi
                        </Link>
                        <Link
                            href="/admin/vizyon"
                            className={`flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-colors ${pathname === "/admin/vizyon" ? "bg-white/10 text-gold" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
                        >
                            <Eye className="w-5 h-5" />
                            Vizyon Yönetimi
                        </Link>
                        <Link
                            href="/admin/hakkimizda"
                            className={`flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-colors ${pathname === "/admin/hakkimizda" ? "bg-white/10 text-gold" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
                        >
                            <Users className="w-5 h-5" />
                            Hakkımızda Yönetimi
                        </Link>
                        <Link
                            href="/admin/footer"
                            className={`flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-colors ${pathname === "/admin/footer" ? "bg-white/10 text-gold" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
                        >
                            <Layout className="w-5 h-5" />
                            İletişim Paneli
                        </Link>
                    </nav>
                </div>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-500/10 hover:text-red-200 font-bold rounded-xl transition-colors w-full"
                    >
                        <LogOut className="w-5 h-5" />
                        Çıkış Yap
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-20 bg-white border-b border-gray-100 flex items-center px-8 shadow-sm">
                    <h1 className="text-2xl font-bold text-navy">Yönetim Paneli</h1>
                </header>
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}
