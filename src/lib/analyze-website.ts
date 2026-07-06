import * as cheerio from "cheerio";
import type { ContentIdea, KeywordOpportunity, SeoAnalysis } from "./types";
import { getDomain } from "./utils";

const STOP_WORDS = new Set([
  "the", "and", "for", "are", "but", "not", "you", "all", "can", "had",
  "her", "was", "one", "our", "out", "day", "get", "has", "him", "his",
  "how", "its", "may", "new", "now", "old", "see", "way", "who", "did",
  "let", "put", "say", "she", "too", "use", "with", "from", "this",
  "that", "they", "have", "been", "will", "your", "more", "when", "what",
  "about", "into", "than", "them", "then", "some", "would", "make",
  "like", "time", "just", "know", "take", "come", "over", "such", "also",
  "back", "after", "most", "only", "very", "here", "well", "where",
]);

function extractKeywords(text: string, domain: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));

  const freq = new Map<string, number>();
  for (const word of words) {
    freq.set(word, (freq.get(word) ?? 0) + 1);
  }

  const domainParts = domain.split(".").filter((p) => p.length > 2);
  const sorted = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word)
    .filter((w) => !domainParts.includes(w));

  return sorted.slice(0, 12);
}

function buildKeywordOpportunities(
  keywords: string[],
  niche: string,
): KeywordOpportunity[] {
  const intents = ["informational", "commercial", "transactional", "navigational"];
  const difficulties: Array<"low" | "medium" | "high"> = ["low", "medium", "high"];

  const base: KeywordOpportunity[] = keywords.slice(0, 6).map((kw, i) => ({
    keyword: kw,
    volume: Math.floor(500 + Math.random() * 4500),
    difficulty: difficulties[i % 3],
    intent: intents[i % 4],
  }));

  const extras: KeywordOpportunity[] = [
    {
      keyword: `best ${niche} guide`,
      volume: 2400,
      difficulty: "medium",
      intent: "informational",
    },
    {
      keyword: `${niche} tips for beginners`,
      volume: 1800,
      difficulty: "low",
      intent: "informational",
    },
    {
      keyword: `how to choose ${niche}`,
      volume: 3200,
      difficulty: "medium",
      intent: "commercial",
    },
    {
      keyword: `${niche} vs alternatives`,
      volume: 1500,
      difficulty: "low",
      intent: "commercial",
    },
  ];

  return [...base, ...extras].slice(0, 10);
}

function buildContentIdeas(keywords: KeywordOpportunity[]): ContentIdea[] {
  const templates = [
    (kw: string) => `The Ultimate Guide to ${kw}`,
    (kw: string) => `${kw}: Everything You Need to Know in 2026`,
    (kw: string) => `10 Proven ${kw} Strategies That Actually Work`,
    (kw: string) => `How to Master ${kw} (Step-by-Step)`,
    (kw: string) => `${kw} Explained: A Complete Beginner's Guide`,
  ];

  return keywords.slice(0, 5).map((kw, i) => ({
    title: templates[i % templates.length](kw.keyword),
    keyword: kw.keyword,
    score: 85 + Math.floor(Math.random() * 15),
  }));
}

function detectTone(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("enterprise") || lower.includes("solution"))
    return "Professional & authoritative";
  if (lower.includes("fun") || lower.includes("awesome"))
    return "Casual & friendly";
  if (lower.includes("innovative") || lower.includes("cutting-edge"))
    return "Innovative & forward-thinking";
  return "Clear & informative";
}

function detectNiche(title: string, h1: string, keywords: string[]): string {
  const combined = `${title} ${h1} ${keywords.slice(0, 3).join(" ")}`.toLowerCase();
  if (combined.includes("shop") || combined.includes("store") || combined.includes("buy"))
    return "e-commerce";
  if (combined.includes("software") || combined.includes("app") || combined.includes("tech"))
    return "technology";
  if (combined.includes("health") || combined.includes("medical") || combined.includes("wellness"))
    return "health & wellness";
  if (combined.includes("food") || combined.includes("recipe") || combined.includes("restaurant"))
    return "food & dining";
  if (combined.includes("travel") || combined.includes("hotel"))
    return "travel";
  if (combined.includes("finance") || combined.includes("money") || combined.includes("invest"))
    return "finance";
  return keywords[0] ?? "your industry";
}

