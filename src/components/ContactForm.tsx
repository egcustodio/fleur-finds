"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MapPin, Phone, Mail, Clock } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase";
import { toast } from "sonner";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.from("contact_inquiries").insert({
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
        status: "new",
      });

      if (error) throw error;

      toast.success("Thank you for your message! We'll get back to you soon.");
      setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-20 sm:py-28 lg:py-32 bg-gradient-to-b from-white to-stone-50/50">
      <div className="w-full px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 sm:mb-20"
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-stone-300" />
            <p className="text-xs tracking-[0.3em] uppercase text-stone-500 font-light">Contact</p>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-stone-300" />
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-900 mb-6 tracking-tight">Get In Touch</h2>
          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto font-light leading-relaxed">
            For special requests & orders, feel free to reach out to us
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Contact Form - Minimal */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-xs tracking-wider uppercase text-stone-500 mb-3 font-light">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 border border-stone-200 text-sm text-stone-800 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none transition-colors duration-300 font-light"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-xs tracking-wider uppercase text-stone-500 mb-3 font-light">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 border border-stone-200 text-sm text-stone-800 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none transition-colors duration-300 font-light"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs tracking-wider uppercase text-stone-500 mb-3 font-light">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 border border-stone-200 text-sm text-stone-800 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none transition-colors duration-300 font-light"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs tracking-wider uppercase text-stone-500 mb-3 font-light">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 border border-stone-200 text-sm text-stone-800 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none transition-colors duration-300 font-light"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs tracking-wider uppercase text-stone-500 mb-3 font-light">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-4 border border-stone-200 text-sm text-stone-800 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none transition-colors duration-300 resize-none font-light"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-stone-900 hover:bg-amber-900 text-white px-8 py-4 text-xs tracking-wider uppercase font-light transition-colors duration-500 disabled:bg-stone-300 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </motion.div>

          {/* Contact Information - Elegant */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div className="bg-gradient-to-b from-stone-50 to-white p-10 border border-stone-200/50">
              <h3 className="font-serif text-2xl sm:text-3xl text-stone-900 mb-10 tracking-tight">Our Store</h3>

              <div className="space-y-8">
                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0">
                    <MapPin className="w-5 h-5 text-stone-400 group-hover:text-amber-800 transition-colors duration-500" />
                  </div>
                  <div>
                    <h4 className="text-xs tracking-wider uppercase text-stone-500 mb-2 font-light">Address</h4>
                    <p className="text-sm text-stone-700 font-light">Magsaysay Avenue, Naga City 4400</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0">
                    <Phone className="w-5 h-5 text-stone-400 group-hover:text-amber-800 transition-colors duration-500" />
                  </div>
                  <div>
                    <h4 className="text-xs tracking-wider uppercase text-stone-500 mb-2 font-light">Phone</h4>
                    <p className="text-sm text-stone-700 font-light">09171271659 (TEXT ONLY)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0">
                    <Mail className="w-5 h-5 text-stone-400 group-hover:text-amber-800 transition-colors duration-500" />
                  </div>
                  <div>
                    <h4 className="text-xs tracking-wider uppercase text-stone-500 mb-2 font-light">Email</h4>
                    <p className="text-sm text-stone-700 font-light">flowertown1496@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0">
                    <Clock className="w-5 h-5 text-stone-400 group-hover:text-amber-800 transition-colors duration-500" />
                  </div>
                  <div>
                    <h4 className="text-xs tracking-wider uppercase text-stone-500 mb-2 font-light">Opening Hours</h4>
                    <p className="text-sm text-stone-700 font-light">Mon - Sun: 9:00 AM - 9:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map - Minimal Frame */}
            <div className="bg-stone-100 overflow-hidden h-64 border border-stone-200/50">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3899.123456789!2d123.1234567!3d13.6191!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDM3JzA4LjgiTiAxMjPCsDA3JzI0LjQiRQ!5e0!3m2!1sen!2sph!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>
        </div>
        </div>
      </div>
    </section>
  );
}
