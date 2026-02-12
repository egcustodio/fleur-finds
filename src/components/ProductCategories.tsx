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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group"
              >
                <Link href={`/product/${product.id}`} className="block">
                  {/* Image Container - Clean Gallery Style */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone-50 mb-6 cursor-pointer">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover transform group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                        unoptimized={product.image.includes('supabase')}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.parentElement) {
                            target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><span class="text-8xl">🌸</span></div>';
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-8xl">🌸</span>
                      </div>
                    )}
                    
                    {/* Elegant Featured Badge */}
                    {product.featured && (
                      <div className="absolute top-4 left-4 bg-amber-800/90 text-white px-3 py-1 text-[10px] tracking-widest uppercase font-light backdrop-blur-sm">
                        Featured
                      </div>
                    )}

                    {/* Minimal Stock Badges */}
                    {!product.in_stock && (
                      <div className="absolute top-4 right-4 bg-stone-800/90 text-white px-3 py-1 text-[10px] tracking-widest uppercase font-light backdrop-blur-sm">
                        Sold Out
                      </div>
                    )}
                    {product.in_stock && product.quantity <= 5 && product.quantity > 0 && (
                      <div className="absolute top-4 right-4 bg-amber-700/90 text-white px-3 py-1 text-[10px] tracking-widest uppercase font-light backdrop-blur-sm">
                        {product.quantity} Left
                      </div>
                    )}

                    {/* Elegant Hover Overlay with View Details */}
                    <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors duration-700 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-white text-xs uppercase tracking-[0.2em] font-light bg-white/10 backdrop-blur-sm px-6 py-3">
                        View Details
                      </span>
                    </div>
                  </div>

                  {/* Product Info - Minimal Typography */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] tracking-[0.2em] uppercase text-stone-400 font-light">
                        {product.category}
                      </span>
                    </div>
                    
                    <h3 className="font-serif text-lg sm:text-xl text-stone-900 tracking-tight group-hover:text-amber-900 transition-colors duration-500">
                      {product.title}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-stone-500 line-clamp-2 font-light leading-relaxed">
                      {product.description}
                    </p>

                    {/* Price and Action Buttons */}
                    <div className="flex flex-col gap-3 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-light text-stone-900">
                          ₱{product.price.toFixed(2)}
                        </span>
                      </div>

                      {/* Modern Button Group */}
                      {product.in_stock ? (
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => handleBuyNow(e, product)}
                            className="flex-1 bg-amber-900 hover:bg-amber-800 text-white py-3 text-xs uppercase tracking-[0.15em] font-light transition-colors duration-300 flex items-center justify-center gap-2 group/btn"
                          >
                            <CreditCard className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                            Buy Now
                          </button>
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            className="flex-1 bg-stone-900 hover:bg-stone-800 text-white py-3 text-xs uppercase tracking-[0.15em] font-light transition-colors duration-300 flex items-center justify-center gap-2 group/btn"
                          >
                            <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                            Add to Cart
                          </button>
                        </div>
                      ) : (
                        <button
                          disabled
                          className="w-full bg-stone-200 text-stone-400 py-3 text-xs uppercase tracking-[0.15em] font-light cursor-not-allowed"
                        >
                          Out of Stock
                        </button>
                      )}
                    </div>
                  </div>
                </Link>
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
