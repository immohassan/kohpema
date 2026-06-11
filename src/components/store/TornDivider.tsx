// Torn-paper edge between dark and cream sections (public/tornpaper.webp,
// solid fill #f0eae3 — cream sections must use the same color to blend).
export default function TornDivider({ flip = false }: { flip?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/tornpaper.webp"
      alt=""
      aria-hidden
      draggable={false}
      className={`block w-full select-none pointer-events-none ${flip ? "rotate-180" : ""}`}
    />
  );
}
