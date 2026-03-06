"use client";

import { useState, useEffect } from "react";
import { Save, RefreshCw, CheckCircle, Instagram, Twitter, Facebook, MapPin, Phone, Mail, Plus, Trash2, Link as LinkIcon } from "lucide-react";
import { getFooterContent, saveFooterContent, DEFAULT_FOOTER, FooterContent, FooterLink } from "@/lib/firestore";

export default function FooterAdminPage() {
    const [form, setForm] = useState<FooterContent>(DEFAULT_FOOTER);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        getFooterContent()
            .then(data => setForm(data))
            .catch(() => setForm(DEFAULT_FOOTER))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);
        try {
            await saveFooterContent(form);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error("Footer kaydedilemedi:", err);
            alert("Bir hata oluştu.");
        } finally {
            setSaving(false);
        }
    };

    const addLink = (type: 'quickLinks' | 'bottomLinks') => {
        setForm(prev => ({
            ...prev,
            [type]: [...prev[type], { title: "", url: "" }]
        }));
    };

    const updateLink = (type: 'quickLinks' | 'bottomLinks', index: number, field: keyof FooterLink, value: string) => {
        setForm(prev => {
            const newLinks = [...prev[type]];
            newLinks[index] = { ...newLinks[index], [field]: value };
            return { ...prev, [type]: newLinks };
        });
    };

    const removeLink = (type: 'quickLinks' | 'bottomLinks', index: number) => {
        setForm(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index)
        }));
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

    const LinkEditor = ({ type, title, icon }: { type: 'quickLinks' | 'bottomLinks', title: string, icon: any }) => (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-navy flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-gold" /> {title}
                </h3>
                <button
                    onClick={() => addLink(type)}
                    className="flex items-center gap-1 text-xs font-bold bg-navy/5 text-navy hover:bg-navy hover:text-white px-3 py-1.5 rounded-lg transition-all"
                >
                    <Plus className="w-3.5 h-3.5" /> Ekle
                </button>
            </div>
            <div className="space-y-3">
                {form[type].map((link, idx) => (
                    <div key={idx} className="flex gap-3 items-start group">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                value={link.title}
                                onChange={e => updateLink(type, idx, 'title', e.target.value)}
                                className={inputClass}
                                placeholder="Başlık (örn: Hakkımızda)"
                            />
                            <input
                                value={link.url}
                                onChange={e => updateLink(type, idx, 'url', e.target.value)}
                                className={inputClass}
                                placeholder="URL (örn: /hakkimizda)"
                            />
                        </div>
                        <button
                            onClick={() => removeLink(type, idx)}
                            className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}
                {form[type].length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4 border-2 border-dashed border-gray-100 rounded-xl">
                        Henüz link eklenmemiş.
                    </p>
                )}
            </div>
        </div>
    );

    return (
        <div className="p-6 md:p-10 max-w-4xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-xl font-bold text-navy">Footer Yönetimi</h2>
                    <p className="text-gray-500 text-sm mt-1">Sitenin alt bölümünde görünen bilgileri düzenleyin.</p>
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

                {/* Açıklama */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-base font-bold text-navy mb-4 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-gold" /> Hakkında Metni
                    </h3>
                    <div>
                        <label className={labelClass}>Kısa Açıklama</label>
                        <textarea
                            value={form.description}
                            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                            className={`${inputClass} resize-none h-24`}
                            placeholder="Sendika hakkında kısa açıklama"
                        />
                    </div>
                </div>

                {/* Hızlı Erişim Linkleri */}
                <LinkEditor type="quickLinks" title="Hızlı Erişim Linkleri" icon={LinkIcon} />

                {/* İletişim */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-base font-bold text-navy mb-4 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-gold" /> İletişim Bilgileri
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className={labelClass}><MapPin className="inline w-4 h-4 mr-1 text-gold" />Adres</label>
                            <textarea
                                value={form.address}
                                onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                                className={`${inputClass} resize-none h-20`}
                                placeholder="Kavaklıdere Mah. Atatürk Bulvarı No: 123/4&#10;Çankaya / Ankara"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}><Phone className="inline w-4 h-4 mr-1 text-gold" />Telefon</label>
                                <input
                                    type="text"
                                    value={form.phone}
                                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                                    className={inputClass}
                                    placeholder="+90 (312) 444 00 00"
                                />
                            </div>
                            <div>
                                <label className={labelClass}><Mail className="inline w-4 h-4 mr-1 text-gold" />E-Posta</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                    className={inputClass}
                                    placeholder="iletisim@ozisbelediye.org.tr"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alt Sosyal Medya */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-base font-bold text-navy mb-4 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-gold" /> Sosyal Medya Bağlantıları
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className={labelClass}><Instagram className="inline w-4 h-4 mr-1 text-pink-500" />Instagram URL</label>
                            <input
                                type="url"
                                value={form.instagram}
                                onChange={e => setForm(p => ({ ...p, instagram: e.target.value }))}
                                className={inputClass}
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                        <div>
                            <label className={labelClass}><Twitter className="inline w-4 h-4 mr-1 text-sky-400" />Twitter / X URL</label>
                            <input
                                type="url"
                                value={form.twitter}
                                onChange={e => setForm(p => ({ ...p, twitter: e.target.value }))}
                                className={inputClass}
                                placeholder="https://twitter.com/..."
                            />
                        </div>
                        <div>
                            <label className={labelClass}><Facebook className="inline w-4 h-4 mr-1 text-blue-600" />Facebook URL</label>
                            <input
                                type="url"
                                value={form.facebook}
                                onChange={e => setForm(p => ({ ...p, facebook: e.target.value }))}
                                className={inputClass}
                                placeholder="https://facebook.com/..."
                            />
                        </div>
                    </div>
                </div>

                {/* Alt Sayfa Linkleri */}
                <LinkEditor type="bottomLinks" title="Alt Sayfa Linkleri (KVKK vb.)" icon={LinkIcon} />

            </div>
        </div>
    );
}
