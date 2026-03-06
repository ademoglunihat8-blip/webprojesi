"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Ana Sayfa", href: "/" },
    { name: "Hakkımızda", href: "/hakkimizda" },
    { name: "Teşkilatımız", href: "/#teskilat" },
    { name: "Faaliyetler", href: "/#faaliyetler" },
    { name: "İletişim", href: "/#iletisim" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center py-2 mr-4">
            <Link href="/" className="flex items-center group">
              <img
                src="/logo-horizontal.png"
                alt="Öz Belediye İş Sendikası"
                className="h-16 w-auto min-w-[120px] object-contain group-hover:opacity-90 transition drop-shadow-sm"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden xl:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                target={link.name === "Hakkımızda" ? "_blank" : undefined}
                rel={link.name === "Hakkımızda" ? "noopener noreferrer" : undefined}
                className="text-gray-700 hover:text-navy font-bold text-sm whitespace-nowrap transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button (Desktop) */}
          <div className="hidden lg:flex items-center ml-4">
            <a
              href="https://www.turkiye.gov.tr/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-full font-bold hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap"
            >
              <ShieldCheck className="w-5 h-5 text-gold" />
              <span className="text-sm">Hemen Üye Ol</span>
              <span className="text-[10px] bg-white text-navy px-2 py-0.5 rounded-full ml-1 font-bold">e-Devlet</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center xl:hidden lg:hidden">
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
