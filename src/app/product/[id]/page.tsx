"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, ShoppingCart, CreditCard, Package, Star } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string | null;
  category: string;
  in_stock: boolean;
  quantity: number;
  featured: boolean;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

  const fetchProduct = async (id: string) => {
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Product not found");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    for (let i = 0; i < selectedQuantity; i++) {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      });
    }
    toast.success(`${product.title} (${selectedQuantity}) added to cart!`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    // Store product temporarily in sessionStorage for direct checkout
    sessionStorage.setItem('buyNowProduct', JSON.stringify({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: selectedQuantity
    }));
    router.push("/checkout?buyNow=true");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-stone-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display text-stone-900 mb-4">Product Not Found</h1>
          <button
            onClick={() => router.push("/collection")}
            className="text-amber-900 hover:text-amber-700 underline"
          >
            Back to Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-stone-600 hover:text-amber-900 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm uppercase tracking-wider">Back</span>
        </button>

        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-2xl shadow-lg p-8">
          {/* Product Image */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-stone-100 to-amber-50">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
                priority
                unoptimized={product.image.includes('supabase')}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><span class="text-9xl">🌸</span></div>';
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-9xl">🌸</span>
              </div>
            )}
            {product.featured && (
              <div className="absolute top-4 left-4 bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-light tracking-wider">
                FEATURED
              </div>
            )}
            {!product.in_stock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-stone-900 text-white px-6 py-3 rounded-full text-lg font-light">
                  OUT OF STOCK
                </span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-2 font-light">
                {product.category}
              </p>
              <h1 className="text-4xl font-display text-stone-900 mb-4 font-light">
                {product.title}
              </h1>
              <div className="flex items-center gap-2 mb-6">
                <p className="text-3xl font-light text-amber-900">
                  ₱{product.price.toFixed(2)}
                </p>
                {product.featured && (
                  <div className="flex items-center gap-1 text-amber-600">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-xs">Premium</span>
                  </div>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                <Package className="w-5 h-5 text-stone-500" />
                <span className="text-sm text-stone-600">
                  {product.in_stock ? (
                    <span className="text-green-600 font-medium">
                      {product.quantity > 0 ? `${product.quantity} in stock` : "In Stock"}
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  )}
                </span>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-sm uppercase tracking-[0.2em] text-stone-700 mb-3 font-light">
                  Description
                </h2>
                <p className="text-stone-600 leading-relaxed font-light">
                  {product.description || "No description available."}
                </p>
              </div>

              {/* Quantity Selector */}
              {product.in_stock && (
                <div className="mb-8">
                  <label className="text-sm uppercase tracking-[0.2em] text-stone-700 mb-3 block font-light">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                      className="w-10 h-10 border border-stone-300 hover:border-amber-600 hover:text-amber-600 transition-colors flex items-center justify-center text-xl"
                    >
                      −
                    </button>
                    <span className="w-12 text-center text-lg font-light">{selectedQuantity}</span>
                    <button
                      onClick={() => setSelectedQuantity(Math.min(product.quantity || 99, selectedQuantity + 1))}
                      className="w-10 h-10 border border-stone-300 hover:border-amber-600 hover:text-amber-600 transition-colors flex items-center justify-center text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {product.in_stock && (
              <div className="space-y-3">
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-sm uppercase tracking-[0.15em] font-medium">
                    Buy Now
                  </span>
                </button>
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-white hover:bg-stone-50 text-stone-900 py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 border border-stone-300 hover:border-stone-400 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="text-sm uppercase tracking-[0.15em] font-medium">
                    Add to Cart
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
