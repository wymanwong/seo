"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { LANGUAGES } from "@/lib/languages";

interface LanguageStepProps {
  onSubmit: (language: string) => void;
}

export function LanguageStep({ onSubmit }: LanguageStepProps) {
  const [selected, setSelected] = useState("en");
  const [search, setSearch] = useState("");

  const filtered = LANGUAGES.filter(
    (lang) =>
      lang.name.toLowerCase().includes(search.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#111]">
          What language should we write in?
        </h2>
        <p className="text-[#777]">
          Choose the language for your SEO content
        </p>
      </div>

      <div className="rounded-2xl bg-white border border-[#E5E5E7] shadow-sm p-4 sm:p-6 space-y-4">
        <input
          type="text"
          placeholder="Search language..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 px-4 rounded-xl border border-[#E5E5E7] bg-[#F9F9F9] focus:outline-none focus:border-[#5855ff] focus:ring-1 focus:ring-[#5855ff] text-[#111]"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
          {filtered.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setSelected(lang.code)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selected === lang.code
                  ? "border-[#5855ff] bg-[#5855ff]/5 ring-1 ring-[#5855ff]"
                  : "border-[#E5E5E7] hover:border-[#5855ff]/50"
              }`}
            >
              <div className="font-medium text-sm text-[#111]">{lang.name}</div>
              <div className="text-xs text-[#777]">{lang.nativeName}</div>
            </button>
          ))}
        </div>

        <Button onClick={() => onSubmit(selected)} className="w-full !py-3.5">
          Continue
        </Button>
      </div>
    </div>
  );
}
