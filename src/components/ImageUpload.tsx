"use client";

import { useState } from "react";
import { createBrowserClient } from "@/lib/supabase";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  currentImage?: string;
  folder?: string;
}

export default function ImageUpload({ onUploadComplete, currentImage, folder = "products" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(currentImage || "");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      const supabase = createBrowserClient();
      
      // Create unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("flowers")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("flowers")
        .getPublicUrl(fileName);

      setPreview(publicUrl);
      onUploadComplete(publicUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onUploadComplete("");
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Image
      </label>

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
          <label
            htmlFor="image-upload"
            className={`cursor-pointer flex flex-col items-center ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {uploading ? (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            ) : (
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
            )}
            <span className="text-sm text-gray-600">
              {uploading ? "Uploading..." : "Click to upload image"}
            </span>
            <span className="text-xs text-gray-400 mt-2">
              PNG, JPG, GIF up to 5MB
            </span>
          </label>
        </div>
      )}

      {/* URL Input Fallback */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">
          Or paste image URL:
        </label>
        <input
          type="url"
          value={preview}
          onChange={(e) => {
            setPreview(e.target.value);
            onUploadComplete(e.target.value);
          }}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        />
      </div>
    </div>
  );
}
