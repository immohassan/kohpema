import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const PALETTE = [
  ["#1a1a1a", "#e8500a"],
  ["#16211f", "#3ba99c"],
  ["#1d1a26", "#8a7cc2"],
  ["#231a16", "#d98e32"],
  ["#101820", "#4a90d9"],
  ["#201616", "#c0392b"],
];

function productSvg(name: string, idx: number, angle: number): string {
  const [bg, accent] = PALETTE[idx % PALETTE.length];
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const peaks =
    angle === 0
      ? "M80 560 L300 260 L420 420 L540 200 L720 560 Z"
      : "M80 560 L260 320 L400 460 L560 240 L720 560 Z";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <rect width="800" height="800" fill="${bg}"/>
  <g opacity="0.12" stroke="#ffffff" stroke-width="1">
    ${Array.from({ length: 9 }, (_, i) => `<line x1="0" y1="${(i + 1) * 80}" x2="800" y2="${(i + 1) * 80}"/>`).join("\n    ")}
    ${Array.from({ length: 9 }, (_, i) => `<line x1="${(i + 1) * 80}" y1="0" x2="${(i + 1) * 80}" y2="800"/>`).join("\n    ")}
  </g>
  <path d="${peaks}" fill="none" stroke="${accent}" stroke-width="14" stroke-linejoin="round"/>
  <circle cx="620" cy="170" r="46" fill="none" stroke="${accent}" stroke-width="10" opacity="0.9"/>
  <text x="400" y="680" font-family="Arial, sans-serif" font-size="120" font-weight="bold" fill="#ffffff" text-anchor="middle" opacity="0.92">${initials}</text>
  <text x="400" y="740" font-family="Arial, sans-serif" font-size="30" letter-spacing="6" fill="${accent}" text-anchor="middle">KOHPEMA GEAR</text>
</svg>`;
}

function categorySvg(name: string, idx: number): string {
  const [bg, accent] = PALETTE[idx % PALETTE.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="${bg}"/>
  <path d="M40 540 L240 220 L360 380 L520 160 L760 540 Z" fill="${accent}" opacity="0.25"/>
  <path d="M40 540 L240 220 L360 380 L520 160 L760 540 Z" fill="none" stroke="${accent}" stroke-width="10" stroke-linejoin="round"/>
</svg>`;
}

