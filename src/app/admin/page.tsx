"use client";

import { useState } from "react";
import { Plus, Image as ImageIcon, Edit2, Trash2, Search, MoreVertical } from "lucide-react";

export default function AdminDashboard() {
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <div className="max-w-6xl mx-auto pb-20">

            {/* Top Action Bar */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-xl font-bold text-navy">Haber Yönetimi</h2>
                    <p className="text-gray-500 text-sm mt-1">Sistemdeki tüm haberleri görüntüleyin ve yönetin.</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-md active:scale-95"
                >
                    {isFormOpen ? <span className="rotate-45 transition-transform"><Plus className="w-5 h-5" /></span> : <Plus className="w-5 h-5" />}
                    {isFormOpen ? "Formu Kapat" : "Yeni Haber Ekle"}
                </button>
            </div>

            {/* Add News Form (Expandable) */}
            {isFormOpen && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 animate-in slide-in-from-top-4 fade-in duration-300">
                    <h3 className="text-lg font-bold text-navy mb-6 flex items-center gap-2">
                        <span className="w-2 h-6 bg-gold rounded-full"></span>
                        Haber Ekleme Formu
                    </h3>

                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Left Column - Title & Image */}
                            <div className="col-span-1 border-r border-gray-100 pr-0 md:pr-8 space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Haber Başlığı</label>
                                    <input
                                        type="text"
                                        placeholder="Örn: Toplu İş Sözleşmesi İmzalandı"
                                        className="w-full bg-zinc-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Haber Görseli</label>
                                    <div className="w-full h-40 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center bg-zinc-50 hover:bg-gray-50 hover:border-navy/50 transition-all cursor-pointer group">
                                        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <ImageIcon className="w-5 h-5 text-gray-400 group-hover:text-navy transition-colors" />
                                        </div>
                                        <span className="text-sm font-bold text-navy">Görsel Yükle</span>
                                        <span className="text-xs text-gray-400 mt-1">PNG, JPG veya WEBP (Max 5MB)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Editor */}
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Haber İçeriği</label>
                                <div className="w-full border border-gray-200 rounded-xl overflow-hidden flex flex-col h-[300px]">
                                    {/* Editor Toolbar (Fake) */}
                                    <div className="bg-zinc-50 border-b border-gray-200 p-2 flex gap-1">
                                        {['B', 'I', 'U'].map((tool) => (
                                            <button key={tool} type="button" className="w-8 h-8 rounded hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600 font-serif">
                                                {tool}
                                            </button>
                                        ))}
                                        <div className="w-px h-6 bg-gray-300 mx-2 self-center"></div>
                                        <button type="button" className="px-3 h-8 rounded hover:bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                                            Başlık Ekle
                                        </button>
                                        <button type="button" className="px-3 h-8 rounded hover:bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                                            Liste
                                        </button>
                                    </div>
                                    {/* Editor Body */}
                                    <textarea
                                        placeholder="Haber detaylarını buraya yazın..."
                                        className="flex-1 w-full p-4 resize-none focus:outline-none focus:bg-white text-sm leading-relaxed"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => setIsFormOpen(false)}
                                className="px-6 py-3 text-gray-500 font-bold hover:text-navy transition-colors mr-4"
                            >
                                İptal Et
                            </button>
                            <button
                                type="button"
                                className="bg-gold text-navy px-8 py-3 rounded-xl font-bold hover:bg-yellow-500 hover:shadow-lg transition-all"
                            >
                                Haberi Kaydet ve Yayınla
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Haber başlığı Ara..."
                        className="w-full bg-zinc-50 border border-gray-200 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:border-navy transition-all"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <select className="bg-zinc-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none w-full md:w-40 font-medium text-gray-700 cursor-pointer">
                        <option>Tüm Kategoriler</option>
                        <option>Toplu İş Sözleşmesi</option>
                        <option>Etkinlik</option>
                        <option>Eğitim</option>
                    </select>
                    <select className="bg-zinc-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none w-full md:w-40 font-medium text-gray-700 cursor-pointer">
                        <option>En Yeniler</option>
                        <option>En Eskiler</option>
                    </select>
                </div>
            </div>

            {/* News Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                                <th className="p-5 font-bold">Görsel</th>
                                <th className="p-5 font-bold">Başlık</th>
                                <th className="p-5 font-bold">Kategori</th>
                                <th className="p-5 font-bold">Tarih</th>
                                <th className="p-5 font-bold">Durum</th>
                                <th className="p-5 text-right font-bold w-24">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { id: 1, img: "https://images.unsplash.com/photo-1541888082470-3d71241f893e?w=100&q=80", title: "Kamu Çerçeve Sözleşmesi Görüşmeleri Başladı", cat: "Sözleşme", date: "03 Mar 2026", status: "Yayında" },
                                { id: 2, img: "https://images.unsplash.com/photo-1575320181282-9afab399332c?w=100&q=80", title: "1 Mayıs Emek ve Dayanışma Günü Hazırlıkları", cat: "Etkinlik", date: "01 Mar 2026", status: "Yayında" },
                                { id: 3, img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=100&q=80", title: "Belediye Çalışanlarına Yönelik Seminer Düzenlendi", cat: "Eğitim", date: "24 Şub 2026", status: "Taslak" },
                            ].map((news) => (
                                <tr key={news.id} className="hover:bg-zinc-50/50 transition-colors group">
                                    <td className="p-5">
                                        <img src={news.img} alt="Thumb" className="w-16 h-12 rounded-lg object-cover bg-gray-100 border border-gray-200" />
                                    </td>
                                    <td className="p-5">
                                        <p className="font-bold text-navy text-sm max-w-xs truncate">{news.title}</p>
                                    </td>
                                    <td className="p-5">
                                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-navy/5 text-navy border border-navy/10">{news.cat}</span>
                                    </td>
                                    <td className="p-5 text-sm text-gray-500 font-medium">
                                        {news.date}
                                    </td>
                                    <td className="p-5">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${news.status === 'Yayında' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${news.status === 'Yayında' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                            {news.status}
                                        </span>
                                    </td>
                                    <td className="p-5 text-right">
                                        <div className="flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="w-8 h-8 rounded-lg bg-navy/5 text-navy flex items-center justify-center hover:bg-navy hover:text-white transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Dummy */}
                <div className="p-5 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                    <p>Toplam 12 haberden 1-3 listeleniyor.</p>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50">Önceki</button>
                        <button className="px-3 py-1 rounded-md bg-navy text-white">1</button>
                        <button className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50">2</button>
                        <button className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50">3</button>
                        <button className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50">Sonraki</button>
                    </div>
                </div>
            </div>

        </div>
    );
}
