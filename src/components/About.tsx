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
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-block bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-6"
            >
              <span className="text-xs font-light tracking-[0.3em] uppercase">Our Philosophy</span>
            </motion.div>

            <h2 className="font-display text-4xl md:text-5xl font-light text-primary-900 mb-6">
              The Art of Floral Curation
            </h2>

            <p className="text-base text-gray-600 mb-6 leading-relaxed font-light">
              At Fleur Finds, we believe in the transformative power of exceptional florals. Each arrangement is a carefully composed masterpiece, 
              sourced from the world's finest growers and crafted with meticulous attention to detail.
            </p>

            <p className="text-base text-gray-600 mb-8 leading-relaxed font-light">
              Our bespoke service caters to discerning clients who appreciate refined aesthetics and uncompromising quality. 
              Every creation tells a story of elegance, crafted to elevate moments into lasting memories.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="flex-shrink-0 bg-primary-100 p-2 rounded-lg">
                      <Icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right side - Remove image grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center shadow-xl">
              <div className="text-center p-8">
                <Flower2 className="w-24 h-24 text-primary-300 mx-auto mb-4" />
                <p className="text-sm text-gray-500 tracking-wider">Gallery images can be added via admin panel</p>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
