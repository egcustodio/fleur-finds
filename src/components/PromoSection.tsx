"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function PromoSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white relative overflow-hidden">
      {/* Elegant Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,0 L100,50 L0,100 Z" fill="currentColor" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-6 h-6 mr-3" />
            <h2 className="font-display text-3xl md:text-4xl font-light tracking-wide">Special Offer</h2>
          </div>
          <p className="text-lg md:text-xl mb-8 font-light">
            Order Online Now & Receive <span className="font-semibold border-b-2 border-white/50">10% OFF</span> Your First Purchase
          </p>
          <a
            href="#products"
            className="inline-flex items-center justify-center bg-white text-primary-700 hover:bg-primary-50 px-10 py-3 rounded-none font-medium text-sm tracking-wider transition-all transform hover:scale-105 shadow-lg uppercase"
          >
            Browse Collection
          </a>
        </motion.div>
      </div>
    </section>
  );
}
