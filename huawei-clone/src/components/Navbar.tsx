"use client";

import { useState, useEffect } from "react";
import { List, ShoppingCart, User, MagnifyingGlass, X } from "@phosphor-icons/react";

const navLinks = [
  { label: "智能手机", href: "#phones" },
  { label: "平板", href: "#tablets" },
  { label: "笔记本", href: "#laptops" },
  { label: "穿戴", href: "#wearables" },
  { label: "音频", href: "#audio" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[var(--background)]/95 backdrop-blur-xl border-b border-[var(--border)]"
            : "bg-transparent"
        }`}
        style={{ height: 64 }}
      >
        <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between px-6">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
            <span className="text-[var(--accent)]">HUAWEI</span>
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-4">
            <button className="p-2 text-[var(--text-secondary)] hover:text-white transition-colors rounded-full hover:bg-[var(--surface)]">
              <MagnifyingGlass size={20} weight="regular" />
            </button>
            <button className="p-2 text-[var(--text-secondary)] hover:text-white transition-colors rounded-full hover:bg-[var(--surface)]">
              <ShoppingCart size={20} weight="regular" />
            </button>
            <button className="p-2 text-[var(--text-secondary)] hover:text-white transition-colors rounded-full hover:bg-[var(--surface)]">
              <User size={20} weight="regular" />
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            {mobileOpen ? <X size={24} /> : <List size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden absolute top-full left-0 right-0 bg-[var(--surface)]/98 backdrop-blur-xl border-b border-[var(--border)] transition-all duration-300 overflow-hidden ${
            mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors py-2"
              >
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-4 pt-2 border-t border-[var(--border)]">
              <button className="p-2 text-[var(--text-secondary)]">
                <MagnifyingGlass size={20} />
              </button>
              <button className="p-2 text-[var(--text-secondary)]">
                <ShoppingCart size={20} />
              </button>
              <button className="p-2 text-[var(--text-secondary)]">
                <User size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}