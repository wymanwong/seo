"use client";

import { useEffect, useRef, useState } from "react";

const MESSAGES = [
  "Reading your website content...",
  "Understanding your brand voice...",
  "Analyzing your target audience...",
  "Finding keyword opportunities...",
  "Calculating traffic potential...",
];

const ANIMATION_DURATION_MS = MESSAGES.length * 1200 + 500;

interface AnalyzingStepProps {
  onComplete: () => void;
}

export function AnalyzingStep({ onComplete }: AnalyzingStepProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => {
        if (prev >= MESSAGES.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      onCompleteRef.current();
    }, ANIMATION_DURATION_MS);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8 text-center">
      <div className="flex justify-center">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-[#E5E5E7]" />
          <div className="absolute inset-0 rounded-full border-4 border-[#5855ff] border-t-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🔍</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#111]">
          Analyzing your website
        </h2>
        <p className="text-[#777] animate-pulse">{MESSAGES[messageIndex]}</p>
      </div>

      <div className="flex justify-center gap-2">
        {MESSAGES.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i <= messageIndex ? "w-8 bg-[#5855ff]" : "w-4 bg-[#E5E5E7]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
