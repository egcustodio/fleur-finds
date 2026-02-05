"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function PromoSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 text-white relative overflow-hidden">
      {/* Subtle Texture */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-center mb-8">
            <div className="h-px w-12 bg-white/30"></div>
            <Sparkles className="w-5 h-5 mx-4 text-white/90" />
            <div className="h-px w-12 bg-white/30"></div>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-light tracking-wide mb-6">Exclusive Introduction</h2>
          <p className="text-base md:text-lg mb-8 font-light text-white/90 leading-relaxed italic">
            Welcome to Fleur Finds. <span className="text-white border-b border-white/40">Receive 15% off</span> your inaugural order as our valued guest.
          </p>
          <a
            href="#products"
            className="inline-flex items-center justify-center bg-white text-rose-700 hover:bg-blush-50 px-12 py-4 rounded-full font-light text-xs tracking-[0.2em] transition-all uppercase shadow-md hover:shadow-lg"
          >
            View Collection
          </a>
        </motion.div>
      </div>
    </section>
  );
}
