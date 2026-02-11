"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase";
import { toast } from "sonner";
import { Mail, Download, UserMinus } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  subscribed: boolean;
  created_at: string;
}

export default function NewsletterAdmin() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      toast.error("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  const unsubscribeUser = async (id: string) => {
    if (!confirm("Are you sure you want to unsubscribe this user?")) return;

    try {
      const supabase = createBrowserClient();
      const { error } = await supabase
        .from("newsletter_subscribers")
        .update({ subscribed: false })
        .eq("id", id);

      if (error) throw error;

      setSubscribers(
        subscribers.map((sub) =>
          sub.id === id ? { ...sub, subscribed: false } : sub
        )
      );
      toast.success("User unsubscribed");
    } catch (error) {
      console.error("Error unsubscribing user:", error);
      toast.error("Failed to unsubscribe user");
    }
  };

  const exportToCSV = () => {
    const activeSubscribers = subscribers.filter((sub) => sub.subscribed);
    
    if (activeSubscribers.length === 0) {
      toast.error("No active subscribers to export");
      return;
    }

    const headers = ["Email", "Name", "Subscribed Date"];
    const rows = activeSubscribers.map((sub) => [
      sub.email,
      sub.name || "",
      new Date(sub.created_at).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Subscribers exported successfully!");
  };

  const activeCount = subscribers.filter((sub) => sub.subscribed).length;
  const inactiveCount = subscribers.length - activeCount;

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading subscribers...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-light text-gray-800 mb-2">
            Newsletter Subscribers
          </h1>
          <p className="text-gray-600">Manage your email subscribers</p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Subscribers</p>
              <p className="text-3xl font-bold text-gray-800">{subscribers.length}</p>
            </div>
            <Mail className="w-12 h-12 text-primary-600" />
          </div>
        </div>
        <div className="bg-green-50 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Active</p>
              <p className="text-3xl font-bold text-green-800">{activeCount}</p>
            </div>
            <Mail className="w-12 h-12 text-green-600" />
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unsubscribed</p>
              <p className="text-3xl font-bold text-gray-700">{inactiveCount}</p>
            </div>
            <UserMinus className="w-12 h-12 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Subscribers List */}
      {subscribers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No subscribers yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscribed Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{subscriber.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">
                      {subscriber.name || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        subscriber.subscribed
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {subscriber.subscribed ? "Active" : "Unsubscribed"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(subscriber.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {subscriber.subscribed && (
                      <button
                        onClick={() => unsubscribeUser(subscriber.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Unsubscribe
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
