"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase";
import { Save, Phone, Mail, MapPin, Clock } from "lucide-react";

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

export default function SettingsAdmin() {
  const [contact, setContact] = useState<ContactInfo>({
    address: "",
    phone: "",
    email: "",
    phoneNote: "",
  });
  const [hours, setHours] = useState<OpeningHours>({
    days: "",
    hours: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const supabase = createBrowserClient();
      
      // Fetch contact info
      const { data: contactData } = await supabase
        .from("site_content")
        .select("content")
        .eq("section", "contact")
        .single();

      if (contactData) {
        setContact(contactData.content as ContactInfo);
      }

      // Fetch opening hours
      const { data: hoursData } = await supabase
        .from("site_content")
        .select("content")
        .eq("section", "hours")
        .single();

      if (hoursData) {
        setHours(hoursData.content as OpeningHours);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContact = async () => {
    setSaving(true);
    const supabase = createBrowserClient();

    try {
      const { error } = await supabase
        .from("site_content")
        .upsert({
          section: "contact",
          content: contact,
        });

      if (error) throw error;
      alert("Contact information updated successfully!");
    } catch (error) {
      console.error("Error saving contact:", error);
      alert("Error saving contact information");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveHours = async () => {
    setSaving(true);
    const supabase = createBrowserClient();

    try {
      const { error } = await supabase
        .from("site_content")
        .upsert({
          section: "hours",
          content: hours,
        });

      if (error) throw error;
      alert("Opening hours updated successfully!");
    } catch (error) {
      console.error("Error saving hours:", error);
      alert("Error saving opening hours");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-display text-primary-900 mb-8">Site Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <Phone className="w-6 h-6 text-rose-600" />
            <h2 className="text-2xl font-display text-primary-900">Contact Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Address
              </label>
              <input
                type="text"
                value={contact.address}
                onChange={(e) =>
                  setContact({ ...contact, address: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="123 Main Street, City"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                value={contact.phone}
                onChange={(e) =>
                  setContact({ ...contact, phone: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="09171234567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Note
              </label>
              <input
                type="text"
                value={contact.phoneNote}
                onChange={(e) =>
                  setContact({ ...contact, phoneNote: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="TEXT ONLY"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) =>
                  setContact({ ...contact, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="contact@example.com"
              />
            </div>

            <button
              onClick={handleSaveContact}
              disabled={saving}
              className="w-full bg-rose-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-rose-800 transition disabled:opacity-50"
            >
              <Save size={20} />
              Save Contact Info
            </button>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-rose-600" />
            <h2 className="text-2xl font-display text-primary-900">Opening Hours</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Days Open
              </label>
              <input
                type="text"
                value={hours.days}
                onChange={(e) => setHours({ ...hours, days: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Mon - Sun"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Operating Hours
              </label>
              <input
                type="text"
                value={hours.hours}
                onChange={(e) => setHours({ ...hours, hours: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="9:00 AM - 9:00 PM"
              />
            </div>

            <button
              onClick={handleSaveHours}
              disabled={saving}
              className="w-full bg-rose-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-rose-800 transition disabled:opacity-50"
            >
              <Save size={20} />
              Save Opening Hours
            </button>
          </div>

          {/* Preview */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Preview:</p>
            <div className="flex items-start gap-2 text-gray-700">
              <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">{hours.days || "Mon - Sun"}</p>
                <p>{hours.hours || "9:00 AM - 9:00 PM"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
