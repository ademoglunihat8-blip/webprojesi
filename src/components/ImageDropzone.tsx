"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/storage";

interface ImageDropzoneProps {
    onUploadComplete: (url: string) => void;
    currentUrl?: string;
}

export default function ImageDropzone({ onUploadComplete, currentUrl }: ImageDropzoneProps) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [preview, setPreview] = useState<string>(currentUrl ?? "");
    const [error, setError] = useState("");

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (!file) return;

            // Önizleme göster
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            setUploading(true);
            setError("");
            setProgress(0);

            try {
                const downloadUrl = await uploadImage(file, (pct) => setProgress(pct));
                onUploadComplete(downloadUrl);
            } catch {
                setError("Görsel yüklenemedi. Lütfen tekrar deneyin.");
                setPreview(currentUrl ?? "");
            } finally {
                setUploading(false);
            }
        },
        [onUploadComplete, currentUrl]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
        maxSize: 5 * 1024 * 1024, // 5MB
        multiple: false,
    });

    const clearImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview("");
        onUploadComplete("");
    };

    return (
        <div>
            <div
                {...getRootProps()}
                className={`relative w-full h-44 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden
          ${isDragActive ? "border-gold bg-gold/5 scale-[1.01]" : "border-gray-200 bg-zinc-50 hover:border-navy/40 hover:bg-gray-50"}
          ${uploading ? "pointer-events-none" : ""}
        `}
            >
                <input {...getInputProps()} />

                {preview ? (
                    <>
                        <img src={preview} alt="Önizleme" className="absolute inset-0 w-full h-full object-contain bg-zinc-100" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-white font-semibold text-sm bg-black/50 px-3 py-1 rounded-full">
                                Değiştirmek için tıklayın veya sürükleyin
                            </span>
                        </div>
                        {!uploading && (
                            <button
                                onClick={clearImage}
                                className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md z-10"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-center px-4">
                        {isDragActive ? (
                            <>
                                <Upload className="w-10 h-10 text-gold" />
                                <p className="text-gold font-bold">Bırakın!</p>
                            </>
                        ) : (
                            <>
                                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
                                    <ImageIcon className="w-6 h-6 text-gray-400" />
                                </div>
                                <p className="text-sm font-bold text-navy">Sürükle & Bırak</p>
                                <p className="text-xs text-gray-400">PNG, JPG, WEBP (Max 5MB)</p>
                            </>
                        )}
                    </div>
                )}

                {/* Upload progress overlay */}
                {uploading && (
                    <div className="absolute inset-0 bg-navy/60 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                        <div className="w-40 bg-white/20 rounded-full h-2">
                            <div
                                className="bg-gold h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="text-white text-sm font-bold">%{progress} yükleniyor...</span>
                    </div>
                )}
            </div>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>
    );
}
