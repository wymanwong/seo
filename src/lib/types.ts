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
  keywords: KeywordOpportunity[];
  contentIdeas: ContentIdea[];
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
}

export interface ContentIdea {
  title: string;
  keyword: string;
  score: number;
  type: "guide" | "listicle" | "comparison" | "how-to";
  outline: string[];
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
