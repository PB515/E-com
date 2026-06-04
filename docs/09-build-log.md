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

*(Append a fresh resume note at every phase transition during the build.)*
