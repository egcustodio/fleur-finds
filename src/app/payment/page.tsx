"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";
import { ShoppingBag, Check } from "lucide-react";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMode, setPaymentMode] = useState<"manual" | "online">("online");
  const [paymentAmountType, setPaymentAmountType] = useState<"50%" | "full">("full");

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (error || !data) {
        router.push("/");
        return;
      }

      setOrder(data);
    } catch (error) {
      console.error("Error fetching order:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const handleManualPayment = () => {
    router.push(`/order-confirmation?order=${orderId}`);
  };

  const getPaymentAmount = () => {
    if (paymentAmountType === "50%") {
      return order.total * 0.5; // 50% down payment
    }
    return order.total; // Full payment
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-display font-light text-gray-800 mb-2">
            Order Created Successfully!
          </h1>
          <p className="text-gray-600">
            Order ID: <span className="font-mono font-semibold">{orderId?.substring(0, 8)}</span>
          </p>
        </div>

        {/* Payment Mode Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Choose Payment Option
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setPaymentMode("online")}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                paymentMode === "online"
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200 hover:border-primary-300"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMode === "online" ? "border-primary-600" : "border-gray-300"
                }`}>
                  {paymentMode === "online" && (
                    <div className="w-3 h-3 bg-primary-600 rounded-full" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Pay Online Now</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Pay securely with Credit Card, GCash, PayMaya, or GrabPay
                  </p>
                  <p className="text-xs text-green-600 mt-2">
                    ✓ Instant confirmation • ✓ Secure payment
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setPaymentMode("manual")}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                paymentMode === "manual"
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200 hover:border-primary-300"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMode === "manual" ? "border-primary-600" : "border-gray-300"
                }`}>
                  {paymentMode === "manual" && (
                    <div className="w-3 h-3 bg-primary-600 rounded-full" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Coordinate Payment</p>
                  <p className="text-sm text-gray-600 mt-1">
                    We'll contact you to arrange payment (Bank transfer only - No COD)
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    ✓ Flexible payment options
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Payment Amount Selection - Only show for online payments */}
          {paymentMode === "online" && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">
                Select Payment Amount
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentAmountType("50%")}
                  className={`p-3 border-2 rounded-lg text-left transition-all ${
                    paymentAmountType === "50%"
                      ? "border-primary-600 bg-white"
                      : "border-gray-300 hover:border-primary-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">50% Down Payment</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Pay ₱{(order.total * 0.5).toFixed(2)} now
                      </p>
                      <p className="text-xs text-orange-600 mt-1">
                        Balance: ₱{(order.total * 0.5).toFixed(2)} - Pay later
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentAmountType === "50%" ? "border-primary-600" : "border-gray-300"
                    }`}>
                      {paymentAmountType === "50%" && (
                        <div className="w-3 h-3 bg-primary-600 rounded-full" />
                      )}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentAmountType("full")}
                  className={`p-3 border-2 rounded-lg text-left transition-all ${
                    paymentAmountType === "full"
                      ? "border-primary-600 bg-white"
                      : "border-gray-300 hover:border-primary-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">Full Payment</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Pay ₱{order.total.toFixed(2)} now
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        ✓ Complete payment • No balance
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentAmountType === "full" ? "border-primary-600" : "border-gray-300"
                    }`}>
                      {paymentAmountType === "full" && (
                        <div className="w-3 h-3 bg-primary-600 rounded-full" />
                      )}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Online Payment Section */}
          {paymentMode === "online" && (
            <div className="border-t border-gray-200 pt-6">
              <PaymentMethodSelector
                orderId={orderId!}
                amount={getPaymentAmount()}
                customerName={order.customer_name}
                customerEmail={order.customer_email}
                paymentAmountType={paymentAmountType}
              />
            </div>
          )}

          {/* Manual Payment Section */}
          {paymentMode === "manual" && (
            <div className="border-t border-gray-200 pt-6">
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Next Steps:</strong>
                </p>
                <ul className="text-sm text-blue-700 space-y-1 ml-4 list-disc">
                  <li>We'll contact you via phone or email within 24 hours</li>
                  <li>Confirm your order details and delivery address</li>
                  <li>Arrange payment via bank transfer (Minimum 50% down payment required)</li>
                  <li>Schedule delivery or pickup</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg mb-4 border border-yellow-200">
                <p className="text-sm text-yellow-800 font-semibold mb-1">
                  ⚠️ Important Payment Policy
                </p>
                <ul className="text-sm text-yellow-700 space-y-1 ml-4 list-disc">
                  <li>Cash on Delivery (COD) is NOT available</li>
                  <li>Minimum 50% down payment required before processing</li>
                  <li>Balance can be paid upon delivery or pickup</li>
                </ul>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Contact Phone:</span>
                  <span className="font-medium">{order.customer_phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contact Email:</span>
                  <span className="font-medium">{order.customer_email}</span>
                </div>
              </div>

              <button
                onClick={handleManualPayment}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Continue
              </button>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">₱{order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount {order.promo_code && `(${order.promo_code})`}:</span>
                <span className="font-medium">-₱{order.discount.toFixed(2)}</span>
              </div>
            )}
            {order.shipping_fee > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping Fee:</span>
                <span className="font-medium">₱{order.shipping_fee.toFixed(2)}</span>
              </div>
            )}
            {order.shipping_fee === 0 && (
              <div className="flex justify-between text-green-600">
                <span>Shipping Fee:</span>
                <span className="font-medium">FREE 🎉</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
              <span>Total:</span>
              <span className="text-primary-600">₱{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
