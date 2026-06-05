"use client";

import { useState } from "react";
import Link from "next/link";
import { List, X, ShoppingBag } from "@phosphor-icons/react";
import { useCart } from "@/lib/cart/CartContext";

export default function SiteHeader({
  categories = [],
}: {
  categories?: { slug: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const { count, ready } = useCart();

  const navLinks = [
    ...categories.map((c) => ({ href: `/category/${c.slug}`, label: c.name })),
    { href: "/our-roots", label: "Our Roots" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-8">
        {/* wordmark (interim — real logo is vector, doc 06b) */}
        <Link
          href="/"
          className="font-heading text-2xl tracking-tight text-ink"
          aria-label="Bugadi, home"
        >
          Bugadi
        </Link>

        {/* desktop nav — single line, condenses to hamburger below lg */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="relative rounded-full p-2 text-ink transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={ready && count > 0 ? `Cart, ${count} item${count === 1 ? "" : "s"}` : "Cart"}
          >
            <ShoppingBag size={22} />
            {ready && count > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium tabular-nums text-accent-ink">
                {count}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full p-2 text-ink transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X size={22} /> : <List size={22} />}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {open ? (
        <nav
          id="mobile-menu"
          className="border-t border-border bg-bg px-5 py-4 lg:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col">
            <li>
              <Link
                href="/shop"
                onClick={() => setOpen(false)}
                className="block py-3 text-ink"
              >
                Shop all
              </Link>
            </li>
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-ink-muted hover:text-ink"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
