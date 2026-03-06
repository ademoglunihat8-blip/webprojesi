import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    deleteDoc,
    doc,
    updateDoc,
    setDoc,
    serverTimestamp,
    query,
    orderBy,
    Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export type NewsCategory = "TIS" | "ETKINLIK" | "MEVZUAT" | "EGITIM" | "GENEL" | "TESKILAT" | "FAALIYETLER";
export type NewsStatus = "DRAFT" | "PUBLISHED";

export interface NewsItem {
    id?: string;
    title: string;
    content: string;
    category: NewsCategory;
    status: NewsStatus;
    imageUrl?: string;
    images?: string[];   // ek fotoğraflar
    createdAt?: string; // ISO string
}

const NEWS_COLLECTION = "news";

// Haber ekle
export async function addNews(news: Omit<NewsItem, "id" | "createdAt">) {
    const docRef = await addDoc(collection(db, NEWS_COLLECTION), {
        ...news,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

// Tüm haberleri getir (en yeniden eskiye)
export async function getNews(): Promise<NewsItem[]> {
    const q = query(collection(db, NEWS_COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => {
        const data = d.data();
        return {
            id: d.id,
            ...data,
            createdAt: data.createdAt instanceof Timestamp
                ? data.createdAt.toDate().toISOString()
                : (data.createdAt ?? null),
        } as NewsItem;
    });
}

// Haber sil
export async function deleteNews(id: string) {
    await deleteDoc(doc(db, NEWS_COLLECTION, id));
}

// ID'ye göre tek haber getir
export async function getNewsById(id: string): Promise<NewsItem | null> {
    const snap = await getDoc(doc(db, NEWS_COLLECTION, id));
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
        id: snap.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp
            ? data.createdAt.toDate().toISOString()
            : (data.createdAt ?? null),
    } as NewsItem;
}

// Haber güncelle
export async function updateNews(id: string, data: Partial<NewsItem>) {
    await updateDoc(doc(db, NEWS_COLLECTION, id), data);
}

// ─── Teşkilat Üyeleri ───────────────────────────────────────────────────────

export type MemberRole =
    | "BASKAN"
    | "DENETLEME_KURULU"
    | "GENEL_YONETIM_KURULU"
    | "GENEL_DISIPLIN_KURULU";

export const MEMBER_ROLE_LABELS: Record<MemberRole, string> = {
    BASKAN: "Genel Başkan",
    DENETLEME_KURULU: "Denetleme Kurulu",
    GENEL_YONETIM_KURULU: "Genel Yönetim Kurulu",
    GENEL_DISIPLIN_KURULU: "Genel Disiplin Kurulu",
};

export interface Member {
    id?: string;
    name: string;
    title?: string;
    role: MemberRole;
    department?: string;
    quote?: string;
    imageUrl?: string;
    order: number;
    createdAt?: string;
}

const MEMBERS_COLLECTION = "members";

export async function getMembers(): Promise<Member[]> {
    const q = query(collection(db, MEMBERS_COLLECTION), orderBy("order", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => {
        const data = d.data();
        return {
            id: d.id,
            ...data,
            createdAt: data.createdAt instanceof Timestamp
                ? data.createdAt.toDate().toISOString()
                : (data.createdAt ?? null),
        } as Member;
    });
}

export async function addMember(member: Omit<Member, "id" | "createdAt">) {
    const docRef = await addDoc(collection(db, MEMBERS_COLLECTION), {
        ...member,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function updateMember(id: string, data: Partial<Member>) {
    await updateDoc(doc(db, MEMBERS_COLLECTION, id), data);
}

export async function deleteMember(id: string) {
    await deleteDoc(doc(db, MEMBERS_COLLECTION, id));
}

// ─── Vizyon Bölümü ──────────────────────────────────────────────────────────

export interface VisionCard {
    title: string;
    description: string;
}

export interface VisionContent {
    badge?: string;
    titleLine1?: string;
    titleLine2?: string;
    description?: string;
    cards: VisionCard[];
    ctaTitle?: string;
    ctaSubtitle?: string;
    ctaButtonText?: string;
    ctaButtonUrl?: string;
}

const VISION_DOC_PATH = "siteContent/vision";

const DEFAULT_VISION: VisionContent = {
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

export async function getVisionContent(): Promise<VisionContent> {
    const snap = await getDoc(doc(db, VISION_DOC_PATH));
    if (!snap.exists()) return DEFAULT_VISION;
    const data = snap.data() as VisionContent;
    return {
        ...DEFAULT_VISION,
        ...data,
        cards: data.cards ?? DEFAULT_VISION.cards,
    };
}

export async function saveVisionContent(content: VisionContent): Promise<void> {
    await setDoc(doc(db, VISION_DOC_PATH), content);
}

// ─── Şubeler ────────────────────────────────────────────────────────────────

export interface Branch {
    id?: string;
    city: string;
    name?: string;
    address?: string;
    phone?: string;
    top: string;
    left: string;
    coordinates?: [number, number]; // [longitude, latitude] — harita pin konumu
    order: number;
}

const BRANCHES_COLLECTION = "branches";

export async function getBranches(): Promise<Branch[]> {
    const q = query(collection(db, BRANCHES_COLLECTION), orderBy("order", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Branch));
}

export async function addBranch(branch: Omit<Branch, "id">): Promise<string> {
    const docRef = await addDoc(collection(db, BRANCHES_COLLECTION), branch);
    return docRef.id;
}

export async function updateBranch(id: string, data: Partial<Branch>): Promise<void> {
    await updateDoc(doc(db, BRANCHES_COLLECTION, id), data);
}


export async function deleteBranch(id: string): Promise<void> {
    await deleteDoc(doc(db, BRANCHES_COLLECTION, id));
}

// ─── Footer ─────────────────────────────────────────────────────────────────

export interface FooterLink {
    title: string;
    url: string;
}

export interface FooterContent {
    description: string;
    address: string;
    phone: string;
    email: string;
    instagram: string;
    twitter: string;
    facebook: string;
    quickLinks: FooterLink[];
    bottomLinks: FooterLink[];
}

const FOOTER_DOC_PATH = "settings/footer";

export const DEFAULT_FOOTER: FooterContent = {
    description: "İşçi haklarını merkeze alan çağdaş sendikacılık anlayışımızla, emeğin ve alın terinin savunucusu olmaya devam ediyoruz.",
    address: "Kavaklıdere Mah. Atatürk Bulvarı No: 123/4\nÇankaya / Ankara",
    phone: "+90 (312) 444 00 00",
    email: "iletisim@ozisbelediye.org.tr",
    instagram: "#",
    twitter: "#",
    facebook: "#",
    quickLinks: [
        { title: "Hakkımızda", url: "/hakkimizda" },
        { title: "Teşkilatımız", url: "/#teskilat" },
        { title: "Haberler & Duyurular", url: "/#faaliyetler" },
        { title: "Toplu İş Sözleşmeleri", url: "#" },
        { title: "İletişim", url: "/#iletisim" },
    ],
    bottomLinks: [
        { title: "KVKK Aydınlatma Metni", url: "#" },
        { title: "Çerez Politikası", url: "#" },
    ],
};

export async function getFooterContent(): Promise<FooterContent> {
    const snap = await getDoc(doc(db, FOOTER_DOC_PATH));
    if (!snap.exists()) return DEFAULT_FOOTER;
    const data = snap.data();
    return {
        ...DEFAULT_FOOTER,
        ...data,
        quickLinks: data.quickLinks || DEFAULT_FOOTER.quickLinks,
        bottomLinks: data.bottomLinks || DEFAULT_FOOTER.bottomLinks,
    } as FooterContent;
}

export async function saveFooterContent(data: FooterContent): Promise<void> {
    await setDoc(doc(db, FOOTER_DOC_PATH), data);
}

// ─── Hakkımızda ─────────────────────────────────────────────────────────────

export interface AboutContent {
    title: string;
    subtitle?: string;
    content: string; // HTML or rich text content (as string for simplicity)
    imageUrl?: string;
}

const ABOUT_DOC_PATH = "siteContent/about";

export const DEFAULT_ABOUT: AboutContent = {
    title: "Biz Kimiz?",
    subtitle: "Öz İş Belediye Sendikası",
    content: `Öz İş Belediye Sendikası, işçi haklarını her zaman ön planda tutan, emeğin ve alın terinin kutsallığına inanan bir anlayışla kurulmuştur. 

Yıllardır süregelen tecrübemiz ve üyelerimizden aldığımız güçle, belediye çalışanlarının çalışma koşullarını iyileştirmek, haklarını savunmak ve geleceklerini güvence altına almak için mücadele ediyoruz.

Demokratik, şeffaf ve katılımcı bir sendikacılık anlayışını benimseyen Öz İş Belediye Sendikası, Türkiye'nin her köşesindeki üyelerine ulaşarak, onların sorunlarına çözüm üretmeyi bir görev bilmektedir.`,
    imageUrl: "/images/about-default.jpg",
};

export async function getAboutContent(): Promise<AboutContent> {
    const snap = await getDoc(doc(db, ABOUT_DOC_PATH));
    if (!snap.exists()) return DEFAULT_ABOUT;
    return { ...DEFAULT_ABOUT, ...snap.data() } as AboutContent;
}

export async function saveAboutContent(content: AboutContent): Promise<void> {
    await setDoc(doc(db, ABOUT_DOC_PATH), content);
}
