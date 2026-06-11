export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div>
      <section className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="font-heading font-bold uppercase text-5xl tracking-tight">
            About Kohpema Gear
          </h1>
          <p className="mt-4 text-[#e8500a] uppercase tracking-[0.3em] text-sm font-semibold">
            Est. 1989 — Built for the summit
          </p>
        </div>
      </section>
      <div className="max-w-3xl mx-auto px-4 py-14 space-y-6 leading-relaxed text-neutral-700">
        <p>
          Kohpema Gear was born at basecamp. Since 1989 we have designed and
          built mountaineering equipment for the people who go where the air is
          thin: alpinists, high-altitude guides, and expedition teams on the
          world&apos;s highest peaks.
        </p>
        <p>
          Every ice axe, crampon, rope and pack we sell is tested in the
          mountains before it earns the Kohpema name. We don&apos;t make
          lifestyle products — we make tools that bring you home.
        </p>
        <p>
          Ordering is simple: pick your gear, tap{" "}
          <strong>Order on WhatsApp</strong>, and our team will confirm your
          order, delivery and payment directly in chat.
        </p>
      </div>
    </div>
  );
}
