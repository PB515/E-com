import { Truck, Coins, ShieldCheck, ArrowUUpLeft } from "@phosphor-icons/react/dist/ssr";

// Informational strip — stays still (skill §5: motion must be motivated).
// No card boxes; grouped by hairline dividers (skill §4.4).
const items = [
  { Icon: Truck, label: "Pan-India shipping", sub: "via Shiprocket" },
  { Icon: Coins, label: "Cash on delivery", sub: "available at checkout" },
  { Icon: ShieldCheck, label: "Secure checkout", sub: "powered by Razorpay" },
  { Icon: ArrowUUpLeft, label: "7-day returns", sub: "on damaged or wrong items" },
];

export default function TrustStrip() {
  return (
    <section className="border-y border-border bg-surface/40">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-px md:grid-cols-4">
        {items.map(({ Icon, label, sub }) => (
          <div
            key={label}
            className="flex items-start gap-3 px-5 py-6 sm:px-8"
          >
            <Icon size={22} weight="light" className="mt-0.5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium text-ink">{label}</p>
              <p className="text-xs text-ink-muted">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
