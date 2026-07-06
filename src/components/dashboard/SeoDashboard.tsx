"use client";

import { useCallback, useEffect, useState } from "react";
import type { SeoAnalysis } from "@/lib/types";
import { DEFAULT_SITE_URL, SITE_NAME } from "@/lib/site-config";
import { formatNumber, isValidUrl, normalizeUrl, sanitizeUrlInput } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

import { FeaturePillars } from "./FeaturePillars";
import { PublishingTab } from "./PublishingTab";

type Tab = "overview" | "publishing" | "keywords" | "content" | "technical" | "issues";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "publishing", label: "Daily Publishing" },
  { id: "keywords", label: "Keyword Research" },
  { id: "content", label: "Content Plan" },
  { id: "technical", label: "Technical SEO" },
  { id: "issues", label: "Issues & Fixes" },
];

const STORAGE_KEY = "seo_analysis_cache";

function ScoreRing({ score }: { score: number }) {
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#E5E5E7" strokeWidth="8" />
        <circle
          cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{score}</span>
        <span className="text-xs text-[#777]">SEO Score</span>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="p-4 rounded-xl bg-white border border-[#E5E5E7]">
      <div className="text-sm text-[#777]">{label}</div>
      <div className="text-2xl font-bold text-[#111] mt-1">{value}</div>
      {sub && <div className="text-xs text-[#999] mt-1">{sub}</div>}
    </div>
  );
}

function DifficultyBadge({ d }: { d: string }) {
  const colors: Record<string, string> = {
    low: "bg-green-50 text-green-700",
    medium: "bg-amber-50 text-amber-700",
    high: "bg-red-50 text-red-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[d] ?? ""}`}>
      {d}
    </span>
  );
}

