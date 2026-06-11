"use client";

import { useRef, ReactNode } from "react";

// Horizontal scroll-snap row with prev/next arrow controls.
export default function Scroller({
  children,
  arrowsTop,
  dark = false,
}: {
  children: ReactNode;
  arrowsTop?: boolean;
  dark?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function scroll(dir: 1 | -1) {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  }

  const arrowCls = dark
    ? "w-9 h-9 rounded-full border border-neutral-600 text-white flex items-center justify-center hover:border-[#d9c9a3] hover:text-[#d9c9a3]"
    : "w-9 h-9 rounded-full border border-neutral-400 text-neutral-700 flex items-center justify-center hover:border-black hover:text-black";

  const arrows = (
    <div className="flex gap-2">
      <button type="button" onClick={() => scroll(-1)} aria-label="Previous" className={arrowCls}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>
      <button type="button" onClick={() => scroll(1)} aria-label="Next" className={arrowCls}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );

  return (
    <div>
      {arrowsTop && <div className="flex justify-end mb-4">{arrows}</div>}
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth"
      >
        {children}
      </div>
      {!arrowsTop && <div className="flex justify-end mt-5">{arrows}</div>}
    </div>
  );
}
