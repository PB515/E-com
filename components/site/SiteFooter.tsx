import Link from "next/link";
import { CATEGORIES } from "@/lib/catalog";

const columns: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Shop",
    links: CATEGORIES.map((c) => ({ href: `/category/${c.slug}`, label: c.name })),
  },
  {
    heading: "Bugadi",
    links: [
      { href: "/our-roots", label: "Our Roots" },
      { href: "/shop", label: "Shop all" },
    ],
  },
  {
    heading: "Help",
    links: [
      { href: "/shipping", label: "Shipping" },
      { href: "/returns", label: "Returns" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-bg">
      <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="col-span-2 md:col-span-1">
            <p className="font-heading text-2xl text-ink">Bugadi</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-muted">
              Traditional Indian ornament, styled to wear today. Oxidised,
              antique-finish pieces, shipped across India.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.heading}>
              <h2 className="text-xs uppercase tracking-[0.16em] text-ink-muted">
                {col.heading}
              </h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-border pt-6 text-xs text-ink-muted">
          <p>&copy; {new Date().getFullYear()} Bugadi. Prices include GST. Test mode.</p>
        </div>
      </div>
    </footer>
  );
}