function calculateSeoScore(checks: {
  hasTitle: boolean;
  hasMetaDescription: boolean;
  hasH1: boolean;
  hasOgTags: boolean;
  hasCanonical: boolean;
  wordCount: number;
  imageCount: number;
  linkCount: number;
}): number {
  let score = 0;
  if (checks.hasTitle) score += 15;
  if (checks.hasMetaDescription) score += 20;
  if (checks.hasH1) score += 15;
  if (checks.hasOgTags) score += 10;
  if (checks.hasCanonical) score += 10;
  if (checks.wordCount > 300) score += 10;
  if (checks.wordCount > 800) score += 5;
  if (checks.imageCount > 0) score += 5;
  if (checks.linkCount > 5) score += 5;
  if (checks.linkCount > 20) score += 5;
  return Math.min(score, 100);
}

export async function analyzeWebsite(url: string): Promise<SeoAnalysis> {
  const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
  const domain = getDomain(normalizedUrl);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  let html: string;
  try {
    const response = await fetch(normalizedUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SEOBot/1.0; +https://github.com/wymanwong/seo)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error(
          "This website is password-protected or blocking access. Try your public store URL.",
        );
      }
      if (response.status === 404) {
        throw new Error("Website not found. Please check the URL and try again.");
      }
      throw new Error(`Unable to access website (HTTP ${response.status})`);
    }

    html = await response.text();
  } finally {
    clearTimeout(timeout);
  }

  const $ = cheerio.load(html);
  $("script, style, noscript").remove();

  const title = $("title").first().text().trim() || null;
  const description =
    $('meta[name="description"]').attr("content")?.trim() ||
    $('meta[property="og:description"]').attr("content")?.trim() ||
    null;
  const h1 = $("h1").first().text().trim() || null;
  const headings = $("h2, h3")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean)
    .slice(0, 10);

  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;
  const hasOgTags = !!$('meta[property="og:title"]').attr("content");
  const hasCanonical = !!$('link[rel="canonical"]').attr("href");
  const imageCount = $("img").length;
  const linkCount = $("a[href]").length;

  const keywords = extractKeywords(bodyText, domain);
  const niche = detectNiche(title ?? "", h1 ?? "", keywords);
  const tone = detectTone(bodyText.slice(0, 2000));

  const keywordOpportunities = buildKeywordOpportunities(keywords, niche);
  const contentIdeas = buildContentIdeas(keywordOpportunities);

  const seoScore = calculateSeoScore({
    hasTitle: !!title,
    hasMetaDescription: !!description,
    hasH1: !!h1,
    hasOgTags,
    hasCanonical,
    wordCount,
    imageCount,
    linkCount,
  });

  const monthlyTraffic = keywordOpportunities.reduce((sum, k) => sum + k.volume, 0);
  const boostPercent = Math.max(15, Math.min(85, 100 - seoScore));

  return {
    url: normalizedUrl,
    domain,
    title,
    description,
    h1,
    headings,
    wordCount,
    hasMetaDescription: !!description,
    hasOgTags,
    hasCanonical,
    imageCount,
    linkCount,
    seoScore,
    brand: {
      name: title?.split(/[|\-–]/)[0]?.trim() || domain,
      tone,
      audience: `People searching for ${niche} solutions and information`,
      niche,
    },
    keywords: keywordOpportunities,
    contentIdeas,
    competitors: [
      `${niche} leader.com`,
      `top${niche.replace(/\s/g, "")}.io`,
      `best-${niche.replace(/\s/g, "-")}.com`,
    ],
    trafficPotential: {
      monthly: monthlyTraffic,
      boost: `+${boostPercent}%`,
    },
  };
}
