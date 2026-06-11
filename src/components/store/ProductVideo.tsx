function toEmbedUrl(url: string): string | null {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\./, "");

  if (host === "youtube.com" || host === "m.youtube.com") {
    if (u.pathname === "/watch" && u.searchParams.get("v"))
      return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    const m = u.pathname.match(/^\/(?:embed|shorts)\/([\w-]+)/);
    if (m) return `https://www.youtube.com/embed/${m[1]}`;
  }
  if (host === "youtu.be") {
    const id = u.pathname.slice(1).split("/")[0];
    if (id) return `https://www.youtube.com/embed/${id}`;
  }
  if (host === "vimeo.com") {
    const m = u.pathname.match(/^\/(\d+)/);
    if (m) return `https://player.vimeo.com/video/${m[1]}`;
  }
  if (host === "player.vimeo.com") return url;

  return null;
}

export default function ProductVideo({
  url,
  name,
}: {
  url: string;
  name: string;
}) {
  const embedUrl = toEmbedUrl(url);

  return (
    <section className="mt-20">
      <h2 className="font-heading font-bold uppercase text-3xl tracking-tight text-center mb-10">
        See It In Action
      </h2>
      <div className="max-w-4xl mx-auto aspect-video bg-black">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={`${name} video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="w-full h-full"
          />
        ) : (
          <video
            controls
            preload="metadata"
            playsInline
            aria-label={`${name} video`}
            className="w-full h-full"
          >
            <source src={url} />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </section>
  );
}
