# 10 — QA Checkpoint Protocol (the gate between phases) + Stuck-State rule

*Bugadi. Control doc (living). Run the same checklist at every phase gate. Never pass on "looks about right." Phases compound — a broken foundation rots everything above it.*

---

## The per-phase gate

```
[ ] Renders on real mobile width (360px), not just narrow desktop
[ ] All links/buttons in this phase actually work
[ ] Matches Design System (colours are TOKENS, spacing on scale, no hardcoded hex)
[ ] Matches the PRD scope for this phase — nothing extra crept in (No-List honored)
[ ] Empty / loading / error states exist where relevant
[ ] RUNTIME FALLBACK: any feature that fetches live (Supabase / Razorpay / Shiprocket / webhook
    / auth) has a planned fallback — loading-WITH-TIMEOUT, empty, and failed (cached or a calm
    message), NEVER an endless spinner; content stays visible if JS is slow or blocked
[ ] MOTION: only the named pieces (pop-in/reveal/bounce) — no ad-hoc inline animation —
    and honors prefers-reduced-motion (reduced on → fully static + readable)
[ ] No console errors
[ ] Committed to git on the phase branch
[ ] Context Anchor (CLAUDE.md) + Build Log updated (+ resume note at phase transitions)
```

## Commerce-specific checks (Phase 3+)

```
[ ] Prices display GST-INCLUSIVE; checkout shows the tax line (CGST+SGST intra / IGST inter)
[ ] Place-of-supply computed from the shipping STATE, server-side
[ ] Tax rate read from data (tax_settings/product), NOT hard-coded; snapshot written to order+invoice
[ ] Order marked paid ONLY by the idempotent webhook — never from the client
[ ] COD path works and is labelled
[ ] Adapter boundary intact — no Razorpay/Shiprocket calls outside lib/payments|shipping/*
[ ] Out-of-stock, cart-empty, payment-failed, webhook-pending states all exist
```

## App / security checks (Phase 4 — gate before any feature that shows user/admin data)

```
[ ] Logged-OUT visitor cannot reach any /admin route or admin data (redirected/denied)
[ ] A customer/non-admin cannot reach admin data (deny-by-default RLS proven)
[ ] Tried by URL, by API call, by guessing an id → all FAIL
[ ] Secrets only in .env.local; none in client bundle; card data never hits our server
```
> **This cross-user / logged-out denial test is non-negotiable and runs before admin features ship.**

---

## Stuck-State Protocol — three strikes, then revert

> **If a bug isn't fixed in ~3 tries, STOP.** `git checkout` to the last good commit and re-approach with a **fresh session** and a re-thought prompt.

Each failed fix pollutes the context with wrong assumptions; a fresh session often one-shots what a poisoned one couldn't in five. Per-phase commits make this safe. **Log the spiral** in the Build Log so the triggering prompt isn't repeated.

## Pre-push gate (every push)

```
[ ] npm run build (PRODUCTION build) passes LOCALLY — the dev build hides type errors that fail in prod
```
