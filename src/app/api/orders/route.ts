import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildWhatsAppLink, formatMoney } from "@/lib/utils";

type OrderItemInput = {
  productId: string;
  variantId?: string | null;
  quantity: number;
};

export async function POST(req: Request) {
  let body: { items?: OrderItemInput[]; customer?: string; phone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const items = body.items ?? [];
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const settings = await prisma.settings.findUnique({ where: { id: 1 } });
  if (!settings?.whatsappNumber) {
    return NextResponse.json(
      { error: "Store WhatsApp number is not configured" },
      { status: 500 }
    );
  }

  // Re-price every line item server-side
  const lines: {
    productId: string;
    variantId: string | null;
    name: string;
    price: number;
    quantity: number;
  }[] = [];

  for (const item of items) {
    const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      include: { variants: true },
    });
    if (!product || !product.published) {
      return NextResponse.json(
        { error: "A product in your cart is no longer available" },
        { status: 400 }
      );
    }
    let name = product.name;
    let price = Number(product.price);
    let variantId: string | null = null;
    if (item.variantId) {
      const variant = product.variants.find((v) => v.id === item.variantId);
      if (!variant) {
        return NextResponse.json(
          { error: "Selected variant is no longer available" },
          { status: 400 }
        );
      }
      variantId = variant.id;
      name = `${product.name} (${variant.title})`;
      if (variant.price != null) price = Number(variant.price);
    }
    lines.push({ productId: product.id, variantId, name, price, quantity });
  }

  const total = lines.reduce((s, l) => s + l.price * l.quantity, 0);

  const order = await prisma.order.create({
    data: {
      customer: body.customer || null,
      phone: body.phone || null,
      total,
      items: {
        create: lines.map((l) => ({
          productId: l.productId,
          variantId: l.variantId,
          name: l.name,
          price: l.price,
          quantity: l.quantity,
        })),
      },
    },
  });

  const currency = settings.currency || "PKR";
  const message = [
    `Hello ${settings.storeName}! I'd like to place an order.`,
    "",
    `Order #${order.number}`,
    ...lines.map(
      (l) =>
        `• ${l.name} × ${l.quantity} — ${formatMoney(l.price * l.quantity, currency)}`
    ),
    "",
    `Total: ${formatMoney(total, currency)}`,
  ].join("\n");

  return NextResponse.json({
    orderId: order.id,
    orderNumber: order.number,
    waLink: buildWhatsAppLink(settings.whatsappNumber, message),
  });
}
