"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  FileText, 
  Settings, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Upload,
  ShoppingBag,
  Tag,
  Package,
  Star,
  MessageSquare,
  Mail
} from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("stories");
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient();

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    const { data } = await supabase
      .from("stories")
      .select("*")
      .order("order", { ascending: true });
    
    if (data) setStories(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl text-primary-900 font-light tracking-wider">Fleur Finds Admin</h1>
              <p className="text-xs text-gray-500 tracking-wide">Content Management System</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => router.push("/admin/products")}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-100 text-gray-700"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className="font-medium">Products</span>
                </button>
                <button
                  onClick={() => router.push("/admin/orders")}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-100 text-gray-700"
                >
                  <Package className="w-5 h-5" />
                  <span className="font-medium">Orders</span>
                </button>
                <button
                  onClick={() => router.push("/admin/promos")}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-100 text-gray-700"
                >
                  <Tag className="w-5 h-5" />
                  <span className="font-medium">Promotions</span>
                </button>
                <button
                  onClick={() => router.push("/admin/reviews")}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-100 text-gray-700"
                >
                  <Star className="w-5 h-5" />
                  <span className="font-medium">Reviews</span>
                </button>
                <button
                  onClick={() => router.push("/admin/inquiries")}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-100 text-gray-700"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="font-medium">Contact Inquiries</span>
                </button>
                <button
                  onClick={() => router.push("/admin/newsletter")}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-100 text-gray-700"
                >
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">Newsletter</span>
                </button>
                <button
                  onClick={() => router.push("/admin/settings")}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-100 text-gray-700"
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Site Settings</span>
                </button>
                <button
                  onClick={() => setActiveTab("stories")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "stories"
                      ? "bg-primary-100 text-primary-700"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <ImageIcon className="w-5 h-5" />
                  <span className="font-medium">Stories</span>
                </button>
                <button
                  onClick={() => setActiveTab("content")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "content"
                      ? "bg-primary-100 text-primary-700"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Page Content</span>
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "settings"
                      ? "bg-primary-100 text-primary-700"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "stories" && <StoriesManager stories={stories} fetchStories={fetchStories} />}
            {activeTab === "content" && <ContentManager />}
            {activeTab === "settings" && <SettingsManager />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Stories Manager Component
function StoriesManager({ stories, fetchStories }: any) {
  const [showAddModal, setShowAddModal] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display text-gray-900">Instagram Stories</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Story</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stories.map((story: any) => (
          <div key={story.id} className="group relative">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={story.cover_image}
                alt={story.title}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-2 text-sm font-medium text-gray-900 text-center">{story.title}</p>
            
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
              <button className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100">
                <Edit className="w-4 h-4 text-gray-700" />
              </button>
              <button className="bg-white p-2 rounded-full shadow-lg hover:bg-red-50">
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Content Manager Component
function ContentManager() {
  const supabase = createBrowserClient();
  const [loading, setLoading] = useState(false);
  const [heroContent, setHeroContent] = useState({
    title: "Exquisite Florals",
    subtitle: "Curated with care, delivered with elegance",
    tagline: "Est. 2024"
  });
  const [aboutContent, setAboutContent] = useState({
    title: "The Art of Floral Curation",
    description1: "At Fleur Finds, we believe in the transformative power of exceptional florals.",
    description2: "Our bespoke service caters to discerning clients who appreciate refined aesthetics."
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      // Fetch hero content
      const { data: heroData } = await supabase
        .from("site_content")
        .select("content")
        .eq("section", "hero")
        .single();

      if (heroData?.content) {
        setHeroContent(heroData.content);
      }

      // Fetch about content
      const { data: aboutData } = await supabase
        .from("site_content")
        .select("content")
        .eq("section", "about")
        .single();

      if (aboutData?.content) {
        setAboutContent(aboutData.content);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  const saveHeroContent = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("site_content")
        .upsert({
          section: "hero",
          content: heroContent
        });

      if (error) throw error;
      toast.success("Hero content saved successfully!");
    } catch (error) {
      console.error("Error saving hero content:", error);
      toast.error("Failed to save hero content");
    } finally {
      setLoading(false);
    }
  };

  const saveAboutContent = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("site_content")
        .upsert({
          section: "about",
          content: aboutContent
        });

      if (error) throw error;
      toast.success("About content saved successfully!");
    } catch (error) {
      console.error("Error saving about content:", error);
      toast.error("Failed to save about content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section Editor */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-serif text-stone-900 mb-6">Hero Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Main Title
            </label>
            <input
              type="text"
              value={heroContent.title}
              onChange={(e) => setHeroContent({ ...heroContent, title: e.target.value })}
              className="w-full px-4 py-3 border border-stone-200 text-stone-800 focus:border-stone-400 focus:outline-none transition-colors duration-300"
              placeholder="Exquisite Florals"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={heroContent.subtitle}
              onChange={(e) => setHeroContent({ ...heroContent, subtitle: e.target.value })}
              className="w-full px-4 py-3 border border-stone-200 text-stone-800 focus:border-stone-400 focus:outline-none transition-colors duration-300"
              placeholder="Curated with care..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Tagline
            </label>
            <input
              type="text"
              value={heroContent.tagline}
              onChange={(e) => setHeroContent({ ...heroContent, tagline: e.target.value })}
              className="w-full px-4 py-3 border border-stone-200 text-stone-800 focus:border-stone-400 focus:outline-none transition-colors duration-300"
              placeholder="Est. 2024"
            />
          </div>

          <button
            onClick={saveHeroContent}
            disabled={loading}
            className="bg-stone-900 hover:bg-amber-900 text-white px-6 py-3 text-sm tracking-wider uppercase font-light transition-colors duration-300 disabled:bg-stone-300"
          >
            {loading ? "Saving..." : "Save Hero Content"}
          </button>
        </div>
      </div>

      {/* About Section Editor */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-serif text-stone-900 mb-6">About Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Section Title
            </label>
            <input
              type="text"
              value={aboutContent.title}
              onChange={(e) => setAboutContent({ ...aboutContent, title: e.target.value })}
              className="w-full px-4 py-3 border border-stone-200 text-stone-800 focus:border-stone-400 focus:outline-none transition-colors duration-300"
              placeholder="The Art of Floral Curation"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              First Paragraph
            </label>
            <textarea
              value={aboutContent.description1}
              onChange={(e) => setAboutContent({ ...aboutContent, description1: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-stone-200 text-stone-800 focus:border-stone-400 focus:outline-none transition-colors duration-300 resize-none"
              placeholder="At Fleur Finds..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Second Paragraph
            </label>
            <textarea
              value={aboutContent.description2}
              onChange={(e) => setAboutContent({ ...aboutContent, description2: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-stone-200 text-stone-800 focus:border-stone-400 focus:outline-none transition-colors duration-300 resize-none"
              placeholder="Our bespoke service..."
            />
          </div>

          <button
            onClick={saveAboutContent}
            disabled={loading}
            className="bg-stone-900 hover:bg-amber-900 text-white px-6 py-3 text-sm tracking-wider uppercase font-light transition-colors duration-300 disabled:bg-stone-300"
          >
            {loading ? "Saving..." : "Save About Content"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Settings Manager Component
function SettingsManager() {
  const supabase = createBrowserClient();
  const [loading, setLoading] = useState(false);
  const [seoSettings, setSeoSettings] = useState({
    siteTitle: "Fleur Finds - Luxury Flower Bouquets",
    siteDescription: "Exquisitely curated luxury flower bouquets and bespoke floral arrangements.",
    keywords: "luxury flowers, premium bouquet, bespoke floral arrangements"
  });
  const [socialMedia, setSocialMedia] = useState({
    facebook: "https://www.facebook.com",
    instagram: "https://www.instagram.com",
    email: "flowertown1496@gmail.com"
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Fetch SEO settings
      const { data: seoData } = await supabase
        .from("site_content")
        .select("content")
        .eq("section", "seo")
        .single();

      if (seoData?.content) {
        setSeoSettings(seoData.content);
      }

      // Fetch social media
      const { data: socialData } = await supabase
        .from("site_content")
        .select("content")
        .eq("section", "social_media")
        .single();

      if (socialData?.content) {
        setSocialMedia(socialData.content);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const saveSeoSettings = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("site_content")
        .upsert({
          section: "seo",
          content: seoSettings
        });

      if (error) throw error;
      toast.success("SEO settings saved successfully!");
    } catch (error) {
      console.error("Error saving SEO settings:", error);
      toast.error("Failed to save SEO settings");
    } finally {
      setLoading(false);
    }
  };

  const saveSocialMedia = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("site_content")
        .upsert({
          section: "social_media",
          content: socialMedia
        });

      if (error) throw error;
      toast.success("Social media links saved successfully!");
    } catch (error) {
      console.error("Error saving social media:", error);
      toast.error("Failed to save social media links");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* SEO Settings */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-serif text-stone-900 mb-6">SEO Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Site Title
            </label>
            <input
              type="text"
              value={seoSettings.siteTitle}
              onChange={(e) => setSeoSettings({ ...seoSettings, siteTitle: e.target.value })}
              className="w-full px-4 py-3 border border-stone-200 text-stone-800 focus:border-stone-400 focus:outline-none transition-colors duration-300"
              placeholder="Fleur Finds - Luxury Flower Bouquets"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Meta Description
            </label>
            <textarea
              value={seoSettings.siteDescription}
              onChange={(e) => setSeoSettings({ ...seoSettings, siteDescription: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-stone-200 text-stone-800 focus:border-stone-400 focus:outline-none transition-colors duration-300 resize-none"
              placeholder="Exquisitely curated luxury flower bouquets..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Keywords (comma-separated)
            </label>
            <input
              type="text"
              value={seoSettings.keywords}
              onChange={(e) => setSeoSettings({ ...seoSettings, keywords: e.target.value })}
              className="w-full px-4 py-3 border border-stone-200 text-stone-800 focus:border-stone-400 focus:outline-none transition-colors duration-300"
              placeholder="luxury flowers, premium bouquet..."
            />
          </div>

          <button
            onClick={saveSeoSettings}
            disabled={loading}
            className="bg-stone-900 hover:bg-amber-900 text-white px-6 py-3 text-sm tracking-wider uppercase font-light transition-colors duration-300 disabled:bg-stone-300"
          >
            {loading ? "Saving..." : "Save SEO Settings"}
          </button>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-serif text-stone-900 mb-6">Social Media Links</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Facebook URL
            </label>
            <input
              type="url"
              value={socialMedia.facebook}
              onChange={(e) => setSocialMedia({ ...socialMedia, facebook: e.target.value })}
              className="w-full px-4 py-3 border border-stone-200 text-stone-800 focus:border-stone-400 focus:outline-none transition-colors duration-300"
              placeholder="https://www.facebook.com/yourpage"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Instagram URL
            </label>
            <input
              type="url"
              value={socialMedia.instagram}
              onChange={(e) => setSocialMedia({ ...socialMedia, instagram: e.target.value })}
              className="w-full px-4 py-3 border border-stone-200 text-stone-800 focus:border-stone-400 focus:outline-none transition-colors duration-300"
              placeholder="https://www.instagram.com/yourprofile"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              value={socialMedia.email}
              onChange={(e) => setSocialMedia({ ...socialMedia, email: e.target.value })}
              className="w-full px-4 py-3 border border-stone-200 text-stone-800 focus:border-stone-400 focus:outline-none transition-colors duration-300"
              placeholder="contact@yoursite.com"
            />
          </div>

          <button
            onClick={saveSocialMedia}
            disabled={loading}
            className="bg-stone-900 hover:bg-amber-900 text-white px-6 py-3 text-sm tracking-wider uppercase font-light transition-colors duration-300 disabled:bg-stone-300"
          >
            {loading ? "Saving..." : "Save Social Media"}
          </button>
        </div>
      </div>
    </div>
  );
}
