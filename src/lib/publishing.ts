import type {
  BuyerKeyword,
  ContentIdea,
  KeywordOpportunity,
  ScheduledPost,
  SeoPostScore,
} from "./types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

export function scorePostSeo(title: string, keyword: string, type: ContentIdea["type"]): SeoPostScore {
  const titleLower = title.toLowerCase();
  const kwLower = keyword.toLowerCase();
  const hasKeywordInTitle = titleLower.includes(kwLower) || titleLower.includes(kwLower.split(" ")[0]);
  const titleLen = title.length;

  const breakdown = [
    {
      label: "Keyword in title",
      score: hasKeywordInTitle ? 20 : 8,
      max: 20,
      tip: hasKeywordInTitle ? undefined : `Include "${keyword}" in the title`,
    },
    {
      label: "Title length (50–60 chars)",
      score: titleLen >= 45 && titleLen <= 65 ? 15 : titleLen >= 35 ? 10 : 5,
      max: 15,
      tip: titleLen > 65 ? "Shorten title to avoid truncation in Google" : undefined,
    },
    {
      label: "Meta description ready",
      score: 15,
      max: 15,
    },
    {
      label: "Heading structure (H2/H3)",
      score: 15,
      max: 15,
    },
    {
      label: "Internal links planned",
      score: 12,
      max: 15,
      tip: "Link to 2–3 product pages from the article",
    },
    {
      label: "FAQ section for AI search",
      score: type === "guide" || type === "how-to" ? 15 : 10,
      max: 15,
      tip: "Add FAQ section — helps rank in ChatGPT and Google AI Overviews",
    },
    {
      label: "Content depth (1500+ words)",
      score: 13,
      max: 15,
    },
  ];

  const total = breakdown.reduce((s, b) => s + b.score, 0);
  const google = Math.min(100, Math.round(total * 0.95 + (hasKeywordInTitle ? 5 : 0)));
  const aiSearch = Math.min(100, Math.round(total * 0.9 + (type === "guide" ? 8 : 4)));

  return { total: Math.min(100, total), google, aiSearch, breakdown };
}

export function buildMetaDescription(title: string, keyword: string, niche: string): string {
  const templates = [
    `Discover everything about ${keyword}. Our expert guide helps you choose the best ${niche} options. Read now.`,
    `Looking for ${keyword}? Learn what to look for, top picks, and tips from ${niche} experts. Updated 2026.`,
    `Complete ${keyword} guide — features, comparisons, and buying tips. Find the right fit for your needs today.`,
  ];
  const idx = keyword.length % templates.length;
  let desc = templates[idx];
  if (desc.length > 160) desc = desc.slice(0, 157) + "...";
  return desc;
}

export function buildBuyerKeywords(
  niche: string,
  keywords: KeywordOpportunity[],
): BuyerKeyword[] {
  const stages: Array<BuyerKeyword["buyerStage"]> = [
    "awareness",
    "consideration",
    "purchase",
  ];

  const queries = [
    {
      query: `what is the best ${niche}`,
      stage: "awareness" as const,
      why: "Buyers researching options before they know what to buy",
    },
    {
      query: `${niche} reviews`,
      stage: "consideration" as const,
      why: "Comparing products — close to making a purchase decision",
    },
    {
      query: `where to buy ${niche}`,
      stage: "purchase" as const,
      why: "Ready to buy — high conversion intent",
    },
    {
      query: `how to choose ${niche}`,
      stage: "consideration" as const,
      why: "Evaluating features before committing",
    },
    {
      query: `affordable ${niche}`,
      stage: "purchase" as const,
      why: "Price-sensitive buyers ready to purchase",
    },
    {
      query: `${niche} for beginners`,
      stage: "awareness" as const,
      why: "New buyers entering the market",
    },
    {
      query: `top ${niche} brands 2026`,
      stage: "consideration" as const,
      why: "Brand comparison shoppers",
    },
    {
      query: `${niche} near me`,
      stage: "purchase" as const,
      why: "Local/commercial intent — wants to buy now",
    },
  ];

  return queries.map((q, i) => ({
    query: keywords[i]?.keyword ? `best ${keywords[i].keyword}` : q.query,
    volume: keywords[i]?.volume ?? 1000 + i * 300,
    buyerStage: stages[i % 3],
    whyBuyersSearch: q.why,
  }));
}

export function buildPublishingSchedule(ideas: ContentIdea[]): ScheduledPost[] {
  const today = new Date();
  today.setHours(8, 0, 0, 0);

  return ideas.slice(0, 14).map((idea, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    return {
      id: `post-${i}`,
      dayOffset: i,
      scheduledDate: date.toISOString(),
      title: idea.title,
      keyword: idea.keyword,
      status: i === 0 ? "draft" : "scheduled",
      seoScore: idea.seoScore,
      metaDescription: idea.metaDescription,
      suggestedSlug: idea.suggestedSlug,
    };
  });
}

export function enrichContentIdea(
  idea: Omit<ContentIdea, "seoScore" | "metaDescription" | "suggestedSlug">,
  niche: string,
): ContentIdea {
  const seoScore = scorePostSeo(idea.title, idea.keyword, idea.type);
  return {
    ...idea,
    score: seoScore.total,
    seoScore,
    metaDescription: buildMetaDescription(idea.title, idea.keyword, niche),
    suggestedSlug: slugify(idea.title),
  };
}
