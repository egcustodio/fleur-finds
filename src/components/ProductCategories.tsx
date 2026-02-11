"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase";
import { ShoppingCart } from "lucide-react";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string | null;
  category: string;
  in_stock: boolean;
  featured: boolean;
}

export default function ProductCategories() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('order', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="products" className="py-20 bg-gradient-to-b from-white to-blush-50/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-light text-primary-900 mb-4">Curated Collections</h2>
          <p className="text-base text-gray-500 max-w-2xl mx-auto font-light">
            Explore our meticulously curated selections, each piece a testament to timeless elegance
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center text-gray-500">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500">No products available. Please add products in the admin panel.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-80 overflow-hidden bg-gray-100">
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
                </div>

                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">{product.category}</span>
                  </div>
                  <h3 className="font-display text-xl font-light text-primary-900 mb-2">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 font-light">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-light text-rose-700">
                      ${product.price.toFixed(2)}
                    </span>
                    <button className="bg-rose-700 hover:bg-rose-800 text-white px-6 py-2 rounded-full text-sm transition-colors duration-300">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
