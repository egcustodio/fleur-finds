"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase";
import { toast } from "sonner";
import { Calendar, MapPin, Tag, ShoppingBag, CreditCard } from "lucide-react";
import Image from "next/image";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get('buyNow') === 'true';
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  const [shippingSettings, setShippingSettings] = useState<any>(null);
  const [buyNowItem, setBuyNowItem] = useState<any>(null);

  const [formData, setFormData] = useState({
    customer_name: "",
    email: "",
    phone: "",
    delivery_address: "",
    notes: "",
    rental_start_date: "",
    rental_end_date: "",
  });

  // Load Buy Now product if in Buy Now mode
  useEffect(() => {
    if (isBuyNow) {
      const stored = sessionStorage.getItem('buyNowProduct');
      if (stored) {
        setBuyNowItem(JSON.parse(stored));
      }
    }
  }, [isBuyNow]);

  // Use Buy Now item or cart
  const checkoutItems = isBuyNow && buyNowItem ? [buyNowItem] : cart;
  const checkoutTotal = isBuyNow && buyNowItem 
    ? buyNowItem.price * buyNowItem.quantity 
    : cartTotal;

  // Fetch shipping settings on mount
  useEffect(() => {
    fetchShippingSettings();
  }, []);

  const fetchShippingSettings = async () => {
    try {
      const supabase = createBrowserClient();
      const { data } = await supabase
        .from("site_content")
        .select("content")
        .eq("section", "shipping")
        .single();

      if (data) {
        setShippingSettings(data.content);
      } else {
        // Default settings if not configured
        setShippingSettings({
          defaultFee: 100,
          freeShippingLocations: ["naga city", "pili, camarines sur"],
        });
      }
    } catch (error) {
      console.error("Error fetching shipping settings:", error);
      // Use defaults on error
      setShippingSettings({
        defaultFee: 100,
        freeShippingLocations: ["naga city", "pili, camarines sur"],
      });
    }
  };

  // Calculate shipping fee based on address
  const calculateShippingFee = (address: string) => {
    if (!shippingSettings) return 0;

    const lowerAddress = address.toLowerCase();
    
    // Check if address matches any free shipping location
    const isFreeShipping = shippingSettings.freeShippingLocations.some(
      (location: string) => lowerAddress.includes(location.toLowerCase())
    );
    
    return isFreeShipping ? 0 : shippingSettings.defaultFee;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setFormData(newFormData);

    // Update shipping fee when delivery address changes
    if (e.target.name === "delivery_address") {
      const newShippingFee = calculateShippingFee(e.target.value);
      setShippingFee(newShippingFee);
    }
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from("promos")
        .select("*")
        .eq("code", promoCode.trim().toUpperCase())
        .eq("active", true)
        .single();

      if (error || !data) {
        toast.error("Invalid or expired promo code");
        return;
      }

      // Check if promo is still valid
      const now = new Date();
      const validFrom = new Date(data.valid_from);
      const validUntil = new Date(data.valid_until);

      if (now < validFrom || now > validUntil) {
        toast.error("This promo code has expired");
        return;
      }

      const discountAmount = (cartTotal * data.discount_percentage) / 100;
      setDiscount(discountAmount);
      setPromoApplied(true);
      toast.success(`Promo code applied! You saved ₱${discountAmount.toFixed(2)}`);
    } catch (error) {
      console.error("Error applying promo code:", error);
      toast.error("Failed to apply promo code");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!formData.customer_name || !formData.email || !formData.phone) {
        toast.error("Please fill in all required fields");
        setLoading(false);
        return;
      }

      if (checkoutItems.length === 0) {
        toast.error("Your cart is empty");
        setLoading(false);
        return;
      }

      const supabase = createBrowserClient();
      const subtotal = checkoutTotal;
      const total = subtotal - discount + shippingFee;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: formData.customer_name,
          email: formData.email.toLowerCase().trim(),
          phone: formData.phone.trim(),
          delivery_address: formData.delivery_address.trim(),
          notes: formData.notes.trim(),
          subtotal: subtotal,
          discount: discount,
          shipping_fee: shippingFee,
          total: total,
          promo_code: promoApplied ? promoCode.toUpperCase() : null,
          status: "pending",
          rental_start_date: formData.rental_start_date || null,
          rental_end_date: formData.rental_end_date || null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = checkoutItems.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_title: item.title,
        product_price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart or sessionStorage based on mode
      if (isBuyNow) {
        sessionStorage.removeItem('buyNowProduct');
      } else {
        clearCart();
      }
      toast.success("Order created! Choose your payment method.");
      router.push(`/payment?order=${order.id}`);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-display text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some beautiful flowers to get started!</p>
            <button
              onClick={() => router.push("/")}
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-display font-light text-gray-800 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
              {/* Customer Information */}
              <div>
                <h2 className="text-xl font-display font-semibold text-gray-800 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-primary-600" />
                  Customer Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="Juan Dela Cruz"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="juan@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="09171271659"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div>
                <h2 className="text-xl font-display font-semibold text-gray-800 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                  Delivery Address
                </h2>
                <textarea
                  name="delivery_address"
                  value={formData.delivery_address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="Complete delivery address (Naga City or Pili, Camarines Sur)"
                />
              </div>

              {/* Rental Dates (Optional) */}
              <div>
                <h2 className="text-xl font-display font-semibold text-gray-800 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary-600" />
                  Rental Period (Optional)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="rental_start_date"
                      value={formData.rental_start_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="rental_end_date"
                      value={formData.rental_end_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="Any special requests or instructions..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-full font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-display font-semibold text-gray-800 mb-4">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {checkoutItems.map((item) => (
                  <div key={item.id} className="flex space-x-3">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-200">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">
                          🌸
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-primary-600">
                        ₱{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Tag className="w-4 h-4 mr-1" />
                  Promo Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    disabled={promoApplied}
                    placeholder="ENTER CODE"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm disabled:bg-gray-100"
                  />
                  <button
                    type="button"
                    onClick={applyPromoCode}
                    disabled={promoApplied}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm transition-colors disabled:bg-gray-400"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-2 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₱{checkoutTotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="font-medium text-green-600">-₱{discount.toFixed(2)}</span>
                  </div>
                )}
                {shippingFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping Fee</span>
                    <span className="font-medium">₱{shippingFee.toFixed(2)}</span>
                  </div>
                )}
                {shippingFee === 0 && formData.delivery_address && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Shipping Fee</span>
                    <span className="font-medium text-green-600">FREE 🎉</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span className="text-primary-600">₱{(checkoutTotal - discount + shippingFee).toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> Minimum 50% down payment required. No COD available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
