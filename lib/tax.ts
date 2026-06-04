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
