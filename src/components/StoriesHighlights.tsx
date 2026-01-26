"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase";

interface Story {
  id: string;
  title: string;
  cover_image: string;
  order: number;
}

interface StoryItem {
  id: string;
  story_id: string;
  image: string;
  caption: string | null;
  order: number;
}

export default function StoriesHighlights() {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [storyItems, setStoryItems] = useState<StoryItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const supabase = createBrowserClient();

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {
    if (selectedStory) {
      fetchStoryItems(selectedStory.id);
      setCurrentItemIndex(0);
      setProgress(0);
    }
  }, [selectedStory]);

  useEffect(() => {
    if (!selectedStory || storyItems.length === 0) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Move to next item
          if (currentItemIndex < storyItems.length - 1) {
            setCurrentItemIndex((prev) => prev + 1);
            return 0;
          } else {
            // Close story viewer
            setSelectedStory(null);
            return 0;
          }
        }
        return prev + 2; // Increase by 2% every 100ms (5 seconds total)
      });
    }, 100);

    return () => clearInterval(timer);
  }, [selectedStory, currentItemIndex, storyItems.length]);

  const fetchStories = async () => {
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .order("order", { ascending: true });

    if (data) setStories(data);
  };

  const fetchStoryItems = async (storyId: string) => {
    const { data, error } = await supabase
      .from("story_items")
      .select("*")
      .eq("story_id", storyId)
      .order("order", { ascending: true });

    if (data) setStoryItems(data);
  };

  const handlePrevious = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (currentItemIndex < storyItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
      setProgress(0);
    } else {
      setSelectedStory(null);
    }
  };

  return (
    <section className="py-12 bg-gradient-to-b from-white to-primary-50/30">
      <div className="container mx-auto px-4">
        {/* Stories Row */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {stories.map((story, index) => (
            <motion.button
              key={story.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedStory(story)}
              className="flex flex-col items-center flex-shrink-0 group"
            >
              <div className="relative">
                {/* Gradient Ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-accent-500 via-primary-500 to-accent-400 p-[3px] group-hover:scale-110 transition-transform">
                  <div className="bg-white rounded-full p-1">
                    <div className="w-20 h-20 rounded-full overflow-hidden">
                      <img
                        src={story.cover_image}
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <span className="mt-2 text-xs font-medium text-gray-700 max-w-[88px] text-center truncate">
                {story.title}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Story Viewer Modal */}
        <AnimatePresence>
          {selectedStory && storyItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black flex items-center justify-center"
              onClick={() => setSelectedStory(null)}
            >
              {/* Story Container */}
              <div
                className="relative w-full max-w-md h-full md:h-[90vh] md:rounded-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Progress Bars */}
                <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2">
                  {storyItems.map((_, index) => (
                    <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-white"
                        initial={{ width: "0%" }}
                        animate={{
                          width: index === currentItemIndex ? `${progress}%` : index < currentItemIndex ? "100%" : "0%",
                        }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  ))}
                </div>

                {/* Header */}
                <div className="absolute top-4 left-0 right-0 z-20 flex items-center justify-between px-4 mt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                      <img
                        src={selectedStory.cover_image}
                        alt={selectedStory.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-white font-medium">{selectedStory.title}</span>
                  </div>
                  <button
                    onClick={() => setSelectedStory(null)}
                    className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Story Image */}
                <div className="relative w-full h-full">
                  <img
                    src={storyItems[currentItemIndex]?.image}
                    alt={storyItems[currentItemIndex]?.caption || "Story"}
                    className="w-full h-full object-cover"
                  />

                  {/* Caption */}
                  {storyItems[currentItemIndex]?.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                      <p className="text-white text-sm">{storyItems[currentItemIndex].caption}</p>
                    </div>
                  )}

                  {/* Navigation Areas */}
                  <button
                    onClick={handlePrevious}
                    className="absolute left-0 top-0 bottom-0 w-1/3"
                    aria-label="Previous"
                  />
                  <button
                    onClick={handleNext}
                    className="absolute right-0 top-0 bottom-0 w-1/3"
                    aria-label="Next"
                  />
                </div>

                {/* Navigation Buttons (Desktop) */}
                <div className="hidden md:flex absolute inset-y-0 left-0 right-0 items-center justify-between pointer-events-none">
                  <button
                    onClick={handlePrevious}
                    disabled={currentItemIndex === 0}
                    className="pointer-events-auto ml-4 bg-white/20 hover:bg-white/30 disabled:opacity-50 p-2 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="pointer-events-auto mr-4 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
  );
}
