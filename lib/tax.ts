/**
 * GST place-of-supply logic (Billing & GST module / doc 06).
 *
 * Rules baked in:
 *  - HSN 7117, default rate 12% (CA-confirmed). These live as admin-editable
 *    DATA in tax_settings / per product; this file never hard-codes them into
 *    the charge except as fallbacks.
 *  - Prices are GST-INCLUSIVE on display. The tax is the portion already inside
 *    the price: taxable base = inclusive / (1 + rate/100); tax = inclusive - base.
 *  - Place of supply decides the split: buyer state == seller state -> CGST+SGST,
 *    else IGST.
 *  - The computed breakdown is SNAPSHOTTED onto the order/invoice at sale. A
 *    later rate edit affects future invoices only, never a past one.
 */

export const DEFAULT_GST_RATE = 12; // percent, CA-confirmed
export const DEFAULT_HSN = "7117";

/**
 * Business tax registration status. NOT a casual on/off:
 *  - "gst": Bugadi has a GSTIN. GST is computed, split, and shown; documents are
 *    GST tax invoices.
 *  - "unregistered": Bugadi is below/outside GST registration. NO GST is charged
 *    or shown; documents are plain retail receipts with a "not a tax invoice"
 *    note. The mode is SNAPSHOTTED onto each order so past documents never change
 *    when the business later registers.
 */
export type TaxMode = "gst" | "unregistered";
export const DEFAULT_TAX_MODE: TaxMode = "gst";

export interface TaxBreakdown {
  ratePct: number;
  isIntraState: boolean;
  taxableValue: number; // base, ex-GST
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  grandTotal: number; // == inclusiveTotal (prices are GST-inclusive)
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function normState(s: string): string {
  return s.trim().toLowerCase();
}

/**
 * The GST amount ALREADY INCLUDED in a GST-inclusive total (state-independent).
 * Used for cart display before a shipping state is known.
 */
export function gstIncludedInTotal(
  inclusiveTotal: number,
  ratePct: number,
): number {
  return round2(inclusiveTotal - inclusiveTotal / (1 + ratePct / 100));
}

/**
 * Compute the GST breakdown from a GST-INCLUSIVE total.
 * @param inclusiveTotal sum of GST-inclusive line prices (INR)
 * @param ratePct GST rate, e.g. 12
 * @param buyerState shipping state (place of supply)
 * @param sellerState registered state (from tax_settings)
 */
export function computeGstFromInclusive(
  inclusiveTotal: number,
  ratePct: number,
  buyerState: string,
  sellerState: string,
): TaxBreakdown {
  const isIntraState = normState(buyerState) === normState(sellerState);
  const taxableValue = round2(inclusiveTotal / (1 + ratePct / 100));
  const totalTax = round2(inclusiveTotal - taxableValue);

  if (isIntraState) {
    const cgst = round2(totalTax / 2);
    const sgst = round2(totalTax - cgst); // keep the sum exact
    return {
      ratePct,
      isIntraState: true,
      taxableValue,
      cgst,
      sgst,
      igst: 0,
      totalTax,
      grandTotal: round2(inclusiveTotal),
    };
  }

  return {
    ratePct,
    isIntraState: false,
    taxableValue,
    cgst: 0,
    sgst: 0,
    igst: totalTax,
    totalTax,
    grandTotal: round2(inclusiveTotal),
  };
}

/**
 * No-GST breakdown for the UNREGISTERED mode: the price stands alone, nothing is
 * treated as tax. taxableValue == grandTotal == the price; all GST parts are 0.
 */
export function noTaxBreakdown(total: number): TaxBreakdown {
  const t = round2(total);
  return {
    ratePct: 0,
    isIntraState: false,
    taxableValue: t,
    cgst: 0,
    sgst: 0,
    igst: 0,
    totalTax: 0,
    grandTotal: t,
  };
}

/**
 * Single entry point used by checkout + manual orders. Picks GST or no-GST by
 * the business tax mode, so callers never branch on it themselves.
 */
export function computeOrderTax(opts: {
  mode: TaxMode;
  inclusiveTotal: number;
  ratePct: number;
  buyerState: string;
  sellerState: string;
}): TaxBreakdown {
  if (opts.mode === "unregistered") return noTaxBreakdown(opts.inclusiveTotal);
  return computeGstFromInclusive(opts.inclusiveTotal, opts.ratePct, opts.buyerState, opts.sellerState);
}

/** Normalise a raw tax_settings.tax_mode value to a known TaxMode. */
export function asTaxMode(v: unknown): TaxMode {
  return v === "unregistered" ? "unregistered" : "gst";
}