async function main() {
  const imgDir = path.join(process.cwd(), "public", "products");
  const catDir = path.join(process.cwd(), "public", "categories");
  fs.mkdirSync(imgDir, { recursive: true });
  fs.mkdirSync(catDir, { recursive: true });
  fs.mkdirSync(path.join(process.cwd(), "public", "uploads"), {
    recursive: true,
  });

  // Admin user
  const password = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@kohpema.com" },
    update: {},
    create: {
      email: "admin@kohpema.com",
      password,
      name: "Kohpema Admin",
      role: "ADMIN",
    },
  });

  // Settings
  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      storeName: "Kohpema Gear",
      whatsappNumber: "+923001234567",
      announcement: "FREE Shipping over Rs 25,000",
      currency: "PKR",
    },
  });

  const categories = [
    { name: "Ice Axes", slug: "ice-axes", description: "Technical and classic mountaineering axes for every grade of terrain." },
    { name: "Crampons", slug: "crampons", description: "Aggressive traction for glacier travel, mixed routes and waterfall ice." },
    { name: "Harnesses", slug: "harnesses", description: "Lightweight alpine and all-round climbing harnesses." },
    { name: "Ropes", slug: "ropes", description: "Dynamic single ropes, half ropes and glacier cords." },
    { name: "Hardware", slug: "hardware", description: "Carabiners, quickdraws, belay devices and protection." },
    { name: "Helmets", slug: "helmets", description: "Certified head protection for climbing and mountaineering." },
    { name: "Headlamps", slug: "headlamps", description: "High-output lighting for alpine starts and night descents." },
    { name: "Backpacks", slug: "backpacks", description: "Expedition and alpine packs from 30 to 80 litres." },
    { name: "Apparel", slug: "apparel", description: "Shells, insulation and gloves built for the death zone." },
  ];

  const catIds: Record<string, string> = {};
  for (let i = 0; i < categories.length; i++) {
    const c = categories[i];
    const file = `${c.slug}.svg`;
    fs.writeFileSync(path.join(catDir, file), categorySvg(c.name, i));
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { ...c, image: `/categories/${file}`, sortOrder: i },
    });
    catIds[c.slug] = cat.id;
  }

  type SeedProduct = {
    name: string;
    slug: string;
    category: string;
    price: number;
    comparePrice?: number;
    sku: string;
    stock: number;
    featured?: boolean;
    description: string;
    specs: string[];
    options?: { name: string; values: string[] }[];
    variants?: { title: string; options: Record<string, string>; price?: number; stock: number; sku: string }[];
  };

  const products: SeedProduct[] = [
    {
      name: "Summit Pro Ice Axe",
      slug: "summit-pro-ice-axe",
      category: "ice-axes",
      price: 189.95,
      comparePrice: 219.95,
      sku: "KG-IA-001",
      stock: 42,
      featured: true,
      description:
        "The Summit Pro is our flagship technical ice axe. A hot-forged steel head with an aggressive reverse-curve pick bites confidently into bullet-hard alpine ice, while the bent aluminium shaft keeps your knuckles clear on steep terrain. Triple-riveted spike for secure plunging on the descent.",
      specs: ["HOT-FORGED HEAD", "485 G", "CEN-B CERTIFIED"],
      options: [{ name: "Length", values: ["50 cm", "55 cm", "60 cm"] }],
      variants: [
        { title: "50 cm", options: { Length: "50 cm" }, stock: 14, sku: "KG-IA-001-50" },
        { title: "55 cm", options: { Length: "55 cm" }, stock: 16, sku: "KG-IA-001-55" },
        { title: "60 cm", options: { Length: "60 cm" }, stock: 12, sku: "KG-IA-001-60" },
      ],
    },
    {
      name: "Glacier Lite Axe",
      slug: "glacier-lite-axe",
      category: "ice-axes",
      price: 119.95,
      sku: "KG-IA-002",
      stock: 35,
      description:
        "An ultralight classic-curve axe for glacier travel and ski mountaineering. Full aluminium construction shaves grams without sacrificing self-arrest performance.",
      specs: ["340 G", "CEN-B CERTIFIED", "ALU SHAFT"],
      options: [{ name: "Length", values: ["55 cm", "65 cm"] }],
      variants: [
        { title: "55 cm", options: { Length: "55 cm" }, stock: 20, sku: "KG-IA-002-55" },
        { title: "65 cm", options: { Length: "65 cm" }, stock: 15, sku: "KG-IA-002-65" },
      ],
    },
    {
      name: "Vertex 12-Point Crampons",
      slug: "vertex-12-point-crampons",
      category: "crampons",
      price: 159.95,
      sku: "KG-CR-001",
      stock: 28,
      featured: true,
      description:
        "Twelve points of chromoly steel traction with dual horizontal front points for stability on snow slopes and moderate ice. Tool-free micro-adjustment fits boot sizes EU 36–47. Anti-balling plates included.",
      specs: ["12 POINTS", "CHROMOLY STEEL", "870 G / PAIR"],
      options: [{ name: "Binding", values: ["Strap", "Hybrid", "Step-In"] }],
      variants: [
        { title: "Strap", options: { Binding: "Strap" }, stock: 10, sku: "KG-CR-001-ST" },
        { title: "Hybrid", options: { Binding: "Hybrid" }, stock: 10, sku: "KG-CR-001-HY" },
        { title: "Step-In", options: { Binding: "Step-In" }, price: 169.95, stock: 8, sku: "KG-CR-001-SI" },
      ],
    },
    {
      name: "Alpine Ascent Harness",
      slug: "alpine-ascent-harness",
      category: "harnesses",
      price: 89.95,
      sku: "KG-HA-001",
      stock: 50,
      featured: true,
      description:
        "A 285-gram alpine harness that packs down to the size of an orange. Drop-leg buckles let you put it on with crampons or skis still attached. Four ice-clipper slots and a haul loop round out a true mountain harness.",
      specs: ["285 G", "4 GEAR LOOPS", "PACKS TINY"],
      options: [
        { name: "Size", values: ["S", "M", "L", "XL"] },
        { name: "Color", values: ["Glacier Blue", "Ember Orange"] },
      ],
      variants: [
        { title: "S / Glacier Blue", options: { Size: "S", Color: "Glacier Blue" }, stock: 6, sku: "KG-HA-001-SB" },
        { title: "M / Glacier Blue", options: { Size: "M", Color: "Glacier Blue" }, stock: 8, sku: "KG-HA-001-MB" },
        { title: "L / Glacier Blue", options: { Size: "L", Color: "Glacier Blue" }, stock: 7, sku: "KG-HA-001-LB" },
        { title: "XL / Glacier Blue", options: { Size: "XL", Color: "Glacier Blue" }, stock: 4, sku: "KG-HA-001-XB" },
        { title: "S / Ember Orange", options: { Size: "S", Color: "Ember Orange" }, stock: 6, sku: "KG-HA-001-SO" },
        { title: "M / Ember Orange", options: { Size: "M", Color: "Ember Orange" }, stock: 9, sku: "KG-HA-001-MO" },
        { title: "L / Ember Orange", options: { Size: "L", Color: "Ember Orange" }, stock: 6, sku: "KG-HA-001-LO" },
        { title: "XL / Ember Orange", options: { Size: "XL", Color: "Ember Orange" }, stock: 4, sku: "KG-HA-001-XO" },
      ],
    },
    {
      name: "Dynamic 9.8 Rope 60m",
      slug: "dynamic-9-8-rope-60m",
      category: "ropes",
      price: 219.95,
      comparePrice: 249.95,
      sku: "KG-RO-001",
      stock: 22,
      featured: true,
      description:
        "A workhorse 9.8 mm single rope with a dry-treated core and sheath. UIAA water-repellent certified for ice and alpine use; supple handling for clean clips even with gloves on.",
      specs: ["9.8 MM", "DRY CORE", "UIAA CERTIFIED"],
      options: [{ name: "Length", values: ["60 m", "70 m"] }],
      variants: [
        { title: "60 m", options: { Length: "60 m" }, stock: 14, sku: "KG-RO-001-60" },
        { title: "70 m", options: { Length: "70 m" }, price: 249.95, stock: 8, sku: "KG-RO-001-70" },
      ],
    },
    {
      name: "HMS Locking Carabiner",
      slug: "hms-locking-carabiner",
      category: "hardware",
      price: 17.95,
      sku: "KG-HW-001",
      stock: 120,
      description:
        "Pear-shaped HMS locker with a smooth screwgate and keylock nose. Ideal for belaying with a Munter hitch or any tube-style device.",
      specs: ["24 KN MAJOR AXIS", "78 G", "KEYLOCK NOSE"],
    },
    {
      name: "Alpine Quickdraw Set (6-Pack)",
      slug: "alpine-quickdraw-set",
      category: "hardware",
      price: 109.95,
      sku: "KG-HW-002",
      stock: 40,
      description:
        "Six lightweight wiregate draws on 60 cm extendable dyneema slings. Rack light, extend long, and keep rope drag off your hardest alpine pitches.",
      specs: ["6 × 60 CM SLINGS", "WIREGATE", "576 G TOTAL"],
    },
    {
      name: "Apex Climbing Helmet",
      slug: "apex-climbing-helmet",
      category: "helmets",
      price: 99.95,
      sku: "KG-HE-001",
      stock: 33,
      featured: true,
      description:
        "In-mold EPS construction at just 210 grams with top and side impact certification. Magnetic buckle works one-handed; four clips hold any headlamp securely.",
      specs: ["210 G", "TOP+SIDE CERTIFIED", "HEADLAMP CLIPS"],
      options: [
        { name: "Size", values: ["S/M", "M/L"] },
        { name: "Color", values: ["White", "Ember Orange", "Black"] },
      ],
      variants: [
        { title: "S/M / White", options: { Size: "S/M", Color: "White" }, stock: 6, sku: "KG-HE-001-SW" },
        { title: "M/L / White", options: { Size: "M/L", Color: "White" }, stock: 6, sku: "KG-HE-001-LW" },
        { title: "S/M / Ember Orange", options: { Size: "S/M", Color: "Ember Orange" }, stock: 5, sku: "KG-HE-001-SO" },
        { title: "M/L / Ember Orange", options: { Size: "M/L", Color: "Ember Orange" }, stock: 6, sku: "KG-HE-001-LO" },
        { title: "S/M / Black", options: { Size: "S/M", Color: "Black" }, stock: 5, sku: "KG-HE-001-SB" },
        { title: "M/L / Black", options: { Size: "M/L", Color: "Black" }, stock: 5, sku: "KG-HE-001-LB" },
      ],
    },
    {
      name: "Beam 450 Headlamp",
      slug: "beam-450-headlamp",
      category: "headlamps",
      price: 64.95,
      sku: "KG-HL-001",
      stock: 60,
      featured: true,
      description:
        "450 lumens of regulated output with a 90-metre spot beam for route-finding on 2 a.m. alpine starts. IPX7 waterproof, red night-vision mode, and a reactive dimming sensor that stretches burn time to 160 hours.",
      specs: ["450 LUMENS", "IPX7", "86 G"],
      options: [{ name: "Color", values: ["Black", "Glacier Blue", "Ember Orange"] }],
      variants: [
        { title: "Black", options: { Color: "Black" }, stock: 25, sku: "KG-HL-001-BK" },
        { title: "Glacier Blue", options: { Color: "Glacier Blue" }, stock: 18, sku: "KG-HL-001-BL" },
        { title: "Ember Orange", options: { Color: "Ember Orange" }, stock: 17, sku: "KG-HL-001-OR" },
      ],
    },
    {
      name: "Expedition 65L Pack",
      slug: "expedition-65l-pack",
      category: "backpacks",
      price: 289.95,
      comparePrice: 329.95,
      sku: "KG-BP-001",
      stock: 18,
      featured: true,
      description:
        "A 65-litre expedition hauler with a stripped-down alpine attitude. Removable lid and frame sheet drop the weight to 1.4 kg for summit pushes. Dual axe attachments, crampon pocket, and a roll-top extension collar for those just-in-case loads.",
      specs: ["65 L", "1.9 KG FULL / 1.4 KG STRIPPED", "210D ROBIC NYLON"],
      options: [{ name: "Size", values: ["S/M", "M/L"] }],
      variants: [
        { title: "S/M", options: { Size: "S/M" }, stock: 9, sku: "KG-BP-001-SM" },
        { title: "M/L", options: { Size: "M/L" }, stock: 9, sku: "KG-BP-001-ML" },
      ],
    },
    {
      name: "Storm Shell Jacket",
      slug: "storm-shell-jacket",
      category: "apparel",
      price: 349.95,
      sku: "KG-AP-001",
      stock: 30,
      description:
        "A 3-layer hardshell with a 28,000 mm waterproof rating and helmet-compatible hood. Pit zips dump heat fast on the approach; harness-friendly pockets stay reachable under a loaded hipbelt.",
      specs: ["3-LAYER SHELL", "28K WATERPROOF", "425 G"],
      options: [
        { name: "Size", values: ["S", "M", "L", "XL"] },
        { name: "Color", values: ["Ember Orange", "Black"] },
      ],
      variants: [
        { title: "S / Ember Orange", options: { Size: "S", Color: "Ember Orange" }, stock: 4, sku: "KG-AP-001-SO" },
        { title: "M / Ember Orange", options: { Size: "M", Color: "Ember Orange" }, stock: 5, sku: "KG-AP-001-MO" },
        { title: "L / Ember Orange", options: { Size: "L", Color: "Ember Orange" }, stock: 4, sku: "KG-AP-001-LO" },
        { title: "XL / Ember Orange", options: { Size: "XL", Color: "Ember Orange" }, stock: 2, sku: "KG-AP-001-XO" },
        { title: "S / Black", options: { Size: "S", Color: "Black" }, stock: 4, sku: "KG-AP-001-SB" },
        { title: "M / Black", options: { Size: "M", Color: "Black" }, stock: 5, sku: "KG-AP-001-MB" },
        { title: "L / Black", options: { Size: "L", Color: "Black" }, stock: 4, sku: "KG-AP-001-LB" },
        { title: "XL / Black", options: { Size: "XL", Color: "Black" }, stock: 2, sku: "KG-AP-001-XB" },
      ],
    },
    {
      name: "Insulated Summit Mitts",
      slug: "insulated-summit-mitts",
      category: "apparel",
      price: 129.95,
      sku: "KG-AP-002",
      stock: 25,
      description:
        "800-fill down mitts rated to -40°C with a removable liner and goat-leather palm. Idiot cords included — you will not drop these on the summit ridge.",
      specs: ["800-FILL DOWN", "-40°C RATED", "LEATHER PALM"],
      options: [{ name: "Size", values: ["S", "M", "L"] }],
      variants: [
        { title: "S", options: { Size: "S" }, stock: 8, sku: "KG-AP-002-S" },
        { title: "M", options: { Size: "M" }, stock: 10, sku: "KG-AP-002-M" },
        { title: "L", options: { Size: "L" }, stock: 7, sku: "KG-AP-002-L" },
      ],
    },
  ];

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const img1 = `${p.slug}-1.svg`;
    const img2 = `${p.slug}-2.svg`;
    fs.writeFileSync(path.join(imgDir, img1), productSvg(p.name, i, 0));
    fs.writeFileSync(path.join(imgDir, img2), productSvg(p.name, i, 1));

    const existing = await prisma.product.findUnique({
      where: { slug: p.slug },
    });
    if (existing) continue;

    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        comparePrice: p.comparePrice,
        sku: p.sku,
        stock: p.stock,
        featured: p.featured ?? false,
        specs: p.specs,
        categoryId: catIds[p.category],
        images: {
          create: [
            { url: `/products/${img1}`, alt: p.name, sortOrder: 0 },
            { url: `/products/${img2}`, alt: `${p.name} alternate view`, sortOrder: 1 },
          ],
        },
        options: {
          create: (p.options ?? []).map((o, idx) => ({
            name: o.name,
            values: o.values,
            sortOrder: idx,
          })),
        },
        variants: {
          create: (p.variants ?? []).map((v) => ({
            title: v.title,
            options: v.options,
            price: v.price,
            stock: v.stock,
            sku: v.sku,
          })),
        },
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
