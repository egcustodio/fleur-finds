"use client";

import { motion } from "framer-motion";
import { Flower2, Package, Gift, Banknote, Sparkles, Heart } from "lucide-react";

const categories = [
  {
    id: 1,
    title: "Fresh Flower Bouquets",
    description: "Beautiful fresh flower arrangements for any occasion",
    icon: Flower2,
    image: "",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: 2,
    title: "Dried Flower Bouquets",
    description: "Long-lasting dried flower arrangements",
    icon: Package,
    image: "",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: 3,
    title: "Vases",
    description: "Elegant vases for your beautiful flowers",
    icon: Gift,
    image: "",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 4,
    title: "Money Bouquets",
    description: "Unique money bouquet arrangements",
    icon: Banknote,
    image: "",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 5,
    title: "Customized Bouquets",
    description: "Personalized arrangements for your special moments",
    icon: Sparkles,
    image: "",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 6,
    title: "Sympathy Flowers",
    description: "Thoughtful arrangements for remembrance",
    icon: Heart,
    image: "",
    color: "from-gray-500 to-slate-500",
  },
];

export default function ProductCategories() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer"
              >
                {/* Image - Only show if image URL exists */}
                {category.image && (
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                    {/* Icon Badge */}
                    <div className={`absolute top-4 right-4 bg-gradient-to-br ${category.color} p-3 rounded-full shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}

                {/* Placeholder if no image */}
                {!category.image && (
                  <div className="relative h-80 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <Icon className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                      <p className="text-xs text-gray-500 tracking-wider">Add image in admin</p>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="font-serif text-2xl font-bold mb-2 group-hover:text-primary-300 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-200 mb-4">{category.description}</p>
                  <button className="inline-flex items-center text-sm font-semibold text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full backdrop-blur-sm transition-all">
                    View Collection
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
