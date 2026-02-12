"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, LogOut } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backTo?: string;
}

export default function AdminHeader({ 
  title, 
  subtitle, 
  showBackButton = true,
  backTo = "/admin/dashboard"
}: AdminHeaderProps) {
  const router = useRouter();
  const supabase = createBrowserClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const handleBack = () => {
    router.push(backTo);
  };

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-stone-600 hover:text-amber-900 transition-colors duration-300 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="text-sm font-light">Back</span>
              </button>
            )}
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 tracking-tight">{title}</h1>
              {subtitle && (
                <p className="text-xs tracking-wider text-stone-500 uppercase mt-1 font-light">{subtitle}</p>
              )}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-stone-600 hover:text-red-600 transition-colors duration-300"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-light">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
