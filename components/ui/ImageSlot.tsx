import { Diamond } from "@phosphor-icons/react/dist/ssr";

/**
 * Honest, aspect-locked placeholder for a REAL product/hero photo.
 * Not a fake screenshot (skill §4.8) — a deliberately-composed slot in the
 * dark-editorial system, labeled for swap. Real photography (06b /
 * docs/image-prompts.md) replaces these before launch.
 * Pass an `aspect-*` class via `className` at the call site.
 */
export default function ImageSlot({
  label,
  className = "",
  rounded = "rounded-2xl",
}: {
  label?: string;
  className?: string;
  rounded?: string;
}) {
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
