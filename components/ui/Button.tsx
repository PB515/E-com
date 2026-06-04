import Link from "next/link";

/**
 * One button system (skill §4.4 Shape Lock): pill radius everywhere.
 * Primary = antique-silver fill + near-black text (WCAG-AA contrast).
 * Secondary = outline. Tactile press on :active. Labels stay one line.
 */
type Variant = "primary" | "secondary";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium whitespace-nowrap transition-[transform,background-color,border-color] duration-200 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-primary-ink hover:bg-ink",
  secondary: "border border-border text-ink hover:bg-surface",
};

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
  type,
}: {
  href?: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
}) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type ?? "button"} className={cls}>
      {children}
    </button>
  );
}
