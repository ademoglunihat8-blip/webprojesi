// Türkiye 81 il — coğrafi merkez koordinatları [longitude, latitude]
// react-simple-maps Marker koordinatlarıyla uyumlu (lon, lat)

export const TURKEY_CITY_COORDINATES: Record<string, [number, number]> = {
    "Adana": [35.32, 37.00],
    "Adıyaman": [38.28, 37.76],
    "Afyonkarahisar": [30.54, 38.76],
    "Ağrı": [43.05, 39.72],
    "Amasya": [35.83, 40.65],
    "Ankara": [32.87, 39.93],
    "Antalya": [30.71, 36.90],
    "Artvin": [41.83, 41.18],
    "Aydın": [27.84, 37.85],
    "Balıkesir": [27.89, 39.65],
    "Bilecik": [29.98, 40.14],
    "Bingöl": [40.50, 38.88],
    "Bitlis": [42.11, 38.40],
    "Bolu": [31.61, 40.74],
    "Burdur": [30.29, 37.72],
    "Bursa": [29.06, 40.20],
    "Çanakkale": [26.41, 40.15],
    "Çankırı": [33.62, 40.60],
    "Çorum": [34.96, 40.55],
    "Denizli": [29.09, 37.78],
    "Diyarbakır": [40.23, 37.91],
    "Edirne": [26.56, 41.68],
    "Elazığ": [39.22, 38.68],
    "Erzincan": [39.49, 39.75],
    "Erzurum": [41.27, 39.91],
    "Eskişehir": [30.52, 39.78],
    "Gaziantep": [37.38, 37.07],
    "Giresun": [38.39, 40.92],
    "Gümüşhane": [39.49, 40.46],
    "Hakkari": [43.74, 37.58],
    "Hatay": [36.16, 36.40],
    "Isparta": [30.55, 37.76],
    "Mersin": [34.64, 36.79],
    "İstanbul": [28.95, 41.01],
    "İzmir": [27.14, 38.42],
    "Kars": [43.10, 40.60],
    "Kastamonu": [33.78, 41.38],
    "Kayseri": [35.49, 38.72],
    "Kırklareli": [27.22, 41.74],
    "Kırşehir": [34.16, 39.14],
    "Kocaeli": [29.92, 40.85],
    "Konya": [32.48, 37.87],
    "Kütahya": [29.98, 39.42],
    "Malatya": [38.33, 38.35],
    "Manisa": [27.43, 38.62],
    "Kahramanmaraş": [36.94, 37.59],
    "Mardin": [40.74, 37.31],
    "Muğla": [28.37, 37.22],
    "Muş": [41.49, 38.75],
    "Nevşehir": [34.71, 38.62],
    "Niğde": [34.68, 37.97],
    "Ordu": [37.88, 40.98],
    "Rize": [40.52, 41.02],
    "Sakarya": [30.52, 40.77],
    "Samsun": [36.33, 41.29],
    "Siirt": [41.95, 37.93],
    "Sinop": [35.15, 42.03],
    "Sivas": [37.02, 39.75],
    "Tekirdağ": [27.51, 41.00],
    "Tokat": [36.55, 40.31],
    "Trabzon": [39.73, 41.00],
    "Tunceli": [39.55, 39.11],
    "Şanlıurfa": [38.80, 37.17],
    "Uşak": [29.41, 38.68],
    "Van": [43.38, 38.49],
    "Yozgat": [34.81, 39.82],
    "Zonguldak": [31.79, 41.45],
    "Aksaray": [33.99, 38.37],
    "Bayburt": [40.22, 40.26],
    "Karaman": [33.22, 37.18],
    "Kırıkkale": [33.51, 39.85],
    "Batman": [41.13, 37.88],
    "Şırnak": [42.46, 37.52],
    "Bartın": [32.34, 41.63],
    "Ardahan": [42.70, 41.11],
    "Iğdır": [44.05, 39.92],
    "Yalova": [29.28, 40.65],
    "Karabük": [32.62, 41.20],
    "Kilis": [37.12, 36.72],
    "Osmaniye": [36.25, 37.07],
    "Düzce": [31.16, 40.84],
};

/**
 * Şehir adına göre koordinat döndürür.
 * Eşleşme bulunamazsa null döner.
 */
export function getCityCoordinates(city: string): [number, number] | null {
    if (!city) return null;
    const normalized = city.trim();
    // Birebir eşleşme
    if (TURKEY_CITY_COORDINATES[normalized]) return TURKEY_CITY_COORDINATES[normalized];
    // Büyük/küçük harf duyarsız arama
    const lower = normalized.toLowerCase();
    const found = Object.entries(TURKEY_CITY_COORDINATES).find(
        ([key]) => key.toLowerCase() === lower
    );
    return found ? found[1] : null;
}
