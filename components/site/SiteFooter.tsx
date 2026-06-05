import Link from "next/link";
import { InstagramLogo, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { BRAND, INSTAGRAM_URL, INSTAGRAM_HANDLE, WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from "@/lib/site";

export default function SiteFooter({
  categories = [],
}: {
  categories?: { slug: string; name: string }[];
}) {
  const columns: { heading: string; links: { href: string; label: string }[] }[] = [
    {
      heading: "Shop",
      links: categories.map((c) => ({ href: `/category/${c.slug}`, label: c.name })),
    },
    {
      heading: BRAND,
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
  return (
    <footer className="mt-auto border-t border-border bg-bg">
      <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="col-span-2 md:col-span-1">
            <p className="font-heading text-2xl text-ink">{BRAND}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-muted">
              Traditional Indian ornament, styled to wear today. Oxidised,
              antique-finish pieces, shipped across India.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label={`Instagram ${INSTAGRAM_HANDLE}`} className="flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink">
                <InstagramLogo size={18} /> Instagram
              </a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${WHATSAPP_DISPLAY}`} className="flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink">
                <WhatsappLogo size={18} /> WhatsApp
              </a>
            </div>
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
          <p>&copy; {new Date().getFullYear()} {BRAND}. Test mode.</p>
        </div>
      </div>
    </footer>
  );
}
