"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Ana Sayfa", href: "/" },
    { name: "Teşkilatımız", href: "#teskilat" },
    { name: "Haberler", href: "#haberler" },
    { name: "İletişim", href: "#iletisim" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-12 h-12 rounded-lg bg-navy flex items-center justify-center text-gold font-bold text-xl shadow-lg group-hover:bg-opacity-90 transition">
                Öİ
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-navy text-xl leading-tight">ÖZ İŞ</span>
                <span className="text-sm text-gray-500 font-medium">Belediye Sendikası</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-600 hover:text-navy font-semibold transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button (Desktop) */}
          <div className="hidden md:flex items-center">
            <a
              href="https://www.turkiye.gov.tr/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-navy text-white px-6 py-2.5 rounded-full font-bold hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <ShieldCheck className="w-5 h-5 text-gold" />
              <span>Hemen Üye Ol</span>
              <span className="text-xs bg-white text-navy px-2 py-0.5 rounded-full ml-1 font-bold">e-Devlet</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-navy hover:text-gold focus:outline-none transition-colors"
            >
              {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 absolute w-full shadow-lg">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-3 rounded-md text-base font-semibold text-gray-700 hover:text-navy hover:bg-gray-50 transition"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 pb-1">
              <a
                href="https://www.turkiye.gov.tr/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-navy text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition shadow-md"
              >
                <ShieldCheck className="w-5 h-5 text-gold" />
                <span>Hemen Üye Ol</span>
                <span className="text-xs bg-white text-navy px-2 py-0.5 rounded-full ml-1">e-Devlet</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
