import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "@/lib/actions/auth";

export const metadata = { title: { default: "Admin", template: "%s | Kohpema Admin" } };

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col lg:flex-row">
      <aside className="lg:w-60 bg-black text-white shrink-0 lg:min-h-screen">
        <div className="p-5 border-b border-neutral-800">
          <Link href="/admin" className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 40 40" aria-hidden>
              <rect width="40" height="40" fill="#000" stroke="#333" />
              <path d="M5 32 L16 14 L22 22 L28 11 L35 32 Z" fill="none" stroke="#e8500a" strokeWidth="2.5" strokeLinejoin="round" />
            </svg>
            <span className="font-heading font-bold tracking-[0.15em] uppercase text-sm">
              Kohpema Admin
            </span>
          </Link>
        </div>
        <nav className="p-3 flex lg:flex-col gap-1 overflow-x-auto">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2.5 text-sm uppercase tracking-wider font-semibold text-neutral-300 hover:bg-neutral-900 hover:text-[#e8500a] whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/"
            className="px-4 py-2.5 text-sm uppercase tracking-wider font-semibold text-neutral-500 hover:bg-neutral-900 hover:text-white whitespace-nowrap"
          >
            ← View Store
          </Link>
        </nav>
        <div className="p-5 lg:absolute lg:bottom-0 hidden lg:block">
          <div className="text-xs text-neutral-500 mb-2">{session.email}</div>
          <form action={logout}>
            <button className="text-xs uppercase tracking-wider text-neutral-400 hover:text-white">
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-neutral-200 px-6 py-3 flex justify-between items-center lg:hidden">
          <span className="text-sm text-neutral-500">{session.email}</span>
          <form action={logout}>
            <button className="text-xs uppercase tracking-wider text-neutral-500 hover:text-black">
              Sign out
            </button>
          </form>
        </header>
        <main className="p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
