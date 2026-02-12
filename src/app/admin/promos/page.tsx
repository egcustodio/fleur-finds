"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase";
import AdminHeader from "@/components/AdminHeader";
import { Plus, Edit, Trash2, X, Tag } from "lucide-react";

interface Promo {
  id: string;
  title: string;
  description: string;
  discount_percentage: number | null;
  discount_amount: number | null;
  code: string;
  active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

export default function PromosAdmin() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount_percentage: "",
    discount_amount: "",
    code: "",
    active: true,
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from("promos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPromos(data || []);
    } catch (error) {
      console.error("Error fetching promos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createBrowserClient();

    const promoData = {
      title: formData.title,
      description: formData.description,
      discount_percentage: formData.discount_percentage
        ? parseInt(formData.discount_percentage)
        : null,
      discount_amount: formData.discount_amount
        ? parseFloat(formData.discount_amount)
        : null,
      code: formData.code.toUpperCase(),
      active: formData.active,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
    };

    try {
      if (editingPromo) {
        const { error } = await supabase
          .from("promos")
          .update(promoData)
          .eq("id", editingPromo.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("promos").insert([promoData]);

        if (error) throw error;
      }

      fetchPromos();
      resetForm();
    } catch (error) {
      console.error("Error saving promo:", error);
      alert("Error saving promo. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promo?")) return;

    const supabase = createBrowserClient();
    const { error } = await supabase.from("promos").delete().eq("id", id);

    if (error) {
      console.error("Error deleting promo:", error);
      alert("Error deleting promo.");
      return;
    }

    fetchPromos();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      discount_percentage: "",
      discount_amount: "",
      code: "",
      active: true,
      start_date: "",
      end_date: "",
    });
    setEditingPromo(null);
    setShowForm(false);
  };

  const handleEdit = (promo: Promo) => {
    setEditingPromo(promo);
    setFormData({
      title: promo.title,
      description: promo.description,
      discount_percentage: promo.discount_percentage?.toString() || "",
      discount_amount: promo.discount_amount?.toString() || "",
      code: promo.code,
      active: promo.active,
      start_date: promo.start_date || "",
      end_date: promo.end_date || "",
    });
    setShowForm(true);
  };

  const toggleActive = async (promo: Promo) => {
    const supabase = createBrowserClient();
    const { error } = await supabase
      .from("promos")
      .update({ active: !promo.active })
      .eq("id", promo.id);

    if (error) {
      console.error("Error toggling promo:", error);
      return;
    }

    fetchPromos();
  };

  return (
    <>
      <AdminHeader title="Promotions" subtitle="Manage promo codes and discounts" />
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-serif text-stone-900">
            Promo Codes
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-stone-900 hover:bg-amber-900 text-white px-6 py-3 flex items-center gap-2 transition-colors duration-300 text-sm tracking-wider uppercase font-light"
          >
            <Plus size={18} />
            Add Promo
          </button>
        </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display text-primary-900">
                {editingPromo ? "Edit Promo" : "Add New Promo"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="e.g., Spring Sale"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Describe the promotion..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent uppercase"
                  placeholder="SPRING2024"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount_percentage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount_percentage: e.target.value,
                        discount_amount: "",
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OR Fixed Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.discount_amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount_amount: e.target.value,
                        discount_percentage: "",
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="10.00"
                  />
                </div>
              </div>

              <p className="text-xs text-gray-500">
                Choose either percentage or fixed amount, not both
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.checked })
                  }
                  className="w-4 h-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Active</span>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-rose-700 text-white px-6 py-3 rounded-lg hover:bg-rose-800 transition"
                >
                  {editingPromo ? "Update Promo" : "Add Promo"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">Loading promos...</div>
      ) : (
        <div className="space-y-4">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                promo.active ? "border-green-500" : "border-gray-300"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Tag className="text-rose-600" size={20} />
                    <h3 className="font-display text-xl text-primary-900">
                      {promo.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        promo.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {promo.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-3">{promo.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Code</p>
                      <p className="font-mono font-medium text-rose-700">
                        {promo.code}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Discount</p>
                      <p className="font-medium">
                        {promo.discount_percentage
                          ? `${promo.discount_percentage}%`
                          : promo.discount_amount
                          ? `$${promo.discount_amount.toFixed(2)}`
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Start Date</p>
                      <p className="font-medium">
                        {promo.start_date
                          ? new Date(promo.start_date).toLocaleDateString()
                          : "No start"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">End Date</p>
                      <p className="font-medium">
                        {promo.end_date
                          ? new Date(promo.end_date).toLocaleDateString()
                          : "No end"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => toggleActive(promo)}
                    className={`px-4 py-2 rounded-lg transition ${
                      promo.active
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {promo.active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleEdit(promo)}
                    className="bg-primary-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-800 transition"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(promo.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && promos.length === 0 && (
        <div className="text-center py-12 text-stone-500">
          <p className="mb-4 font-light">No promotions yet. Add your first promo!</p>
        </div>
      )}
      </div>
    </>
  );
}
