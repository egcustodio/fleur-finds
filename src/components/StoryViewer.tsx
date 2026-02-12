"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Story {
  id: string;
  title: string;
  cover_image: string | null;
}

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

export default function StoryViewer({ stories, initialIndex, onClose }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const STORY_DURATION = 5000; // 5 seconds per story

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Auto-advance to next story
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1);
            return 0;
          } else {
            // Close viewer after last story
            onClose();
            return 100;
          }
        }
        return prev + (100 / (STORY_DURATION / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, stories.length, onClose]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrevious();
    if (e.key === "ArrowRight") handleNext();
    if (e.key === "Escape") onClose();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  const currentStory = stories[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-[99999] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Progress Bars */}
      <div className="absolute top-4 left-0 right-0 flex gap-1 px-4 z-10">
        {stories.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-100"
              style={{
                width: index < currentIndex ? "100%" : index === currentIndex ? `${progress}%` : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white hover:text-stone-300 transition-colors"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Story Title */}
      <div className="absolute top-12 left-4 right-4 z-10">
        <h2 className="text-white text-lg font-light tracking-wider drop-shadow-lg">
          {currentStory.title}
        </h2>
      </div>

      {/* Navigation Areas */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1/3 cursor-pointer z-10"
        onClick={(e) => {
          e.stopPropagation();
          handlePrevious();
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {currentIndex > 0 && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors">
            <ChevronLeft className="w-12 h-12" />
          </div>
        )}
      </div>

      <div
        className="absolute right-0 top-0 bottom-0 w-1/3 cursor-pointer z-10"
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {currentIndex < stories.length - 1 && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors">
            <ChevronRight className="w-12 h-12" />
          </div>
        )}
      </div>

      {/* Story Image - Portrait Mode */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full max-w-[500px] max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {currentStory.cover_image ? (
            <Image
              src={currentStory.cover_image}
              alt={currentStory.title}
              fill
              className="object-contain"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-800 to-amber-900">
              <span className="text-9xl">🌸</span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Story Counter */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/70 text-sm">
        {currentIndex + 1} / {stories.length}
      </div>
    </motion.div>
  );
}
