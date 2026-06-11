import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SpecCard from "@/components/store/SpecCard";
import Scroller from "@/components/store/Scroller";
import TornDivider from "@/components/store/TornDivider";

export const dynamic = "force-dynamic";

const ACTIVITIES = [
  { name: "Alpine", slug: "ice-axes" },
  { name: "Ice Climbing", slug: "crampons" },
  { name: "Trekking", slug: "backpacks" },
  { name: "Expedition", slug: "apparel" },
  { name: "Night Missions", slug: "headlamps" },
];

function SectionHeading({
  first,
  second,
  light,
}: {
  first: string;
  second: string;
  light?: boolean;
}) {
  return (
    <h2 className="font-heading font-extrabold uppercase text-2xl lg:text-[28px] tracking-wide mb-8">
      <span className={light ? "text-white" : "text-[#111]"}>{first} </span>
      <span className={light ? "text-[#d9c9a3]" : "text-[#a08c5f]"}>{second}</span>
    </h2>
  );
}

export default async function HomePage() {
  const [featured, categories, hero] = await Promise.all([
    prisma.product.findMany({
      where: { published: true, featured: true },
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.category.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.product.findFirst({
      where: { published: true, featured: true },
      orderBy: { createdAt: "desc" },
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    }),
  ]);

  return (
    <div className="bg-[#0c0c0c] text-white">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 38%, rgba(70,60,40,0.35), transparent 70%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 pt-14 pb-10 text-center">
          <div className="text-[12px] tracking-[0.5em] uppercase text-neutral-300 mb-3">
            Introducing
          </div>
          <h1 className="font-heading font-extrabold uppercase text-4xl lg:text-6xl tracking-[0.06em]">
            {hero?.name ?? "Kohpema Gear"}
          </h1>
          {hero?.images[0] && (
            <div className="relative mx-auto mt-6 w-64 lg:w-80">
              <div
                className="absolute inset-0 -m-10"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(120,100,60,0.4), transparent 65%)",
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hero.images[0].url}
                alt={hero.name}
                className="relative w-full"
              />
            </div>
          )}
          {hero && (
            <div className="mt-2">
              <Link href={`/products/${hero.slug}`} className="btn-tan">
                Available Now
              </Link>
            </div>
          )}
        </div>

        {/* Trust bar */}
        <div className="relative max-w-5xl mx-auto px-4 pb-14 pt-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-[13px] text-neutral-200">
          <span className="flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d9c9a3" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7l1.2 2.7 2.8.3-2.1 1.9.6 2.8-2.5-1.5-2.5 1.5.6-2.8-2.1-1.9 2.8-.3L12 7z" />
            </svg>
            EST. 1989
          </span>
          <span className="flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d9c9a3" strokeWidth="1.5">
              <path d="M3 19 L10 7 L13.5 12 L16 6 L21 19 Z" />
            </svg>
            Expedition-grade equipment
          </span>
          <span className="flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d9c9a3" strokeWidth="1.5">
              <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            Trusted on <span className="text-[#d9c9a3]">the world&apos;s highest peaks</span>
          </span>
        </div>
      </section>

      {/* ── Explore Collections ── */}
      <section className="max-w-7xl mx-auto px-4 pb-20 pt-4">
        <SectionHeading first="Explore" second="Collections" light />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {categories.slice(0, 3).map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="group relative block aspect-[5/6] overflow-hidden bg-neutral-900"
            >
              {c.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bracket font-heading font-bold uppercase text-white text-xl tracking-[0.15em]">
                  {c.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Best Sellers (cream, torn edges) ── */}
      <TornDivider />
      <section className="bg-[#f0eae3] text-[#111]">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="flex items-center gap-6 mb-8">
            <h2 className="font-heading font-extrabold uppercase text-2xl lg:text-[28px] tracking-wide whitespace-nowrap">
              Best <span className="text-[#a08c5f]">Sellers</span>
            </h2>
            <div className="h-px bg-[#a08c5f]/50 flex-1 max-w-40" />
          </div>
          <Scroller arrowsTop>
            {/* Promo tile */}
            {hero?.images[0] && (
              <Link
                href={`/products/${hero.slug}`}
                className="snap-start shrink-0 w-60 lg:w-64 bg-[#0c0c0c] text-white relative overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hero.images[0].url}
                  alt={hero.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="relative p-5">
                  <div className="text-xs text-neutral-300">The All-New</div>
                  <div className="font-heading font-extrabold text-2xl uppercase leading-tight">
                    {hero.name.split(" ").slice(0, 2).join(" ")}
                  </div>
                </div>
              </Link>
            )}
            {featured.map((p) => (
              <div key={p.id} className="snap-start shrink-0 w-60 lg:w-64">
                <SpecCard
                  product={{
                    slug: p.slug,
                    name: p.name,
                    price: Number(p.price),
                    image: p.images[0]?.url ?? null,
                    specs: (p.specs as string[]) ?? [],
                  }}
                />
              </div>
            ))}
          </Scroller>
        </div>
      </section>
      <TornDivider flip />

      {/* ── Explore Categories ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading first="Explore" second="Categories" light />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1 px-1">
          {categories.slice(0, 6).map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="group relative block aspect-square overflow-hidden bg-neutral-900"
            >
              {c.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center px-2">
                <span className="bracket font-heading font-bold uppercase text-white text-[13px] tracking-[0.12em] text-center">
                  {c.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Explore by Activity ── */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading first="Explore" second="by Activity" light />
        </div>
        <div className="max-w-7xl mx-auto px-4">
          <Scroller dark>
            {ACTIVITIES.map((a, i) => {
              const cat = categories.find((c) => c.slug === a.slug);
              return (
                <Link
                  key={a.name}
                  href={`/category/${a.slug}`}
                  className="group snap-start shrink-0 relative w-44 lg:w-56 h-80 lg:h-105 overflow-hidden bg-neutral-900"
                >
                  {cat?.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cat.image}
                      alt={a.name}
                      className={`w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500 ${i % 2 ? "scale-x-[-1]" : ""}`}
                    />
                  )}
                  <span
                    className="absolute top-4 left-3 font-heading font-extrabold uppercase text-[#f0eae3] text-4xl lg:text-5xl tracking-wide leading-none"
                    style={{ writingMode: "vertical-rl" }}
                  >
                    {a.name}
                  </span>
                </Link>
              );
            })}
          </Scroller>
          <div className="h-0.5 bg-neutral-800 mt-6 relative">
            <div className="absolute left-0 top-0 h-full w-1/3 bg-[#d9c9a3]" />
          </div>
        </div>
      </section>

      {/* ── Social ── */}
      <section className="pb-16">
        <div className="text-center mb-10">
          <span className="bracket font-heading font-bold uppercase text-white text-lg lg:text-xl tracking-[0.15em]">
            Follow us on social media
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 px-1">
          {featured.slice(0, 5).map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.slug}`}
              className="group relative block aspect-square overflow-hidden bg-neutral-900"
            >
              {p.images[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.images[0].url}
                  alt={p.name}
                  className="w-full h-full object-cover opacity-85 group-hover:opacity-60 transition-opacity"
                />
              )}
              <span className="absolute bottom-2 left-2 flex items-center gap-1.5 text-[11px] text-white/90">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
                @kohpemagear
              </span>
            </Link>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`h-0.5 w-8 ${i === 0 ? "bg-[#d9c9a3]" : "bg-neutral-700"}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
