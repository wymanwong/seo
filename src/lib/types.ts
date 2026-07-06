export interface SeoAnalysis {
  url: string;
  domain: string;
  title: string | null;
  description: string | null;
  h1: string | null;
  headings: string[];
  wordCount: number;
  hasMetaDescription: boolean;
  hasOgTags: boolean;
  hasCanonical: boolean;
  imageCount: number;
  linkCount: number;
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
}

export interface KeywordOpportunity {
  keyword: string;
  volume: number;
  difficulty: "low" | "medium" | "high";
  intent: string;
}

export interface ContentIdea {
  title: string;
  keyword: string;
  score: number;
}

export interface QuizData {
  website: string;
  language: string;
  email: string;
  analysis?: SeoAnalysis;
}

export type QuizStep = "website" | "analyzing" | "language" | "email" | "results";
