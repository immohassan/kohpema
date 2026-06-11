"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import TornDivider from "./TornDivider";

type Cat = { name: string; slug: string };

function SocialIcons({ className }: { className: string }) {
  return (
    <div className={`flex items-center gap-4 mb-5 ${className}`}>
      <a href="#" aria-label="YouTube" className="hover:opacity-60">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.5s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.4-1C16.6 4 12 4 12 4s-4.6 0-7.7.2c-.5.1-1.5.1-2.4 1-.7.7-.9 2.3-.9 2.3S1 9.4 1 11.3v1.4c0 1.9.2 3.8.2 3.8s.2 1.6.9 2.3c.9.9 2 .9 2.5 1 1.8.2 7.4.2 7.4.2s4.6 0 7.7-.2c.5-.1 1.5-.1 2.4-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8v-1.4c0-1.9-.2-3.8-.2-3.8zM9.8 15.3V8.7l6.2 3.3-6.2 3.3z"/></svg>
      </a>
      <a href="#" aria-label="Facebook" className="hover:opacity-60">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3l-.4 3H14v9h-3.5v-9H8V9h2.5V7.2C10.5 4.9 11.6 3 14.7 3H17v3h-1.6c-1.1 0-1.4.5-1.4 1.4V9z"/></svg>
      </a>
      <a href="#" aria-label="X" className="hover:opacity-60">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-6.8 7.8L23.3 22h-6.3l-4.9-6.4L6.5 22H3.4l7.3-8.3L1 2h6.5l4.4 5.8L18.9 2zm-1.1 18h1.7L7.6 3.9H5.8L17.8 20z"/></svg>
      </a>
      <a href="#" aria-label="Instagram" className="hover:opacity-60">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
      </a>
    </div>
  );
}

function FooterBody({ categories, dark }: { categories: Cat[]; dark: boolean }) {
  const text = dark ? "text-neutral-300" : "text-[#111]";
  const heading = dark ? "text-[#d9c9a3]" : "text-[#111]";
  const hover = "hover:opacity-60";

  return (
    <div className={dark ? "text-neutral-300" : "text-[#111]"}>
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-5">
            <svg width="40" height="31" viewBox="0 0 52 40" aria-hidden>
              <path d="M2 36 L20 8 L28 20 L34 4 L50 36 Z" fill={dark ? "#fff" : "#111"} />
            </svg>
            <span className={`font-heading font-extrabold text-lg tracking-[0.15em] uppercase ${dark ? "text-white" : "text-[#111]"}`}>
              Kohpema Gear
            </span>
          </div>
          <SocialIcons className={dark ? "text-white" : "text-[#111]"} />
          <p className={`text-sm leading-relaxed ${text}`}>
            Kohpema Gear
            <br />
            Basecamp Road, Alpine District
            <br />
            +92.300.1234567
          </p>
          <p className={`text-sm mt-4 ${text}`}>orders@kohpema.com</p>
        </div>

        <div>
          <h4 className={`font-heading font-bold text-sm mb-4 ${heading}`}>Useful Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products" className={hover}>All Products</Link></li>
            {categories.slice(0, 4).map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className={hover}>
                  {c.name}
                </Link>
              </li>
            ))}
            <li><Link href="/about" className={hover}>About Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className={`font-heading font-bold text-sm mb-4 ${heading}`}>Orders</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/cart" className={hover}>Cart</Link></li>
            <li><Link href="/about" className={hover}>How Ordering Works</Link></li>
            <li><Link href="/about" className={hover}>Shipping</Link></li>
            <li><Link href="/about" className={hover}>Returns</Link></li>
            <li><Link href="/login" className={hover}>Admin</Link></li>
          </ul>
        </div>

        <div>
          <h4 className={`font-heading font-bold text-sm mb-4 ${heading}`}>Join Our Mailing List:</h4>
          <form className="flex">
            <input
              type="email"
              placeholder="Email"
              className={
                dark
                  ? "w-full bg-neutral-900 border border-neutral-700 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#d9c9a3]"
                  : "w-full bg-white border border-neutral-400 px-3 py-2 text-sm focus:outline-none focus:border-black"
              }
            />
            <button
              type="submit"
              className={
                dark
                  ? "bg-[#f0eae3] text-[#111] text-xs font-bold uppercase tracking-wider px-4 whitespace-nowrap hover:bg-white"
                  : "bg-[#111] text-white text-xs font-bold uppercase tracking-wider px-4 whitespace-nowrap hover:bg-neutral-800"
              }
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
      <div className={`text-center text-xs pb-5 ${dark ? "text-neutral-500" : "text-neutral-600"}`}>
        © {new Date().getFullYear()} Kohpema Gear — Built for the summit.
      </div>
    </div>
  );
}

export default function Footer({ categories }: { categories: Cat[] }) {
  const isHome = usePathname() === "/";

  if (isHome) {
    // Home: dark page above → torn edge → cream footer
    return (
      <footer className="bg-[#0c0c0c] mt-auto">
        <TornDivider />
        <div className="bg-[#f0eae3]">
          <FooterBody categories={categories} dark={false} />
        </div>
      </footer>
    );
  }

  // Inner pages: cream page above → flipped torn edge → black footer
  return (
    <footer className="bg-[#0c0c0c] mt-auto">
      <TornDivider flip />
      <FooterBody categories={categories} dark />
    </footer>
  );
}
