import { NextRequest, NextResponse } from "next/server";
import {
    getAboutContent,
    getFooterContent,
    getVisionContent,
    getMembers,
    getNews,
    getBranches,
    Member,
    Branch,
    NewsItem
} from "@/lib/firestore";
import { formatFAQContext } from "@/lib/faq";

// Basit bellek içi önbellek (In-memory cache)
let cachedData: any = null;
let lastCacheTime = 0;
const CACHE_DURATION = 1000 * 60 * 5; // 5 Dakika

async function getCachedSiteData() {
    const now = Date.now();
    if (cachedData && (now - lastCacheTime < CACHE_DURATION)) {
        return cachedData;
    }

    const [about, footer, vision, members, news, branches] = await Promise.all([
        getAboutContent(),
        getFooterContent(),
        getVisionContent(),
        getMembers(),
        getNews().then(items => items.slice(0, 5)),
        getBranches()
    ]);

    cachedData = { about, footer, vision, members, news, branches };
    lastCacheTime = now;
    return cachedData;
}

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();
        const { about, footer, vision, members, news, branches } = await getCachedSiteData();

        // 1. Bilgi Bankası - Llama dostu kompakt yapı
        const contextData = `
ABOUT: ${about.title}. ${about.content.substring(0, 300)}...
VISION: ${vision.description}
TEAM: ${members.map((m: Member) => `${m.name}(${m.title})`).join(", ")}
BRANCHES: ${branches.map((b: Branch) => b.city).join(", ")}
NEWS: ${news.map((n: NewsItem) => n.title).join(" | ")}
CONTACT: ${footer.address}, ${footer.phone}
`;

        const OLLAMA_URL = "http://localhost:11434/api/chat";

        const systemPrompt = {
            role: "system",
            content: `ÖZ İŞ SENDİKASI ASİSTANI.
KURALLAR:
1. %100 TÜRKÇE.
2. ÜYELİK: E-DEVLET (https://www.turkiye.gov.tr/).
3. BİLGİ: SADECE VERİLENİ KULLAN.
4. ÜSLUP: RESMİ VE KISA.

BİLGİ BANKASI:
${contextData}

FAQs:
${formatFAQContext().substring(0, 1500)}...

TALİMAT: Kısa ve öz cevap ver. Bilgi yoksa uydurma, ${footer.phone}'a yönlendir.`
        };

        const response = await fetch(OLLAMA_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama3.2",
                messages: [systemPrompt, ...messages.slice(-10)],
                options: {
                    num_predict: 500,
                    temperature: 0.1,
                },
                stream: true,
            }),
        });

        if (!response.ok) {
            throw new Error("Ollama API hatası");
        }

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                const reader = response.body?.getReader();
                if (!reader) {
                    controller.close();
                    return;
                }

                const decoder = new TextDecoder();
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split("\n").filter(l => l.trim());

                    for (const line of lines) {
                        try {
                            const json = JSON.parse(line);
                            if (json.message?.content) {
                                controller.enqueue(encoder.encode(json.message.content));
                            }
                            if (json.done) {
                                controller.close();
                            }
                        } catch (e) { }
                    }
                }
            }
        });

        return new Response(stream);

    } catch (error) {
        console.error("Llama Chat API Hatası:", error);
        return NextResponse.json(
            { error: "Mesaj iletilemedi. Lütfen sonra tekrar deneyin." },
            { status: 500 }
        );
    }
}
