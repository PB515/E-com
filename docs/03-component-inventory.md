# 03 — Component Inventory

*Bugadi. Frozen planning doc. Every building block + its states, so the agent never invents three inconsistent "cards." The **states column is where consistency lives.***

> Status: **FROZEN** after sign-off.

---

## Primitives

| Component | States needed |
|---|---|
| Button (primary/secondary/ghost) | default / hover / focus / disabled / **loading** |
| Icon button (qty +/–, close) | default / hover / focus / disabled |
| Input / textarea | empty / focused / filled / **error** + helper text |
| Select (category, qty, state dropdown) | closed / open / selected / disabled / error |
| Checkbox (consent, COD) | unchecked / checked / focus / error |
| Badge / tag (category, "out of stock", "COD") | default |
| Price | regular · with strike (if compare-at) · "GST incl." note |
| Toast / alert | success / warning / error |
| Modal / drawer (cart, mobile nav) | open / closed |
| Skeleton / spinner | for any live fetch (with timeout — see doc 10) |

## Commerce components

| Component | States needed |
|---|---|
| Product card | default / hover / **out-of-stock** / loading (skeleton) |
| Product gallery | single image / multi-image swipeable / zoom / no-image fallback |
| **Add-to-Cart bar** (sticky on mobile) | enabled / disabled (out of stock) / **loading** / added-confirm |
| Quantity stepper | min(1) / value / max(stock) / disabled |
| Cart line item | default / qty-updating / removing / removed |
| Cart summary | empty / items + subtotal / loading |
| **Heritage Story block** (killer feature) | present (motif/region/occasion) / minimal (if story TBD) |
| Checkout form | idle / validating / **submitting** / success / error |
| Address fields incl. **State select** | (drives place-of-supply) empty/filled/error |
| Tax summary line | computing / CGST+SGST (intra) / IGST (inter) / COD note |
| Payment area | Razorpay loading / redirected / success / failed / COD-selected |
| Order confirmation | success (order id + summary) / pending (webhook not yet) |

## Page-level & global

| Component | States needed |
|---|---|
| Page-level | **loading / empty / error / 404** |
| Nav | desktop / mobile (hamburger) / scrolled / cart-count badge |
| Footer | with newsletter capture + policy links |
| Category listing | items / **empty** ("no pieces yet") / loading / error |
| Newsletter form | idle / submitting / success / error (+ honeypot, hidden) |
| Returns form | idle / submitting / success / error (+ honeypot) |

## Admin components (authenticated — see app docs)

| Component | States needed |
|---|---|
| Login form | idle / submitting / error (wrong creds) |
| Auth guard / route gate | authorized / **denied → redirect** (deny-by-default) |
| Product editor (incl. HSN + GST rate fields) | new / editing / saving / saved / error |
| Order table | list / empty / loading / error · row: paid/COD/fulfilled |
| Tax settings form (GSTIN, state, default rate) | loaded / saving / saved / error |
| Invoice view | generated (from snapshot) / not-yet |
| Return review | pending / approved (→ credit note) / rejected |

---

## FORM SECURITY (component requirement — non-negotiable)

Every form that captures data (newsletter, returns, checkout, admin) **must** specify:
- **Honeypot** hidden field → if filled, silently reject.
- **Server-side validation** of every field (never trust the client).
- **Rate limiting** per IP/session.

Rate-limit + validation logic lives in a single server module (e.g. `lib/security.ts`) — referenced, not re-implemented per form. *(Resume-note this location for future-you.)*

---

## Motion (see doc 04 for the named pieces)

Components use only the named motion pieces (pop-in / reveal / bounce) — **no ad-hoc inline animation**. Animate transform/opacity only; entrances fire once; honor `prefers-reduced-motion`.

**Done when:** every screen in the Flow Map (01) can be assembled from this list with no surprises, and every form lists honeypot + validation + rate-limit. ✔
