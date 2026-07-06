export interface GscQueryRow {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GscSummary {
  connected: boolean;
  siteUrl: string | null;
  startDate: string;
  endDate: string;
  totals: {
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  };
  queries: GscQueryRow[];
}

export function buildKeywordPlannerUrl(): string {
  return "https://ads.google.com/aw/keywordplanner/home";
}
