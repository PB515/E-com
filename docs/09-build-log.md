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
```

*(Add a row per significant prompt during the build. Mark BROKE/reverted explicitly.)*

---

## Resume notes (a conversational paragraph to future-you at each phase transition)

### Pre-build → Phase 0
The docs are written and aligned. Before you write code: **(1)** approve `docs/03b` (the page list/section order) — that gate locks the image slots; **(2)** confirm the founder-decision defaults adopted from the Brief (audience, voice, price bands, returns window, primary goal) — they're flagged in `docs/02` and `CLAUDE.md`; **(3)** produce real product photography (06b) — the product shot IS the trust asset, so these are real photos of the actual pieces, not AI. The single biggest must-hold: **GST is admin-editable data, snapshotted onto the invoice** — never hard-code 12% in logic; read it from `tax_settings`/the product row and write the computed split onto the order. The webhook (`app/api/webhooks/razorpay`) is the ONLY place an order becomes "paid," and it must be idempotent. Open `docs/05` (architecture) and `docs/06` (schema + tax model) first when you return.

*(Append a fresh resume note at every phase transition during the build.)*
