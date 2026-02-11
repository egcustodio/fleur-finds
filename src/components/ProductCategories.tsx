"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase";
import { ShoppingCart, Search, Filter } from "lucide-react";
import { useCart } from "@/context/CartContext";
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

export default function ProductCategories() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>(["All"]);
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image || ""
    });
    toast.success(`${product.title} added to cart!`);
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
    <section id="products" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-blush-50/50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-primary-900 mb-4">Curated Collections</h2>
            <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto font-light px-4">
              Explore our meticulously curated selections, each piece a testament to timeless elegance
            </p>
          </motion.div>

          {/* Search and Filter Section */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search flowers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    selectedCategory === category
                      ? "bg-rose-700 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

        {loading ? (
          <div className="text-center text-gray-500 py-12">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            {searchQuery || selectedCategory !== "All" 
              ? "No products match your search criteria." 
              : "No products available. Please add products in the admin panel."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-64 sm:h-72 lg:h-80 overflow-hidden bg-gray-100">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blush-100 to-rose-100">
                      <ShoppingCart className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  
                  {product.featured && (
                    <div className="absolute top-4 left-4 bg-rose-600 text-white px-3 py-1 rounded-full text-xs tracking-wider uppercase">
                      Featured
                    </div>
                  )}

                  {/* Stock Badge */}
                  {!product.in_stock && (
                    <div className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-full text-xs">
                      Out of Stock
                    </div>
                  )}
                  {product.in_stock && product.quantity <= 5 && product.quantity > 0 && (
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs">
                      Only {product.quantity} left
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-6">
                  <div className="mb-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">{product.category}</span>
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-light text-primary-900 mb-2">
                    {product.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-2 font-light">
                    {product.description}
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <span className="text-xl sm:text-2xl font-light text-rose-700">
                      ${product.price.toFixed(2)}
                    </span>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.in_stock}
                      className={`w-full sm:w-auto px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm transition-colors duration-300 ${
                        product.in_stock
                          ? "bg-rose-700 hover:bg-rose-800 text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {product.in_stock ? "Add to Cart" : "Out of Stock"}
                    </button>
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
