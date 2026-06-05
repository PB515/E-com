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

```
2026-06-04 | 4     | Keys verified; found+fixed swapped      | RLS verified (anon blocked   | (phase-4)
                     Supabase keys; built admin auth + guard | from tax/orders); logged-out
                                                              | denial PROVEN live
```

**Phase 4 — auth + denial gate (4a-4c done).** Verified the founder's Supabase keys connect + migration seeded (11 products, tax_settings). **Caught a swapped-keys bug:** service-role secret was in `NEXT_PUBLIC_SUPABASE_ANON_KEY` (would expose it to the client) — swapped back mechanically (no values printed), re-verified RLS. Built: `middleware.ts` + `lib/supabase/middleware.ts` (session refresh + logged-out gate on `/admin/*`), restructured admin into `app/admin/(dash)/` (guarded) vs `app/admin/login` (public), `(dash)/layout.tsx` admin-role gate via `is_admin()` rpc, `LoginForm`/`LogoutButton`/`AdminNav`. **Denial PROVEN live:** logged-out `/admin` + `/admin/orders` → redirect to login; anon can't read tax_settings/orders (RLS). Storefront unaffected. **Next (4c cont. + 4d):** founder creates an admin user → promote to `admin_users` → test signed-in admin + cross-user order denial → then catalog-from-DB + checkout (GST + mock pay + idempotent confirm + invoice) + Shiprocket + Resend + admin screens.

```
2026-06-04 | 4     | Promote admin; catalog reads from DB;   | Build PASSES; storefront     | (phase-4)
                     cart stores price/name snapshot         | reads 11 products from
                                                              | Supabase; cart verified live
```

**Phase 4 — catalog from DB + admin promoted.** Promoted `bhavsarpurven515@gmail.com` to `admin_users` (service role; can now log in). Built `lib/supabase/public.ts` (cookie-less anon read client) + `lib/products.ts` (server data layer mapping DB rows → Product). Pointed home featured rail, category, PDP, and shop at Supabase (`force-dynamic`; admin edits reflect next request). Trimmed `lib/catalog.ts` to categories + type + helpers (static product array removed). **Refactored the cart to store a snapshot** (slug/name/price/maxStock) so the client no longer needs a static product list; the server will re-read price/stock at checkout (never trust client prices). Verified live: /shop shows 11 DB products; PDP (Oxidised Kada) loads from DB with the Story block; add-to-bag stores the snapshot; cart renders ₹899; no console errors. Logged-out denial still holds.

```
2026-06-04 | 4     | Checkout -> order -> mock pay ->        | FULL mock order verified     | (phase-4)
                     idempotent confirm -> invoice +          | live + in DB: BUG-10001 paid,
                     confirmation page; razorpay webhook route| CGST+SGST snapshot, 1 invoice
```

```
2026-06-04 | 4     | Admin screens + form persistence        | Build PASSES; newsletter     | (phase-4)
                     (dashboard/products/orders/tax/invoices/| persists to DB verified;
                     returns); newsletter+returns -> DB      | admin data present
```

**Phase 4 — COMPLETE (code; verified locally).** Admin under `app/admin/(dash)/` (RLS-enforced via server client): dashboard (counts + recent orders), products (list + full editor: price/stock/HSN/GST-rate/active/story), orders (list + detail w/ GST breakdown + mark-fulfilled), tax-settings (GSTIN/state/rate/HSN editor), invoices (list), returns (approve → credit note that reverses GST). Public forms persist via server actions (`app/(storefront)/actions.ts`, service-role + honeypot + validation): newsletter → subscribers (verified live), returns → return_requests. Best-effort Resend email + Shiprocket. **NOT merged to main** — production deploy needs the env vars in **Vercel → Settings → Environment Variables** first (same keys as `.env.local`, corrected anon/service-role + PAYMENT_PROVIDER=mock + MOCK_PAYMENT_SECRET), else the DB-backed storefront breaks in prod. main stays on Phase 3 until then. **Hardening left:** form rate-limiting; Resend domain; Shiprocket pickup config; contact still UI-only; real Razorpay deferred.

```
2026-06-05 | post  | Admin product mgmt: create/delete/      | Build PASSES; stock          | (main)
                     image upload + auto sold-out ticker     | decrement 18->16 verified;
                                                              | storage public img 200
```

**Post-launch — top-5 admin improvements.** (1) **Order fulfillment workflow** — paid→packed→shipped→delivered pipeline (`OrderFulfillment`), tracking/AWB + courier capture, **Push-to-Shiprocket** button. **Needs migration `supabase/migrations/0002_order_fulfillment.sql`** (new statuses + tracking columns) — run in Supabase SQL editor. (2) **Invoice + packing slip** — print-friendly GST invoice at `/admin/orders/[id]/invoice` (`window.print()` → Save as PDF; print CSS hides chrome). (3) **Search/filter/sort + pagination** on Products (name/category/status) and Orders (status/number, 20/page). (4) **Low-stock** — dashboard alert + "Low stock" stat/filter (active, stock 1-5); query flags Beaded Hasli Set (4). (5) **Multiple images per product** — `ProductGallery` (upload many, set-primary, delete); `lib/products` returns the full `gallery`; PDP renders main + thumbnails (verified 2 imgs live). Build passes; no console errors. To main (deploys to prod).

**Post-launch feature — product management + stock ticker.** Admin can now **create** products (`/admin/products/new`), **delete** (FK-guarded → suggests deactivate if in an order), **mark sold out** (stock→0) / set stock, and **upload a product image** (Supabase Storage `product-images` public bucket → `product_images` row → shown via `next/image`; upload via service-role after admin check, so no storage policies needed). Storefront `ImageSlot` now renders the real image when present (cards + PDP), placeholder otherwise; `lib/products` embeds the primary image; `next.config` allows the Supabase host. **Auto sold-out ticker:** `finalizeOrder` decrements each product's stock once per confirmed order; at 0 the piece shows sold-out on its own (storefront derives it). Verified live: order of 2 → stock 18→16; storage upload + public URL 200; GST CGST/SGST split now visible on checkout. Committed to `main` (deploys to prod).

**Phase 4 — commerce flow COMPLETE (verified).** Built `lib/orders.ts` (server: `createOrder` re-reads authoritative price/stock, computes place-of-supply GST via `lib/tax`, writes customer/address/order/order_items with the **tax snapshot**; `markOrderPaid` **idempotent** via conditional status update + creates the invoice once; `finalizeOrder` best-effort email + Shiprocket; `getOrderForConfirmation`), `lib/email.ts` (Resend, best-effort), Shiprocket adapter (auth + create-order, best-effort). Checkout is now a real flow: `CheckoutClient` (address + State + payment method, re-validated server-side in `actions.ts`) -> COD finalizes immediately / online -> `PayMock` (simulate success/fail) -> idempotent confirm -> `/order/[id]` confirmation with the CGST/SGST-or-IGST breakdown. Added `/api/webhooks/razorpay` (signature-verified, idempotent) for the later real-Razorpay swap. **Verified end to end:** placed a Maharashtra (intra-state) order -> Paid -> CGST ₹80.25 + SGST ₹80.25 on ₹1,498 -> 1 invoice (INV-BUG-10001), HSN 7117 / rate 12 snapshot on the line. Mock payment, card data off-server, snapshot-on-invoice, idempotency all proven.

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