function OverviewTab({ data }: { data: SeoAnalysis }) {
  return (
    <div className="space-y-8">
      <FeaturePillars data={data} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="SEO Score" value={`${data.seoScore}/100`} />
        <StatCard label="Monthly search volume" value={formatNumber(data.trafficPotential.monthly)} sub="across target keywords" />
        <StatCard label="Traffic potential" value={data.trafficPotential.boost} sub="estimated growth" />
        <StatCard label="Content ideas" value={String(data.contentIdeas.length)} sub="articles to write" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-[#E5E5E7] space-y-4">
          <h3 className="font-semibold text-lg">Site snapshot</h3>
          <dl className="space-y-3 text-sm">
            {[
              ["URL", data.url],
              ["Title", data.title ?? "—"],
              ["Meta description", data.description ?? "—"],
              ["H1", data.h1 ?? "—"],
              ["Word count", String(data.wordCount)],
              ["Niche", data.brand.niche],
              ["Last analyzed", new Date(data.analyzedAt).toLocaleString()],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-3 gap-2">
                <dt className="text-[#777]">{k}</dt>
                <dd className="col-span-2 text-[#111] break-words">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E5E5E7] space-y-4">
          <h3 className="font-semibold text-lg">Top recommendations</h3>
          <div className="space-y-3">
            {data.recommendations.slice(0, 5).map((r) => (
              <div key={r.id} className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E5E7]">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    r.impact === "high" ? "bg-red-50 text-red-700" :
                    r.impact === "medium" ? "bg-amber-50 text-amber-700" :
                    "bg-blue-50 text-blue-700"
                  }`}>{r.impact} impact</span>
                  <span className="text-xs text-[#999]">{r.category}</span>
                </div>
                <div className="font-medium text-sm">{r.title}</div>
                <p className="text-xs text-[#777] mt-1">{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {data.headings.length > 0 && (
        <div className="p-6 rounded-2xl bg-white border border-[#E5E5E7]">
          <h3 className="font-semibold text-lg mb-3">Page headings found</h3>
          <ul className="space-y-1">
            {data.headings.map((h, i) => (
              <li key={i} className="text-sm text-[#555] flex items-start gap-2">
                <span className="text-[#999] shrink-0">H{i < 2 ? "2" : "3"}</span>
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function KeywordsTab({ data }: { data: SeoAnalysis }) {
  const stageColors: Record<string, string> = {
    awareness: "bg-blue-50 text-blue-700",
    consideration: "bg-amber-50 text-amber-700",
    purchase: "bg-green-50 text-green-700",
  };

  return (
    <div className="space-y-8">
      <div className="p-5 rounded-2xl bg-white border border-[#E5E5E7]">
        <h3 className="font-semibold text-lg mb-1">What your buyers search for</h3>
        <p className="text-sm text-[#777] mb-4">
          These are the queries real buyers type into Google — each one maps to a blog post you should write.
        </p>
        <div className="space-y-3">
          {data.buyerKeywords.map((kw, i) => (
            <div key={i} className="p-4 rounded-xl border border-[#E5E5E7] hover:border-[#5855ff]/30 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium text-[#111]">&ldquo;{kw.query}&rdquo;</div>
                  <p className="text-xs text-[#777] mt-1">{kw.whyBuyersSearch}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-[#5855ff]">{formatNumber(kw.volume)}/mo</div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${stageColors[kw.buyerStage]}`}>
                    {kw.buyerStage}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3">All keyword opportunities</h3>
        <p className="text-sm text-[#777] mb-4">
          {data.keywords.length} keywords discovered for <strong>{data.brand.niche}</strong>
        </p>
      <div className="overflow-x-auto rounded-2xl border border-[#E5E5E7] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E5E5E7] bg-[#FAFAFA]">
              <th className="text-left p-3 font-medium">Keyword</th>
              <th className="text-left p-3 font-medium">Volume/mo</th>
              <th className="text-left p-3 font-medium">Difficulty</th>
              <th className="text-left p-3 font-medium">Intent</th>
              <th className="text-left p-3 font-medium">Buyer?</th>
            </tr>
          </thead>
          <tbody>
            {data.keywords.map((kw, i) => (
              <tr key={i} className="border-b border-[#F0F0F0] hover:bg-[#FAFAFA]">
                <td className="p-3 font-medium">{kw.keyword}</td>
                <td className="p-3 text-[#5855ff]">{formatNumber(kw.volume)}</td>
                <td className="p-3"><DifficultyBadge d={kw.difficulty} /></td>
                <td className="p-3 text-[#777] capitalize">{kw.intent}</td>
                <td className="p-3">
                  {kw.buyerIntent ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium">Yes</span>
                  ) : (
                    <span className="text-xs text-[#999]">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}

function ContentTab({ data }: { data: SeoAnalysis }) {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-sm text-emerald-800">
        <strong>Google + AI optimization:</strong> Each article below is scored out of 100 for Google
        rankings and AI search (ChatGPT). Aim for 90+ before publishing.
      </div>
      {data.contentIdeas.map((idea, i) => (
        <div key={i} className="p-5 rounded-2xl bg-white border border-[#E5E5E7] space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs px-2 py-0.5 rounded bg-[#5855ff]/10 text-[#5855ff] font-medium capitalize">
                {idea.type}
              </span>
              <h3 className="font-semibold text-[#111] mt-2">{idea.title}</h3>
              <p className="text-sm text-[#777] mt-1">Target keyword: <strong>{idea.keyword}</strong></p>
            </div>
            <div className="shrink-0 text-center">
              <div className={`text-2xl font-bold ${
                idea.seoScore.total >= 90 ? "text-green-600" :
                idea.seoScore.total >= 70 ? "text-[#5855ff]" : "text-amber-600"
              }`}>
                {idea.seoScore.total}
              </div>
              <div className="text-xs text-[#777]">/100</div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-[#FAFAFA]">
              <div className="text-xs text-[#777]">Google score</div>
              <div className="text-lg font-bold text-[#5855ff]">{idea.seoScore.google}/100</div>
            </div>
            <div className="p-3 rounded-lg bg-[#FAFAFA]">
              <div className="text-xs text-[#777]">AI search score</div>
              <div className="text-lg font-bold text-emerald-600">{idea.seoScore.aiSearch}/100</div>
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-[#777] mb-2">SEO breakdown</div>
            <div className="grid sm:grid-cols-2 gap-2">
              {idea.seoScore.breakdown.map((b, j) => (
                <div key={j} className="flex justify-between text-xs p-2 rounded bg-[#FAFAFA]">
                  <span className="text-[#555]">{b.label}</span>
                  <span className="font-medium">{b.score}/{b.max}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-[#777] mb-1">Meta description (copy to Shopify)</div>
            <p className="text-sm text-[#555] bg-[#FAFAFA] p-2 rounded-lg">{idea.metaDescription}</p>
          </div>

          <div>
            <div className="text-xs font-medium text-[#777] mb-2">Suggested outline</div>
            <ol className="list-decimal list-inside space-y-1">
              {idea.outline.map((item, j) => (
                <li key={j} className="text-sm text-[#555]">{item}</li>
              ))}
            </ol>
          </div>
        </div>
      ))}
    </div>
  );
}

function TechnicalTab({ data }: { data: SeoAnalysis }) {
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Images" value={String(data.imageCount)} sub={`${data.imagesWithoutAlt} missing alt`} />
        <StatCard label="Internal links" value={String(data.internalLinks)} />
        <StatCard label="External links" value={String(data.externalLinks)} />
      </div>
      <div className="rounded-2xl border border-[#E5E5E7] bg-white overflow-hidden">
        {data.technicalChecks.map((check, i) => (
          <div key={i} className={`p-4 flex items-start gap-4 ${i > 0 ? "border-t border-[#F0F0F0]" : ""}`}>
            <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              check.status === "pass" ? "bg-green-100 text-green-700" :
              check.status === "warn" ? "bg-amber-100 text-amber-700" :
              "bg-red-100 text-red-700"
            }`}>
              {check.status === "pass" ? "✓" : check.status === "warn" ? "!" : "✗"}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{check.label}</div>
              {check.value && <div className="text-sm text-[#777] mt-0.5 break-words">{check.value}</div>}
              {check.recommendation && (
                <div className="text-xs text-amber-700 mt-1">→ {check.recommendation}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IssuesTab({ data }: { data: SeoAnalysis }) {
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  const sorted = [...data.issues].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity],
  );

  return (
    <div className="space-y-4">
      {sorted.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-green-50 border border-green-100">
          <div className="text-3xl mb-2">✅</div>
          <p className="font-medium text-green-800">No critical issues found!</p>
        </div>
      ) : (
        sorted.map((issue) => (
          <div key={issue.id} className={`p-5 rounded-2xl border ${
            issue.severity === "critical" ? "bg-red-50 border-red-200" :
            issue.severity === "warning" ? "bg-amber-50 border-amber-200" :
            "bg-blue-50 border-blue-200"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold uppercase ${
                issue.severity === "critical" ? "text-red-700" :
                issue.severity === "warning" ? "text-amber-700" : "text-blue-700"
              }`}>{issue.severity}</span>
            </div>
            <h3 className="font-semibold">{issue.title}</h3>
            <p className="text-sm text-[#555] mt-1">{issue.description}</p>
            <div className="mt-3 p-3 rounded-lg bg-white/60 text-sm">
              <strong>How to fix:</strong> {issue.fix}
            </div>
          </div>
        ))
      )}

      <div className="p-6 rounded-2xl bg-white border border-[#E5E5E7]">
        <h3 className="font-semibold mb-3">All recommendations</h3>
        <div className="space-y-3">
          {data.recommendations.map((r) => (
            <div key={r.id} className="p-3 rounded-xl bg-[#FAFAFA]">
              <div className="font-medium text-sm">{r.title}</div>
              <p className="text-xs text-[#777] mt-1">{r.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SeoDashboard() {
  const [siteUrl, setSiteUrl] = useState(DEFAULT_SITE_URL);
  const [inputUrl, setInputUrl] = useState(DEFAULT_SITE_URL);
  const [analysis, setAnalysis] = useState<SeoAnalysis | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runAnalysis = useCallback(async (url: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalizeUrl(url) }),
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setAnalysis(data);
      setSiteUrl(normalizeUrl(url));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as SeoAnalysis;
        if (parsed.buyerKeywords && parsed.publishingSchedule) {
          setAnalysis(parsed);
          return;
        }
      } catch { /* ignore */ }
    }
    void runAnalysis(DEFAULT_SITE_URL);
  }, [runAnalysis]);

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <header className="bg-white border-b border-[#E5E5E7] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-bold text-xl text-[#111]">{SITE_NAME}</h1>
            <p className="text-sm text-[#777]">SEO research dashboard for your website</p>
          </div>
          <form
            className="flex gap-2 flex-1 sm:max-w-md"
            onSubmit={(e) => {
              e.preventDefault();
              if (isValidUrl(inputUrl)) void runAnalysis(sanitizeUrlInput(inputUrl));
            }}
          >
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="yourwebsite.com"
              className="flex-1 h-10 px-3 rounded-lg border border-[#E5E5E7] text-sm focus:outline-none focus:border-[#5855ff]"
            />
            <Button type="submit" disabled={loading || !isValidUrl(inputUrl)} className="!px-4 !py-2 !text-sm shrink-0">
              {loading ? "Analyzing..." : "Analyze"}
            </Button>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {loading && !analysis && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-[#5855ff] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#777]">Analyzing {siteUrl}...</p>
          </div>
        )}

        {analysis && (
          <>
            <div className="mb-8 p-6 rounded-2xl bg-white border border-[#E5E5E7] flex flex-col sm:flex-row items-center gap-6">
              <ScoreRing score={analysis.seoScore} />
              <div className="flex-1 text-center sm:text-left space-y-1">
                <h2 className="text-2xl font-bold">{analysis.brand.name}</h2>
                <p className="text-[#5855ff] text-sm">{analysis.domain}</p>
                <p className="text-sm text-[#777]">
                  Niche: <strong>{analysis.brand.niche}</strong> · Audience: {analysis.brand.audience}
                </p>
                <p className="text-xs text-[#999]">
                  Analyzed {new Date(analysis.analyzedAt).toLocaleString()}
                </p>
              </div>
              <Button
                onClick={() => void runAnalysis(siteUrl)}
                disabled={loading}
                variant="secondary"
                className="!text-sm shrink-0"
              >
                {loading ? "Refreshing..." : "Re-analyze"}
              </Button>
            </div>

            <div className="flex gap-1 overflow-x-auto mb-6 pb-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    tab === t.id
                      ? "bg-[#5855ff] text-white"
                      : "bg-white text-[#777] hover:text-[#111] border border-[#E5E5E7]"
                  }`}
                >
                  {t.label}
                  {t.id === "issues" && analysis.issues.length > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-xs">
                      {analysis.issues.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {tab === "overview" && <OverviewTab data={analysis} />}
            {tab === "publishing" && <PublishingTab data={analysis} />}
            {tab === "keywords" && <KeywordsTab data={analysis} />}
            {tab === "content" && <ContentTab data={analysis} />}
            {tab === "technical" && <TechnicalTab data={analysis} />}
            {tab === "issues" && <IssuesTab data={analysis} />}
          </>
        )}
      </main>
    </div>
  );
}
