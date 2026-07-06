"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { SeoAnalysis } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface ResultsStepProps {
  analysis: SeoAnalysis;
  email: string;
}

function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="#E5E5E7"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-[#111]">{score}</span>
        <span className="text-xs text-[#777]">SEO Score</span>
      </div>
    </div>
  );
}

export function ResultsStep({ analysis, email }: ResultsStepProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Analysis complete
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#111]">
          Ready to grow traffic
        </h2>
        <p className="text-[#777]">
          Results sent to <span className="font-medium text-[#111]">{email}</span>
        </p>
      </div>

      <div className="rounded-2xl bg-white border border-[#E5E5E7] shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#F9F9F9] border border-[#E5E5E7] flex items-center justify-center text-lg">
            🌐
          </div>
          <div>
            <div className="text-sm text-[#777]">Your Website</div>
            <div className="font-semibold text-[#111]">{analysis.domain}</div>
          </div>
        </div>

        <ScoreRing score={analysis.seoScore} />

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#F9F9F9] border border-[#E5E5E7]">
            <div className="text-sm text-[#777]">Potential traffic boost</div>
            <div className="text-2xl font-bold text-green-600">
              {analysis.trafficPotential.boost}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#F9F9F9] border border-[#E5E5E7]">
            <div className="text-sm text-[#777]">Monthly search volume</div>
            <div className="text-2xl font-bold text-[#5855ff]">
              {formatNumber(analysis.trafficPotential.monthly)}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-[#E5E5E7] shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-[#F9F9F9] transition-colors"
        >
          <span className="font-semibold text-[#111]">View full analysis</span>
          <svg
            className={`w-5 h-5 text-[#777] transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expanded && (
          <div className="border-t border-[#E5E5E7] p-4 space-y-6">
            <section>
              <h3 className="font-semibold text-[#111] mb-3">Brand (what we know about you)</h3>
              <div className="grid gap-3">
                <div className="p-3 rounded-xl bg-[#F9F9F9]">
                  <div className="text-xs text-[#777]">Brand Name</div>
                  <div className="text-sm font-medium">{analysis.brand.name}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#F9F9F9]">
                  <div className="text-xs text-[#777]">Tone & Voice</div>
                  <div className="text-sm font-medium">{analysis.brand.tone}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#F9F9F9]">
                  <div className="text-xs text-[#777]">Target Audience</div>
                  <div className="text-sm font-medium">{analysis.brand.audience}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#F9F9F9]">
                  <div className="text-xs text-[#777]">Niche</div>
                  <div className="text-sm font-medium">{analysis.brand.niche}</div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-[#111] mb-3">
                Content ideas (what we will write)
              </h3>
              <div className="space-y-2">
                {analysis.contentIdeas.map((idea, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl border border-[#E5E5E7] flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="text-sm font-medium text-[#111]">{idea.title}</div>
                      <div className="text-xs text-[#777] mt-1">Target: {idea.keyword}</div>
                    </div>
                    <div className="shrink-0 px-2 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-medium">
                      {idea.score}/100
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-[#111] mb-3">Keyword opportunities</h3>
              <div className="space-y-2">
                {analysis.keywords.slice(0, 6).map((kw, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl border border-[#E5E5E7] flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-medium text-[#111]">{kw.keyword}</div>
                      <div className="text-xs text-[#777]">{kw.intent} · {kw.difficulty} difficulty</div>
                    </div>
                    <div className="text-sm font-medium text-[#5855ff]">
                      {formatNumber(kw.volume)}/mo
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-[#111] mb-3">Technical SEO checks</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Title tag", ok: !!analysis.title },
                  { label: "Meta description", ok: analysis.hasMetaDescription },
                  { label: "H1 heading", ok: !!analysis.h1 },
                  { label: "Open Graph tags", ok: analysis.hasOgTags },
                  { label: "Canonical URL", ok: analysis.hasCanonical },
                  { label: "Content depth", ok: analysis.wordCount > 300 },
                ].map((check) => (
                  <div
                    key={check.label}
                    className={`p-2 rounded-lg text-sm flex items-center gap-2 ${
                      check.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    }`}
                  >
                    {check.ok ? "✓" : "✗"} {check.label}
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button href="/quiz" variant="secondary" className="flex-1">
          Try a different website
        </Button>
        <Button href="/pricing" className="flex-1">
          Continue to pricing
        </Button>
      </div>
    </div>
  );
}
