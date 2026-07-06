"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface EmailStepProps {
  onSubmit: (email: string) => void;
  error?: string;
  loading?: boolean;
}

export function EmailStep({ onSubmit, error, loading }: EmailStepProps) {
  const [email, setEmail] = useState("");

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onSubmit(email);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#111]">
          Where should we send your results?
        </h2>
        <p className="text-[#777]">
          We&apos;ll send your SEO score review to this email. You can
          unsubscribe anytime.
        </p>
      </div>

      <div className="rounded-2xl bg-white border border-[#E5E5E7] shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 px-4 text-center rounded-xl border border-[#E5E5E7] bg-[#F9F9F9] focus:outline-none focus:border-[#5855ff] focus:ring-1 focus:ring-[#5855ff] transition-colors text-[#111]"
            autoFocus
          />
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <Button
            type="submit"
            className="w-full !py-3.5"
            disabled={!isValid || loading}
          >
            {loading ? "Saving..." : "See my results"}
          </Button>
        </form>
      </div>
    </div>
  );
}
