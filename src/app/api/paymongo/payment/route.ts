import { NextRequest, NextResponse } from "next/server";

const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { amount, orderId, description, email, name } = await request.json();

    if (!PAYMONGO_SECRET_KEY || PAYMONGO_SECRET_KEY === 'sk_test_your_secret_key_here') {
      return NextResponse.json(
        { 
          success: false, 
          error: "PayMongo is not configured. Please add your API keys to .env.local" 
        },
        { status: 500 }
      );
    }

    // Convert amount to centavos (PayMongo uses smallest currency unit)
    const amountInCentavos = Math.round(amount * 100);

    // Create PayMongo Payment Intent
    const response = await fetch("https://api.paymongo.com/v1/payment_intents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET_KEY).toString("base64")}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            amount: amountInCentavos,
            currency: "PHP",
            payment_method_allowed: ["card", "gcash", "paymaya", "grab_pay"],
            description: description || `Fleur Finds Order #${orderId?.substring(0, 8)}`,
            statement_descriptor: "Fleur Finds",
            metadata: {
              order_id: orderId,
              customer_email: email,
              customer_name: name,
            },
          },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("PayMongo error:", data);
      return NextResponse.json(
        { 
          success: false, 
          error: data.errors?.[0]?.detail || "Payment creation failed" 
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      clientKey: data.data.attributes.client_key,
      paymentIntentId: data.data.id,
    });
  } catch (error) {
    console.error("PayMongo payment error:", error);
    return NextResponse.json(
      { success: false, error: "Payment creation failed" },
      { status: 500 }
    );
  }
}
