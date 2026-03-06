"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, RefreshCw, CheckCircle, X, Download, MapPin } from "lucide-react";
import { getBranches, addBranch, updateBranch, deleteBranch, Branch } from "@/lib/firestore";
import { getCityCoordinates, TURKEY_CITY_COORDINATES } from "@/lib/turkeyCoordinates";

const DEFAULT_BRANCHES: Branch[] = [
    { city: "Ankara", name: "İç Anadolu Bölge Şubesi", address: "Kavaklıdere Mah. Atatürk Bulvarı No: 123 Çankaya / Ankara", phone: "0312 444 00 00", top: "45%", left: "42%", coordinates: [32.87, 39.93], order: 1 },
    { city: "İstanbul", name: "Marmara Bölge Şubesi", address: "Barbaros Bulvarı No: 45 Beşiktaş / İstanbul", phone: "0212 444 00 00", top: "30%", left: "25%", coordinates: [28.95, 41.01], order: 2 },
    { city: "İzmir", name: "Ege Bölge Şubesi", address: "Alsancak Mah. Kıbrıs Şehitleri Cad. No: 12 Konak / İzmir", phone: "0232 444 00 00", top: "50%", left: "15%", coordinates: [27.14, 38.42], order: 3 },
    { city: "Antalya", name: "Akdeniz Bölge Şubesi", address: "Muratpaşa Mah. Işıklar Cad. No: 8 Muratpaşa / Antalya", phone: "0242 444 00 00", top: "75%", left: "35%", coordinates: [30.71, 36.90], order: 4 },
    { city: "Gaziantep", name: "Güneydoğu Bölge Şubesi", address: "Şehitkamil Mah. İncilipınar Cad. No: 5 Şehitkamil / Gaziantep", phone: "0342 444 00 00", top: "70%", left: "65%", coordinates: [37.38, 37.07], order: 5 },
    { city: "Trabzon", name: "Karadeniz Bölge Şubesi", address: "Ortahisar Mah. Uzun Sokak No: 10 Ortahisar / Trabzon", phone: "0462 444 00 00", top: "25%", left: "68%", coordinates: [39.73, 41.00], order: 6 },
    { city: "Erzurum", name: "Doğu Anadolu Bölge Şubesi", address: "Yakutiye Mah. Cumhuriyet Cad. No: 20 Yakutiye / Erzurum", phone: "0442 444 00 00", top: "40%", left: "80%", coordinates: [41.27, 39.91], order: 7 },
];

const EMPTY_BRANCH: Omit<Branch, "id"> = {
    city: "",
    name: "",
    address: "",
    phone: "",
    top: "50%",
    left: "50%",
    order: 0,
};

