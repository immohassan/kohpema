import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP, GIF or SVG images allowed" },
      { status: 400 }
    );
  }
  if (file.size > 4 * 1024 * 1024) {
    return NextResponse.json({ error: "Max file size is 4 MB" }, { status: 400 });
  }

  const data = Buffer.from(await file.arrayBuffer());
  const image = await prisma.image.create({
    data: { data, contentType: file.type },
    select: { id: true },
  });

  return NextResponse.json({ url: `/api/images/${image.id}` });
}
