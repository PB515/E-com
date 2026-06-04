/**
 * Form security — the single home for honeypot + server-side validation +
 * rate limiting (doc 02 / doc 03). Referenced by every public form, never
 * re-implemented per form. Real implementation lands in Phase 4.
 *
 * Resume note for future-you: rate-limit + validation logic lives HERE, not in
 * the form components.
 */

// Hidden field humans never fill; bots do → reject silently.
export const HONEYPOT_FIELD = "company_website";

/** True if the honeypot was filled (a bot). */
export function isHoneypotTripped(form: FormData | Record<string, unknown>): boolean {
  const value =
    form instanceof FormData ? form.get(HONEYPOT_FIELD) : form[HONEYPOT_FIELD];
  return typeof value === "string" && value.trim().length > 0;
}

// TODO (Phase 4): server-side field validation (zod) + rate limiting (per IP/session).
