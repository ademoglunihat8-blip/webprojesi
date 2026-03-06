"use client";

import { useState, useEffect } from "react";
import { Save, RefreshCw, CheckCircle, Plus, Trash2, Layout, Type, AlignLeft, Image as ImageIcon } from "lucide-react";
import { getAboutContent, saveAboutContent, AboutContent, DEFAULT_ABOUT } from "@/lib/firestore";
import ImageDropzone from "@/components/ImageDropzone";

export default function AdminHakkimizdaPage() {
    const [form, setForm] = useState<AboutContent>(DEFAULT_ABOUT);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        getAboutContent()
            .then(data => setForm(data))
            .catch(() => setForm(DEFAULT_ABOUT))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);
        try {
            await saveAboutContent(form);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error("Hakkımızda içeriği kaydedilemedi:", err);
            alert("Bir hata oluştu.");
        } finally {
            setSaving(false);
        }
    };

    const inputClass = "w-full bg-zinc-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-navy transition-colors";
    const labelClass = "block text-sm font-bold text-gray-700 mb-2";

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[300px]">
                <RefreshCw className="w-6 h-6 animate-spin text-navy" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-4xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-xl font-bold text-navy">Hakkımızda Yönetimi</h2>
                    <p className="text-gray-500 text-sm mt-1">Hakkımızda sayfasının içeriğini ve görsellerini düzenleyin.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-md active:scale-95 disabled:opacity-60"
                >
                    {saving ? (
                        <><RefreshCw className="w-5 h-5 animate-spin" /> Kaydediliyor...</>
                    ) : saved ? (
                        <><CheckCircle className="w-5 h-5 text-green-400" /> Kaydedildi!</>
                    ) : (
                        <><Save className="w-5 h-5" /> Kaydet</>
                    )}
                </button>
            </div>

            <div className="space-y-6">
                {/* Ana Bilgiler */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-base font-bold text-navy mb-4 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-gold" /> Ana Metinler
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className={labelClass}><Type className="inline w-4 h-4 mr-1 text-gold" /> Başlık</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                                className={inputClass}
                                placeholder="Örn: Biz Kimiz?"
                            />
                        </div>
                        <div>
                            <label className={labelClass}><AlignLeft className="inline w-4 h-4 mr-1 text-gold" /> Alt Başlık</label>
                            <input
                                type="text"
                                value={form.subtitle || ""}
                                onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))}
                                className={inputClass}
                                placeholder="Örn: Öz İş Belediye Sendikası"
                            />
                        </div>
                        <div>
                            <label className={labelClass}><AlignLeft className="inline w-4 h-4 mr-1 text-gold" />İçerik</label>
                            <textarea
                                value={form.content}
                                onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                                className={`${inputClass} resize-none h-64 font-sans`}
                                placeholder="Sayfa içeriğini buraya yazın..."
                            />
                        </div>
                    </div>
                </div>

                {/* Görsel */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-base font-bold text-navy mb-4 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-gold" /> Sayfa Görseli
                    </h3>
                    <div className="space-y-4">
                        <ImageDropzone
                            currentUrl={form.imageUrl}
                            onUploadComplete={url => setForm(p => ({ ...p, imageUrl: url }))}
                        />
                        <div className="mt-4">
                            <label className={labelClass}><ImageIcon className="inline w-4 h-4 mr-1 text-gold" /> Görsel URL (Alternatif)</label>
                            <input
                                type="text"
                                value={form.imageUrl || ""}
                                onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))}
                                className={inputClass}
                                placeholder="/images/about-default.jpg"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
