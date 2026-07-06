import type { PlatformInfo } from "./types";

export function detectPlatform(url: string, html: string): PlatformInfo {
  const lower = html.toLowerCase();
  const domain = url.toLowerCase();

  if (domain.includes("myshopify.com") || lower.includes("cdn.shopify.com") || lower.includes("shopify")) {
    return {
      name: "Shopify",
      type: "shopify",
      blogPath: "/blogs/news",
      connected: true,
      publishSteps: [
        "Go to Shopify Admin → Online Store → Blog posts",
        "Click 'Add blog post' and paste your article",
        "Set the URL handle to the suggested slug below",
        "Add the meta description in the SEO section at the bottom",
        "Add 2–3 internal links to your product pages",
        "Publish or schedule for the suggested date",
      ],
    };
  }

  if (lower.includes("wp-content") || lower.includes("wordpress")) {
    return {
      name: "WordPress",
      type: "wordpress",
      blogPath: "/blog",
      connected: true,
      publishSteps: [
        "Log in to WordPress Admin → Posts → Add New",
        "Paste your article and set the SEO title + meta description (Yoast/RankMath)",
        "Use the suggested slug as the permalink",
        "Add featured image with alt text containing your keyword",
        "Publish or schedule for the suggested date",
      ],
    };
  }

  if (lower.includes("webflow")) {
    return {
      name: "Webflow",
      type: "webflow",
      blogPath: "/blog",
      connected: true,
      publishSteps: [
        "Open Webflow CMS → Blog Posts collection",
        "Create a new item with your article content",
        "Set SEO title, meta description, and slug",
        "Publish the collection item",
      ],
    };
  }

  if (lower.includes("__next") || lower.includes("_next/static")) {
    return {
      name: "Next.js",
      type: "nextjs",
      blogPath: "/blog",
      connected: true,
      publishSteps: [
        "Add a new MDX/markdown file in your /content or /posts directory",
        "Include frontmatter: title, description, date, slug",
        "Deploy or use your CMS to publish",
      ],
    };
  }

  return {
    name: "Custom website",
    type: "custom",
    blogPath: "/blog",
    connected: false,
    publishSteps: [
      "Create a new page or blog post on your site",
      "Use the suggested title, meta description, and slug",
      "Add internal links to your main product/service pages",
      "Submit the new URL to Google Search Console after publishing",
    ],
  };
}

export function getPlatformPublishUrl(platform: PlatformInfo, domain: string): string {
  const base = domain.startsWith("http") ? domain.replace(/\/$/, "") : `https://${domain}`;
  if (platform.type === "shopify") {
    return `${base}/admin/blogs`;
  }
  if (platform.type === "wordpress") {
    return `${base}/wp-admin/post-new.php`;
  }
  return `${base}${platform.blogPath}`;
}
