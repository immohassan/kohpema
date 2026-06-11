import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const image = await prisma.image.findUnique({ where: { id } });
  if (!image) {
    return new Response("Not found", { status: 404 });
  }

  const headers: Record<string, string> = {
    "Content-Type": image.contentType,
    // ids are random and content is immutable, so cache aggressively
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
  };
  if (image.contentType === "image/svg+xml") {
    // prevent scripts inside uploaded SVGs from running on our origin
    headers["Content-Security-Policy"] = "sandbox";
  }

  return new Response(new Uint8Array(image.data), { headers });
}
