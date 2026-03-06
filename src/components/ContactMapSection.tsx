"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Map, Building2 } from "lucide-react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { getBranches, Branch } from "@/lib/firestore";
import { getCityCoordinates } from "@/lib/turkeyCoordinates";

// Natural Earth verilerinden Türkiye (toplumsal alan filtresi)
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
// Turkey = ISO numeric 792
const TURKEY_ID = "792";

const DEFAULT_BRANCHES: Branch[] = [
    { id: "1", city: "Ankara", name: "İç Anadolu Bölge Şubesi", address: "Kavaklıdere Mah. Atatürk Bulvarı No: 123 Çankaya / Ankara", phone: "0312 444 00 00", top: "42%", left: "43%", coordinates: [32.87, 39.93], order: 1 },
    { id: "2", city: "İstanbul", name: "Marmara Bölge Şubesi", address: "Barbaros Bulvarı No: 45 Beşiktaş / İstanbul", phone: "0212 444 00 00", top: "28%", left: "18%", coordinates: [28.95, 41.01], order: 2 },
    { id: "3", city: "İzmir", name: "Ege Bölge Şubesi", address: "Alsancak Mah. Kıbrıs Şehitleri Cad. No: 12 Konak / İzmir", phone: "0232 444 00 00", top: "52%", left: "10%", coordinates: [27.14, 38.42], order: 3 },
    { id: "4", city: "Antalya", name: "Akdeniz Bölge Şubesi", address: "Muratpaşa Mah. Işıklar Cad. No: 8 Muratpaşa / Antalya", phone: "0242 444 00 00", top: "74%", left: "33%", coordinates: [30.71, 36.90], order: 4 },
    { id: "5", city: "Gaziantep", name: "Güneydoğu Bölge Şubesi", address: "Şehitkamil Mah. İncilipınar Cad. No: 5 Şehitkamil / Gaziantep", phone: "0342 444 00 00", top: "72%", left: "63%", coordinates: [37.38, 37.07], order: 5 },
    { id: "6", city: "Trabzon", name: "Karadeniz Bölge Şubesi", address: "Ortahisar Mah. Uzun Sokak No: 10 Ortahisar / Trabzon", phone: "0462 444 00 00", top: "20%", left: "68%", coordinates: [39.73, 41.00], order: 6 },
    { id: "7", city: "Erzurum", name: "Doğu Anadolu Bölge Şubesi", address: "Yakutiye Mah. Cumhuriyet Cad. No: 20 Yakutiye / Erzurum", phone: "0442 444 00 00", top: "36%", left: "78%", coordinates: [41.27, 39.91], order: 7 },
];

