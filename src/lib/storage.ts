import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

/**
 * Firebase Storage'a görsel yükler ve download URL döner.
 * @param file Yüklenecek dosya
 * @param onProgress İlerleme callback (0-100)
 */
export async function uploadImage(
    file: File,
    onProgress?: (percent: number) => void
): Promise<string> {
    const ext = file.name.split(".").pop();
    const fileName = `news/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const storageRef = ref(storage, fileName);

    return new Promise((resolve, reject) => {
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                onProgress?.(percent);
            },
            (error) => reject(error),
            async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(url);
            }
        );
    });
}
