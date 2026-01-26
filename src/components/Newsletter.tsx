"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter subscription:", email);
    alert("Thank you for subscribing!");
    setEmail("");
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <Mail className="w-16 h-16 mx-auto mb-6 text-white/90" />
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-lg text-white/90 mb-8">
            Stay updated with our latest collections, exclusive offers, and floral tips
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email here"
              required
              className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
            />
            <button
              type="submit"
              className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg whitespace-nowrap"
            >
              Subscribe Now
            </button>
          </form>

          <div className="mt-6">
            <label className="inline-flex items-center text-sm text-white/90">
              <input type="checkbox" className="mr-2 rounded" defaultChecked />
              Yes, subscribe me to your newsletter
            </label>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
