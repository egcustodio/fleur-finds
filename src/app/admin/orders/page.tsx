"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase";
import AdminHeader from "@/components/AdminHeader";
import { toast } from "sonner";
import { Package, Mail, Phone, MapPin, Calendar, Tag, ChevronDown, ChevronUp, Download } from "lucide-react";

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
  payment_status: string;
  payment_method: string | null;
  paymongo_payment_id: string | null;
  rental_start_date: string | null;
  rental_end_date: string | null;
  created_at: string;
}

interface OrderItem {
  id: string;
  order_id: string;
  product_title: string;
  product_price: number;
  quantity: number;
  subtotal: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<{ [key: string]: OrderItem[] }>({});
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);

      // Fetch order items for each order
      if (data && data.length > 0) {
        const orderIds = data.map((order) => order.id);
        const { data: items, error: itemsError } = await supabase
          .from("order_items")
          .select("*")
          .in("order_id", orderIds);

        if (itemsError) throw itemsError;

        // Group items by order_id
        const groupedItems: { [key: string]: OrderItem[] } = {};
        items?.forEach((item) => {
          if (!groupedItems[item.order_id]) {
            groupedItems[item.order_id] = [];
          }
          groupedItems[item.order_id].push(item);
        });
        setOrderItems(groupedItems);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success("Order status updated");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "failed":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const filteredOrders = statusFilter === "all" 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const exportToCSV = () => {
    if (filteredOrders.length === 0) {
      toast.error("No orders to export");
      return;
    }

    // Create CSV header
    const headers = [
      "Order ID",
      "Date",
      "Customer Name",
      "Email",
      "Phone",
      "Delivery Address",
      "Status",
      "Subtotal",
      "Discount",
      "Total",
      "Promo Code",
      "Rental Start",
      "Rental End",
      "Notes"
    ];

    // Create CSV rows
    const rows = filteredOrders.map(order => [
      order.id,
      new Date(order.created_at).toLocaleDateString(),
      order.customer_name,
      order.customer_email,
      order.customer_phone,
      order.delivery_address || "",
      order.status,
      order.payment_status || "pending",
      order.payment_method || "N/A",
      order.subtotal.toFixed(2),
      order.discount.toFixed(2),
      order.total.toFixed(2),
      order.promo_code || "",
      order.rental_start_date ? new Date(order.rental_start_date).toLocaleDateString() : "",
      order.rental_end_date ? new Date(order.rental_end_date).toLocaleDateString() : "",
      order.notes || ""
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `fleur-finds-orders-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Orders exported successfully!");
  };

  if (loading) {
    return (
      <>
        <AdminHeader title="Orders" subtitle="Manage customer orders" />
        <div className="p-6">
          <p className="text-stone-500 font-light">Loading orders...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Orders" subtitle="View and manage customer orders" />
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-serif text-stone-900">Order Management</h2>
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 bg-green-700 hover:bg-green-800 text-white px-6 py-3 transition-colors duration-300 text-sm tracking-wider uppercase font-light"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>

      {/* Status Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {["all", "pending", "confirmed", "processing", "completed", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              statusFilter === status
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status === "all" && ` (${orders.length})`}
            {status !== "all" && ` (${orders.filter(o => o.status === status).length})`}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Order Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-mono text-sm font-semibold">{order.id.slice(0, 8)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="text-sm font-medium">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-lg font-semibold text-primary-600">
                        ₱{order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Status Badge */}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>

                    {/* Payment Status Badge */}
                    {order.payment_status && (
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getPaymentStatusColor(
                          order.payment_status
                        )}`}
                      >
                        💳 {order.payment_status === "paid" ? "Paid" : order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                      </span>
                    )}

                    {/* Expand Button */}
                    <button
                      onClick={() =>
                        setExpandedOrder(expandedOrder === order.id ? null : order.id)
                      }
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      {expandedOrder === order.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Details (Expanded) */}
              {expandedOrder === order.id && (
                <div className="p-6 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Customer Info */}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Customer Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start">
                          <span className="font-medium text-gray-600 w-24">Name:</span>
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
                      </div>
                    </div>

                    {/* Order Details */}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Order Details</h3>
                      <div className="space-y-2 text-sm">
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
                        {order.promo_code && (
                          <div className="flex items-start">
                            <Tag className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                            <span className="text-gray-800">
                              Promo: <span className="font-mono font-semibold">{order.promo_code}</span>
                            </span>
                          </div>
                        )}
                        {order.notes && (
                          <div>
                            <span className="font-medium text-gray-600">Notes:</span>
                            <p className="text-gray-800 mt-1">{order.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
                    <div className="bg-white rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Product
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Price
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Qty
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Subtotal
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {orderItems[order.id]?.map((item) => (
                            <tr key={item.id}>
                              <td className="px-4 py-3 text-sm text-gray-800">
                                {item.product_title}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                ₱{item.product_price.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {item.quantity}
                              </td>
                              <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                                ₱{item.subtotal.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Order Totals */}
                  <div className="bg-white rounded-lg p-4">
                    <div className="space-y-2 max-w-xs ml-auto">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">₱{order.subtotal.toFixed(2)}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-green-600">Discount:</span>
                          <span className="font-medium text-green-600">
                            -₱{order.discount.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                        <span>Total:</span>
                        <span className="text-primary-600">₱{order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Update */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Update Status
                    </label>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      </div>
    </>
  );
}
