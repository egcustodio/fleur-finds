"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import CartIcon from "./CartIcon";
import CartDrawer from "./CartDrawer";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Hide header on admin pages
  const isAdminPage = pathname?.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't render header on admin pages
  if (isAdminPage) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-sm py-4" 
          : "bg-transparent py-6"
      }`}
    >
      <div className="w-full px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo - Minimalist */}
            <Link href="/" className="group">
              <div className="flex flex-col">
                <span className={`font-serif text-2xl sm:text-3xl font-normal tracking-tight transition-colors duration-300 ${
                  isScrolled ? "text-stone-900" : "text-stone-900"
                }`}>
                  Fleur Finds
                </span>
                <span className="hidden sm:block text-[8px] tracking-[0.35em] text-stone-500 uppercase mt-0.5 font-light opacity-70">
                  Est. 2024
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Clean & Minimal */}
            <nav className="hidden lg:flex items-center space-x-12">
              <Link 
                href="/" 
                className={`text-sm tracking-wide font-light transition-all duration-300 hover:text-amber-800 ${
                  isScrolled ? "text-stone-700" : "text-stone-800"
                }`}
              >
                Home
              </Link>
              <Link 
                href="#products" 
                className={`text-sm tracking-wide font-light transition-all duration-300 hover:text-amber-800 ${
                  isScrolled ? "text-stone-700" : "text-stone-800"
                }`}
              >
                Collection
              </Link>
              <Link 
                href="#about" 
                className={`text-sm tracking-wide font-light transition-all duration-300 hover:text-amber-800 ${
                  isScrolled ? "text-stone-700" : "text-stone-800"
                }`}
              >
                About
              </Link>
              <Link 
                href="#contact" 
                className={`text-sm tracking-wide font-light transition-all duration-300 hover:text-amber-800 ${
                  isScrolled ? "text-stone-700" : "text-stone-800"
                }`}
              >
                Contact
              </Link>
              <Link 
                href="/track-order" 
                className={`text-sm tracking-wide font-light transition-all duration-300 hover:text-amber-800 ${
                  isScrolled ? "text-stone-700" : "text-stone-800"
                }`}
              >
                Track
              </Link>
            </nav>

            {/* Right Side Actions - Minimal */}
            <div className="flex items-center space-x-6">
              {/* Cart Icon */}
              <div className="transform transition-transform duration-300 hover:scale-110">
                <CartIcon onClick={() => setIsCartOpen(true)} />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`lg:hidden transition-colors duration-300 ${
                  isScrolled ? "text-stone-700" : "text-stone-800"
                } hover:text-amber-800`}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Elegant Dropdown */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-6 pb-6 border-t border-stone-200/50">
            <div className="flex flex-col space-y-5 pt-6">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm tracking-wide text-stone-700 hover:text-amber-800 transition-colors font-light"
              >
                Home
              </Link>
              <Link
                href="#products"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm tracking-wide text-stone-700 hover:text-amber-800 transition-colors font-light"
              >
                Collection
              </Link>
              <Link
                href="#about"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm tracking-wide text-stone-700 hover:text-amber-800 transition-colors font-light"
              >
                About
              </Link>
              <Link
                href="#contact"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm tracking-wide text-stone-700 hover:text-amber-800 transition-colors font-light"
              >
                Contact
              </Link>
              <Link
                href="/track-order"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm tracking-wide text-stone-700 hover:text-amber-800 transition-colors font-light"
              >
                Track Order
              </Link>
            </div>
          </nav>
        )}
      </div>
      
      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
