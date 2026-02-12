import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const WEBHOOK_SECRET = process.env.PAYMONGO_WEBHOOK_SECRET;
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("paymongo-signature");

    // In production, verify webhook signature for security
    // For now, we'll process the webhook directly

    const event = JSON.parse(payload);
    const eventType = event.data.attributes.type;

    console.log("PayMongo webhook event:", eventType);

    // Handle payment.paid event
    if (eventType === "payment.paid") {
      const paymentData = event.data.attributes.data;
      const orderId = paymentData.attributes.metadata?.order_id;
      const paymentId = paymentData.id;
      const paymentMethod = paymentData.attributes.source?.type || "card";

      if (orderId) {
        // Update order status in database
        const { error } = await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            status: "confirmed",
            payment_method: paymentMethod,
            paymongo_payment_id: paymentId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId);

        if (error) {
          console.error("Failed to update order:", error);
          return NextResponse.json({ error: "Database update failed" }, { status: 500 });
        }

        console.log(`✅ Order ${orderId.substring(0, 8)} marked as paid`);
      }
    }

    // Handle payment.failed event
    if (eventType === "payment.failed") {
      const paymentData = event.data.attributes.data;
      const orderId = paymentData.attributes.metadata?.order_id;

      if (orderId) {
        const { error } = await supabase
          .from("orders")
          .update({
            payment_status: "failed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId);

        if (error) {
          console.error("Failed to update order:", error);
        }

        console.log(`❌ Order ${orderId.substring(0, 8)} payment failed`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
  }
}
