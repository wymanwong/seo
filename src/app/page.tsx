import type { Metadata } from "next";
import { SeoDashboard } from "@/components/dashboard/SeoDashboard";
import { SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `${SITE_NAME} — SEO Research Dashboard`,
  description: "Personal SEO research dashboard — keyword analysis, content ideas, technical audit, and recommendations for your website.",
  robots: "noindex, nofollow",
};

export default function Home() {
  return <SeoDashboard />;
}
