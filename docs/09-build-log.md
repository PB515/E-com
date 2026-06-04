# 09 — Build Log (changelog + resume notes)

*Bugadi. Control doc (living). One line per significant prompt and what it produced or broke — so a phase-4 explosion traces to its phase-1 cause in minutes. The **BROKE/reverted lines are the gold.***

---

## Changelog

```
DATE       | PHASE | PROMPT SUMMARY                         | RESULT / NOTES              | COMMIT
2026-06-04 | docs  | Generate doc set 01–11 + app docs      | Generated; awaiting 03b      | (pre-git)
                                                              sign-off + founder-default
                                                              confirmation
2026-06-04 | 3b    | 03b APPROVED by founder ("proceed")    | Gate cleared; image slots    | (pre-git)
                                                              locked from 03b page list
2026-06-04 | 4     | Generate image prompts from 06b+04     | docs/image-prompts.md —      | (pre-git)
                                                              34 files; icons+logo skipped
2026-06-04 | 0     | Scaffold Next.js 16 + Tailwind v4 +     | Build PASSES (20 routes);    | 799bfdd
                     tokens + all 03b routes + lib stubs    | git init, main+phase-0
2026-06-04 | 0     | Consolidate skills → .claude/skills;    | Clean; .claudeskills/        | f852c4c
                     untrack auto-provisioned mirror        | untracked
2026-06-04 | docs  | FROZEN-DOC CHANGE: doc 04 palette+type  | Logged spec change before    | (this commit)
                     revised per taste-skill decision       | build (toolkit rule). Token
                                                              code update happens in Phase 1
```

```
2026-06-04 | 1     | Homepage build w/ taste-skill: tokens, | Build PASSES; no console      | (phase-1)
                     fonts, header/footer, 6 home sections, | errors; 360px no overflow;
                     (storefront) route group               | mobile menu works
```

**Phase 1 — DONE / green.** Built the home shape per 03b using `design-taste-frontend`: near-black/silver/rose tokens in `globals.css`; Cormorant + Outfit via `next/font`; `SiteHeader` (sticky, desktop nav + mobile menu) + `SiteFooter`; six sections each a distinct layout family (split hero · asymmetric 3-then-2 category grid · horizontal featured rail · editorial heritage band · hairline trust strip · centered newsletter band). Moved storefront routes into an `app/(storefront)` group so chrome never bleeds into admin. Motion = `Reveal` client leaf (entrance + scroll-reveal once, reduced-motion honored). Verified live in the preview at 1280 + 360px. Pre-Flight + doc-10 QA pass. **Placeholder image slots** (hero, 5 category, 6 featured) await real photography from `docs/image-prompts.md`. Newsletter form is UI-only (honeypot present; persistence is Phase 4). New deps (approved): `motion`, `@phosphor-icons/react`.

```
2026-06-04 | 2     | Secondary storefront pages (static):   | Build PASSES; category+PDP    | (phase-2)
                     category, PDP w/ Heritage Story, cart, | SSG (5+11 paths); no console
                     checkout shell, shop, our-roots, policy | errors; 360px no overflow
```

**Phase 2 — DONE / green.** Extended `lib/catalog.ts` to 11 placeholder SKUs (full PDP fields + heritage stories). Built, all with the taste-skill: **category** pages (SSG, product grid + empty state + newsletter), the **PDP** (SSG: gallery + buy panel + functional qty stepper + Add-to-bag with mobile sticky bar + the **Heritage Story block** killer feature + details + shipping/returns note + related + Product JSON-LD), **shop-all**, **cart** (empty state — live cart is Phase 3), **checkout shell** (address form incl. State select for place-of-supply, summary, all visual; payment/GST are Phase 4), **Our Roots** (heritage editorial), and the policy/info pages (**shipping, returns** w/ ReturnForm, **privacy** matching the cookieless analytics, **terms, contact** w/ ContactForm). New shared pieces: `shop/ProductCard`, `shop/AddToCart`, `site/ContentPage`, `forms/ContactForm`, `forms/ReturnForm`; `NewsletterBand` moved to `site/`. Fixed em-dashes in visible meta titles/404 (skill §9.G). Verified live via DOM: PDP renders correctly, no console errors, no 360px overflow. Add-to-bag + forms are UI-only (honest feedback, no fake storage); wired in Phase 3/4. Image slots still placeholders.

