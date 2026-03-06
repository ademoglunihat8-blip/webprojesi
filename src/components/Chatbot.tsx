"use client";

import { motion } from "framer-motion";
import { MessageSquare, X, Send, User, Bot } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type Message = {
    id: number;
    text: string;
    sender: "user" | "bot";
};

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Merhaba, sendika üyelik şartları, haklarınız veya sözleşmeler hakkında size nasıl yardımcı olabilirim?",
            sender: "bot",
        },
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const [isTyping, setIsTyping] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const userText = input;
        const newUserMsg: Message = {
            id: Date.now(),
            text: userText,
            sender: "user",
        };

        const botMsgId = Date.now() + 1;
        const placeholderBotMsg: Message = {
            id: botMsgId,
            text: "",
            sender: "bot",
        };

        setMessages((prev) => [...prev, newUserMsg, placeholderBotMsg]);
        setInput("");
        setIsTyping(true);

        try {
            // API'ye geçmiş mesajları formatlayıp gönder (boş mesajları filtrele)
            const chatHistory = messages.filter(m => m.text).map(m => ({
                role: m.sender === "user" ? "user" : "assistant",
                content: m.text
            })).concat({ role: "user", content: userText });

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: chatHistory }),
            });

            if (!response.ok) throw new Error();

            const reader = response.body?.getReader();
            if (!reader) throw new Error();

            const decoder = new TextDecoder();
            let accumulatedText = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                accumulatedText += chunk;

                setMessages((prev) =>
                    prev.map(m => m.id === botMsgId ? { ...m, text: accumulatedText } : m)
                );
            }
        } catch (err) {
            setMessages((prev) =>
                prev.map(m => m.id === botMsgId ? { ...m, text: "Üzgünüm, şu an bağlantı kuramıyorum. Lütfen daha sonra tekrar deneyiniz." } : m)
            );
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="bg-white w-80 sm:w-96 rounded-2xl shadow-2xl mb-4 overflow-hidden border border-gray-100 flex flex-col h-[500px]"
                >
                    {/* Header */}
                    <div className="bg-navy p-4 text-white flex justify-between items-center shadow-md z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center">
                                <Bot className="w-6 h-6 text-navy" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-tight">Öz İş AI Asistan</h3>
                                <p className="text-xs text-gold font-medium">Çevrimiçi</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-gold transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-4">
                        {messages.map((msg) => (
                            msg.text || (msg.sender === "bot" && isTyping && msg === messages[messages.length - 1]) ? (
                                <div
                                    key={msg.id}
                                    className={`flex items-end gap-2 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === "user" ? "bg-navy" : "bg-gold"}`}>
                                        {msg.sender === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-5 h-5 text-navy" />}
                                    </div>
                                    <div
                                        className={`px-4 py-3 rounded-2xl max-w-[75%] shadow-sm ${msg.sender === "user"
                                            ? "bg-navy text-white rounded-br-none"
                                            : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">{msg.text || (isTyping && msg === messages[messages.length - 1] ? "..." : "")}</p>
                                    </div>
                                </div>
                            ) : null
                        ))}
                        {isTyping && messages[messages.length - 1]?.text === "" && (
                            <div className="flex items-end gap-2">
                                <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-5 h-5 text-navy" />
                                </div>
                                <div className="bg-white text-gray-400 border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Mesajınızı yazın..."
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className="w-12 h-12 rounded-full bg-gold text-navy flex items-center justify-center hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0 shadow-md"
                            >
                                <Send className="w-5 h-5 ml-1" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Floating Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-navy rounded-full text-gold shadow-2xl flex items-center justify-center hover:bg-[#0F264A] transition-colors border-2 border-gold/20"
                >
                    <MessageSquare className="w-8 h-8" />
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                </motion.button>
            )}
        </div>
    );
}
