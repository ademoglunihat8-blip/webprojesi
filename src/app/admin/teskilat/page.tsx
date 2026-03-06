"use client";

import { useState, useEffect } from "react";
import {
    Plus, Edit2, Trash2, X, GripVertical, ChevronUp, ChevronDown,
    UserCircle2,
} from "lucide-react";
import {
    getMembers, addMember, updateMember, deleteMember,
    Member, MemberRole, MEMBER_ROLE_LABELS,
} from "@/lib/firestore";
import ImageDropzone from "@/components/ImageDropzone";

const EMPTY_FORM: Omit<Member, "id" | "createdAt"> = {
    name: "",
    title: "",
    role: "GENEL_YONETIM_KURULU",
    department: "",
    quote: "",
    imageUrl: "",
    order: 0,
};

export default function TeskilatPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            setMembers(await getMembers());
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMembers(); }, []);

    const openAdd = () => {
        setEditingId(null);
        setForm({ ...EMPTY_FORM, order: members.length });
        setIsFormOpen(true);
    };

    const openEdit = (m: Member) => {
        setEditingId(m.id!);
        setForm({
            name: m.name,
            title: m.title ?? "",
            role: m.role,
            department: m.department ?? "",
            quote: m.quote ?? "",
            imageUrl: m.imageUrl ?? "",
            order: m.order,
        });
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingId(null);
        setForm(EMPTY_FORM);
    };

    const handleSave = async () => {
        if (!form.name.trim()) {
            alert("Ad soyad zorunludur.");
            return;
        }
        setSaving(true);
        try {
            if (editingId) {
                await updateMember(editingId, form);
            } else {
                await addMember(form);
            }
            closeForm();
            await fetchMembers();
        } catch (e) {
            console.error(e);
            alert("İşlem sırasında hata oluştu.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteMember(id);
            setConfirmDeleteId(null);
            await fetchMembers();
        } catch (e) {
            console.error(e);
            alert("Silme başarısız.");
        }
    };

    const moveOrder = async (member: Member, direction: "up" | "down") => {
        const idx = members.findIndex((m) => m.id === member.id);
        const swapIdx = direction === "up" ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= members.length) return;

        const other = members[swapIdx];
        try {
            await updateMember(member.id!, { order: other.order });
            await updateMember(other.id!, { order: member.order });
            await fetchMembers();
        } catch (e) {
            console.error(e);
        }
    };

    const f = (field: keyof typeof form, val: string) =>
        setForm((prev) => ({ ...prev, [field]: val }));

    return (
        <div className="max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-xl font-bold text-navy">Teşkilat / Kişi Yönetimi</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Org şemasındaki kişileri ekleyin, düzenleyin ve sıralayın.
                    </p>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-md active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Kişi Ekle
                </button>
            </div>

            {/* Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-navy flex items-center gap-2">
                                <span className="w-2 h-6 bg-gold rounded-full" />
                                {editingId ? "Kişiyi Düzenle" : "Yeni Kişi Ekle"}
                            </h3>
                            <button onClick={closeForm} className="text-gray-400 hover:text-navy transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Fotoğraf */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Fotoğraf</label>
                                <ImageDropzone
                                    currentUrl={form.imageUrl}
                                    onUploadComplete={(url) => f("imageUrl", url)}
                                />
                            </div>

                            {/* Ad */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Ad Soyad *</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => f("name", e.target.value)}
                                    placeholder="Örn: Ahmet Yılmaz"
                                    className="w-full bg-zinc-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-navy"
                                />
                            </div>

                            {/* Unvan + Rol */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Unvan <span className="font-normal text-gray-400">(isteğe bağlı)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={(e) => f("title", e.target.value)}
                                        placeholder="Örn: Genel Başkan Yardımcısı"
                                        className="w-full bg-zinc-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-navy"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Rol (Hiyerarşi)</label>
                                    <select
                                        value={form.role}
                                        onChange={(e) => f("role", e.target.value as MemberRole)}
                                        className="w-full bg-zinc-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-navy"
                                    >
                                        {Object.entries(MEMBER_ROLE_LABELS).map(([val, label]) => (
                                            <option key={val} value={val}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Birim + Sıra */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Birim / Sorumluluk <span className="font-normal text-gray-400">(isteğe bağlı)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={form.department}
                                        onChange={(e) => f("department", e.target.value)}
                                        placeholder="Örn: Teşkilatlanma"
                                        className="w-full bg-zinc-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-navy"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Sıralama No</label>
                                    <input
                                        type="number"
                                        value={form.order}
                                        onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) }))}
                                        className="w-full bg-zinc-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-navy"
                                    />
                                </div>
                            </div>

                            {/* Alıntı (sadece Başkan için anlamlı ama herkese açık) */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Alıntı / Mesaj <span className="font-normal text-gray-400">(isteğe bağlı)</span>
                                </label>
                                <textarea
                                    value={form.quote}
                                    onChange={(e) => f("quote", e.target.value)}
                                    placeholder="Başkan için alıntı metni..."
                                    rows={3}
                                    className="w-full bg-zinc-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-navy resize-none"
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
                                {saving ? "Kaydediliyor..." : editingId ? "Değişiklikleri Kaydet" : "Kişiyi Ekle"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Üye Listesi */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                                <th className="p-5 w-10">Sıra</th>
                                <th className="p-5">Fotoğraf</th>
                                <th className="p-5">Ad / Unvan</th>
                                <th className="p-5">Rol</th>
                                <th className="p-5">Birim</th>
                                <th className="p-5 text-right w-32">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={6} className="p-10 text-center text-gray-400 text-sm">Yükleniyor...</td></tr>
                            ) : members.length === 0 ? (
                                <tr><td colSpan={6} className="p-10 text-center text-gray-400 text-sm">
                                    Henüz kişi eklenmedi. <button onClick={openAdd} className="text-navy font-bold underline">Ekle</button>
                                </td></tr>
                            ) : (
                                members.map((member, idx) => (
                                    <tr key={member.id} className="hover:bg-zinc-50/50 transition-colors">
                                        {/* Sıralama */}
                                        <td className="p-5">
                                            <div className="flex flex-col gap-1">
                                                <button
                                                    disabled={idx === 0}
                                                    onClick={() => moveOrder(member, "up")}
                                                    className="p-0.5 rounded hover:bg-gray-100 disabled:opacity-30 transition"
                                                >
                                                    <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
                                                </button>
                                                <button
                                                    disabled={idx === members.length - 1}
                                                    onClick={() => moveOrder(member, "down")}
                                                    className="p-0.5 rounded hover:bg-gray-100 disabled:opacity-30 transition"
                                                >
                                                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                                                </button>
                                            </div>
                                        </td>

                                        {/* Fotoğraf */}
                                        <td className="p-5">
                                            {member.imageUrl ? (
                                                <img
                                                    src={member.imageUrl}
                                                    alt={member.name}
                                                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-navy/5 flex items-center justify-center">
                                                    <UserCircle2 className="w-7 h-7 text-navy/30" />
                                                </div>
                                            )}
                                        </td>

                                        {/* Ad / Unvan */}
                                        <td className="p-5">
                                            <p className="font-bold text-navy text-sm">{member.name}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{member.title}</p>
                                            {member.quote && (
                                                <p className="text-xs text-gray-300 italic mt-0.5 max-w-xs truncate">"{member.quote}"</p>
                                            )}
                                        </td>

                                        {/* Rol */}
                                        <td className="p-5">
                                            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-navy/5 text-navy border border-navy/10">
                                                {MEMBER_ROLE_LABELS[member.role] ?? member.role}
                                            </span>
                                        </td>

                                        {/* Birim */}
                                        <td className="p-5 text-sm text-gray-600">
                                            {member.department || <span className="text-gray-300">—</span>}
                                        </td>

                                        {/* Aksiyon */}
                                        <td className="p-5 text-right">
                                            {confirmDeleteId === member.id ? (
                                                <div className="flex justify-end items-center gap-2">
                                                    <span className="text-xs text-red-600 font-bold">Emin misin?</span>
                                                    <button
                                                        onClick={() => handleDelete(member.id!)}
                                                        className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
                                                    >Sil</button>
                                                    <button
                                                        onClick={() => setConfirmDeleteId(null)}
                                                        className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200 transition-colors"
                                                    >İptal</button>
                                                </div>
                                            ) : (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openEdit(member)}
                                                        className="w-9 h-9 rounded-lg bg-navy/5 text-navy flex items-center justify-center hover:bg-navy hover:text-white transition-colors"
                                                        title="Düzenle"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmDeleteId(member.id!)}
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
                    Toplam <span className="font-bold text-navy">{members.length}</span> kişi.
                </div>
            </div>
        </div>
    );
}
