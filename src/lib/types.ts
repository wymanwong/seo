export interface PlatformInfo {
  name: string;
  type: "shopify" | "wordpress" | "webflow" | "wix" | "nextjs" | "custom";
  blogPath: string;
  publishSteps: string[];
  connected: boolean;
}

export interface BuyerKeyword {
  query: string;
  volume: number;
  buyerStage: "awareness" | "consideration" | "purchase";
  whyBuyersSearch: string;
}

export interface SeoPostScore {
  total: number;
  google: number;
  aiSearch: number;
  breakdown: {
    label: string;
    score: number;
    max: number;
    tip?: string;
  }[];
}

export interface ScheduledPost {
  id: string;
  dayOffset: number;
  scheduledDate: string;
  title: string;
  keyword: string;
  status: "scheduled" | "draft" | "approved" | "published";
  seoScore: SeoPostScore;
  metaDescription: string;
  suggestedSlug: string;
}

export interface SeoAnalysis {
  url: string;
  domain: string;
  analyzedAt: string;
  title: string | null;
  description: string | null;
  h1: string | null;
  headings: string[];
  wordCount: number;
  hasMetaDescription: boolean;
  hasOgTags: boolean;
  hasCanonical: boolean;
  imageCount: number;
  imagesWithoutAlt: number;
  linkCount: number;
  internalLinks: number;
  externalLinks: number;
  seoScore: number;
  brand: {
    name: string;
    tone: string;
    audience: string;
    niche: string;
  };
  platform: PlatformInfo;
  keywords: KeywordOpportunity[];
  buyerKeywords: BuyerKeyword[];
  contentIdeas: ContentIdea[];
  publishingSchedule: ScheduledPost[];
  competitors: string[];
  trafficPotential: {
    monthly: number;
    boost: string;
  };
  issues: SeoIssue[];
  recommendations: SeoRecommendation[];
  technicalChecks: TechnicalCheck[];
}

export interface KeywordOpportunity {
  keyword: string;
  volume: number;
  difficulty: "low" | "medium" | "high";
  intent: string;
  priority: "high" | "medium" | "low";
  buyerIntent?: boolean;
}

export interface ContentIdea {
  title: string;
  keyword: string;
  score: number;
  type: "guide" | "listicle" | "comparison" | "how-to";
  outline: string[];
  seoScore: SeoPostScore;
  metaDescription: string;
  suggestedSlug: string;
}

export interface SeoIssue {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  fix: string;
}

export interface SeoRecommendation {
  id: string;
  category: "content" | "technical" | "keywords" | "links";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
}

export interface TechnicalCheck {
  label: string;
  status: "pass" | "fail" | "warn";
  value?: string;
  recommendation?: string;
}
