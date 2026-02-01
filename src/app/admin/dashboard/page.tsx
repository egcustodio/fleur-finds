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
  Upload
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
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-display text-gray-900 mb-6">Page Content Editor</h2>
      <p className="text-gray-600">Edit homepage sections, about text, contact information, and more...</p>
      {/* Add your content editing interface here */}
    </div>
  );
}

// Settings Manager Component
function SettingsManager() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-display text-gray-900 mb-6">Website Settings</h2>
      <p className="text-gray-600">Configure site-wide settings, SEO, social media links...</p>
      {/* Add your settings interface here */}
    </div>
  );
}
