"use client";

import { useState, useEffect } from "react";
import { Save, RefreshCw, CheckCircle, Plus, Trash2 } from "lucide-react";
import { getVisionContent, saveVisionContent, VisionContent } from "@/lib/firestore";

const DEFAULT_CONTENT: VisionContent = {
    badge: "VİZYONUMUZ",
    titleLine1: "Temel Prensibimiz",
    titleLine2: "İşçiye Yarar Sağlamak",
    description: "Güçlü sendika, güvenceli gelecek demektir. İşçi haklarını merkeze alan çağdaş sendikacılık anlayışımızla tüm üyelerimize değer katıyoruz.",
    cards: [
        { title: "Hukuksal Destek", description: "İş hayatında karşılaştığınız her türlü hukuki sorunda, uzman avukat kadromuzla arkanızdayız. Hakkınızı savunmak bizim birincil önceliğimizdir." },
        { title: "Toplu İş Sözleşmeleri", description: "Masaya işçinin gücüyle oturuyor, alın terinizin tam karşılığını almak için enflasyona ezdirmeyen, güçlü sözleşmelere imza atıyoruz." },
        { title: "Sosyal Haklar", description: "Sadece maaş değil; ikramiye, eğitim yardımı, sağlık sigortası gibi yaşam kalitenizi artıracak kapsamlı sosyal kazanımlar sağlıyoruz." },
    ],
    ctaTitle: "Birlikte Daha Güçlüyüz",
    ctaSubtitle: "Siz de sendikamıza katılın, haklarınızı güvence altına alın.",
    ctaButtonText: "Hemen Üye Ol",
    ctaButtonUrl: "https://www.turkiye.gov.tr/",
};

