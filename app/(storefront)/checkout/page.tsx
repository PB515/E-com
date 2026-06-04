import type { Metadata } from "next";
import CheckoutSummary from "@/components/cart/CheckoutSummary";

export const metadata: Metadata = { title: "Checkout" };

// Phase 3: the summary reads the live cart. The form structure is laid out for
// Phase 4, which wires the flow (address -> place-of-supply GST -> Razorpay
// test / COD -> idempotent webhook). The form does not submit yet.
const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab",
  "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand",
  "West Bengal",
];

const inputClass =
  "w-full rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink placeholder:text-ink-muted/70 focus:border-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";
const labelClass = "mb-2 block text-sm text-ink";

export default function CheckoutPage() {
  return (
    <section className="mx-auto max-w-[1100px] px-5 py-12 sm:px-8 lg:py-16">
      <h1 className="font-heading text-4xl text-ink lg:text-5xl">Checkout</h1>
      <p className="mt-3 max-w-xl text-sm text-ink-muted">
        This is a preview of the checkout. Payment and GST run in test mode and
        are wired in the next update. No real money moves.
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
        {/* Address form (structure only) */}
        <form className="flex flex-col gap-5" aria-label="Shipping details">
          <fieldset className="flex flex-col gap-5">
            <legend className="font-heading text-xl text-ink">Contact</legend>
            <div>
              <label htmlFor="name" className={labelClass}>Full name</label>
              <input id="name" name="name" className={inputClass} placeholder="Your name" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className={labelClass}>Email</label>
                <input id="email" name="email" type="email" className={inputClass} placeholder="you@email.com" />
              </div>
              <div>
                <label htmlFor="phone" className={labelClass}>Phone</label>
                <input id="phone" name="phone" type="tel" className={inputClass} placeholder="10-digit mobile" />
              </div>
            </div>
          </fieldset>

          <fieldset className="mt-2 flex flex-col gap-5">
            <legend className="font-heading text-xl text-ink">Shipping address</legend>
            <div>
              <label htmlFor="line1" className={labelClass}>Address</label>
              <input id="line1" name="line1" className={inputClass} placeholder="House, street, area" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="city" className={labelClass}>City</label>
                <input id="city" name="city" className={inputClass} placeholder="City" />
              </div>
              <div>
                <label htmlFor="pincode" className={labelClass}>PIN code</label>
                <input id="pincode" name="pincode" className={inputClass} placeholder="6-digit PIN" />
              </div>
            </div>
            <div>
              <label htmlFor="state" className={labelClass}>State</label>
              <select id="state" name="state" className={inputClass} defaultValue="">
                <option value="" disabled>Select your state</option>
                {STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <p className="mt-2 text-xs text-ink-muted">
                Your state sets the GST split (CGST and SGST within the state,
                IGST across states).
              </p>
            </div>
          </fieldset>
        </form>

        {/* Summary */}
        <CheckoutSummary />
      </div>
    </section>
  );
}
