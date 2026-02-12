"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase";
import { ShoppingCart, Search, Filter, CreditCard } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

export default function ProductCategories() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>(["All"]);
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image || null,
    });
    toast.success(`${product.title} added to cart!`);
  };

  const handleBuyNow = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();
    // Store product temporarily in sessionStorage for direct checkout
    sessionStorage.setItem('buyNowProduct', JSON.stringify({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image || null,
      quantity: 1
    }));
    router.push("/checkout?buyNow=true");
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
      
      // Extract unique categories
      const uniqueCategories = ["All", ...new Set(data?.map(p => p.category).filter(Boolean) as string[])];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  return (
    <section id="products" className="py-16 sm:py-20 lg:py-28 bg-white">
      <div className="w-full px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Elegant Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16 sm:mb-20"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-stone-300" />
                <p className="text-xs tracking-[0.3em] uppercase text-stone-500 font-light">
                  Collection
                </p>
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-stone-300" />
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-900 tracking-tight">
                Curated Florals
              </h2>
              <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto font-light leading-relaxed">
                Each arrangement is thoughtfully crafted to bring elegance to every moment
              </p>
            </div>
          </motion.div>

          {/* Minimal Search and Filter */}
          <div className="mb-12 sm:mb-16 space-y-6">
            {/* Search Bar - Minimal */}
            <div className="relative max-w-lg mx-auto">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 border border-stone-200 text-sm text-stone-800 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none transition-colors duration-300"
              />
            </div>

            {/* Category Filter - Elegant Pills */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide justify-center flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 text-xs tracking-wide uppercase font-light transition-all duration-300 ${
                    selectedCategory === category
                      ? "text-stone-900 border-b-2 border-amber-800"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

        {loading ? (
          <div className="text-center text-stone-400 py-20 font-light tracking-wide">Loading...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-stone-400 py-20 font-light">
            {searchQuery || selectedCategory !== "All" 
              ? "No products found" 
              : "Collection coming soon"}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative"
              >
                {/* Luxury Card Container with Shadow and Border */}
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 border border-stone-100 hover:border-amber-200">
                  <Link href={`/product/${product.id}`} className="block">
                    {/* Image Container with Gradient Overlay */}
                    <div className="relative aspect-[4/5] overflow-hidden">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover transform group-hover:scale-110 transition-transform duration-[2s] ease-out"
                          unoptimized={product.image.includes('supabase')}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            if (target.parentElement) {
                              target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-50 to-amber-50"><span class="text-8xl">🌸</span></div>';
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-50 to-amber-50">
                          <span className="text-8xl">🌸</span>
                        </div>
                      )}
                      
                      {/* Gradient Overlay for Better Text Visibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      
                      {/* Premium Badges */}
                      <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                        {product.featured && (
                          <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-white px-3 py-1.5 rounded-full text-[9px] tracking-[0.15em] uppercase font-medium shadow-lg backdrop-blur-sm">
                            ✨ Featured
                          </div>
                        )}
                        {!product.in_stock && (
                          <div className="ml-auto bg-stone-900/95 text-white px-3 py-1.5 rounded-full text-[9px] tracking-[0.15em] uppercase font-medium shadow-lg backdrop-blur-sm">
                            Sold Out
                          </div>
                        )}
                        {product.in_stock && product.quantity <= 5 && product.quantity > 0 && (
                          <div className="ml-auto bg-red-600/95 text-white px-3 py-1.5 rounded-full text-[9px] tracking-[0.15em] uppercase font-medium shadow-lg backdrop-blur-sm animate-pulse">
                            Only {product.quantity} Left
                          </div>
                        )}
                      </div>

                      {/* Elegant Hover Text */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                          <span className="text-white text-sm uppercase tracking-[0.25em] font-light bg-white/20 backdrop-blur-md px-8 py-3 rounded-full border border-white/30 shadow-2xl">
                            View Details
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Product Info Section */}
                    <div className="p-5 space-y-3">
                      {/* Category Tag */}
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] tracking-[0.25em] uppercase text-amber-700 font-medium bg-amber-50 px-2 py-1 rounded">
                          {product.category}
                        </span>
                      </div>
                      
                      {/* Product Title */}
                      <h3 className="font-serif text-xl text-stone-900 tracking-tight leading-tight group-hover:text-amber-900 transition-colors duration-500 min-h-[3rem]">
                        {product.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-sm text-stone-600 line-clamp-2 font-light leading-relaxed min-h-[2.5rem]">
                        {product.description || "A beautiful arrangement crafted with care."}
                      </p>

                      {/* Price with Divider */}
                      <div className="pt-3 border-t border-stone-100">
                        <div className="flex items-baseline justify-between mb-4">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-serif text-amber-900 font-medium">₱{product.price.toFixed(2)}</span>
                          </div>
                          {product.featured && (
                            <div className="flex items-center gap-1 text-amber-600">
                              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                              </svg>
                              <span className="text-xs font-medium">Premium</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Luxury Action Buttons - Outside Link */}
                  <div className="px-5 pb-5">
                    {product.in_stock ? (
                      <div className="grid grid-cols-2 gap-3">
                        {/* Buy Now - Gradient Premium Button */}
                        <button
                          onClick={(e) => handleBuyNow(e, product)}
                          className="relative overflow-hidden bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white py-3.5 rounded-xl text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group/btn"
                        >
                          <CreditCard className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
                          <span>Buy Now</span>
                          {/* Shimmer Effect */}
                          <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        </button>
                        
                        {/* Add to Cart - Elegant Dark Button */}
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className="relative overflow-hidden bg-stone-900 hover:bg-stone-800 text-white py-3.5 rounded-xl text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group/btn border border-stone-800 hover:border-stone-700"
                        >
                          <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-stone-100 text-stone-400 py-3.5 rounded-xl text-xs uppercase tracking-[0.15em] font-medium cursor-not-allowed border border-stone-200"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Out of Stock
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
