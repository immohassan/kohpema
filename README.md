# Kohpema Gear

A Shopify-style ecommerce store for mountaineering equipment, built with Next.js (App Router), Prisma and PostgreSQL. Checkout happens over WhatsApp — no payment gateway needed.

## Stack

- **Next.js 16** (App Router, Server Components, Server Actions)
- **Prisma 6** + **PostgreSQL** (running in Docker, container `kohpeema-pg`, port `5433`)
- **Tailwind CSS v4**
- Auth: bcrypt password hashing + signed JWT session cookie (`jose`)

## Quick start

```bash
# 1. Postgres must be running (Docker container kohpeema-pg on port 5433)
docker start kohpeema-pg

# 2. Install and prepare the database
npm install
npx prisma migrate dev
npx prisma db seed

# 3. Run
npm run dev        # development
# or
npm run build && npm run start
```

The app runs at http://localhost:3000.

## Admin panel

- URL: http://localhost:3000/admin (login at `/login`)
- Default credentials (created by the seed):
  - **Email:** `admin@kohpema.com`
  - **Password:** `admin123`

Change this password before deploying anywhere public.

Admin features:

- **Dashboard** — product/category/order counts, recent orders
- **Products** — full CRUD: images (file upload), spec badges, options (e.g. Size, Color), auto-generated variants with per-variant price/SKU/stock, draft/published, featured flag
- **Categories** — full CRUD with image, sort order, publish toggle
- **Orders** — every WhatsApp checkout is logged; update status (Pending → Confirmed → Fulfilled / Cancelled)
- **Settings** — store name, **WhatsApp order number**, announcement bar text, currency

## WhatsApp checkout

There is no payment gateway. When a customer clicks **Order on WhatsApp** (product page) or **Order via WhatsApp** (cart):

1. The order is validated and re-priced server-side, then saved to the database (visible in admin → Orders).
2. The customer is redirected to `wa.me/<your number>` with a pre-filled message listing the order number, items and total.

Set your WhatsApp number in **Admin → Settings** (international format, e.g. `+923001234567`).

## Environment

`.env`:

```
DATABASE_URL="postgresql://vetta:vetta@localhost:5433/kohpema?schema=public"
AUTH_SECRET="<random secret used to sign session JWTs>"
```

## Project layout

```
prisma/schema.prisma      # User, Category, Product, ProductOption, Variant,
                          # ProductImage, Order, OrderItem, Settings
prisma/seed.ts            # admin user, 9 categories, 12 products + variants
src/app/(store)/          # storefront: home, products, product detail, category, cart, about
src/app/admin/            # admin panel (session-guarded in layout)
src/app/login/            # admin login
src/app/api/orders/       # checkout endpoint → logs order, returns wa.me link
src/app/api/upload/       # image upload (admin only) → public/uploads
src/lib/actions/          # server actions: auth, products, categories, orders, settings
src/components/store/     # header, footer, product card, cart, purchase widget
src/components/admin/     # product form (variants editor), category form, etc.
```
