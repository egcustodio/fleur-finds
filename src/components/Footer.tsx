"use client";

import Link from "next/link";
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

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <Link href="/" className="flex flex-col items-start group mb-4">
              <span className="font-display text-2xl font-light tracking-wider text-primary-800 group-hover:text-primary-700 transition-colors">
                Fleur Finds
              </span>
              <span className="text-[9px] tracking-[0.2em] text-rose-500 uppercase mt-1 font-light italic">Perfect for hearts that speak without words</span>
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
                href={`https://maps.google.com/?q=${encodeURIComponent(contact.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{contact.address}</span>
              </a>
              <a href={`tel:${contact.phone}`} className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{contact.phone} {contact.phoneNote && `(${contact.phoneNote})`}</span>
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{contact.email}</span>
              </a>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Opening Hours</h3>
            <div className="flex items-start space-x-2 text-gray-600">
              <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">{hours.days}</p>
                <p>{hours.hours}</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Newsletter</h3>
            <p className="text-sm text-gray-600 mb-4">
              Subscribe for exclusive offers and updates
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <input
                type="text"
                value={newsletterName}
                onChange={(e) => setNewsletterName(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
              <button
                type="submit"
                disabled={submittingNewsletter}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:bg-gray-400"
              >
                {submittingNewsletter ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
            <div className="mt-4 space-y-1">
              <Link href="/admin/login" className="block text-xs text-gray-500 hover:text-rose-600 transition-colors">
                Admin Login
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
