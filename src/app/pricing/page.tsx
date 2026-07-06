import type { Metadata } from "next";
import { PricingPage } from "@/components/pricing/PricingPage";

export const metadata: Metadata = {
  title: "Pricing — SEO Autopilot | Starting from $39/mo",
  description:
    "Get daily SEO content publishing, keyword research, Google + AI optimization, and website integration. 50% off sale. 14-day money-back guarantee.",
  openGraph: {
    title: "SEO Autopilot Pricing — $39/mo",
    description:
      "Daily publishing, keyword research, and AI optimization. Works with WordPress, Shopify, and more.",
    type: "website",
  },
};

export default function Page() {
  return <PricingPage />;
}
