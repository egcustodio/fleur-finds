"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@/lib/supabase";
import StoryViewer from "./StoryViewer";
import Image from "next/image";

interface Story {
  id: string;
  title: string;
  cover_image: string | null;
  order: number;
}

export default function StoriesHighlights() {
  const [stories, setStories] = useState<Story[]>([]);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const supabase = createBrowserClient();

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .order("order", { ascending: true });

    if (data) setStories(data);
  };

  const handleStoryClick = (index: number) => {
    setInitialIndex(index);
    setViewerOpen(true);
  };

  if (stories.length === 0) return null;

  return (
    <>
      <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-stone-50/30">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Stories Row */}
            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {stories.map((story, index) => (
                <button
                  key={story.id}
                  onClick={() => handleStoryClick(index)}
                  className="flex flex-col items-center flex-shrink-0 group cursor-pointer"
                >
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28">
                    {/* Gradient Ring */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 via-amber-600 to-amber-400 p-[2.5px] group-hover:scale-105 transition-transform">
                      <div className="w-full h-full bg-white rounded-full p-[3px]">
                        <div className="w-full h-full rounded-full overflow-hidden bg-stone-100 relative">
                          {story.cover_image ? (
                            <Image
                              src={story.cover_image}
                              alt={story.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-100 to-amber-100">
                              <span className="text-2xl">🌸</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="mt-2 text-xs font-light text-stone-700 max-w-[100px] text-center truncate">
                    {story.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </section>

      {/* Story Viewer */}
      {viewerOpen && (
        <StoryViewer
          stories={stories}
          initialIndex={initialIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </>
  );
}
