"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Mail, MapPin, Phone, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase";
import { toast } from "sonner";

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  phoneNote: string;
}

interface OpeningHours {
  days: string;
  hours: string;
}

export default function Footer() {
  const pathname = usePathname();
  const [contact, setContact] = useState<ContactInfo>({
    address: "Magsaysay Avenue, Naga City 4400",
    phone: "09171271659",
    email: "flowertown1496@gmail.com",
    phoneNote: "TEXT ONLY",
  });
  const [hours, setHours] = useState<OpeningHours>({
    days: "Mon - Sun",
    hours: "9:00 AM - 9:00 PM",
  });
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterName, setNewsletterName] = useState("");
  const [submittingNewsletter, setSubmittingNewsletter] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const supabase = createBrowserClient();
      
      const { data: contactData } = await supabase
        .from("site_content")
        .select("content")
        .eq("section", "contact")
        .single();

      if (contactData?.content) {
        setContact(contactData.content as ContactInfo);
      }

      const { data: hoursData } = await supabase
        .from("site_content")
        .select("content")
        .eq("section", "hours")
        .single();

      if (hoursData?.content) {
        setHours(hoursData.content as OpeningHours);
      }
    } catch (error) {
      // Use default values if fetching fails
      console.error("Error fetching settings:", error);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setSubmittingNewsletter(true);

    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.from("newsletter_subscribers").insert({
        email: newsletterEmail.toLowerCase().trim(),
        name: newsletterName.trim() || null,
        subscribed: true,
      });

      if (error) {
        if (error.code === "23505") { // Unique constraint violation
          toast.error("This email is already subscribed!");
        } else {
          throw error;
        }
      } else {
        toast.success("Thank you for subscribing!");
        setNewsletterEmail("");
        setNewsletterName("");
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setSubmittingNewsletter(false);
    }
  };

  // Hide footer on admin pages
  const isAdminPage = pathname?.startsWith("/admin");
  if (isAdminPage) {
    return null;
  }

  return (
    <footer className="bg-gradient-to-b from-white via-stone-50/50 to-stone-50 border-t border-stone-200/50">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand Section */}
          <div>
            <Link href="/" className="flex flex-col items-start group mb-6">
              <span className="font-serif text-2xl sm:text-3xl text-stone-900 group-hover:text-amber-900 transition-colors duration-500">
                Fleur Finds
              </span>
              <span className="text-[9px] tracking-[0.3em] text-amber-800/60 uppercase mt-2 font-light">Est. 2024</span>
            </Link>
            <p className="text-stone-600 text-sm mb-6 font-light leading-relaxed">
              Exquisitely curated luxury bouquets and bespoke floral arrangements for discerning clientele.
            </p>
            <div className="flex space-x-6">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-500 hover:text-amber-900 transition-colors duration-500"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-500 hover:text-amber-900 transition-colors duration-500"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-6 font-light">Contact</h3>
            <div className="space-y-4">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(contact.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start space-x-3 text-stone-600 hover:text-amber-900 transition-colors duration-500 group"
              >
                <MapPin className="w-4 h-4 flex-shrink-0 mt-1 text-stone-400 group-hover:text-amber-900 transition-colors duration-500" />
                <span className="text-sm font-light leading-relaxed">{contact.address}</span>
              </a>
              <a href={`tel:${contact.phone}`} className="flex items-center space-x-3 text-stone-600 hover:text-amber-900 transition-colors duration-500 group">
                <Phone className="w-4 h-4 flex-shrink-0 text-stone-400 group-hover:text-amber-900 transition-colors duration-500" />
                <span className="text-sm font-light">{contact.phone} {contact.phoneNote && `(${contact.phoneNote})`}</span>
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center space-x-3 text-stone-600 hover:text-amber-900 transition-colors duration-500 group"
              >
                <Mail className="w-4 h-4 flex-shrink-0 text-stone-400 group-hover:text-amber-900 transition-colors duration-500" />
                <span className="text-sm font-light">{contact.email}</span>
              </a>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-6 font-light">Hours</h3>
            <div className="flex items-start space-x-3 text-stone-600 group">
              <Clock className="w-4 h-4 flex-shrink-0 mt-1 text-stone-400" />
              <div className="text-sm font-light leading-relaxed">
                <p className="text-stone-700">{hours.days}</p>
                <p className="text-stone-500">{hours.hours}</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-6 font-light">Newsletter</h3>
            <p className="text-sm text-stone-600 mb-6 font-light leading-relaxed">
              Subscribe for exclusive offers and updates
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input
                type="text"
                value={newsletterName}
                onChange={(e) => setNewsletterName(e.target.value)}
                placeholder="Name (optional)"
                className="w-full px-4 py-3 border border-stone-200 text-sm text-stone-800 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none transition-colors duration-300 font-light"
              />
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 border border-stone-200 text-sm text-stone-800 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none transition-colors duration-300 font-light"
              />
              <button
                type="submit"
                disabled={submittingNewsletter}
                className="w-full bg-stone-900 hover:bg-amber-900 text-white px-6 py-3 text-xs tracking-wider uppercase font-light transition-colors duration-500 disabled:bg-stone-300"
              >
                {submittingNewsletter ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
            <div className="mt-6">
              <Link href="/admin/login" className="text-xs text-stone-400 hover:text-amber-900 transition-colors duration-500 tracking-wide">
                Admin Login
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-stone-200/50 mt-16 sm:mt-20 pt-8 text-center">
          <p className="text-xs text-stone-500 mb-3 font-light">
            Made by:{" "}
            <a 
              href="https://jirehdevportfolio.netlify.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-900 hover:text-amber-700 underline underline-offset-2 transition-colors duration-300"
            >
              jirehdevportfolio.netlify.app
            </a>
          </p>
          <p className="text-xs text-stone-400 tracking-[0.2em] uppercase font-light">
            © {new Date().getFullYear()} Fleur Finds. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
