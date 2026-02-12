"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase";
import { Save, Phone, Mail, MapPin, Clock, Truck } from "lucide-react";

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

interface ShippingSettings {
  defaultFee: number;
  freeShippingLocations: string[];
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
  const [shipping, setShipping] = useState<ShippingSettings>({
    defaultFee: 100,
    freeShippingLocations: ["naga city", "pili, camarines sur"],
  });
  const [newLocation, setNewLocation] = useState("");
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

      // Fetch shipping settings
      const { data: shippingData } = await supabase
        .from("site_content")
        .select("content")
        .eq("section", "shipping")
        .single();

      if (shippingData) {
        setShipping(shippingData.content as ShippingSettings);
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

  const handleSaveShipping = async () => {
    setSaving(true);
    const supabase = createBrowserClient();

    try {
      const { error } = await supabase
        .from("site_content")
        .upsert({
          section: "shipping",
          content: shipping,
        });

      if (error) throw error;
      alert("Shipping settings updated successfully!");
    } catch (error) {
      console.error("Error saving shipping:", error);
      alert("Error saving shipping settings");
    } finally {
      setSaving(false);
    }
  };

  const addLocation = () => {
    if (newLocation.trim()) {
      setShipping({
        ...shipping,
        freeShippingLocations: [...shipping.freeShippingLocations, newLocation.trim().toLowerCase()],
      });
      setNewLocation("");
    }
  };

  const removeLocation = (location: string) => {
    setShipping({
      ...shipping,
      freeShippingLocations: shipping.freeShippingLocations.filter((loc) => loc !== location),
    });
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

      {/* Shipping Settings - Full Width */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <Truck className="w-6 h-6 text-rose-600" />
            <h2 className="text-2xl font-display text-primary-900">Shipping Settings</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Default Shipping Fee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Shipping Fee (₱)
              </label>
              <input
                type="number"
                value={shipping.defaultFee}
                onChange={(e) =>
                  setShipping({ ...shipping, defaultFee: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="100"
                min="0"
                step="10"
              />
              <p className="text-xs text-gray-500 mt-1">
                This fee applies to all locations not listed in free shipping areas
              </p>
            </div>

            {/* Free Shipping Locations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Free Shipping Locations
              </label>
              
              {/* Add Location Input */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addLocation()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="e.g., Manila, Quezon City"
                />
                <button
                  onClick={addLocation}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Add
                </button>
              </div>

              {/* Location List */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {shipping.freeShippingLocations.map((location, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                  >
                    <span className="text-sm text-gray-700 capitalize">{location}</span>
                    <button
                      onClick={() => removeLocation(location)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Customers from these locations get FREE shipping
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-semibold text-blue-800 mb-2">📦 How it works:</p>
            <ul className="text-sm text-blue-700 space-y-1 ml-4 list-disc">
              <li>
                <strong>Free Shipping:</strong> Customers from{" "}
                {shipping.freeShippingLocations.map((loc, i) => (
                  <span key={i}>
                    {i > 0 && (i === shipping.freeShippingLocations.length - 1 ? " and " : ", ")}
                    <span className="capitalize font-medium">{loc}</span>
                  </span>
                ))}
              </li>
              <li>
                <strong>Standard Shipping:</strong> ₱{shipping.defaultFee.toFixed(2)} for all other locations
              </li>
              <li>
                System automatically detects location from delivery address
              </li>
            </ul>
          </div>

          <button
            onClick={handleSaveShipping}
            disabled={saving}
            className="mt-6 w-full bg-rose-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-rose-800 transition disabled:opacity-50"
          >
            <Save size={20} />
            Save Shipping Settings
          </button>
        </div>
      </div>
    </div>
  );
}
