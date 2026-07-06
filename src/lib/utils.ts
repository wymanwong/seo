export function sanitizeUrlInput(input: string): string {
  return input
    .trim()
    .replace(/[\u200B-\u200D\uFEFF\u00A0]/g, "")
    .replace(/\s+/g, "");
}

export function normalizeUrl(input: string): string {
  let url = sanitizeUrlInput(input);
  if (!url) return "";
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  return url;
}

export function isValidUrl(input: string): boolean {
  const cleaned = sanitizeUrlInput(input);
  if (!cleaned) return false;

  // Bare domain like example.com or sub.example.co.uk
  const domainPattern =
    /^(?:https?:\/\/)?(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}(?:\/.*)?$/i;

  if (domainPattern.test(cleaned)) {
    return true;
  }

  try {
    const url = new URL(normalizeUrl(cleaned));
    return !!url.hostname && url.hostname.includes(".");
  } catch {
    return false;
  }
}

export function getDomain(url: string): string {
  try {
    return new URL(normalizeUrl(url)).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toString();
}

export function getQuizProgress(step: string): number {
  const steps: Record<string, number> = {
    website: 20,
    publishing: 30,
    language: 60,
    email: 80,
    results: 100,
  };
  return steps[step] ?? 20;
}
