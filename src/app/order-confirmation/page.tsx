"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase";
import { CheckCircle, Package, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-light text-gray-800 mb-2">
            {order.payment_status === "paid" ? "Payment Successful!" : "Order Confirmed!"}
          </h1>
          <p className="text-gray-600">
            Thank you for your order, {order.customer_name}!
          </p>
        </div>

        {/* Order Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="font-mono font-semibold text-lg">{orderId?.substring(0, 8)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-semibold">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Payment Status */}
          {order.payment_status === "paid" ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800">Payment Confirmed</p>
                  <p className="text-sm text-green-700">
                    Paid via {order.payment_method || "Online Payment"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-800">Order Received</p>
                  <p className="text-sm text-blue-700">
                    We'll contact you within 24 hours to arrange payment and delivery
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{order.customer_email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium">{order.customer_phone}</span>
            </div>
            {order.delivery_address && (
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <span className="text-gray-600">Address:</span>
                <span className="font-medium">{order.delivery_address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
            {order.payment_amount_type === "50%" && (
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm font-semibold text-orange-800 mb-1">
                  💰 Payment Status: 50% Down Payment
                </p>
                <p className="text-sm text-orange-700">
                  Paid: ₱{(order.total * 0.5).toFixed(2)} | Remaining Balance: ₱{(order.total * 0.5).toFixed(2)}
                </p>
                <p className="text-xs text-orange-600 mt-2">
                  Please pay the remaining balance before or upon delivery.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">What's Next?</h3>
          <ul className="space-y-3 text-sm text-gray-700">
            {order.payment_status === "paid" ? (
              <>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">1.</span>
                  <span>We'll prepare your order and contact you for delivery arrangements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">2.</span>
                  <span>You'll receive updates via email and SMS</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">3.</span>
                  <span>Track your order status anytime</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">1.</span>
                  <span>We'll contact you via phone or email within 24 hours</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">2.</span>
                  <span>Confirm your order details and delivery address</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">3.</span>
                  <span>Arrange payment (Bank transfer or Cash on delivery)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">4.</span>
                  <span>Schedule delivery or pickup</span>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={`/track-order?email=${order.customer_email}&order=${orderId?.substring(0, 8)}`}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold text-center transition-colors"
          >
            Track Your Order
          </Link>
          <Link
            href="/"
            className="flex-1 bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-300 py-3 rounded-lg font-semibold text-center transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Contact Support */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-2">Questions about your order?</p>
          <div className="flex justify-center space-x-4 text-sm">
            <a
              href="tel:09171271659"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Call: 09171271659
            </a>
            <span className="text-gray-400">|</span>
            <a
              href="mailto:flowertown1496@gmail.com"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 pb-12 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}
