"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Image as ImageIcon, Edit2, Trash2, Search, X, Table2, ChevronDown } from "lucide-react";
import { addNews, getNews, deleteNews, updateNews, NewsItem, NewsCategory } from "@/lib/firestore";
import ImageDropzone from "@/components/ImageDropzone";

const CATEGORY_LABELS: Record<NewsCategory, string> = {
    TIS: "Toplu İş Sözleşmesi",
    ETKINLIK: "Etkinlik",
    MEVZUAT: "Mevzuat",
    EGITIM: "Eğitim",
    GENEL: "Genel",
    TESKILAT: "Teşkilat",
    FAALIYETLER: "Faaliyetler",
};

const EMPTY_FORM = {
    title: "",
    content: "",
    category: "GENEL" as NewsCategory,
    status: "PUBLISHED" as "PUBLISHED" | "DRAFT",
    imageUrl: "",
    images: [] as string[],
};

export default function AdminDashboard() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [newsList, setNewsList] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState("");
    const [filterCat, setFilterCat] = useState<string>("Tümü");
    const [form, setForm] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    // Tablo oluşturucu state
    const [showTableBuilder, setShowTableBuilder] = useState(false);
    const [tableRows, setTableRows] = useState(3);
    const [tableCols, setTableCols] = useState(3);
    const [tableData, setTableData] = useState<string[][]>([[""]]);
    const [hasHeader, setHasHeader] = useState(true);

    const initTable = useCallback((rows: number, cols: number) => {
        setTableData(Array.from({ length: rows }, () => Array(cols).fill("")));
    }, []);

    const handleTableDimChange = (newRows: number, newCols: number) => {
        setTableRows(newRows);
        setTableCols(newCols);
        initTable(newRows, newCols);
    };

    const setCell = (r: number, c: number, val: string) => {
        setTableData(prev => {
            const next = prev.map(row => [...row]);
            next[r][c] = val;
            return next;
        });
    };

    const insertTableToContent = () => {
        const headerRow = hasHeader ? tableData[0] : null;
        const bodyRows = hasHeader ? tableData.slice(1) : tableData;
        let html = '<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%;margin:12px 0">';
        if (headerRow) {
            html += '<thead><tr>' + headerRow.map(c => `<th style="background:#1a2e5e;color:#fff;padding:8px">${c || '&nbsp;'}</th>`).join('') + '</tr></thead>';
        }
        html += '<tbody>';
        bodyRows.forEach(row => {
            html += '<tr>' + row.map(c => `<td style="padding:8px;border:1px solid #ddd">${c || '&nbsp;'}</td>`).join('') + '</tr>';
        });
        html += '</tbody></table>';
        setForm(prev => ({ ...prev, content: prev.content + (prev.content ? '\n\n' : '') + html }));
        setShowTableBuilder(false);
        initTable(tableRows, tableCols);
    };

    const fetchNews = async () => {
        setLoading(true);
        try {
            const data = await getNews();
            setNewsList(data);
        } catch (err) {
            console.error("Haberler yüklenemedi:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchNews(); }, []);

    const openAddForm = () => {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setIsFormOpen(true);
    };

    const openEditForm = (news: NewsItem) => {
        setEditingId(news.id!);
        setForm({
            title: news.title,
            content: news.content,
            category: news.category,
            status: news.status,
            imageUrl: news.imageUrl ?? "",
            images: news.images ?? [],
        });
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingId(null);
        setForm(EMPTY_FORM);
    };

    const handleSave = async () => {
        if (!form.title.trim() || !form.content.trim()) {
            alert("Başlık ve içerik zorunludur.");
            return;
        }
        setSaving(true);
        try {
            const saveData = {
                ...form,
                images: (form.images ?? []).filter(url => url.trim() !== ""),
            };
            if (editingId) {
                await updateNews(editingId, saveData);
            } else {
                await addNews(saveData);
            }
            closeForm();
            await fetchNews();
        } catch (err) {
            console.error("Kaydedilemedi:", err);
            alert("İşlem sırasında hata oluştu.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteNews(id);
            setConfirmDeleteId(null);
            await fetchNews();
        } catch (err) {
            console.error("Silinemedi:", err);
            alert("Silme işlemi başarısız oldu.");
        }
    };

    const filtered = newsList.filter((n) => {
        const matchSearch = n.title.toLowerCase().includes(search.toLowerCase());
        const matchCat = filterCat === "Tümü" || n.category === filterCat;
        return matchSearch && matchCat;
    });

    return (
        <div className="max-w-6xl mx-auto pb-20">
            {/* Top Action Bar */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-xl font-bold text-navy">Haber Yönetimi</h2>
                    <p className="text-gray-500 text-sm mt-1">Sistemdeki tüm haberleri görüntüleyin ve yönetin.</p>
                </div>
                <button
                    onClick={openAddForm}
                    className="flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-md active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Haber Ekle
                </button>
            </div>

            {/* Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-navy flex items-center gap-2">
                                <span className="w-2 h-6 bg-gold rounded-full" />
                                {editingId ? "Haberi Düzenle" : "Yeni Haber Ekle"}
                            </h3>
                            <button onClick={closeForm} className="text-gray-400 hover:text-navy transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Haber Başlığı *</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="Örn: TİS Görüşmeleri Başladı"
                                    className="w-full bg-zinc-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-navy"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value as NewsCategory })}
                                        className="w-full bg-zinc-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-navy"
                                    >
                                        {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                                            <option key={val} value={val}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Durum</label>
                                    <select
                                        value={form.status}
                                        onChange={(e) => setForm({ ...form, status: e.target.value as "PUBLISHED" | "DRAFT" })}
                                        className="w-full bg-zinc-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-navy"
                                    >
                                        <option value="PUBLISHED">Yayında</option>
                                        <option value="DRAFT">Taslak</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Ana Görsel</label>
                                <ImageDropzone
                                    currentUrl={form.imageUrl}
                                    onUploadComplete={(url) => setForm({ ...form, imageUrl: url })}
                                />
                            </div>

                            {/* Ek Fotoğraflar */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-bold text-gray-700">Ek Fotoğraflar</label>
                                    <button
                                        type="button"
                                        onClick={() => setForm(prev => ({ ...prev, images: [...(prev.images ?? []), ""] }))}
                                        className="flex items-center gap-1.5 text-xs font-bold text-navy bg-navy/5 hover:bg-navy/10 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Fotoğraf Ekle
                                    </button>
                                </div>
                                {(form.images ?? []).map((imgUrl, idx) => (
                                    <div key={idx} className="relative mb-3">
                                        <ImageDropzone
                                            currentUrl={imgUrl}
                                            onUploadComplete={(url) => {
                                                const next = [...(form.images ?? [])];
                                                next[idx] = url;
                                                setForm(prev => ({ ...prev, images: next }));
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const next = (form.images ?? []).filter((_, i) => i !== idx);
                                                setForm(prev => ({ ...prev, images: next }));
                                            }}
                                            className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-bold text-gray-700">Haber İçeriği *</label>
                                    <button
                                        type="button"
                                        onClick={() => { setShowTableBuilder(v => !v); if (!showTableBuilder) initTable(tableRows, tableCols); }}
                                        className="flex items-center gap-1.5 text-xs font-bold text-navy bg-navy/5 hover:bg-navy/10 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        <Table2 className="w-3.5 h-3.5" />
                                        Tablo Ekle
                                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showTableBuilder ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>

                                {showTableBuilder && (
                                    <div className="border border-navy/20 rounded-xl p-4 mb-3 bg-navy/2 space-y-3">
                                        <div className="flex items-center gap-4 flex-wrap">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-gray-600">Satır:</span>
                                                <input type="number" min={1} max={20} value={tableRows}
                                                    onChange={e => handleTableDimChange(Number(e.target.value), tableCols)}
                                                    className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:border-navy" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-gray-600">Sütun:</span>
                                                <input type="number" min={1} max={10} value={tableCols}
                                                    onChange={e => handleTableDimChange(tableRows, Number(e.target.value))}
                                                    className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:border-navy" />
                                            </div>
                                            <label className="flex items-center gap-2 text-xs font-bold text-gray-600 cursor-pointer">
                                                <input type="checkbox" checked={hasHeader} onChange={e => setHasHeader(e.target.checked)} className="w-4 h-4" />
                                                İlk satır başlık
                                            </label>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse text-sm">
                                                <tbody>
                                                    {tableData.map((row, r) => (
                                                        <tr key={r}>
                                                            {row.map((cell, c) => (
                                                                <td key={c} className="p-1">
                                                                    <input
                                                                        value={cell}
                                                                        onChange={e => setCell(r, c, e.target.value)}
                                                                        placeholder={r === 0 && hasHeader ? `Başlık ${c + 1}` : `Satır ${r + 1}, Süt ${c + 1}`}
                                                                        className={`w-full border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-navy ${r === 0 && hasHeader ? 'bg-navy/5 border-navy/20 font-bold' : 'border-gray-200'
                                                                            }`}
                                                                    />
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="flex justify-end gap-2">
                                            <button type="button" onClick={() => setShowTableBuilder(false)}
                                                className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-navy transition-colors">Vazgeç</button>
                                            <button type="button" onClick={insertTableToContent}
                                                className="px-4 py-2 text-xs font-bold bg-navy text-white rounded-lg hover:bg-opacity-90 transition-colors">
                                                ✓ İçeriğe Ekle
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <textarea
                                    value={form.content}
                                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                                    placeholder="Haber detaylarını buraya yazın..."
                                    className="w-full border border-gray-200 rounded-xl p-4 text-sm resize-none focus:outline-none focus:border-navy h-48"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
                            <button onClick={closeForm} className="px-6 py-3 text-gray-500 font-bold hover:text-navy transition-colors">
                                İptal Et
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-gold text-navy px-8 py-3 rounded-xl font-bold hover:bg-yellow-500 hover:shadow-lg transition-all disabled:opacity-50"
                            >
                                {saving ? "Kaydediliyor..." : editingId ? "Değişiklikleri Kaydet" : "Haberi Yayınla"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Search & Filter */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Haber başlığı ara..."
                        className="w-full bg-zinc-50 border border-gray-200 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:border-navy"
                    />
                </div>
                <select
                    value={filterCat}
                    onChange={(e) => setFilterCat(e.target.value)}
                    className="bg-zinc-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none w-full md:w-48 font-medium text-gray-700"
                >
                    <option value="Tümü">Tüm Kategoriler</option>
                    {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                    ))}
                </select>
            </div>

            {/* News Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                                <th className="p-5">Görsel</th>
                                <th className="p-5">Başlık</th>
                                <th className="p-5">Kategori</th>
                                <th className="p-5">Tarih</th>
                                <th className="p-5">Durum</th>
                                <th className="p-5 text-right w-28">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={6} className="p-10 text-center text-gray-400 text-sm">Yükleniyor...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={6} className="p-10 text-center text-gray-400 text-sm">Haber bulunamadı.</td></tr>
                            ) : (
                                filtered.map((news) => (
                                    <tr key={news.id} className="hover:bg-zinc-50/50 transition-colors">
                                        <td className="p-5">
                                            <img
                                                src={news.imageUrl || "/default-news.png"}
                                                alt="Thumb"
                                                className="w-16 h-12 rounded-lg object-contain bg-white border border-gray-200 p-0.5"
                                            />
                                        </td>
                                        <td className="p-5">
                                            <p className="font-bold text-navy text-sm max-w-xs truncate">{news.title}</p>
                                            <p className="text-xs text-gray-400 mt-1 max-w-xs truncate">{news.content}</p>
                                        </td>
                                        <td className="p-5">
                                            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-navy/5 text-navy border border-navy/10">
                                                {CATEGORY_LABELS[news.category] ?? news.category}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <p className="text-sm text-gray-700 font-medium">
                                                {news.createdAt
                                                    ? new Date(news.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
                                                    : "—"
                                                }
                                            </p>
                                        </td>
                                        <td className="p-5">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${news.status === "PUBLISHED" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${news.status === "PUBLISHED" ? "bg-green-500" : "bg-yellow-500"}`} />
                                                {news.status === "PUBLISHED" ? "Yayında" : "Taslak"}
                                            </span>
                                        </td>
                                        <td className="p-5 text-right">
                                            {confirmDeleteId === news.id ? (
                                                <div className="flex justify-end items-center gap-2">
                                                    <span className="text-xs text-red-600 font-bold">Emin misin?</span>
                                                    <button
                                                        onClick={() => handleDelete(news.id!)}
                                                        className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
                                                    >
                                                        Sil
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmDeleteId(null)}
                                                        className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200 transition-colors"
                                                    >
                                                        İptal
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditForm(news)}
                                                        className="w-9 h-9 rounded-lg bg-navy/5 text-navy flex items-center justify-center hover:bg-navy hover:text-white transition-colors"
                                                        title="Düzenle"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmDeleteId(news.id!)}
                                                        className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                                                        title="Sil"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-5 border-t border-gray-100 text-sm text-gray-500">
                    Toplam <span className="font-bold text-navy">{filtered.length}</span> haber listeleniyor.
                </div>
            </div>
        </div>
    );
}