export default function VizyonAdminPage() {
    const [form, setForm] = useState<VisionContent>(DEFAULT_CONTENT);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [confirmDeleteIdx, setConfirmDeleteIdx] = useState<number | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await getVisionContent();
                setForm(data);
            } catch (err) {
                console.error("Vizyon verisi yüklenemedi:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const updateCard = (idx: number, field: "title" | "description", value: string) => {
        setForm(prev => {
            const cards = prev.cards.map((c, i) => i === idx ? { ...c, [field]: value } : c);
            return { ...prev, cards };
        });
    };

    const addCard = () => {
        setForm(prev => ({
            ...prev,
            cards: [...prev.cards, { title: "", description: "" }],
        }));
    };

    const deleteCard = (idx: number) => {
        setForm(prev => ({
            ...prev,
            cards: prev.cards.filter((_, i) => i !== idx),
        }));
        setConfirmDeleteIdx(null);
    };

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);
        try {
            await saveVisionContent(form);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error("Kaydedilemedi:", err);
            alert("Kaydetme sırasında hata oluştu.");
        } finally {
            setSaving(false);
        }
    };

    const inputClass = "w-full bg-zinc-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-navy transition-colors";
    const labelClass = "block text-sm font-bold text-gray-700 mb-2";

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-navy rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto pb-20">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-xl font-bold text-navy">Vizyon Bölümü Yönetimi</h2>
                    <p className="text-gray-500 text-sm mt-1">Ana sayfadaki &quot;Vizyonumuz&quot; bölümünü düzenleyin.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-md active:scale-95 disabled:opacity-60"
                >
                    {saved ? (
                        <><CheckCircle className="w-5 h-5 text-green-400" /> Kaydedildi!</>
                    ) : saving ? (
                        <><RefreshCw className="w-5 h-5 animate-spin" /> Kaydediliyor...</>
                    ) : (
                        <><Save className="w-5 h-5" /> Kaydet</>
                    )}
                </button>
            </div>

            {/* Üst Bölüm — opsiyonel */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 space-y-4">
                <div className="flex items-start justify-between border-b border-gray-100 pb-3">
                    <div>
                        <h3 className="text-base font-bold text-navy">Üst Bölüm</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Boş bırakılan alanlar sitede görünmez.</p>
                    </div>
                </div>

                <div>
                    <label className={labelClass}>Rozet Metni <span className="text-gray-400 font-normal">(opsiyonel)</span></label>
                    <input
                        type="text"
                        value={form.badge ?? ""}
                        onChange={e => setForm(p => ({ ...p, badge: e.target.value }))}
                        className={inputClass}
                        placeholder="Örn: VİZYONUMUZ — boş bırakılırsa gizlenir"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Başlık 1. Satır <span className="text-gray-400 font-normal">(opsiyonel)</span></label>
                        <input
                            type="text"
                            value={form.titleLine1 ?? ""}
                            onChange={e => setForm(p => ({ ...p, titleLine1: e.target.value }))}
                            className={inputClass}
                            placeholder="Örn: Temel Prensibimiz"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Başlık 2. Satır <span className="text-gray-400 font-normal">(opsiyonel)</span></label>
                        <input
                            type="text"
                            value={form.titleLine2 ?? ""}
                            onChange={e => setForm(p => ({ ...p, titleLine2: e.target.value }))}
                            className={inputClass}
                            placeholder="Örn: İşçiye Yarar Sağlamak"
                        />
                    </div>
                </div>

                <div>
                    <label className={labelClass}>Açıklama Metni <span className="text-gray-400 font-normal">(opsiyonel)</span></label>
                    <textarea
                        value={form.description ?? ""}
                        onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                        className={`${inputClass} resize-none h-24`}
                        placeholder="Boş bırakılırsa sitede bu metin görünmez"
                    />
                </div>
            </div>

            {/* Kartlar — zorunlu */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-5">
                    <div>
                        <h3 className="text-base font-bold text-navy">
                            Özellik Kartları
                            <span className="ml-2 text-xs font-normal text-gray-400">({form.cards.length} kart)</span>
                        </h3>
                    </div>
                    <button
                        onClick={addCard}
                        className="flex items-center gap-1.5 text-sm font-bold text-navy bg-navy/5 hover:bg-navy/10 px-4 py-2 rounded-xl transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Kart Ekle
                    </button>
                </div>

                {form.cards.length === 0 && (
                    <div className="text-center py-10 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl">
                        Henüz kart yok. &quot;Kart Ekle&quot; butonuna basın.
                    </div>
                )}

                <div className="space-y-4">
                    {form.cards.map((card, idx) => (
                        <div key={idx} className="p-4 bg-zinc-50 rounded-xl border border-gray-100 space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kart {idx + 1}</p>
                                {confirmDeleteIdx === idx ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-red-600 font-bold">Silinsin mi?</span>
                                        <button
                                            onClick={() => deleteCard(idx)}
                                            className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
                                        >
                                            Evet, Sil
                                        </button>
                                        <button
                                            onClick={() => setConfirmDeleteIdx(null)}
                                            className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-300 transition-colors"
                                        >
                                            İptal
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setConfirmDeleteIdx(idx)}
                                        className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                                        title="Kartı sil"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <div>
                                <label className={labelClass}>Başlık</label>
                                <input
                                    type="text"
                                    value={card.title}
                                    onChange={e => updateCard(idx, "title", e.target.value)}
                                    className={inputClass}
                                    placeholder="Kart başlığı"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Açıklama</label>
                                <textarea
                                    value={card.description}
                                    onChange={e => updateCard(idx, "description", e.target.value)}
                                    className={`${inputClass} resize-none h-24`}
                                    placeholder="Kart açıklaması"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Ribbon — opsiyonel */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                <div className="border-b border-gray-100 pb-3">
                    <h3 className="text-base font-bold text-navy">Alt Bant (CTA)</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Tüm alanlar boş bırakılırsa bu bant sitede görünmez.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Başlık <span className="text-gray-400 font-normal">(opsiyonel)</span></label>
                        <input
                            type="text"
                            value={form.ctaTitle ?? ""}
                            onChange={e => setForm(p => ({ ...p, ctaTitle: e.target.value }))}
                            className={inputClass}
                            placeholder="Örn: Birlikte Daha Güçlüyüz"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Alt Başlık <span className="text-gray-400 font-normal">(opsiyonel)</span></label>
                        <input
                            type="text"
                            value={form.ctaSubtitle ?? ""}
                            onChange={e => setForm(p => ({ ...p, ctaSubtitle: e.target.value }))}
                            className={inputClass}
                            placeholder="Örn: Siz de katılın..."
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Buton Metni <span className="text-gray-400 font-normal">(opsiyonel)</span></label>
                        <input
                            type="text"
                            value={form.ctaButtonText ?? ""}
                            onChange={e => setForm(p => ({ ...p, ctaButtonText: e.target.value }))}
                            className={inputClass}
                            placeholder="Örn: Hemen Üye Ol"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Buton Linki <span className="text-gray-400 font-normal">(opsiyonel)</span></label>
                        <input
                            type="url"
                            value={form.ctaButtonUrl ?? ""}
                            onChange={e => setForm(p => ({ ...p, ctaButtonUrl: e.target.value }))}
                            className={inputClass}
                            placeholder="https://..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