```
2026-06-04 | 3     | Client cart: CartContext + provider,    | Build PASSES; full flow      | (phase-3)
                     header badge, add-to-bag, cart page,    | verified live (add→badge→
                     checkout summary, localStorage          | cart→qty→remove→empty); no
                                                              console errors
```

**Phase 3 — DONE / green.** Built the **client cart** (`lib/cart/CartContext.tsx`, React Context + localStorage, **no new dep**). Stores `{slug, qty}`; product/price/stock resolved from `lib/catalog` (single-sourced). `CartProvider` wraps the storefront layout (not admin). Wired: header **cart badge** (reflects count, hidden at 0, hydration-safe via `ready` flag); **Add-to-bag** on the PDP (inline + mobile sticky bar) adds to the cart with an "Added / View bag" confirmation; **cart page** (`CartView`) with line items, qty stepper, remove, subtotal, empty + loading states; **checkout summary** (`CheckoutSummary`) reads the live cart. Stepper uses a functional `changeQty(slug, delta)` so rapid clicks increment correctly (fixed a stale-closure found in testing). Verified end to end live: add → badge → cart → qty 1/2/3 → remove → empty, persistence across a full reload, checkout subtotal correct (₹2,997 for a 2-line bag). No console errors. Still no DB/payment (Phase 4); image slots still placeholders.

```
2026-06-04 | 4     | Phase 4 FOUNDATION (key-independent):   | Build PASSES; GST math       | (phase-4)
                     migration SQL, lib/tax (verified),      | verified; deps added.
                     Supabase clients, setup guide           | PAUSED at denial gate
                                                              (needs live Supabase)
```

**Phase 4 — IN PROGRESS (foundation laid; paused for keys).** Built the parts that need no keys: `supabase/migrations/0001_init.sql` (full schema + RLS deny-by-default + `is_admin()` + 11-product seed, ready to run in Supabase SQL editor); `lib/tax.ts` (place-of-supply GST on GST-inclusive prices — **verified**: intra → CGST+SGST split exact, inter → IGST, base+tax==inclusive); `lib/supabase/{client,server,admin}.ts` (anon browser, cookie-bound server, service-role server-only — read env by name). Deps added (approved as Phase 4): `@supabase/supabase-js`, `@supabase/ssr`, `razorpay`, `resend`. `.env.local` created from template (blank, founder fills). Wrote `docs/phase-4-setup.md` (what/where/upload). **NOT merged to main** — main stays on the complete Phase 3; merge when Phase 4 is green. **Blocked on:** founder's Supabase keys + running the migration → then build auth → RLS → **prove denial gate** → features (catalog-from-DB, checkout GST+Razorpay test+idempotent webhook+invoice snapshot, Shiprocket, Resend, admin). Order/invoice numbering via DB sequences in the migration.

**Frozen-doc change — doc 04 (logged).** Adopted the `design-taste-frontend` skill for storefront surfaces. Founder chose: **cool antique-silver on near-black** (brass/gold dropped; one accent = deep rose `#B23A52`) and a **justified heritage serif, not Fraunces** (Cormorant Garamond first choice). Recorded the skill's Design Read + dials (`VARIANCE 7 / MOTION 4 / DENSITY 3`) in doc 04. Reason for diverging from doc 04 v1: it had reached for the exact warm-beige/brass + Fraunces combo the skill names as the top-2 premium-consumer AI-tells. Admin + checkout are out of the skill's scope (docs 03/04 functional patterns). Token values land in `app/globals.css` during Phase 1, not here.

