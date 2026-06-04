import Image from "next/image";
import { Diamond } from "@phosphor-icons/react/dist/ssr";

/**
 * Renders a REAL product image when `src` is provided (admin-uploaded, Supabase
 * Storage), otherwise a deliberately-composed placeholder slot. Pass an
 * `aspect-*` class via `className` at the call site.
 */
export default function ImageSlot({
  label,
  src,
  alt,
  className = "",
  rounded = "rounded-2xl",
  sizes = "(min-width: 1024px) 25vw, 50vw",
}: {
  label?: string;
  src?: string;
  alt?: string;
  className?: string;
  rounded?: string;
  sizes?: string;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${rounded} border border-border bg-surface ${className}`}>
        <Image
          src={src}
          alt={alt ?? label ?? "Product image"}
          fill
          sizes={sizes}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${rounded} border border-border bg-surface ${className}`}
      aria-hidden="true"
    >
      {/* lit-surface highlight (lighting, not a brand colour) */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_30%_15%,rgba(255,255,255,0.06),transparent_55%)]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
        <Diamond size={22} weight="thin" className="text-ink-muted/70" />
        {label ? (
          <span className="text-[11px] uppercase tracking-[0.18em] text-ink-muted/70">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
