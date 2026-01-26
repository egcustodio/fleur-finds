"use client";

import { motion } from "framer-motion";
import { Award, Users, Heart, Sparkles } from "lucide-react";

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
              <span className="text-sm font-semibold">About Flowertown</span>
            </motion.div>

            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              A Sanctuary of Floral Artistry
            </h2>

            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Flowertown is a sanctuary of floral artistry, crafting stunning bouquets and exquisite floral arrangements that bring the
              beauty of nature into your home.
            </p>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our team is dedicated to providing exceptional service and creating memorable experiences for our clients. We are passionate
              about flowers and are committed to spreading joy through our unique creations.
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

          {/* Right Image Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=400&h=300&fit=crop"
                    alt="Flower arrangement 1"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1560070094-e1f2ddec4337?w=400&h=400&fit=crop"
                    alt="Flower arrangement 2"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400&h=400&fit=crop"
                    alt="Flower arrangement 3"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400&h=300&fit=crop"
                    alt="Flower arrangement 4"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
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
