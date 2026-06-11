"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartContext";

type Cat = { name: string; slug: string };

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 select-none" aria-label="Kohpema Gear home">
      <svg width="44" height="34" viewBox="0 0 52 40" aria-hidden>
        <path d="M2 36 L20 8 L28 20 L34 4 L50 36 Z" fill="#fff" />
        <path d="M2 36 L20 8 L28 20 L34 4 L50 36 Z" fill="none" stroke="#0c0c0c" strokeWidth="1" />
      </svg>
      <span className="font-heading font-extrabold text-white text-lg tracking-[0.18em] uppercase hidden sm:inline">
        Kohpema
      </span>
    </Link>
  );
}

export default function Header({
  categories,
  announcement,
}: {
  categories: Cat[];
  announcement: string;
}) {
  const { count } = useCart();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setSearchOpen(false);
    setMenuOpen(false);
    router.push(`/products?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <>
      {announcement && (
        <div className="bg-[#f0eae3] text-[#111] text-center text-[11px] font-semibold tracking-wider py-1.5 px-4">
          {announcement}
        </div>
      )}
      <header className="sticky top-0 z-40 bg-[#0c0c0c] text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-[1fr_auto_1fr] items-center h-16">
          {/* Left: logo (+ mobile hamburger) */}
          <div className="flex items-center gap-2">
            <button
              className="lg:hidden p-2 -ml-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
              </svg>
            </button>
            <Logo />
          </div>

          {/* Center nav */}
          <nav className="hidden lg:flex items-center gap-8 text-[12px] font-bold uppercase tracking-[0.18em]">
            <div
              className="relative"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <Link href="/products" className="py-5 inline-flex items-center gap-1 hover:text-[#d9c9a3]">
                Shop
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </Link>
              {shopOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full bg-[#0c0c0c] border border-neutral-800 min-w-52 py-3 z-50">
                  <Link
                    href="/products"
                    className="block px-5 py-2 normal-case tracking-normal text-sm font-medium text-neutral-200 hover:text-[#d9c9a3]"
                    onClick={() => setShopOpen(false)}
                  >
                    All Products
                  </Link>
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/category/${c.slug}`}
                      className="block px-5 py-2 normal-case tracking-normal text-sm font-medium text-neutral-200 hover:text-[#d9c9a3]"
                      onClick={() => setShopOpen(false)}
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/about" className="hover:text-[#d9c9a3]">
              About
            </Link>
            <Link href="/products" className="hover:text-[#d9c9a3]">
              News
            </Link>
          </nav>
          <div className="lg:hidden" />

          {/* Right icons */}
          <div className="flex items-center justify-end gap-0.5">
            <button
              className="p-2 hover:text-[#d9c9a3]"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
            <Link href="/login" className="p-2 hover:text-[#d9c9a3] hidden sm:block" aria-label="Account">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
              </svg>
            </Link>
            <Link href="/cart" className="p-2 relative hover:text-[#d9c9a3]" aria-label="Cart">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 7h12l1.5 13h-15L6 7z" />
                <path d="M9 7a3 3 0 016 0" />
              </svg>
              <span className="absolute -top-0.5 right-0 bg-[#c0392b] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {count}
              </span>
            </Link>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-neutral-800 bg-[#0c0c0c]">
            <form onSubmit={submitSearch} className="max-w-7xl mx-auto px-4 py-3 flex gap-2">
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search gear..."
                className="w-full bg-neutral-900 border border-neutral-700 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#d9c9a3]"
              />
              <button type="submit" className="btn-tan !py-2">
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="lg:hidden border-t border-neutral-800 bg-[#0c0c0c] pb-4">
            <Link
              href="/products"
              className="block px-4 py-3 font-bold uppercase tracking-[0.18em] text-xs border-b border-neutral-900"
              onClick={() => setMenuOpen(false)}
            >
              All Products
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="block px-4 py-3 font-bold uppercase tracking-[0.18em] text-xs border-b border-neutral-900"
                onClick={() => setMenuOpen(false)}
              >
                {c.name}
              </Link>
            ))}
            <Link
              href="/about"
              className="block px-4 py-3 font-bold uppercase tracking-[0.18em] text-xs"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
          </nav>
        )}
      </header>
    </>
  );
}
