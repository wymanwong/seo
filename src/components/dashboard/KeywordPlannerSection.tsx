"use client";

import { useState } from "react";
import type { SeoAnalysis } from "@/lib/types";
import { buildKeywordPlannerUrl } from "@/lib/gsc-types";
import { formatNumber } from "@/lib/utils";

const MANUAL_VOLUMES_KEY = "seo_manual_keyword_volumes";

function loadManualVolumes(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(MANUAL_VOLUMES_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveManualVolume(keyword: string, volume: number) {
  const all = loadManualVolumes();
  all[keyword] = volume;
  localStorage.setItem(MANUAL_VOLUMES_KEY, JSON.stringify(all));
}

interface Props {
  data: SeoAnalysis;
}

export function KeywordPlannerSection({ data }: Props) {
  const [manual, setManual] = useState<Record<string, number>>(() => loadManualVolumes());
  const [copied, setCopied] = useState(false);

  const keywordList = data.keywords.map((k) => k.keyword).join("\n");

  const copyKeywords = async () => {
    await navigator.clipboard.writeText(keywordList);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 space-y-4">
      <div>
        <h3 className="font-semibold text-blue-900">Get real search volumes (free)</h3>
        <p className="text-sm text-blue-800 mt-1">
          Volumes below marked <span className="font-medium">Est.</span> are guesses. For real
          numbers, use Google Keyword Planner (free with a Google Ads account — no ad spend
          required).
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void copyKeywords()}
          className="px-4 py-2 rounded-lg bg-white border border-blue-200 text-sm font-medium text-blue-900 hover:bg-blue-100"
        >
          {copied ? "Copied!" : "Copy keywords to clipboard"}
        </button>
        <a
          href={buildKeywordPlannerUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg bg-[#5855ff] text-white text-sm font-medium hover:opacity-90"
        >
          Open Google Keyword Planner →
        </a>
      </div>

      <p className="text-xs text-blue-700">
        Paste the copied keywords into Keyword Planner → paste the real monthly volume back in the
        table below (saved in your browser).
      </p>

      <div className="rounded-xl border border-blue-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-blue-100 bg-[#FAFAFA]">
              <th className="text-left p-3 font-medium">Keyword</th>
              <th className="text-left p-3 font-medium">Est. volume</th>
              <th className="text-left p-3 font-medium">Real volume (you enter)</th>
            </tr>
          </thead>
          <tbody>
            {data.keywords.slice(0, 10).map((kw) => (
              <tr key={kw.keyword} className="border-b border-[#F0F0F0]">
                <td className="p-3 font-medium">{kw.keyword}</td>
                <td className="p-3 text-[#999]">
                  {formatNumber(kw.volume)}/mo <span className="text-xs">(Est.)</span>
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    placeholder="e.g. 2900"
                    value={manual[kw.keyword] ?? ""}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val > 0) {
                        saveManualVolume(kw.keyword, val);
                        setManual({ ...manual, [kw.keyword]: val });
                      }
                    }}
                    className="w-28 h-8 px-2 rounded border border-[#E5E5E7] text-sm focus:outline-none focus:border-[#5855ff]"
                  />
                  {manual[kw.keyword] ? (
                    <span className="ml-2 text-xs text-green-700 font-medium">/mo real</span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
