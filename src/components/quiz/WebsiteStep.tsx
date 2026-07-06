"use client";

import { Button } from "@/components/ui/Button";
import { isValidUrl } from "@/lib/utils";

interface WebsiteStepProps {
  url: string;
  onUrlChange: (url: string) => void;
  onSubmit: (url: string) => void;
  error?: string;
  loading?: boolean;
}

export function WebsiteStep({
  url,
  onUrlChange,
  onSubmit,
  error,
  loading,
}: WebsiteStepProps) {
  const valid = isValidUrl(url);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (valid && !loading) {
      onSubmit(url.trim());
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#111]">
          What&apos;s your website?
        </h2>
        <p className="text-[#777]">
          Enter your URL and we&apos;ll analyze your business
        </p>
      </div>

      <div className="flex justify-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#5855ff]/10 to-[#8b3dff]/10 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-[#5855ff]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-[#E5E5E7] shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="yourwebsite.com"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            disabled={loading}
            className="w-full h-12 px-4 text-center rounded-xl border border-[#E5E5E7] bg-[#F9F9F9] focus:outline-none focus:border-[#5855ff] focus:ring-1 focus:ring-[#5855ff] transition-colors text-[#111] disabled:opacity-60"
            autoFocus
          />
          {!valid && url.trim().length > 0 && (
            <p className="text-amber-600 text-sm text-center">
              Enter a valid URL like yoursite.com
            </p>
          )}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <Button
            type="submit"
            className="w-full !py-3.5"
            disabled={!valid || loading}
            onClick={(e) => {
              if (!valid || loading) {
                e.preventDefault();
              }
            }}
          >
            {loading ? "Starting analysis..." : "Continue"}
          </Button>
        </form>
      </div>
    </div>
  );
}
