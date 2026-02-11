"use client";

import { useState } from "react";
import { createBrowserClient } from "@/lib/supabase";
import { toast } from "sonner";
import { Package, Search, Mail, Phone, MapPin, Calendar, Tag } from "lucide-react";
import Image from "next/image";

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  notes: string;
  subtotal: number;
  discount: number;
  total: number;
  promo_code: string | null;
  status: string;
  rental_start_date: string | null;
  rental_end_date: string | null;
  created_at: string;
}

interface OrderItem {
  id: string;
  product_title: string;
  product_price: number;
  quantity: number;
  subtotal: number;
}

export default function TrackOrder() {
  const [email, setEmail] = useState("");
  const [orderIdInput, setOrderIdInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    setNotFound(false);
    setOrder(null);
    setOrderItems([]);

    try {
      const supabase = createBrowserClient();
      
      // Search by email and order ID (first 8 characters)
      const { data: orders, error } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_email", email.toLowerCase().trim())
        .like("id", `${orderIdInput.trim()}%`)
        .single();

      if (error || !orders) {
        setNotFound(true);
        toast.error("Order not found. Please check your email and order ID.");
        return;
      }

      setOrder(orders);

      // Fetch order items
      const { data: items } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orders.id);

      setOrderItems(items || []);
      toast.success("Order found!");
    } catch (error) {
      console.error("Error searching for order:", error);
      toast.error("Failed to search for order");
    } finally {
      setSearching(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "processing":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "pending":
        return "We've received your order and will contact you soon to confirm.";
      case "confirmed":
        return "Your order has been confirmed! We're preparing it for you.";
      case "processing":
        return "Your order is being processed and will be ready soon.";
      case "completed":
        return "Your order has been completed. Thank you for your purchase!";
      case "cancelled":
        return "This order has been cancelled.";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-display font-light text-gray-800 mb-4">
            Track Your Order
          </h1>
          <p className="text-gray-600">
            Enter your email and order ID to check your order status
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order ID
              </label>
              <input
                type="text"
                required
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="Enter first 8 characters (e.g., a1b2c3d4)"
              />
              <p className="text-xs text-gray-500 mt-1">
                You received this in your order confirmation
              </p>
            </div>
            <button
              type="submit"
              disabled={searching}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {searching ? (
                <span>Searching...</span>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Track Order</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Not Found */}
        {notFound && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <Package className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Order Not Found
            </h3>
            <p className="text-red-600">
              Please check your email address and order ID and try again.
            </p>
          </div>
        )}

        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-display font-semibold text-gray-800">
                  Order Status
                </h2>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{getStatusMessage(order.status)}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Order ID:</span>
                  <p className="font-mono font-semibold">{order.id.slice(0, 8)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Order Date:</span>
                  <p className="font-semibold">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer & Delivery Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Customer & Delivery Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <span className="font-medium text-gray-600 w-32">Name:</span>
                  <span className="text-gray-800">{order.customer_name}</span>
                </div>
                <div className="flex items-start">
                  <Mail className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                  <span className="text-gray-800">{order.customer_email}</span>
                </div>
                <div className="flex items-start">
                  <Phone className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                  <span className="text-gray-800">{order.customer_phone}</span>
                </div>
                {order.delivery_address && (
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                    <span className="text-gray-800">{order.delivery_address}</span>
                  </div>
                )}
                {order.rental_start_date && (
                  <div className="flex items-start">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <span className="text-gray-600">Rental Period:</span>
                      <br />
                      <span className="text-gray-800">
                        {new Date(order.rental_start_date).toLocaleDateString()} -{" "}
                        {order.rental_end_date
                          ? new Date(order.rental_end_date).toLocaleDateString()
                          : "Not specified"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b border-gray-200 pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{item.product_title}</p>
                      <p className="text-sm text-gray-600">
                        ₱{item.product_price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-800">
                      ₱{item.subtotal.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
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
                  <>
                    <div className="flex justify-between text-green-600">
                      <span>
                        Discount {order.promo_code && `(${order.promo_code})`}:
                      </span>
                      <span className="font-medium">-₱{order.discount.toFixed(2)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                  <span>Total:</span>
                  <span className="text-primary-600">₱{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {order.notes && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Your Note:</strong> {order.notes}
                </p>
              </div>
            )}

            {/* Contact Info */}
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-2">Questions about your order?</p>
              <p className="text-sm text-gray-500">
                Contact us at{" "}
                <a
                  href="tel:09171271659"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  09171271659
                </a>{" "}
                or{" "}
                <a
                  href="mailto:flowertown1496@gmail.com"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  flowertown1496@gmail.com
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
