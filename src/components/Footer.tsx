"use client";

import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <Link href="/" className="flex flex-col items-start group mb-4">
              <span className="font-display text-2xl font-light tracking-wider text-primary-800 group-hover:text-primary-900 transition-colors">
                Fleur Finds
              </span>
              <span className="text-[9px] tracking-[0.2em] text-rose-400 uppercase mt-1 font-light italic">Perfect for hearts that speak without words</span>
            </Link>
            <p className="text-gray-500 text-sm mb-4 font-light leading-relaxed">
              Exquisitely curated luxury bouquets and bespoke floral arrangements for discerning clientele.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contact Us</h3>
            <div className="space-y-3">
              <a
                href="https://maps.google.com/?q=Magsaysay+Avenue+Naga+City+4400"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Magsaysay Avenue, Naga City 4400</span>
              </a>
              <a href="tel:09171271659" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">09171271659 (TEXT ONLY)</span>
              </a>
              <a
                href="mailto:flowertown1496@gmail.com"
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">flowertown1496@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Opening Hours</h3>
            <div className="flex items-start space-x-2 text-gray-600">
              <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Mon - Sun</p>
                <p>9:00 AM - 9:00 PM</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="#products" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
                Shop
              </Link>
              <Link href="#about" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
                About Us
              </Link>
              <Link href="#contact" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
                Contact
              </Link>
              <Link href="/faq" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
                FAQ
              </Link>
              <Link href="/shipping" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
                Shipping & Returns
              </Link>
              <Link href="/privacy" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-xs text-gray-500 tracking-wide font-light">
            © {new Date().getFullYear()} Fleur Finds. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
