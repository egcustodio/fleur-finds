"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase";
import AdminHeader from "@/components/AdminHeader";
import { toast } from "sonner";
import { Star, Check, X, ThumbsUp } from "lucide-react";

interface Review {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  comment: string;
  approved: boolean;
  created_at: string;
  products?: {
    title: string;
  };
}

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from("product_reviews")
        .select(`
          *,
          products (title)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const updateReviewStatus = async (id: string, approved: boolean) => {
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase
        .from("product_reviews")
        .update({ approved })
        .eq("id", id);

      if (error) throw error;

      setReviews(
        reviews.map((review) =>
          review.id === id ? { ...review, approved } : review
        )
      );
      toast.success(approved ? "Review approved" : "Review rejected");
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Failed to update review");
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const supabase = createBrowserClient();
      const { error } = await supabase
        .from("product_reviews")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setReviews(reviews.filter((review) => review.id !== id));
      toast.success("Review deleted");
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  const filteredReviews = reviews.filter((review) => {
    if (filter === "pending") return !review.approved;
    if (filter === "approved") return review.approved;
    return true;
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading reviews...</p>
      </div>
    );
  }

  return (
    <>
      <AdminHeader title="Reviews" subtitle="Manage customer reviews and ratings" />
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-serif text-stone-900 mb-8">Product Reviews</h2>

      {/* Filter Buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        {["all", "pending", "approved"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as typeof filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === status
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status === "all" && ` (${reviews.length})`}
            {status === "pending" && ` (${reviews.filter((r) => !r.approved).length})`}
            {status === "approved" && ` (${reviews.filter((r) => r.approved).length})`}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <ThumbsUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No reviews found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-800">
                      {review.customer_name}
                    </h3>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-sm text-gray-500">
                    {review.products?.title || "Unknown Product"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  {review.approved ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                      Approved
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                      Pending
                    </span>
                  )}
                </div>
              </div>

              {review.comment && (
                <p className="text-gray-700 mb-4 bg-gray-50 p-4 rounded-lg">
                  "{review.comment}"
                </p>
              )}

              <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                {!review.approved && (
                  <button
                    onClick={() => updateReviewStatus(review.id, true)}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                )}
                {review.approved && (
                  <button
                    onClick={() => updateReviewStatus(review.id, false)}
                    className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    <X className="w-4 h-4" />
                    <span>Unapprove</span>
                  </button>
                )}
                <button
                  onClick={() => deleteReview(review.id)}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  <X className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </>
  );
}
