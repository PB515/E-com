/**
 * Shiprocket ADAPTER BOUNDARY (doc 05 / billing-gst module).
 * ALL Shiprocket calls live behind this module. Switching courier later =
 * rewrite only this adapter; our DB stays the source of truth.
 *
 * Flow (Phase 4): auth → create order → request AWB → fetch tracking.
 * Keys/credentials from env, SERVER-SIDE only.
 */

export interface ShippingAdapter {
  createOrder(args: { orderNumber: string }): Promise<{ shipmentId: string }>;
  getTracking(shipmentId: string): Promise<{ status: string; awb?: string }>;
}

// TODO (Phase 4): implement against the Shiprocket REST API using env creds by name only.
export const shiprocket = {} as Partial<ShippingAdapter>;
