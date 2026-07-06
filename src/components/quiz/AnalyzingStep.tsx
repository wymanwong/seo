"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

const MESSAGES = [
  "Reading your website content...",
  "Understanding your brand voice...",
  "Analyzing your target audience...",
  "Finding keyword opportunities...",
  "Calculating traffic potential...",
];

const MIN_ANIMATION_MS = 2500;

interface AnalyzingStepProps {
  onComplete: () => void;
  analysisReady?: boolean;
  error?: string;
  onRetry?: () => void;
}

export function AnalyzingStep({
  onComplete,
  analysisReady = false,
  error,
  onRetry,
}: AnalyzingStepProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => Math.min(prev + 1, MESSAGES.length - 1));
    }, 900);

    const minTimer = setTimeout(() => setMinTimeElapsed(true), MIN_ANIMATION_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(minTimer);
    };
  }, []);

  useEffect(() => {
    if (minTimeElapsed && analysisReady) {
      onCompleteRef.current();
    }
  }, [minTimeElapsed, analysisReady]);

  if (error) {
    return (
      <div className="space-y-6 text-center">
        <div className="text-4xl">😅</div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[#111]">
            Couldn&apos;t analyze that website
          </h2>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
        <Button onClick={onRetry} className="w-full !py-3.5">
          Try again
        </Button>
      </div>
    );
  }

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
        {analysisReady && !minTimeElapsed && (
          <p className="text-sm text-[#5855ff]">Almost done...</p>
        )}
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
