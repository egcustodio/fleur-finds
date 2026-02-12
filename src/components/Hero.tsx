"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase";

export default function Hero() {
  const [content, setContent] = useState({
    title: "Fleur Finds",
    subtitle: "Curated Florals & Timeless Elegance",
    tagline: "Est. 2024"
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const supabase = createBrowserClient();
      const { data } = await supabase
        .from("site_content")
        .select("content")
        .eq("section", "hero")
        .single();

      if (data?.content) {
        setContent(data.content);
      }
    } catch (error) {
      console.error("Error fetching hero content:", error);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-stone-50 via-amber-50/30 to-white">
      {/* Elegant Background Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-100/20 via-transparent to-transparent" />
      
      <div className="w-full px-6 sm:px-8 lg:px-12 py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center space-y-12"
          >
            {/* Minimalist Tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              <p className="text-xs tracking-[0.3em] uppercase text-amber-800/60 font-light mb-3">
                {content.tagline}
              </p>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent mx-auto" />
            </motion.div>

            {/* Main Heading - Elegant Typography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-stone-900 tracking-tight leading-none">
                {content.title}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-stone-600 font-light tracking-wide max-w-3xl mx-auto">
                {content.subtitle}
              </p>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-sm md:text-base text-stone-500 font-light max-w-2xl mx-auto leading-relaxed"
            >
              Discover handpicked blooms and refined arrangements for every occasion.
              <br className="hidden sm:block" />
              Serving Naga City & Pili, Camarines Sur with grace.
            </motion.p>

            {/* Elegant CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="pt-8"
            >
              <a
                href="#products"
                className="group inline-flex items-center gap-3 text-sm tracking-[0.2em] uppercase text-stone-800 hover:text-amber-900 transition-colors duration-500"
              >
                <span className="font-light">Explore Collection</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-500" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Minimalist Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <div className="w-px h-16 bg-gradient-to-b from-stone-300 to-transparent" />
      </motion.div>
    </section>
  );
}
