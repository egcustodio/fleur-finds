"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";

interface CartIconProps {
  onClick: () => void;
}

export default function CartIcon({ onClick }: CartIconProps) {
  const { cartCount } = useCart();

  return (
    <button
      onClick={onClick}
      className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group"
      aria-label="Shopping cart"
    >
      <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-primary-600 transition-colors" />
      
      {cartCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
        >
          {cartCount > 99 ? "99+" : cartCount}
        </motion.span>
      )}
    </button>
  );
}
