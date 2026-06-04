import "server-only";
import { Resend } from "resend";
import { formatInr } from "@/lib/catalog";

// Order-confirmation email (Resend). BEST-EFFORT: wrapped by callers in
// try/catch so a mail failure never blocks an order. Until a sending domain is
// verified, Resend only delivers to the account owner's address — fine for
// test mode. From uses Resend's shared onboarding sender.
interface OrderEmail {
  to: string;
  orderNumber: string;
  grandTotalInr: number;
  paymentMethod: "razorpay" | "cod";
}

export async function sendOrderConfirmation(o: OrderEmail): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  const resend = new Resend(apiKey);
  const pay = o.paymentMethod === "cod" ? "Cash on delivery" : "Paid (test mode)";
  const { error } = await resend.emails.send({
    from: "Bugadi <onboarding@resend.dev>",
    to: o.to,
    subject: `Your Bugadi order ${o.orderNumber}`,
    html: `
      <div style="font-family:system-ui,sans-serif;color:#1a1a1a">
        <h2 style="font-family:Georgia,serif">Thank you for your order</h2>
        <p>Order <strong>${o.orderNumber}</strong> is confirmed.</p>
        <p>Total: <strong>${formatInr(o.grandTotalInr)}</strong> (incl. GST)<br/>
        Payment: ${pay}</p>
        <p>We will email you tracking once it ships. This store is in test mode.</p>
        <p style="color:#777">Bugadi — traditional ornament, styled to wear today.</p>
      </div>`,
  });
  return !error;
}