export default function SubelerAdminPage() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDefault, setIsDefault] = useState(false); // Firestore boşsa default gösteriliyor
    const [seeding, setSeeding] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<Omit<Branch, "id">>(EMPTY_BRANCH);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    const fetchBranches = async () => {
        setLoading(true);
        try {
            const data = await getBranches();
            if (data.length > 0) {
                setBranches(data);
                setIsDefault(false);
            } else {
                setBranches(DEFAULT_BRANCHES);
                setIsDefault(true);
            }
        } catch (err) {
            console.error("Şubeler yüklenemedi:", err);
            setBranches(DEFAULT_BRANCHES);
            setIsDefault(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBranches(); }, []);

    const openAdd = () => {
        setEditingId(null);
        setForm({ ...EMPTY_BRANCH, order: branches.length + 1 });
        setIsFormOpen(true);
    };

    const openEdit = (branch: Branch) => {
        setEditingId(branch.id!);
        setForm({
            city: branch.city,
            name: branch.name ?? "",
            address: branch.address ?? "",
            phone: branch.phone ?? "",
            top: branch.top,
            left: branch.left,
            coordinates: branch.coordinates,
            order: branch.order,
        });
        setIsFormOpen(true);
    };

    // Şehir değişince koordinatı otomatik ata
    const handleCityChange = (city: string) => {
        const coords = getCityCoordinates(city);
        setForm(prev => ({
            ...prev,
            city,
            ...(coords ? { coordinates: coords } : {}),
        }));
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingId(null);
        setForm(EMPTY_BRANCH);
    };

    const handleSave = async () => {
        if (!form.city.trim()) { alert("Şehir adı zorunludur."); return; }
        setSaving(true);
        setSaved(false);
        try {
            if (editingId) {
                await updateBranch(editingId, form);
            } else {
                await addBranch(form);
            }
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
            closeForm();
            await fetchBranches();
        } catch (err) {
            console.error("Kaydedilemedi:", err);
            alert("Kaydetme sırasında hata oluştu.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteBranch(id);
            setConfirmDeleteId(null);
            await fetchBranches();
        } catch (err) {
            console.error("Silinemedi:", err);
        }
    };

    const handleSeedDefaults = async () => {
        if (!confirm("Mevcut 7 şube Firestore'a kaydedilsin mi?")) return;
        setSeeding(true);
        try {
            for (const b of DEFAULT_BRANCHES) await addBranch(b);
            await fetchBranches();
        } catch (err) {
            console.error("Aktarma hatası:", err);
            alert("Bir hata oluştu.");
        } finally {
            setSeeding(false);
        }
    };

    const inputClass = "w-full bg-zinc-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-navy transition-colors";
    const labelClass = "block text-sm font-bold text-gray-700 mb-2";

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-xl font-bold text-navy">Şube Yönetimi</h2>
                    <p className="text-gray-500 text-sm mt-1">Haritada ve listede görünen şubeleri düzenleyin.</p>
                </div>
                <div className="flex gap-3">
                    {isDefault && (
                        <button
                            onClick={handleSeedDefaults}
                            disabled={seeding}
                            className="flex items-center gap-2 border-2 border-navy text-navy px-5 py-2.5 rounded-xl font-bold hover:bg-navy hover:text-white transition-all text-sm"
                            title="Mevcut şubeleri Firestore'a kaydet"
                        >
                            {seeding
                                ? <><RefreshCw className="w-4 h-4 animate-spin" /> Aktarılıyor...</>
                                : <><Download className="w-4 h-4" /> Firestore’a Aktar</>}
                        </button>
                    )}
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-md active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        Şube Ekle
                    </button>
                </div>
            </div>

            {/* Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-navy flex items-center gap-2">
                                <span className="w-2 h-6 bg-gold rounded-full" />
                                {editingId ? "Şubeyi Düzenle" : "Yeni Şube Ekle"}
                            </h3>
                            <button onClick={closeForm} className="text-gray-400 hover:text-navy transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Şehir *</label>
                                    <input
                                        type="text"
                                        list="city-list"
                                        value={form.city}
                                        onChange={e => handleCityChange(e.target.value)}
                                        className={inputClass}
                                        placeholder="İl adı yazın veya seçin"
                                    />
                                    <datalist id="city-list">
                                        {Object.keys(TURKEY_CITY_COORDINATES).sort().map(c => (
                                            <option key={c} value={c} />
                                        ))}
                                    </datalist>
                                    {form.coordinates ? (
                                        <p className="mt-1.5 text-xs text-emerald-600 flex items-center gap-1 font-medium">
                                            <MapPin className="w-3 h-3" /> Koordinat otomatik ayarlandı
                                        </p>
                                    ) : form.city ? (
                                        <p className="mt-1.5 text-xs text-amber-500 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> Bu il tanınmıyor, haritada gösterilmez
                                        </p>
                                    ) : null}
                                </div>
                                <div>
                                    <label className={labelClass}>Şube Adı <span className="text-gray-400 font-normal">(opsiyonel)</span></label>
                                    <input type="text" value={form.name ?? ""}
                                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                        className={inputClass} placeholder="Örn: İç Anadolu Bölge Şubesi" />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Telefon <span className="text-gray-400 font-normal">(opsiyonel)</span></label>
                                <input type="text" value={form.phone ?? ""}
                                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                                    className={inputClass} placeholder="Örn: 0312 444 00 00" />
                            </div>

                            <div>
                                <label className={labelClass}>Adres <span className="text-gray-400 font-normal">(opsiyonel)</span></label>
                                <textarea value={form.address ?? ""}
                                    onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                                    className={`${inputClass} resize-none h-20`}
                                    placeholder="Örn: Kavaklıdere Mah. Atatürk Bulvarı No: 123 Çankaya / Ankara" />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className={labelClass}>Harita — Yukarıdan (%)</label>
                                    <input type="text" value={form.top}
                                        onChange={e => setForm(p => ({ ...p, top: e.target.value }))}
                                        className={inputClass} placeholder="Örn: 45%" />
                                    <p className="text-xs text-gray-400 mt-1">Harita üzerindeki dikey konum</p>
                                </div>
                                <div>
                                    <label className={labelClass}>Harita — Soldan (%)</label>
                                    <input type="text" value={form.left}
                                        onChange={e => setForm(p => ({ ...p, left: e.target.value }))}
                                        className={inputClass} placeholder="Örn: 42%" />
                                    <p className="text-xs text-gray-400 mt-1">Harita üzerindeki yatay konum</p>
                                </div>
                                <div>
                                    <label className={labelClass}>Sıra</label>
                                    <input type="number" min={1} value={form.order}
                                        onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))}
                                        className={inputClass} />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
                            <button onClick={closeForm} className="px-6 py-3 text-gray-500 font-bold hover:text-navy transition-colors">
                                İptal
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-gold text-navy px-8 py-3 rounded-xl font-bold hover:bg-yellow-500 hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                {saving ? <><RefreshCw className="w-4 h-4 animate-spin" /> Kaydediliyor...</> :
                                    saved ? <><CheckCircle className="w-4 h-4" /> Kaydedildi!</> :
                                        <><Save className="w-4 h-4" /> {editingId ? "Güncelle" : "Ekle"}</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Branches Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {isDefault && (
                    <div className="flex items-center gap-3 px-5 py-3 bg-amber-50 border-b border-amber-100 text-sm text-amber-700">
                        <span className="font-bold">⚠️</span>
                        Firestore’da kayıtlı şube yok — web sitesindeki varsayılan şubeler gösteriliyor.
                        Bunları düzenleyip kaydetmek için “Firestore&apos;a Aktar” butonunu kullanın.
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                                <th className="p-5">Sıra</th>
                                <th className="p-5">Şehir</th>
                                <th className="p-5">Şube Adı</th>
                                <th className="p-5">Telefon</th>
                                <th className="p-5">Konum (H/Y)</th>
                                <th className="p-5 text-right w-28">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={6} className="p-10 text-center text-gray-400 text-sm">Yükleniyor...</td></tr>
                            ) : branches.length === 0 ? (
                                <tr><td colSpan={6} className="p-10 text-center text-gray-400 text-sm">Henüz şube yok.</td></tr>
                            ) : (
                                branches.map(branch => (
                                    <tr key={branch.id} className="hover:bg-zinc-50/50 transition-colors">
                                        <td className="p-5">
                                            <span className="w-8 h-8 rounded-lg bg-navy/5 text-navy font-bold text-sm flex items-center justify-center">{branch.order}</span>
                                        </td>
                                        <td className="p-5">
                                            <p className="font-bold text-navy text-sm">{branch.city}</p>
                                        </td>
                                        <td className="p-5">
                                            <p className="text-sm text-gray-600">{branch.name || <span className="text-gray-300 italic">—</span>}</p>
                                        </td>
                                        <td className="p-5">
                                            <p className="text-sm text-gray-600">{branch.phone || <span className="text-gray-300 italic">—</span>}</p>
                                        </td>
                                        <td className="p-5">
                                            <span className="text-xs font-mono text-gray-500">{branch.top} / {branch.left}</span>
                                        </td>
                                        <td className="p-5 text-right">
                                            {confirmDeleteId === branch.id ? (
                                                <div className="flex justify-end items-center gap-2">
                                                    <span className="text-xs text-red-600 font-bold">Emin misin?</span>
                                                    <button onClick={() => handleDelete(branch.id!)}
                                                        className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700">Sil</button>
                                                    <button onClick={() => setConfirmDeleteId(null)}
                                                        className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200">İptal</button>
                                                </div>
                                            ) : (
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => openEdit(branch)}
                                                        className="w-9 h-9 rounded-lg bg-navy/5 text-navy flex items-center justify-center hover:bg-navy hover:text-white transition-colors" title="Düzenle">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => setConfirmDeleteId(branch.id!)}
                                                        className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors" title="Sil">
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
                    Toplam <span className="font-bold text-navy">{branches.length}</span> şube.
                </div>
            </div>
        </div>
    );
}