**Phase 0 — DONE / green.** Acceptance met: Next.js (TS) runs · doc-04 tokens in `app/globals.css` (no hardcoded hex in components) · empty routes for every 03b page (+ 404/error/loading) · skills in `.claude/skills/` · `.env.local` gitignored · **prod build passes locally**. Remaining (human): connect repo to Vercel for the blank deploy (needs your account link).

*(Add a row per significant prompt during the build. Mark BROKE/reverted explicitly.)*

---

## Resume notes (a conversational paragraph to future-you at each phase transition)

### Pre-build → Phase 0
The docs are written and aligned. Before you write code: **(1)** approve `docs/03b` (the page list/section order) — that gate locks the image slots; **(2)** confirm the founder-decision defaults adopted from the Brief (audience, voice, price bands, returns window, primary goal) — they're flagged in `docs/02` and `CLAUDE.md`; **(3)** produce real product photography (06b) — the product shot IS the trust asset, so these are real photos of the actual pieces, not AI. The single biggest must-hold: **GST is admin-editable data, snapshotted onto the invoice** — never hard-code 12% in logic; read it from `tax_settings`/the product row and write the computed split onto the order. The webhook (`app/api/webhooks/razorpay`) is the ONLY place an order becomes "paid," and it must be idempotent. Open `docs/05` (architecture) and `docs/06` (schema + tax model) first when you return.

### Phase 0 → Phase 1
The scaffold is green and committed (`main` @ `f852c4c`; `phase-0` branch marks it). The stack is **Next.js 16 (App Router, TS) + Tailwind v4**; tokens live in `app/globals.css` via Tailwind v4 `@theme` — use the token utilities (`bg-bg`, `text-ink`, `text-primary`, `border-border`, `font-heading`) and **never a raw hex** in a component. Every 03b route exists as a `Placeholder` stub (`components/Placeholder.tsx`) — Phase 1 replaces the home page with the real shape (hero → category grid → featured → heritage strip → trust strip → newsletter → footer). Fonts are deliberately system stacks for now; **Phase 1 wires the real heritage serif + body sans via `next/font` through the `frontend-design` skill** and verifies WCAG contrast on the silver/gold tokens. Two adapter stubs (`lib/payments/razorpay`, `lib/shipping/shiprocket`) and `lib/security.ts` mark the boundaries for Phase 4 — don't scatter provider calls outside them. **Open first when you return:** `docs/08-build-roadmap.md` (Phase 1 acceptance) + `docs/03b` (home section order) + `app/page.tsx`.

**Heads-up for Phase 1 (toolkit task):** Bugadi is the **verification build for the experimental `taste-skill`** (`.claude/skills/taste-skill-main`). Per the skills INDEX: build one key page (the home or PDP) with `frontend-design`, then the same page with `taste-skill`, compare the output (**lift**), and check the two don't misfire when both are loaded (**trigger**). The outcome (replace / keep-both / drop) feeds back to the toolkit. Note the taste-skill `SKILL.md` is ~87 KB (heavy context).

To start Phase 1 cleanly: `git checkout -b phase-1` off `main`, plan first (no code), build in small chunks, run the doc-10 QA gate, commit on the branch, merge when green.

