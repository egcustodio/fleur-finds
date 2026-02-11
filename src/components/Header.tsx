"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart, Phone } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-3" : "bg-white/95 backdrop-blur-sm py-4"
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="flex flex-col">
              <span className="font-display text-xl sm:text-2xl lg:text-3xl font-light tracking-wider text-primary-800 group-hover:text-primary-700 transition-colors">
                Fleur Finds
              </span>
              <span className="hidden sm:block text-[9px] tracking-[0.25em] text-rose-500 uppercase mt-[-2px] font-light">Rent • Rewear • Recreate</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Home
            </Link>
            <Link href="#products" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Shop
            </Link>
            <Link href="#about" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              About
            </Link>
            <Link href="#contact" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Contact
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <a
              href="tel:09171271659"
              className="hidden sm:flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-full transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">TEXT US</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-primary-600 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                href="#products"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              >
                Shop
              </Link>
              <Link
                href="#about"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              >
                About
              </Link>
              <Link
                href="#contact"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              >
                Contact
              </Link>
              <a
                href="tel:09171271659"
                className="flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-full transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">TEXT US: 09171271659</span>
              </a>
            </div>
          </nav>
        )}
        </div>
      </div>
    </header>
  );
}
