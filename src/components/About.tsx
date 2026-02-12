"use client";

import { motion } from "framer-motion";
import { Award, Users, Heart, Sparkles, Flower2 } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Premium Quality",
    description: "We source the finest flowers to ensure lasting beauty and freshness",
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "Our skilled florists bring artistry and passion to every arrangement",
  },
  {
    icon: Heart,
    title: "Customer Focused",
    description: "Dedicated to creating memorable experiences for every client",
  },
  {
    icon: Sparkles,
    title: "Unique Creations",
    description: "Each arrangement is crafted with creativity and attention to detail",
  },
];

export default function About() {
  return (
    <section id="about" className="py-20 sm:py-28 lg:py-32 bg-white">
      <div className="w-full px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-stone-300" />
                <span className="text-xs tracking-[0.3em] uppercase text-stone-500 font-light">Philosophy</span>
              </div>
            </motion.div>

            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-900 mb-8 tracking-tight leading-tight">
              The Art of Floral Curation
            </h2>

            <p className="text-sm sm:text-base text-stone-600 mb-6 leading-relaxed font-light">
              At Fleur Finds, we believe in the transformative power of exceptional florals. Each arrangement is a carefully composed masterpiece, 
              sourced from the world&apos;s finest growers and crafted with meticulous attention to detail.
            </p>

            <p className="text-sm sm:text-base text-stone-600 mb-12 leading-relaxed font-light">
              Our bespoke service caters to discerning clients who appreciate refined aesthetics and uncompromising quality. 
              Every creation tells a story of elegance, crafted to elevate moments into lasting memories.
            </p>

            {/* Features Grid - Minimal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="group"
                  >
                    <div className="mb-4">
                      <Icon className="w-6 h-6 text-stone-400 group-hover:text-amber-800 transition-colors duration-500" />
                    </div>
                    <h3 className="font-serif text-base sm:text-lg text-stone-900 mb-2">{feature.title}</h3>
                    <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right side - Elegant Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-gradient-to-b from-stone-50 to-stone-100 flex items-center justify-center">
              <div className="text-center p-12">
                <Flower2 className="w-24 h-24 text-stone-300 mx-auto mb-6" />
                <p className="text-xs text-stone-400 tracking-wider font-light">Gallery images can be added via admin panel</p>
              </div>
            </div>

            {/* Subtle Decorative Element */}
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl" />
          </motion.div>
        </div>
        </div>
      </div>
    </section>
  );
}