export default function ContactMapSection() {
    const [activeBranch, setActiveBranch] = useState<string | null>(null);
    const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
    const [branches, setBranches] = useState<Branch[]>(DEFAULT_BRANCHES);
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getBranches()
            .then(data => { if (data.length > 0) setBranches(data); })
            .catch(() => { /* default kullan */ });
    }, []);

    return (
        <section id="iletisim" className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-sm font-bold tracking-widest text-lightblue uppercase mb-3 flex items-center justify-center gap-2">
                        <Map className="w-4 h-4 text-gold" />
                        İLETİŞİM VE ŞUBELERİMİZ
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-extrabold text-navy">Türkiye&apos;nin Her Yerindeyiz</h3>
                    <p className="mt-6 text-lg text-gray-600">
                        Güçlü teşkilatımızla, yurdun dört bir yanındaki işçi kardeşlerimize bir adım uzaklıktayız. Size en yakın şubemizi haritadan bulabilirsiniz.
                    </p>
                </div>

                {/* Map & List Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Interactive Map */}
                    <div ref={mapRef} className="lg:col-span-8 bg-navy/5 rounded-3xl border border-gray-100 relative">
                        {/* SVG harita — overflow kırpması burada */}
                        <div className="overflow-hidden rounded-3xl">
                            <ComposableMap
                                projection="geoMercator"
                                projectionConfig={{
                                    center: [35.5, 38.9],
                                    scale: 2100,
                                }}
                                width={800}
                                height={320}
                                style={{ width: "100%", height: "100%" }}
                            >
                                <Geographies geography={GEO_URL}>
                                    {({ geographies }) =>
                                        geographies
                                            .filter(geo => geo.id === TURKEY_ID)
                                            .map(geo => (
                                                <Geography
                                                    key={geo.rsmKey}
                                                    geography={geo}
                                                    fill="#0A192F"
                                                    fillOpacity={0.10}
                                                    stroke="#0A192F"
                                                    strokeOpacity={0.3}
                                                    strokeWidth={1}
                                                    style={{
                                                        default: { outline: "none" },
                                                        hover: { outline: "none" },
                                                        pressed: { outline: "none" },
                                                    }}
                                                />
                                            ))
                                    }
                                </Geographies>

                                {branches.map(branch => {
                                    const coords: [number, number] | undefined =
                                        branch.coordinates ?? getCityCoordinates(branch.city) ?? undefined;
                                    if (!coords) return null;
                                    return (
                                        <Marker
                                            key={branch.id}
                                            coordinates={coords}
                                            onMouseEnter={(e: React.MouseEvent) => {
                                                const rect = mapRef.current?.getBoundingClientRect();
                                                if (rect) {
                                                    setTooltipPos({
                                                        x: (e as unknown as MouseEvent).clientX - rect.left,
                                                        y: (e as unknown as MouseEvent).clientY - rect.top,
                                                    });
                                                }
                                                setActiveBranch(branch.id!);
                                            }}
                                            onMouseLeave={() => { setActiveBranch(null); setTooltipPos(null); }}
                                        >
                                            <g className="cursor-pointer">
                                                {/* Ping halkası */}
                                                <circle
                                                    r={activeBranch === branch.id ? 18 : 14}
                                                    fill="#D4AF37"
                                                    fillOpacity={0.2}
                                                    className="animate-ping"
                                                />
                                                {/* Pin dairesi */}
                                                <circle
                                                    r={8}
                                                    fill={activeBranch === branch.id ? "#D4AF37" : "#0A192F"}
                                                    stroke="white"
                                                    strokeWidth={2}
                                                />
                                                {/* Şehir adı */}
                                                {activeBranch === branch.id && (
                                                    <text
                                                        textAnchor="middle"
                                                        y={-16}
                                                        style={{ fontSize: 11, fontWeight: 700, fill: "#0A192F" }}
                                                    >
                                                        {branch.city}
                                                    </text>
                                                )}
                                            </g>
                                        </Marker>
                                    );
                                })}
                            </ComposableMap>
                        </div>{/* /overflow-hidden wrapper */}

                        {/* Tooltip overlay — pine yakın, kırpılmaz */}
                        <AnimatePresence>
                            {activeBranch && tooltipPos && (() => {
                                const branch = branches.find(b => b.id === activeBranch);
                                if (!branch) return null;
                                const mapW = mapRef.current?.offsetWidth ?? 800;
                                const mapH = mapRef.current?.offsetHeight ?? 320;
                                const tipW = 288;
                                const clampedLeft = Math.min(Math.max(tooltipPos.x - tipW / 2, 8), mapW - tipW - 8);
                                // Pinin üst yarısındaysa aşağı aç, alt yarısındaysa yukarı aç
                                const openBelow = tooltipPos.y < mapH / 2;
                                return (
                                    <motion.div
                                        key={activeBranch}
                                        initial={{ opacity: 0, y: openBelow ? -6 : 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                        style={{
                                            position: "absolute",
                                            left: clampedLeft,
                                            ...(openBelow
                                                ? { top: tooltipPos.y + 20 }
                                                : { top: tooltipPos.y - 16, transform: "translateY(-100%)" }
                                            ),
                                        }}
                                        className="bg-navy text-white px-5 py-4 rounded-2xl shadow-2xl border border-white/10 w-72 pointer-events-none z-50"
                                    >
                                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                                            <Building2 className="w-5 h-5 text-gold" />
                                            <h4 className="font-bold text-base">{branch.city}</h4>
                                        </div>
                                        {branch.name && <p className="text-sm text-gray-300 mb-2">{branch.name}</p>}
                                        {branch.address && (
                                            <div className="flex items-start gap-2 mb-1 text-sm text-gray-400">
                                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gold" />
                                                <span className="leading-tight">{branch.address}</span>
                                            </div>
                                        )}
                                        {branch.phone && (
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <Phone className="w-4 h-4 flex-shrink-0 text-gold" />
                                                <span>{branch.phone}</span>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })()}
                        </AnimatePresence>
                    </div>

                    {/* Quick List */}
                    <div className="lg:col-span-4 flex flex-col h-full">
                        <h4 className="text-2xl font-bold text-navy mb-6 flex items-center gap-2">
                            <span className="w-8 h-1 bg-gold rounded-full" />
                            Bölge Şubeleri
                        </h4>
                        <div className="flex-1 space-y-4">
                            {branches.slice(0, 5).map(branch => (
                                <div
                                    key={branch.id}
                                    className="p-4 rounded-xl bg-zinc-50 border border-gray-100 hover:border-gold hover:bg-white transition-all cursor-pointer group flex items-start gap-4"
                                    onMouseEnter={() => setActiveBranch(branch.id!)}
                                    onMouseLeave={() => setActiveBranch(null)}
                                >
                                    <div className={`w-10 h-10 rounded-lg flex flex-shrink-0 items-center justify-center transition-colors ${activeBranch === branch.id ? "bg-gold text-navy" : "bg-navy/5 text-navy group-hover:bg-gold group-hover:text-navy"}`}>
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-navy text-base">{branch.city}</h5>
                                        {branch.phone && <p className="text-sm text-gray-500 mt-1">{branch.phone}</p>}
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
