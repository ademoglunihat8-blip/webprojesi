import {
    collection,
    doc,
    getDocs,
    query,
    where,
    setDoc,
    getDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export interface AdminUser {
    username: string;
    password: string; // Gerçek projede hash kullanılmalı
}

const ADMINS_COLLECTION = "admins";

/**
 * Admin kullanıcısının var olup olmadığını kontrol eder,
 * yoksa test/test kullanıcısını oluşturur.
 */
export async function ensureDefaultAdmin() {
    const docRef = doc(db, ADMINS_COLLECTION, "test");
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
        await setDoc(docRef, { username: "test", password: "test" });
    }
}

/**
 * Kullanıcı adı ve şifreyi Firestore'daki admins koleksiyonuyla karşılaştırır.
 */
export async function loginAdmin(
    username: string,
    password: string
): Promise<boolean> {
    const q = query(
        collection(db, ADMINS_COLLECTION),
        where("username", "==", username),
        where("password", "==", password)
    );
    const snap = await getDocs(q);
    return !snap.empty;
}

// localStorage tabanlı oturum yönetimi
const SESSION_KEY = "ozis_admin_session";

export function setAdminSession(username: string) {
    localStorage.setItem(SESSION_KEY, username);
}

export function getAdminSession(): string | null {
    return localStorage.getItem(SESSION_KEY);
}

export function clearAdminSession() {
    localStorage.removeItem(SESSION_KEY);
}
