import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/homepage", label: "Homepage" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/tax-settings", label: "Tax settings" },
  { href: "/admin/invoices", label: "Invoices" },
  { href: "/admin/returns", label: "Returns" },
  { href: "/admin/launch", label: "Launch" },
  { href: "/admin/audit", label: "Activity" },
];

export default function AdminNav({ email }: { email?: string }) {
  return (
    <header className="border-b border-border bg-bg">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4 sm:px-8">
        <Link href="/admin" className="font-heading text-xl text-ink">
          Bugadi admin
        </Link>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-ink-muted transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          {email ? (
            <span className="hidden text-xs text-ink-muted sm:inline">{email}</span>
          ) : null}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