### Phase 1 → Phase 2
Home is built and green on branch `phase-1` (merged to `main`). The storefront now lives under `app/(storefront)/` with `layout.tsx` providing `SiteHeader`/`SiteFooter`; **admin stays outside the group** so it never gets shop chrome. Design tokens are in `app/globals.css` (Tailwind v4 `@theme`) — near-black `--color-bg`, antique-silver `--color-primary`, one rose accent `--color-accent`; **use the token utilities, never raw hex**. Reusable pieces to build Phase 2 on: `components/ui/Button` (pill, silver primary), `components/ui/ImageSlot` (aspect-locked placeholder for real photos), `components/site/Reveal` (the only motion wrapper — entrance/scroll-reveal, reduced-motion safe), and `lib/catalog.ts` (placeholder category + featured data; replaced by Supabase in Phase 3). The `design-taste-frontend` skill governs storefront pages; admin/checkout do not. Phase 2 = the remaining storefront pages static (category, PDP with the Heritage Story block, cart, our-roots, shipping/returns/privacy/terms/contact) — they currently render the `Placeholder` stub. **Open first:** `docs/03b` (section orders) + `app/(storefront)/page.tsx` (home, as the pattern) + `docs/04`. Build the PDP carefully: the Heritage Story block is the killer feature.

**Verification-build note (taste-skill):** Phase 1 used `design-taste-frontend` only. The toolkit asks to also build one key page with `frontend-design` and compare (lift) and check both don't misfire when loaded together (trigger). Candidate page for the comparison: the PDP in Phase 2. Capture the outcome for the toolkit (`v4-backlog`).

### Phase 2 → Phase 3
All storefront pages are built and static, on branch `phase-2` (merged to `main`). The catalog renders from `lib/catalog.ts` (11 placeholder SKUs). What's NOT yet functional, by design: **the cart**. Add-to-bag shows an honest "opens next" note; the cart page is an empty state; the header cart badge is static. **Phase 3 = wire the client cart**: a cart store (Context or a small store like Zustand — ASK before adding a dep; Context needs none), Add-to-bag actually adds, the cart page lists line items + subtotal, the header badge reflects count, and Category to PDP to Cart works end to end. Keep it client-side only (no DB/payment yet — that's Phase 4). The checkout shell already lays out the address/State/summary structure to wire into. **Reuse:** `shop/AddToCart` (add the real handler there), `lib/catalog` (getProduct), `formatInr`. **Open first:** `docs/08` (Phase 3 acceptance) + `components/shop/AddToCart.tsx` + `app/(storefront)/cart/page.tsx`. Storefront stays on the taste-skill; admin/checkout-internals do not.

### Phase 3 → Phase 4 (the big one: security-first + commerce rail)
Client cart is done on `phase-3` (merged to `main`). Phase 4 is where it gets real, and it is an **authenticated + payments** build, so follow **`docs/app-03` security-first order**, not features-first: **auth -> RLS/access rules -> PROVE logged-out & cross-user denial -> THEN features**. This needs the founder's Step-5 accounts/keys in `.env.local` first (Supabase Mumbai, Razorpay TEST, Shiprocket, Resend) — the agent never creates accounts or holds keys. Build order: (1) Supabase client + schema from `docs/06` + RLS per `docs/app-02`, seed the 11 products; (2) admin auth + `/admin/*` route guard, then **prove denial** (the non-negotiable gate); (3) swap `lib/catalog` placeholder reads for Supabase reads; (4) checkout server action: capture address -> compute **place-of-supply GST** (CGST+SGST vs IGST from `tax_settings.registered_state` vs shipping state) -> create order -> **Razorpay test** hosted checkout -> **idempotent webhook** marks paid (the ONLY thing that does) -> write the **tax snapshot** to order + invoice; (5) Shiprocket order via the adapter; (6) Resend confirmation email; (7) admin product/order/tax-settings/returns screens; newsletter + return + contact forms persist with `lib/security` (honeypot + server validation + rate limit). **Must-holds:** rate/HSN admin-editable + snapshot-on-invoice, card data off-server, single-brand (no TCS), credit-note reverses GST. **Open first:** `docs/app-03`, `docs/06`, `docs/app-02`, the Billing & GST module, `lib/payments/razorpay` + `lib/shipping/shiprocket` (the adapter stubs to fill). Keep the cart's `{slug, qty}` shape; the order is built from it server-side at checkout.

*(Append a fresh resume note at every phase transition during the build.)*
