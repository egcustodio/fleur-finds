"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Smartphone, Wallet } from "lucide-react";
import { toast } from "sonner";

interface PaymentMethodSelectorProps {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  paymentAmountType: "50%" | "full";
}

export default function PaymentMethodSelector({
  orderId,
  amount,
  customerName,
  customerEmail,
  paymentAmountType,
}: PaymentMethodSelectorProps) {
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const router = useRouter();

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Visa, Mastercard",
    },
    {
      id: "gcash",
      name: "GCash",
      icon: Smartphone,
      description: "Pay with GCash app",
    },
    {
      id: "paymaya",
      name: "PayMaya",
      icon: Wallet,
      description: "Pay with PayMaya",
    },
    {
      id: "grab_pay",
      name: "GrabPay",
      icon: Wallet,
      description: "Pay with GrabPay",
    },
  ];

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setProcessing(true);

    try {
      // Create PayMongo payment intent
      const response = await fetch("/api/paymongo/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          orderId,
          description: `Fleur Finds Order - ${orderId.substring(0, 8)}`,
          email: customerEmail,
          name: customerName,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Payment creation failed");
      }

      // Update order with payment intent ID and payment amount type
      const { createBrowserClient } = await import("@/lib/supabase");
      const supabase = createBrowserClient();
      
      await supabase
        .from("orders")
        .update({ 
          payment_intent_id: data.paymentIntentId,
          payment_method: selectedMethod,
          payment_amount_type: paymentAmountType,
        })
        .eq("id", orderId);

      // Redirect to PayMongo checkout page
      const checkoutUrl = `https://checkout.paymongo.com/${data.clientKey}`;
      
      toast.success("Redirecting to payment...");
      
      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = checkoutUrl;
      }, 1000);
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Failed to process payment. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Select Payment Method
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                selectedMethod === method.id
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200 hover:border-primary-300"
              }`}
            >
              <div className="flex items-center space-x-3">
                <method.icon
                  className={`w-6 h-6 ${
                    selectedMethod === method.id
                      ? "text-primary-600"
                      : "text-gray-400"
                  }`}
                />
                <div>
                  <p className="font-medium text-gray-800">{method.name}</p>
                  <p className="text-sm text-gray-500">{method.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">
            {paymentAmountType === "50%" ? "Down Payment (50%):" : "Full Payment:"}
          </span>
          <span className="text-2xl font-bold text-primary-600">
            ₱{amount.toFixed(2)}
          </span>
        </div>
        {paymentAmountType === "50%" && (
          <p className="text-xs text-orange-600 mb-2">
            Remaining balance: ₱{amount.toFixed(2)} - to be paid later
          </p>
        )}
        <p className="text-xs text-gray-500">
          You will be redirected to a secure payment page
        </p>
      </div>

      <button
        onClick={handlePayment}
        disabled={!selectedMethod || processing}
        className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {processing ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </span>
        ) : (
          `Pay ₱${amount.toFixed(2)}`
        )}
      </button>

      <p className="text-center text-xs text-gray-500">
        🔒 Secured by PayMongo • Your payment information is encrypted
      </p>
    </div>
  );
}
