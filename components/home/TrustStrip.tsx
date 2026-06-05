import { Truck, Coins, ShieldCheck, ArrowUUpLeft } from "@phosphor-icons/react/dist/ssr";

// Informational strip — stays still (skill §5: motion must be motivated).
// No card boxes; grouped by hairline dividers (skill §4.4). Icons are fixed by
// position; the labels/subs are admin-editable (homepage CMS).
const ICONS = [Truck, Coins, ShieldCheck, ArrowUUpLeft];
const DEFAULT_ITEMS = [
  { label: "Pan-India shipping", sub: "via Shiprocket" },
  { label: "Cash on delivery", sub: "available at checkout" },
  { label: "Secure checkout", sub: "powered by Razorpay" },
  { label: "7-day returns", sub: "on damaged or wrong items" },
];

export default function TrustStrip({ items = DEFAULT_ITEMS }: { items?: { label: string; sub: string }[] }) {
  return (
    <section className="border-y border-border bg-surface/40">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-px md:grid-cols-4">
        {items.map((item, i) => {
          const Icon = ICONS[i] ?? Truck;
          return (
            <div key={i} className="flex items-start gap-3 px-5 py-6 sm:px-8">
              <Icon size={22} weight="light" className="mt-0.5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium text-ink">{item.label}</p>
                <p className="text-xs text-ink-muted">{item.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
